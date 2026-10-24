import React from 'react';
import {
  X,
  Globe,
  Mail,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  CheckCircle,
  ExternalLink,
  Layers,
  Clock
} from 'lucide-react';
import { ScanHistoryItem } from '../types';
import { RiskGauge } from './RiskGauge';

interface ScanDetailModalProps {
  item: ScanHistoryItem | null;
  onClose: () => void;
}

export const ScanDetailModal: React.FC<ScanDetailModalProps> = ({ item, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-2xl p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1b2742]">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-[#141f36] text-cyan-400">
              {item.type === 'url' ? <Globe className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{item.type === 'url' ? 'URL Heuristic Record' : 'Email Security Forensic Record'}</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Scan ID: {item.id} &bull; {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Verdict Overview */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#080d19] border border-[#192744] gap-4">
          <div className="flex items-center space-x-4">
            <RiskGauge
              score={item.riskScore}
              riskLevel={item.riskLevel}
              verdict={item.verdict}
              size="md"
              showLabel={false}
            />
            <div>
              <span
                className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                  item.riskLevel === 'high'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : item.riskLevel === 'suspicious'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {item.verdict} ({item.riskScore}/100)
              </span>
              <h4 className="text-sm font-bold text-white mt-1 break-all">
                {item.target}
              </h4>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#142038] hover:bg-[#1b2b4b] text-slate-200 border border-[#213459] text-xs font-mono transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? 'Copied JSON' : 'Export JSON'}</span>
          </button>
        </div>

        {/* Primary Threat Summary */}
        <div className="p-3.5 rounded-xl bg-[#0e182e] border border-[#1d2f54] text-xs space-y-1">
          <span className="text-slate-400 font-mono text-[10px] uppercase">Primary Threat Factor:</span>
          <p className="text-white font-medium">{item.primaryThreat}</p>
        </div>

        {/* URL Specific Details if present */}
        {item.urlResult && (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Triggered Heuristic Indicators ({item.urlResult.indicators.length})
            </h5>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {item.urlResult.indicators.map((ind) => (
                <div key={ind.id} className="p-3 rounded-lg bg-[#080d19] border border-[#192742] text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{ind.title}</span>
                    <span className="text-rose-400 font-mono text-[11px]">+{ind.scoreImpact} pts</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{ind.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email Specific Details if present */}
        {item.emailResult && (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Email Psychological Trigger Patterns ({item.emailResult.indicators.length})
            </h5>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {item.emailResult.indicators.map((ind) => (
                <div key={ind.id} className="p-3 rounded-lg bg-[#080d19] border border-[#192742] text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{ind.title}</span>
                    <span className="text-rose-400 font-mono text-[11px]">+{ind.scoreImpact} pts</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{ind.description}</p>
                  {ind.snippet && (
                    <div className="text-[10px] text-amber-300 font-mono">
                      Quote: {ind.snippet}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-[#1b2742] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
