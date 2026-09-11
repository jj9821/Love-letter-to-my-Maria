'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface MetricItem {
  name: string;
  count: number;
}

interface DailyVisitItem {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

interface AnalyticsData {
  totalVisits: number;
  uniqueSessions: number;
  visitsToday: number;
  visits7d: number;
  visits30d: number;
  deviceTypes: MetricItem[];
  brands: MetricItem[];
  models: MetricItem[];
  operatingSystems: MetricItem[];
  browsers: MetricItem[];
  screenResolutions: MetricItem[];
  pages: MetricItem[];
  referrers: MetricItem[];
  dailyVisits: DailyVisitItem[];
}

export default function AnalyticsDashboardPage() {
  const [adminKey, setAdminKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [configMessage, setConfigMessage] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  // Load saved key from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = window.sessionStorage.getItem('admin_analytics_key');
      if (savedKey) {
        setAdminKey(savedKey);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const fetchStats = useCallback(async (keyToUse: string) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`/api/analytics/stats?key=${encodeURIComponent(keyToUse)}`, {
        headers: {
          'x-admin-key': keyToUse,
        },
      });

      if (res.status === 401 || res.status === 403) {
        setIsAuthenticated(false);
        setAuthError('Invalid admin passcode. Access denied.');
        window.sessionStorage.removeItem('admin_analytics_key');
        setIsLoading(false);
        return;
      }

      const json = await res.json();

      if (!json.configured) {
        setIsConfigured(false);
        setConfigMessage(json.message || 'Supabase environment variables not configured.');
      } else {
        setIsConfigured(true);
        setData(json.metrics);
      }

      setIsAuthenticated(true);
      window.sessionStorage.setItem('admin_analytics_key', keyToUse);
    } catch (err: any) {
      setAuthError('Failed to communicate with analytics service.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchStats(adminKey);
    }
  }, [isAuthenticated, adminKey, fetchStats]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setAdminKey(inputKey.trim());
    fetchStats(inputKey.trim());
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem('admin_analytics_key');
    setAdminKey('');
    setIsAuthenticated(false);
    setData(null);
  };

  // Helper for percentage bar
  const renderBarList = (items: MetricItem[], total: number) => {
    if (!items || items.length === 0) {
      return <p className="text-xs text-[#a38a70]/60 italic">No events recorded yet</p>;
    }

    return (
      <div className="space-y-3">
        {items.map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-xs text-[#eedec6]">
                <span className="truncate pr-2 font-mono text-[13px]">{item.name}</span>
                <span className="text-[#c7a475] font-semibold whitespace-nowrap">
                  {item.count} <span className="text-[#a38a70]/60 font-normal">({pct}%)</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#251b14] rounded-full overflow-hidden border border-[#523e2a]/40">
                <div
                  className="h-full bg-gradient-to-r from-[#8f673a] to-[#d8ad70] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(pct, 3)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 1. Password Protection Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0d0906] text-[#e8dbce] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md p-8 rounded-sm bg-[#18110b] border border-[#543f2c] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
          <div className="text-center mb-6">
            <span className="text-3xl inline-block mb-2">🔒</span>
            <h1 className="text-xl sm:text-2xl font-serif text-[#ecdac1] tracking-wide">
              Device Analytics Portal
            </h1>
            <p className="text-xs text-[#9c8065] mt-1 font-serif italic">
              Restricted Area • Confidential Visitor Metrics
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#a88d72] mb-1.5 font-mono">
                Admin Passcode / Key
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter ADMIN_ANALYTICS_PASSWORD"
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#0e0a07] border border-[#59432f] text-sm text-[#f5ebd9] focus:outline-none focus:border-[#c59c6b] transition-colors font-mono"
                required
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded border border-rose-900/60 font-sans">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#6e4e2c] to-[#997143] hover:from-[#7e5a33] hover:to-[#ae814d] text-[#f7f0e3] text-xs font-semibold uppercase tracking-widest rounded-sm transition-all shadow-md focus:outline-none cursor-pointer"
            >
              {isLoading ? 'Verifying...' : 'Unlock Analytics'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#3d2b1c] text-center">
            <Link
              href="/"
              className="text-xs font-serif text-[#a68c71] hover:text-[#e8dbce] transition-colors underline decoration-[#63482f]"
            >
              ← Return to Love Letter
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0906] text-[#e8dbce] p-4 sm:p-8 md:p-12 selection:bg-[#cca673]/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#3b2b1d]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-[#332214] text-[#d4ae77] border border-[#6b4e2e]/50 font-mono">
                First-Party Analytics
              </span>
              <span className="text-xs text-emerald-400/90 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#f2e5d5] mt-1 tracking-wide">
              Device & Visitor Analytics
            </h1>
            <p className="text-xs text-[#a68c71] font-serif italic mt-0.5">
              Privacy-conscious non-fingerprinted telemetry for Maria Mathew letter
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchStats(adminKey)}
              disabled={isLoading}
              className="px-3.5 py-1.5 text-xs font-serif text-[#ecdac1] bg-[#21160e] hover:bg-[#332216] border border-[#5e442d] rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>↻</span> {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-xs font-serif text-rose-300 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 rounded-sm transition-colors cursor-pointer"
            >
              Lock
            </button>
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-serif text-[#d2ba98] hover:text-[#f8ede0] bg-[#1c130b] hover:bg-[#2b1e13] border border-[#523a23] rounded-sm transition-colors"
            >
              View Letter →
            </Link>
          </div>
        </header>

        {/* Privacy Note Banner */}
        <div className="p-3.5 sm:p-4 rounded-sm bg-[#16100a] border border-[#4a3522] text-xs text-[#baa388] leading-relaxed flex items-start gap-3 shadow-inner">
          <span className="text-base text-[#d8ad70] mt-0.5">🛡️</span>
          <div>
            <strong className="text-[#eddcc7] font-serif text-[13px] block">
              Privacy & Device Model Disclosure Note
            </strong>
            Modern mobile browsers (notably iOS Safari & privacy-hardened Chromium) deliberately withhold exact hardware models (e.g. reporting generic &ldquo;iPhone&rdquo;) to protect user identity. This system collects only legitimate standard User-Agent Client Hints and headers without invasive canvas, audio, or battery fingerprinting.
          </div>
        </div>

        {/* Supabase Not Configured Warning */}
        {!isConfigured && (
          <div className="p-6 rounded-sm bg-[#24130b] border border-amber-800/80 text-amber-200 space-y-2">
            <h3 className="font-serif font-bold text-base text-amber-100 flex items-center gap-2">
              <span>⚠️</span> Supabase Credentials Needed in Environment
            </h3>
            <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
              {configMessage || 'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not yet configured.'}
            </p>
            <p className="text-xs text-amber-300 font-mono mt-2">
              1. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env.local<br />
              2. Run the migration in supabase/migrations/20260912_device_visits.sql in your Supabase SQL Editor.
            </p>
          </div>
        )}

        {/* Overview KPI Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-sm bg-[#16100a] border border-[#473320] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-[#9c8266] font-mono block mb-1">
              Total Visits (30d)
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-[#f4ebdc] font-bold">
              {data ? data.totalVisits : 0}
            </span>
          </div>

          <div className="p-4 rounded-sm bg-[#16100a] border border-[#473320] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-[#9c8266] font-mono block mb-1">
              Unique Visitors
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-[#d8b072] font-bold">
              {data ? data.uniqueSessions : 0}
            </span>
          </div>

          <div className="p-4 rounded-sm bg-[#16100a] border border-[#473320] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-[#9c8266] font-mono block mb-1">
              Visits Today
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-[#f4ebdc] font-bold">
              {data ? data.visitsToday : 0}
            </span>
          </div>

          <div className="p-4 rounded-sm bg-[#16100a] border border-[#473320] shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-[#9c8266] font-mono block mb-1">
              Last 7 Days
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-[#f4ebdc] font-bold">
              {data ? data.visits7d : 0}
            </span>
          </div>

          <div className="p-4 rounded-sm bg-[#16100a] border border-[#473320] shadow-sm col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wider text-[#9c8266] font-mono block mb-1">
              Active Letters
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-[#c59c6b] font-bold">
              2
            </span>
          </div>
        </section>

        {/* Visits Over Time Chart (Last 14 Days) */}
        <section className="p-5 sm:p-6 rounded-sm bg-[#16100a] border border-[#473320]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-serif text-[#f2e6d6]">
                Visits & Unique Visitors Over Time
              </h2>
              <span className="text-xs text-[#9e8367] font-serif italic">Last 14 days activity</span>
            </div>
          </div>

          {/* Clean SVG Bar Chart */}
          <div className="h-44 w-full flex items-end gap-1.5 sm:gap-2.5 pt-4 pb-2 border-b border-[#3b2b1d]">
            {data && data.dailyVisits.map((day) => {
              const maxVisits = Math.max(...data.dailyVisits.map((d) => d.visits), 5);
              const heightPct = Math.max((day.visits / maxVisits) * 100, 4);

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#090604] border border-[#6b5035] p-1.5 rounded text-[10px] whitespace-nowrap z-20 shadow-lg font-mono">
                    <div>{day.date}</div>
                    <div className="text-[#d8ad70]">{day.visits} visits ({day.uniqueVisitors} unique)</div>
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-[#614223] to-[#c79d63] rounded-t-sm group-hover:from-[#7d562f] group-hover:to-[#e2b77a] transition-all"
                    style={{ height: `${heightPct}%` }}
                  />

                  {/* Date label */}
                  <span className="text-[9px] font-mono text-[#8a7056] mt-2 block truncate w-full text-center">
                    {day.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Device Categories & Brands */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. Mobile vs Desktop vs Tablet */}
          <div className="p-5 rounded-sm bg-[#16100a] border border-[#473320]">
            <h3 className="font-serif text-base text-[#f0e3d2] mb-1">
              Device Form Factor
            </h3>
            <p className="text-xs text-[#9e8367] mb-4">Mobile vs Desktop vs Tablet</p>
            {data && renderBarList(data.deviceTypes, data.totalVisits)}
          </div>

          {/* 2. Top Brands */}
          <div className="p-5 rounded-sm bg-[#16100a] border border-[#473320]">
            <h3 className="font-serif text-base text-[#f0e3d2] mb-1">
              Top Device Brands
            </h3>
            <p className="text-xs text-[#9e8367] mb-4">Manufacturer where exposed</p>
            {data && renderBarList(data.brands, data.totalVisits)}
          </div>

          {/* 3. Top Models */}
          <div className="p-5 rounded-sm bg-[#16100a] border border-[#473320]">
            <h3 className="font-serif text-base text-[#f0e3d2] mb-1">
              Detected Hardware Models
            </h3>
            <p className="text-xs text-[#9e8367] mb-4">User-Agent Client Hints</p>
            {data && renderBarList(data.models, data.totalVisits)}
          </div>
        </div>

        {/* Operating Systems & Browsers & Screen Resolutions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* OS */}
          <div className="p-5 rounded-sm bg-[#16100a] border border-[#473320]">
            <h3 className="font-serif text-base text-[#f0e3d2] mb-1">
              Operating Systems
            </h3>
            <p className="text-xs text-[#9e8367] mb-4">Platform & major version</p>
            {data && renderBarList(data.operatingSystems, data.totalVisits)}
          </div>

          {/* Browsers */}
          <div className="p-5 rounded-sm bg-[#16100a] border border-[#473320]">
            <h3 className="font-serif text-base text-[#f0e3d2] mb-1">
              Web Browsers
            </h3>
            <p className="text-xs text-[#9e8367] mb-4">Browser engine & brand</p>
            {data && renderBarList(data.browsers, data.totalVisits)}
          </div>

          {/* Screen Resolutions */}
          <div className="p-5 rounded-sm bg-[#16100a] border border-[#473320]">
            <h3 className="font-serif text-base text-[#f0e3d2] mb-1">
              Screen Resolutions
            </h3>
            <p className="text-xs text-[#9e8367] mb-4">Physical screen pixels</p>
            {data && renderBarList(data.screenResolutions, data.totalVisits)}
          </div>
        </div>

        {/* Traffic & Pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pages */}
          <div className="p-5 rounded-sm bg-[#16100a] border border-[#473320]">
            <h3 className="font-serif text-base text-[#f0e3d2] mb-1">
              Pages Visited
            </h3>
            <p className="text-xs text-[#9e8367] mb-4">Requested URL paths</p>
            {data && renderBarList(data.pages, data.totalVisits)}
          </div>

          {/* Referrers */}
          <div className="p-5 rounded-sm bg-[#16100a] border border-[#473320]">
            <h3 className="font-serif text-base text-[#f0e3d2] mb-1">
              Traffic Sources / Referrers
            </h3>
            <p className="text-xs text-[#9e8367] mb-4">Inbound links & domains</p>
            {data && renderBarList(data.referrers, data.totalVisits)}
          </div>
        </div>

      </div>
    </main>
  );
}
