import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // 1. Authenticate admin access
  const authHeader = req.headers.get('authorization') || '';
  const adminKeyHeader = req.headers.get('x-admin-key') || '';
  const searchParamKey = req.nextUrl.searchParams.get('key') || '';

  const configuredPassword = process.env.ADMIN_ANALYTICS_PASSWORD;
  
  // Extract token from Bearer if provided
  let token = adminKeyHeader || searchParamKey;
  if (!token && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // If password is configured, enforce it strictly
  if (configuredPassword && configuredPassword.trim()) {
    if (!token || token.trim() !== configuredPassword.trim()) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin key' }, { status: 401 });
    }
  } else if (!token && process.env.NODE_ENV === 'production') {
    // In production without password set, prompt to configure password
    return NextResponse.json(
      { error: 'ADMIN_ANALYTICS_PASSWORD must be configured in environment variables' },
      { status: 403 }
    );
  }

  // 2. Query Supabase
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      configured: false,
      message: 'Supabase credentials not configured in environment variables.',
      metrics: null,
    });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    // Fetch visits from last 30 days for aggregation
    const { data: visits, error } = await supabase
      .from('device_visits')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(5000);

    if (error) {
      console.error('Error fetching analytics visits:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = visits || [];

    // Compute Overall Counts
    const totalVisits = rows.length;
    const uniqueSessions = new Set(rows.map((r) => r.anonymous_session_id)).size;

    const visitsToday = rows.filter((r) => new Date(r.created_at) >= startOfToday).length;
    const visits7d = rows.filter((r) => new Date(r.created_at) >= sevenDaysAgo).length;
    const visits30d = totalVisits;

    // Helper to count frequencies
    const countBy = (arr: any[], keyFn: (item: any) => string) => {
      const counts: Record<string, number> = {};
      arr.forEach((item) => {
        const key = keyFn(item);
        if (key) {
          counts[key] = (counts[key] || 0) + 1;
        }
      });
      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    };

    // Device Types
    const deviceTypes = countBy(rows, (r) => r.device_type || 'unknown');

    // Brands
    const brands = countBy(rows, (r) => r.device_brand || 'Unknown').slice(0, 8);

    // Models
    const models = countBy(rows, (r) => r.device_model || 'Unknown').slice(0, 10);

    // Operating Systems
    const operatingSystems = countBy(
      rows,
      (r) => (r.os ? `${r.os}${r.os_version ? ' ' + r.os_version : ''}` : 'Unknown')
    ).slice(0, 8);

    // Browsers
    const browsers = countBy(
      rows,
      (r) => (r.browser ? `${r.browser}${r.browser_version ? ' ' + r.browser_version : ''}` : 'Unknown')
    ).slice(0, 8);

    // Screen Resolutions
    const screenResolutions = countBy(rows, (r) =>
      r.screen_width && r.screen_height ? `${r.screen_width}x${r.screen_height}` : 'Unknown'
    ).slice(0, 8);

    // Pages Visited
    const pages = countBy(rows, (r) => r.page_path || '/').slice(0, 10);

    // Referrers
    const referrers = countBy(rows, (r) => {
      if (!r.referrer) return 'Direct / None';
      try {
        const url = new URL(r.referrer);
        return url.hostname || r.referrer;
      } catch {
        return r.referrer;
      }
    }).slice(0, 8);

    // Visits over time (last 14 days)
    const dailyMap: Record<string, { date: string; visits: number; unique: Set<string> }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyMap[dateStr] = { date: dateStr, visits: 0, unique: new Set() };
    }

    rows.forEach((r) => {
      const dateStr = r.created_at.split('T')[0];
      if (dailyMap[dateStr]) {
        dailyMap[dateStr].visits += 1;
        dailyMap[dateStr].unique.add(r.anonymous_session_id);
      }
    });

    const dailyVisits = Object.values(dailyMap).map((d) => ({
      date: d.date,
      visits: d.visits,
      uniqueVisitors: d.unique.size,
    }));

    return NextResponse.json({
      configured: true,
      metrics: {
        totalVisits,
        uniqueSessions,
        visitsToday,
        visits7d,
        visits30d,
        deviceTypes,
        brands,
        models,
        operatingSystems,
        browsers,
        screenResolutions,
        pages,
        referrers,
        dailyVisits,
      },
    });
  } catch (err: any) {
    console.error('Stats endpoint error:', err);
    return NextResponse.json({ error: 'Failed to compute analytics' }, { status: 500 });
  }
}
