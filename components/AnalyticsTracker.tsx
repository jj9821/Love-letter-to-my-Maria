'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_STORAGE_KEY = 'm_anon_session_id';
const OPT_OUT_KEY = 'analytics_opt_out';

/**
 * Generates an ephemeral anonymous session ID.
 * Stored strictly in sessionStorage (cleared when browser session ends).
 */
function getOrCreateAnonymousSessionId(): string {
  if (typeof window === 'undefined') return '';

  try {
    let sessionId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        sessionId = crypto.randomUUID();
      } else {
        sessionId = 'anon_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      }
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    // If storage is blocked by privacy mode, return a temporary fallback
    return 'ephemeral_' + Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Privacy-conscious client-side analytics tracker.
 * Dispatches non-invasive device data asynchronously in idle time.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Privacy Opt-Out Check
    try {
      if (
        window.localStorage.getItem(OPT_OUT_KEY) === 'true' ||
        (window as any).__DISABLE_ANALYTICS__ === true
      ) {
        return;
      }
    } catch {
      // Storage access blocked
    }

    // Avoid double tracking the same path on rapid re-renders
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    // 2. Schedule non-blocking execution during browser idle time
    const executeTracking = async () => {
      try {
        const sessionId = getOrCreateAnonymousSessionId();
        if (!sessionId) return;

        // Collect standard, legitimate browser properties
        const payload: any = {
          anonymousSessionId: sessionId,
          pagePath: pathname || window.location.pathname || '/',
          referrer: document.referrer || '',
          screenWidth: window.screen ? window.screen.width : undefined,
          screenHeight: window.screen ? window.screen.height : undefined,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio || 1,
        };

        // 3. Collect User-Agent Client Hints if supported (Best-effort modern device hints)
        const nav = navigator as any;
        if (nav.userAgentData && typeof nav.userAgentData.getHighEntropyValues === 'function') {
          try {
            const hints = await nav.userAgentData.getHighEntropyValues([
              'model',
              'platform',
              'platformVersion',
              'brands',
              'mobile',
            ]);
            payload.clientHints = {
              model: hints.model,
              platform: hints.platform,
              platformVersion: hints.platformVersion,
              mobile: hints.mobile,
              brands: hints.brands,
            };
          } catch {
            // High entropy values rejected by user or browser policy; continue gracefully
          }
        }

        const jsonPayload = JSON.stringify(payload);

        // 4. Dispatch via Beacon API or keepalive fetch
        if (navigator.sendBeacon) {
          const blob = new Blob([jsonPayload], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/track', blob);
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonPayload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Analytics failure should never impact user experience
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        executeTracking();
      }, { timeout: 2000 });
    } else {
      setTimeout(executeTracking, 800);
    }
  }, [pathname]);

  return null;
}
