import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Globe,
  Mail,
  GraduationCap,
  GitCompare,
  History,
  BookOpen,
  Settings,
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Cpu
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'url-scanner'
  | 'email-analyzer'
  | 'awareness-lab'
  | 'url-comparison'
  | 'history'
  | 'guides'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  backendOnline: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  backendOnline,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard, badge: 'Overview' },
    { id: 'url-scanner' as NavTab, label: 'URL Scanner', icon: Globe, badge: 'Core' },
    { id: 'email-analyzer' as NavTab, label: 'Email Analyzer', icon: Mail, badge: 'Smart' },
    { id: 'awareness-lab' as NavTab, label: 'Awareness Lab', icon: GraduationCap, badge: '5 Scenarios' },
    { id: 'url-comparison' as NavTab, label: 'URL Comparison', icon: GitCompare, badge: 'Diff Tool' },
    { id: 'history' as NavTab, label: 'Scan History', icon: History },
    { id: 'guides' as NavTab, label: 'Security Guides', icon: BookOpen, badge: 'Playbook' },
    { id: 'settings' as NavTab, label: 'Settings & About', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a101f] border-r border-[#1a253c] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a253c]">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow-cyan">
              <Shield className="w-5 h-5 text-black" strokeWidth={2.5} />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-mono">PhishGuard</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-mono">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Cyber Defense Platform</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase font-mono">
            Navigation Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#131d31]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      isActive
                        ? 'bg-cyan-400/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Engine status indicator & footer */}
        <div className="p-3 m-3 rounded-xl bg-[#0e1628] border border-[#1b2742]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">Analysis Engine</span>
            </div>
            <span
              className={`flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                backendOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                }`}
              />
              <span>{backendOnline ? 'FastAPI' : 'Client Heuristic'}</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {backendOnline
              ? 'Connected to local FastAPI backend for enhanced heuristic parsing.'
              : 'Zero external API dependencies. 100% private local browser heuristics.'}
          </p>

          <div className="mt-3 pt-2.5 border-t border-[#1a253c] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Privacy Guard</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> No Remote Logs
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
