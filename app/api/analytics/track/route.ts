import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { ClientDevicePayload, isDuplicateVisit, parseDeviceData } from '@/lib/analytics-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Guard payload size
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 15 * 1024) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    // 2. Parse and validate JSON
    const body: ClientDevicePayload = await req.json();

    if (!body || typeof body.anonymousSessionId !== 'string' || !body.anonymousSessionId.trim()) {
      return NextResponse.json({ error: 'Invalid session identifier' }, { status: 400 });
    }

    const pagePath = typeof body.pagePath === 'string' ? body.pagePath : '/';

    // 3. Duplicate protection: skip duplicate event within 15 seconds
    if (isDuplicateVisit(body.anonymousSessionId, pagePath)) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    // 4. Parse & Normalize Device Data (Server-Side)
    const userAgent = req.headers.get('user-agent') || '';
    const visitRecord = parseDeviceData(userAgent, body, req.headers);

    // 5. Store in Supabase using the service role admin client
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      // Supabase is not yet configured with environment variables
      return NextResponse.json({
        success: true,
        warning: 'Supabase credentials not configured in environment variables.',
      });
    }

    const { error } = await supabase.from('device_visits').insert([visitRecord]);

    if (error) {
      console.error('Supabase device_visits insert error:', error.message);
      return NextResponse.json({ success: false, error: 'Storage error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Analytics tracking error:', err);
    // Never crash or disrupt client experience
    return NextResponse.json({ success: false, error: 'Internal tracking error' }, { status: 500 });
  }
}
