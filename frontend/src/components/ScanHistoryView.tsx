import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  Globe,
  Mail,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  Info
} from 'lucide-react';
import { ScanHistoryItem } from '../types';
import { clearScanHistory, deleteScanHistoryItem } from '../services/storage';

interface ScanHistoryViewProps {
  history: ScanHistoryItem[];
  onHistoryChange: (updated: ScanHistoryItem[]) => void;
  onOpenDetail: (item: ScanHistoryItem) => void;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  history,
  onHistoryChange,
  onOpenDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'url' | 'email'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'suspicious' | 'low'>('all');

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryThreat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesRisk = riskFilter === 'all' || item.riskLevel === riskFilter;
    return matchesSearch && matchesType && matchesRisk;
  });

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your local scan history? This action cannot be undone.')) {
      clearScanHistory();
      onHistoryChange([]);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteScanHistoryItem(id);
    onHistoryChange(updated);
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Type', 'Target', 'RiskScore', 'Verdict', 'PrimaryThreat'];
    const rows = history.map((item) => [
      `"${item.timestamp}"`,
      `"${item.type}"`,
      `"${item.target.replace(/"/g, '""')}"`,
      item.riskScore,
      `"${item.verdict}"`,
      `"${item.primaryThreat.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phishguard_telemetry_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phishguard_telemetry_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header card with export & clear buttons */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <History className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                Scan Telemetry & Threat History
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Persistent local audit trail of inspected URLs, email analyses, and heuristic verdicts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={history.length === 0}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#142038] hover:bg-[#1b2c4f] disabled:opacity-50 text-slate-200 border border-[#23355b] text-xs font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              disabled={history.length === 0}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#142038] hover:bg-[#1b2c4f] disabled:opacity-50 text-slate-200 border border-[#23355b] text-xs font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-violet-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleClearAll}
              disabled={history.length === 0}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 disabled:opacity-50 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search target URL, subject, or threat factor..."
              className="w-full pl-9 pr-3 py-2 bg-[#080d19] border border-[#1b2742] rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#080d19] border border-[#1b2742] rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Types (URL & Email)</option>
              <option value="url">URLs Only</option>
              <option value="email">Emails Only</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="md:col-span-3">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#080d19] border border-[#1b2742] rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk (70-100)</option>
              <option value="suspicious">Suspicious (35-69)</option>
              <option value="low">Low Risk (0-34)</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#080d19] border-b border-[#1b2742] text-slate-400 font-mono">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Target / Subject</th>
                <th className="py-3 px-4">Threat Diagnosis</th>
                <th className="py-3 px-4">Score & Verdict</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#152035]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                    No scans found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isHigh = item.riskLevel === 'high';
                  const isSuspicious = item.riskLevel === 'suspicious';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onOpenDetail(item)}
                      className="hover:bg-[#101b33] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 text-slate-400 font-mono whitespace-nowrap text-[11px]">
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-[#142038] text-slate-300 border border-[#23355b]">
                          {item.type === 'url' ? <Globe className="w-3 h-3 text-cyan-400" /> : <Mail className="w-3 h-3 text-violet-400" />}
                          {item.type}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs md:max-w-md truncate font-medium text-slate-200" title={item.target}>
                        {item.target}
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                        {item.primaryThreat}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                            isHigh
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : isSuspicious
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {item.riskScore}/100 &bull; {item.verdict}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDetail(item);
                          }}
                          className="px-2.5 py-1 rounded bg-[#17243f] group-hover:bg-cyan-500 group-hover:text-black text-cyan-400 font-semibold transition-all text-[11px]"
                        >
                          Details
                        </button>

                        <button
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
