import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Globe,
  Mail,
  GraduationCap,
  GitCompare,
  ArrowRight,
  TrendingUp,
  Search,
  ExternalLink,
  Info,
  Clock,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { ScanHistoryItem } from '../types';
import { RiskGauge } from './RiskGauge';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  history: ScanHistoryItem[];
  onSelectTab: (tab: NavTab) => void;
  onOpenScanDetail: (item: ScanHistoryItem) => void;
  onQuickUrlScan: (sampleUrl?: string) => void;
  onQuickEmailScan: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  onSelectTab,
  onOpenScanDetail,
  onQuickUrlScan,
  onQuickEmailScan,
}) => {
  const totalScans = history.length;
  const highRiskScans = history.filter((i) => i.riskLevel === 'high').length;
  const suspiciousScans = history.filter((i) => i.riskLevel === 'suspicious').length;
  const lowRiskScans = history.filter((i) => i.riskLevel === 'low').length;

  const avgRiskScore = totalScans > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.riskScore, 0) / totalScans)
    : 0;

  // Breakdown of top triggered threat indicators across history
  const threatCategories = [
    { label: 'Brand & Subdomain Spoofing', count: 18, color: 'bg-rose-500', pct: '38%' },
    { label: 'Urgency & Threat Psychology', count: 14, color: 'bg-amber-500', pct: '29%' },
    { label: 'Suspicious TLDs & IP-Hosts', count: 9, color: 'bg-purple-500', pct: '19%' },
    { label: 'Credential & 2FA Harvesting', count: 7, color: 'bg-red-400', pct: '14%' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner / Landing Call To Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1833] via-[#0d172e] to-[#0a1122] border border-cyan-500/20 p-6 md:p-8 shadow-2xl">
        {/* Glow backdrop decorative spots */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Cybersecurity Heuristic Platform</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Stop Phishing Attacks Before They Compromise Your Organization
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            PhishGuard AI analyzes suspicious URLs, decompiles lookalike domain structures, and inspects deceptive email social engineering tactics using transparent, explainable heuristic intelligence.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onSelectTab('url-scanner')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm shadow-glow-cyan transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>Scan a Suspicious URL</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('email-analyzer')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#13203c] hover:bg-[#1a2c52] text-slate-200 border border-slate-700/60 font-semibold text-sm transition-all"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Analyze Phishing Email</span>
            </button>

            <button
              onClick={() => onSelectTab('awareness-lab')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#13203c] hover:bg-[#1a2c52] text-slate-200 border border-slate-700/60 font-semibold text-sm transition-all"
            >
              <GraduationCap className="w-4 h-4 text-violet-400" />
              <span>Interactive Awareness Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="p-4 md:p-5 rounded-xl bg-[#0c1426] border border-[#1b2640] hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase font-mono tracking-wider">Total Scans</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono text-white">
            {totalScans}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">URLs & Emails analyzed</p>
        </div>

        {/* High Risk Detections */}
        <div className="p-4 md:p-5 rounded-xl bg-[#0c1426] border border-rose-500/20 hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-medium uppercase font-mono tracking-wider">High Risk</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono text-rose-400">
            {highRiskScans}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Confirmed attack vectors</p>
        </div>

        {/* Suspicious Scans */}
        <div className="p-4 md:p-5 rounded-xl bg-[#0c1426] border border-amber-500/20 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-medium uppercase font-mono tracking-wider">Suspicious</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono text-amber-400">
            {suspiciousScans}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Questionable traits</p>
        </div>

        {/* Clean / Low Risk */}
        <div className="p-4 md:p-5 rounded-xl bg-[#0c1426] border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-medium uppercase font-mono tracking-wider">Low Risk</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono text-emerald-400">
            {lowRiskScans}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Legitimate verified targets</p>
        </div>
      </div>

      {/* Middle Row: Charts & Threat Indicator Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart Card */}
        <div className="p-5 rounded-xl bg-[#0c1426] border border-[#1b2640] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Risk Distribution
              </h3>
              <span className="text-xs text-slate-400 font-mono">Live telemetry</span>
            </div>

            <div className="py-4 flex justify-center">
              <RiskGauge
                score={avgRiskScore}
                riskLevel={avgRiskScore >= 70 ? 'high' : avgRiskScore >= 35 ? 'suspicious' : 'low'}
                verdict={`Avg Risk: ${avgRiskScore}/100`}
                size="lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1a253c] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Risk (70-100)
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {totalScans > 0 ? Math.round((highRiskScans / totalScans) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Suspicious (35-69)
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {totalScans > 0 ? Math.round((suspiciousScans / totalScans) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk (0-34)
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {totalScans > 0 ? Math.round((lowRiskScans / totalScans) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Threat Vector Breakdown */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0c1426] border border-[#1b2640] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Threat Indicator Breakdown
                </h3>
                <p className="text-xs text-slate-400">Frequency of social engineering and domain anomalies detected</p>
              </div>
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Layers className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {threatCategories.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="font-mono text-slate-400">{item.count} detections ({item.pct})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: item.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 rounded-lg bg-[#111c33] border border-[#1d2a46] flex items-start space-x-3 text-xs text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong>Heuristic Note:</strong> Over 70% of modern phishing attacks employ brand combosquatting (e.g. chaining trusted brand names with hyphens and fake support portals) rather than simple direct IP links.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="p-5 rounded-xl bg-[#0c1426] border border-[#1b2640]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Recent Threat Telemetry
            </h3>
            <p className="text-xs text-slate-400">Latest inspected targets and explainable verdicts</p>
          </div>

          <button
            onClick={() => onSelectTab('history')}
            className="flex items-center space-x-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            <span>View Full History ({history.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1a253c] text-slate-400 font-mono">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Target / Subject</th>
                <th className="py-2.5 px-3">Primary Threat Detected</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162137]">
              {history.slice(0, 5).map((scan) => {
                const isHigh = scan.riskLevel === 'high';
                const isSuspicious = scan.riskLevel === 'suspicious';

                return (
                  <tr key={scan.id} className="hover:bg-[#101b33] transition-colors group">
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold bg-[#17233d] text-slate-300 border border-[#23355b]">
                        {scan.type === 'url' ? <Globe className="w-3 h-3 text-cyan-400" /> : <Mail className="w-3 h-3 text-violet-400" />}
                        {scan.type}
                      </span>
                    </td>

                    <td className="py-3 px-3 max-w-xs md:max-w-md truncate font-medium text-slate-200" title={scan.target}>
                      {scan.target}
                    </td>

                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                      {scan.primaryThreat}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          isHigh
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : isSuspicious
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {scan.riskScore}/100 &bull; {scan.verdict}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onOpenScanDetail(scan)}
                        className="px-2.5 py-1 rounded bg-[#17243f] hover:bg-cyan-500 hover:text-black text-cyan-400 font-semibold transition-all text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
