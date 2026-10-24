import React from 'react';
import { Menu, Shield, Zap, Search, Bell, ExternalLink, HelpCircle } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onOpenSidebar: () => void;
  onQuickScan: () => void;
  onSelectTab: (tab: NavTab) => void;
  backendOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSidebar,
  onQuickScan,
  onSelectTab,
  backendOnline,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Threat Intelligence Dashboard', subtitle: 'Real-time heuristic telemetry and risk monitoring' };
      case 'url-scanner':
        return { title: 'Smart URL Security Scanner', subtitle: 'Deep structural analysis, brand spoofing & homoglyph detection' };
      case 'email-analyzer':
        return { title: 'AI-Style Phishing Email Analyzer', subtitle: 'Rule-based social engineering, urgency & credential inspection' };
      case 'awareness-lab':
        return { title: 'Interactive Cyber Awareness Lab', subtitle: '5 real-world attack scenarios with hands-on red flag discovery' };
      case 'url-comparison':
        return { title: 'URL Lookalike & Safety Comparison', subtitle: 'Side-by-side component diff, combosquatting & typosquatting detection' };
      case 'history':
        return { title: 'Threat History & Telemetry Logs', subtitle: 'Searchable audit trail of verified scans and verdicts' };
      case 'guides':
        return { title: 'Incident Response & Security Playbooks', subtitle: 'Actionable steps if compromised, reporting channels, and MFA guides' };
      case 'settings':
        return { title: 'System Engine & Privacy Settings', subtitle: 'Heuristic rules configuration, offline engine, and project architecture' };
      default:
        return { title: 'PhishGuard AI', subtitle: 'Cyber Defense Platform' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-[#0a101f]/90 backdrop-blur-md border-b border-[#1a253c]">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#131d31] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h1>
          <p className="hidden md:block text-xs text-slate-400 truncate max-w-md">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Engine status indicator */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111c33] border border-[#1e2c48] text-xs">
          <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
          <span className="text-slate-300 font-medium">
            {backendOnline ? 'FastAPI Connected' : 'Browser Heuristic Active'}
          </span>
        </div>

        {/* Quick action buttons */}
        <button
          onClick={onQuickScan}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs transition-all shadow-glow-cyan active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Quick Scan</span>
        </button>

        <button
          onClick={() => onSelectTab('awareness-lab')}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141e35] hover:bg-[#1b2848] text-slate-200 border border-[#243454] font-medium text-xs transition-colors"
          title="Practice in Awareness Lab"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Awareness Lab</span>
        </button>
      </div>
    </header>
  );
};
