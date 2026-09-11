-- Migration: Create device_visits table for custom privacy-conscious analytics
-- Created at: 2026-09-12

CREATE TABLE IF NOT EXISTS public.device_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    anonymous_session_id TEXT NOT NULL,
    device_type TEXT DEFAULT 'unknown' NOT NULL,
    device_brand TEXT,
    device_model TEXT,
    os TEXT,
    os_version TEXT,
    browser TEXT,
    browser_version TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    viewport_width INTEGER,
    viewport_height INTEGER,
    device_pixel_ratio NUMERIC(4,2),
    user_agent TEXT,
    page_path TEXT DEFAULT '/' NOT NULL,
    referrer TEXT,
    country TEXT,
    city TEXT
);

-- Performance Indexes for Dashboard Queries
CREATE INDEX IF NOT EXISTS idx_device_visits_created_at ON public.device_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_device_visits_session ON public.device_visits (anonymous_session_id);
CREATE INDEX IF NOT EXISTS idx_device_visits_device_type ON public.device_visits (device_type);
CREATE INDEX IF NOT EXISTS idx_device_visits_brand ON public.device_visits (device_brand);
CREATE INDEX IF NOT EXISTS idx_device_visits_path ON public.device_visits (page_path);
CREATE INDEX IF NOT EXISTS idx_device_visits_session_path_time ON public.device_visits (anonymous_session_id, page_path, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.device_visits ENABLE ROW LEVEL SECURITY;

-- Block public anonymous read/write directly from browser clients
-- All inserts and queries must go through our authenticated backend API endpoints using the service role key.
DROP POLICY IF EXISTS "Deny public select" ON public.device_visits;
DROP POLICY IF EXISTS "Deny public insert" ON public.device_visits;

-- Explicitly only allow service_role to manage analytics data
CREATE POLICY "Allow service_role full access" ON public.device_visits
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

COMMENT ON TABLE public.device_visits IS 'Stores privacy-conscious, non-fingerprinted device analytics visits.';
