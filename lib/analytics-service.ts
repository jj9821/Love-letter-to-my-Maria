import { UAParser } from 'ua-parser-js';

export interface ClientDevicePayload {
  anonymousSessionId: string;
  pagePath: string;
  referrer?: string;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  devicePixelRatio?: number;
  clientHints?: {
    model?: string;
    platform?: string;
    platformVersion?: string;
    mobile?: boolean;
    brands?: Array<{ brand: string; version: string }>;
  };
}

export interface DeviceVisitRecord {
  anonymous_session_id: string;
  page_path: string;
  referrer?: string | null;
  device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  device_brand?: string | null;
  device_model?: string | null;
  os?: string | null;
  os_version?: string | null;
  browser?: string | null;
  browser_version?: string | null;
  screen_width?: number | null;
  screen_height?: number | null;
  viewport_width?: number | null;
  viewport_height?: number | null;
  device_pixel_ratio?: number | null;
  user_agent?: string | null;
  country?: string | null;
  city?: string | null;
}

// In-memory rate limiting & duplicate protection cache (session+path within 15 seconds)
const recentVisitsCache = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 15 * 1000; // 15 seconds

/**
 * Checks if a visit is an immediate duplicate within the deduplication window.
 */
export function isDuplicateVisit(sessionId: string, path: string): boolean {
  const key = `${sessionId}:${path}`;
  const now = Date.now();
  const lastTime = recentVisitsCache.get(key);

  if (lastTime && now - lastTime < DUPLICATE_WINDOW_MS) {
    return true;
  }

  recentVisitsCache.set(key, now);

  // Periodically clean up cache entries older than 5 minutes
  if (recentVisitsCache.size > 2000) {
    const expireThreshold = now - 5 * 60 * 1000;
    recentVisitsCache.forEach((time, k) => {
      if (time < expireThreshold) {
        recentVisitsCache.delete(k);
      }
    });
  }

  return false;
}

/**
 * Normalizes device brand names into clean human-readable titles.
 */
function normalizeBrand(rawBrand?: string): string | null {
  if (!rawBrand) return null;
  const lower = rawBrand.trim().toLowerCase();
  if (lower.includes('apple')) return 'Apple';
  if (lower.includes('samsung')) return 'Samsung';
  if (lower.includes('google')) return 'Google';
  if (lower.includes('xiaomi') || lower.includes('redmi') || lower.includes('poco')) return 'Xiaomi';
  if (lower.includes('huawei') || lower.includes('honor')) return 'Huawei';
  if (lower.includes('oneplus')) return 'OnePlus';
  if (lower.includes('motorola') || lower.includes('moto')) return 'Motorola';
  if (lower.includes('sony')) return 'Sony';
  if (lower.includes('oppo')) return 'Oppo';
  if (lower.includes('vivo')) return 'Vivo';
  if (lower.includes('microsoft')) return 'Microsoft';
  if (lower.includes('lg')) return 'LG';
  if (lower.includes('asus')) return 'Asus';
  if (lower.includes('lenovo')) return 'Lenovo';
  if (lower === 'unknown') return null;

  // Capitalize first letter
  return rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1);
}

/**
 * Parses user agent and merges with high-entropy User-Agent Client Hints where available.
 * Respects browser privacy policies: does not fabricate device models from screen resolution.
 */
