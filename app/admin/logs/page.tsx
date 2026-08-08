'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Activity, Clock, Terminal } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

interface AuditLogRow {
  id: string;
  actorId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: string;
  ipAddress?: string;
  createdAt: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error('Failed to fetch audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA] tracking-tight">System Audit & Security Logs</h1>
          <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">
            Immutable tracking of all high-privilege operations and system actions
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="aurora-btn-primary px-4 py-2.5 text-xs inline-flex items-center cursor-pointer w-fit"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
        </button>
      </div>

      <div className="rounded-2xl border border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5EAF2] dark:border-[#27313B] flex items-center justify-between bg-[#F5F8FC] dark:bg-[#1A2129]">
          <div className="flex items-center space-x-2 text-[#2563EB] dark:text-[#60A5FA]">
            <Activity className="h-4 w-4" />
            <h2 className="text-sm font-extrabold text-[#111827] dark:text-[#F5F7FA]">Audit Stream ({logs.length})</h2>
          </div>
          <span className="text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">PostgreSQL Audit Table</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm font-semibold text-[#475569] dark:text-[#A3ADB8]">
            Fetching system security logs...
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            title="No Audit Logs Recorded"
            description="System security activity stream is clean. High-privilege actions will appear here automatically."
            icon={Activity}
            className="border-0 shadow-none py-12"
          />
        ) : (
          <div className="divide-y divide-[#E5EAF2] dark:divide-[#27313B] font-mono text-xs">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#F5F8FC] dark:hover:bg-[#1A2129] transition-colors">
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="mt-0.5 h-6 w-6 shrink-0 rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center font-bold">
                    <Terminal className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] bg-[#DBEAFE] dark:bg-[#1A2129] px-2 py-0.5 rounded border border-[#2563EB]/20 dark:border-[#27313B]">
                        {log.action}
                      </span>
                      <span className="text-[#111827] dark:text-[#F5F7FA] font-bold">{log.resource}</span>
                      {log.resourceId && <span className="text-[#94A3B8] dark:text-[#6B7682]">[{log.resourceId}]</span>}
                    </div>
                    {log.metadata && (
                      <p className="text-[11px] text-[#475569] dark:text-[#A3ADB8] mt-1 truncate">
                        Payload: {log.metadata}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 text-[#94A3B8] dark:text-[#6B7682] text-[11px] font-sans font-medium">
                  <span>Actor: {log.actorId.slice(0, 12)}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

