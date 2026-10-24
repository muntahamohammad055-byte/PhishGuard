import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  ShieldCheck,
  Database,
  Lock,
  RefreshCw,
  Terminal,
  Info,
  CheckCircle,
  Layers,
  AlertCircle
} from 'lucide-react';
import { checkBackendHealth } from '../services/api';

interface SettingsViewProps {
  backendOnline: boolean;
  onRefreshBackend: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  backendOnline,
  onRefreshBackend,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setIsChecking(true);
    setCheckMessage(null);
    const res = await checkBackendHealth();
    setIsChecking(false);
    onRefreshBackend();
    if (res.online) {
      setCheckMessage('Successfully connected to FastAPI Backend at http://localhost:8000!');
    } else {
      setCheckMessage('FastAPI backend not detected. Seamlessly using In-Browser TypeScript Heuristics Engine.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-2">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Settings className="w-5 h-5" />
          </span>
          <h2 className="text-lg md:text-xl font-bold text-white">
            System Architecture & Engine Settings
          </h2>
        </div>
        <p className="text-xs text-slate-300">
          Transparency settings, dual-engine runtime status, and local security rule configurations.
        </p>
      </div>

      {/* Dual Engine Status Card */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Dual Heuristic Engine Architecture</span>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={isChecking}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#142038] hover:bg-[#1b2c4f] text-cyan-400 border border-cyan-500/30 text-xs font-mono transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        {checkMessage && (
          <div className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
            backendOnline ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
          }`}>
            <Info className="w-4 h-4 shrink-0" />
            <span>{checkMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Engine 1: Client Heuristic */}
          <div className="p-4 rounded-xl bg-[#080d19] border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm font-mono">1. Client-Side TypeScript Engine</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Always Active
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Executes directly inside your browser. Deconstructs URLs, extracts apex domains, calculates Shannon entropy, tests lookalike homoglyphs, and audits email urgency patterns. 100% offline-capable.
            </p>
          </div>

          {/* Engine 2: Python FastAPI */}
          <div className="p-4 rounded-xl bg-[#080d19] border border-[#1d2a45] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm font-mono">2. Python FastAPI Backend</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                backendOnline 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {backendOnline ? 'Connected (Port 8000)' : 'Offline (Optional)'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Provides dedicated REST API endpoints (<code>/api/scan/url</code>, <code>/api/scan/email</code>, <code>/api/compare/url</code>) using high-performance Python heuristics. When running, the frontend automatically relays deep scans to FastAPI.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee & No-API-Key Policy */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Confidentiality & Zero Paid API Policy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#080d19] border border-[#1b2742] space-y-1.5">
            <strong className="text-white font-mono block">Zero Paid API Keys Required</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              All detection algorithms run using explainable heuristic rules and deterministic scoring matrices. No subscriptions, no tokens, and no quota restrictions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080d19] border border-[#1b2742] space-y-1.5">
            <strong className="text-white font-mono block">Zero Remote Data Transmission</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Your sensitive email bodies, corporate links, and employee communication contents are never relayed to OpenAI, Google Cloud, or third-party loggers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080d19] border border-[#1b2742] space-y-1.5">
            <strong className="text-white font-mono block">Local Storage Audit Trail</strong>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              All history records and awareness quiz scores remain strictly confined to your browser&apos;s localStorage, easily exportable or wiped at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Backend Run Instructions */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-3">
        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>How to Run the FastAPI Backend (Optional)</span>
        </h4>

        <div className="p-3.5 rounded-xl bg-[#080d19] border border-[#192641] text-xs font-mono text-slate-300 space-y-2">
          <p className="text-slate-400">In your terminal, navigate to the project directory and run:</p>
          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300">
            <code>python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload</code>
          </div>
          <p className="text-[11px] text-slate-500">
            Once running, the UI status pill will automatically illuminate green (&quot;FastAPI Connected&quot;).
          </p>
        </div>
      </div>
    </div>
  );
};