export function parseDeviceData(
  userAgent: string,
  clientData: ClientDevicePayload,
  headers: Headers
): DeviceVisitRecord {
  const parser = new UAParser(userAgent);
  const parsedUA = parser.getResult();
  const ch = clientData.clientHints;

  // 1. Determine Device Type
  let deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown' = 'desktop';
  const rawType = parsedUA.device.type?.toLowerCase();

  if (rawType === 'mobile') {
    deviceType = 'mobile';
  } else if (rawType === 'tablet') {
    deviceType = 'tablet';
  } else if (ch?.mobile === true) {
    deviceType = 'mobile';
  } else if (ch?.mobile === false) {
    deviceType = 'desktop';
  } else {
    // Fallback: check OS name
    const osName = (parsedUA.os.name || '').toLowerCase();
    if (osName === 'ios' || osName === 'android') {
      deviceType = 'mobile';
    } else {
      deviceType = 'desktop';
    }
  }

  // 2. Determine Brand
  let brand: string | null = normalizeBrand(parsedUA.device.vendor);
  if (!brand && ch?.platform) {
    const platLower = ch.platform.toLowerCase();
    if (platLower === 'ios' || platLower === 'macos') {
      brand = 'Apple';
    } else if (platLower === 'windows') {
      brand = 'Microsoft';
    }
  }
  if (!brand && parsedUA.os.name) {
    const osLower = parsedUA.os.name.toLowerCase();
    if (osLower === 'ios' || osLower === 'mac os') {
      brand = 'Apple';
    }
  }

  // 3. Determine Model (Best-effort; unknown if privacy masked)
  let model: string | null = null;
  if (ch?.model && ch.model.trim() && ch.model.toLowerCase() !== 'unknown') {
    model = ch.model.trim();
  } else if (parsedUA.device.model && parsedUA.device.model.toLowerCase() !== 'unknown') {
    model = parsedUA.device.model.trim();
  } else if (brand === 'Apple' && deviceType === 'mobile') {
    // Apple explicitly masks model on iOS to "iPhone"
    model = 'iPhone (Model Masked)';
  } else {
    model = 'Unknown';
  }

  // 4. Determine Operating System
  let osName = parsedUA.os.name || ch?.platform || 'Unknown';
  let osVersion = parsedUA.os.version || ch?.platformVersion || null;

  // 5. Determine Browser
  let browserName = parsedUA.browser.name || 'Unknown';
  let browserVersion = parsedUA.browser.version ? parsedUA.browser.version.split('.')[0] : null;

  if (ch?.brands && ch.brands.length > 0) {
    // Find significant brand excluding greased brands
    const meaningfulBrand = ch.brands.find(
      (b) =>
        !b.brand.includes('Not') &&
        !b.brand.includes('Brand') &&
        !b.brand.includes('Chromium')
    );
    if (meaningfulBrand) {
      browserName = meaningfulBrand.brand;
      browserVersion = meaningfulBrand.version ? meaningfulBrand.version.split('.')[0] : browserVersion;
    }
  }

  // 6. Clamp numeric screen and viewport sizes
  const clamp = (val: number | undefined, min: number, max: number): number | null => {
    if (typeof val !== 'number' || isNaN(val)) return null;
    return Math.min(Math.max(Math.round(val), min), max);
  };

  const screenWidth = clamp(clientData.screenWidth, 1, 10000);
  const screenHeight = clamp(clientData.screenHeight, 1, 10000);
  const viewportWidth = clamp(clientData.viewportWidth, 1, 10000);
  const viewportHeight = clamp(clientData.viewportHeight, 1, 10000);

  let dpr: number | null = null;
  if (typeof clientData.devicePixelRatio === 'number' && !isNaN(clientData.devicePixelRatio)) {
    dpr = Math.min(Math.max(parseFloat(clientData.devicePixelRatio.toFixed(2)), 0.1), 10);
  }

  // 7. Extract Country / City from standard edge headers (Privacy-friendly, NO IP stored)
  const country =
    headers.get('x-vercel-ip-country') ||
    headers.get('cf-ipcountry') ||
    headers.get('x-country-code') ||
    null;

  let city =
    headers.get('x-vercel-ip-city') ||
    headers.get('cf-ipcity') ||
    null;

  if (city) {
    try {
      city = decodeURIComponent(city);
    } catch {
      // Keep original
    }
  }

  // Clean referrer
  let referrer = clientData.referrer ? clientData.referrer.trim() : null;
  if (referrer && referrer.length > 500) {
    referrer = referrer.substring(0, 500);
  }

  const pagePath = (clientData.pagePath || '/').substring(0, 200);

  return {
    anonymous_session_id: clientData.anonymousSessionId.substring(0, 100),
    page_path: pagePath,
    referrer: referrer || null,
    device_type: deviceType,
    device_brand: brand || 'Unknown',
    device_model: model || 'Unknown',
    os: osName,
    os_version: osVersion,
    browser: browserName,
    browser_version: browserVersion,
    screen_width: screenWidth,
    screen_height: screenHeight,
    viewport_width: viewportWidth,
    viewport_height: viewportHeight,
    device_pixel_ratio: dpr,
    user_agent: userAgent.substring(0, 500),
    country: country ? country.toUpperCase().substring(0, 10) : null,
    city: city ? city.substring(0, 100) : null,
  };
}
