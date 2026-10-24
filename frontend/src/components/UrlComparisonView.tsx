import React, { useState } from 'react';
import {
  GitCompare,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  X,
  Lock,
  Unlock,
  BookOpen
} from 'lucide-react';
import { URL_COMPARISON_PRESETS } from '../data/sampleData';
import { UrlComparisonResult } from '../types';
import { compareTwoUrls } from '../services/api';
import { RiskGauge } from './RiskGauge';

export const UrlComparisonView: React.FC = () => {
  const [urlA, setUrlA] = useState<string>('https://www.paypal.com/signin');
  const [urlB, setUrlB] = useState<string>('http://paypal-security-verification.com.id984.xyz/signin');
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [result, setResult] = useState<UrlComparisonResult | null>(null);

  const handleRunComparison = async (overrideA?: string, overrideB?: string) => {
    const targetA = overrideA || urlA;
    const targetB = overrideB || urlB;
    if (!targetA.trim() || !targetB.trim()) return;

    setIsComparing(true);
    try {
      const compResult = await compareTwoUrls(targetA, targetB);
      setResult(compResult);
    } catch (e) {
      console.error(e);
    } finally {
      setIsComparing(false);
    }
  };

  const handleSelectPreset = (preset: typeof URL_COMPARISON_PRESETS[0]) => {
    setUrlA(preset.legitUrl);
    setUrlB(preset.targetUrl);
    handleRunComparison(preset.legitUrl, preset.targetUrl);
  };

  // Run on mount once with default PayPal comparison
  React.useEffect(() => {
    handleRunComparison();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header & Preset Selector */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <GitCompare className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                URL Safety & Lookalike Comparison Engine
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Decompile two URLs side-by-side to expose subtle typosquatting, subdomain deception, and homoglyph impersonations.
            </p>
          </div>

          <button
            onClick={() => handleRunComparison()}
            disabled={isComparing || !urlA.trim() || !urlB.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-black font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
          >
            {isComparing ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Comparing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Differential Diff</span>
              </>
            )}
          </button>
        </div>

        {/* Inputs Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* URL A: Legitimate Reference */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Legitimate / Reference URL (A)</span>
            </label>
            <input
              type="text"
              value={urlA}
              onChange={(e) => setUrlA(e.target.value)}
              placeholder="e.g. https://www.paypal.com/signin"
              className="w-full px-3.5 py-2.5 bg-[#080d19] border border-emerald-500/30 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* URL B: Target / Suspicious */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-rose-400 flex items-center gap-1.5 uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Target / Lookalike URL (B)</span>
            </label>
            <input
              type="text"
              value={urlB}
              onChange={(e) => setUrlB(e.target.value)}
              placeholder="e.g. http://paypal-security.com.attacker.xyz/signin"
              className="w-full px-3.5 py-2.5 bg-[#080d19] border border-rose-500/30 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Presets Row */}
        <div className="mt-4 pt-3 border-t border-[#17233c]">
          <div className="text-[11px] text-slate-400 font-mono mb-2">
            Preset Comparison Demonstrations:
          </div>
          <div className="flex flex-wrap gap-2">
            {URL_COMPARISON_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#111a2e] hover:bg-[#1a2846] text-cyan-300 border border-[#1d2d4f] font-mono transition-colors"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Results Card */}
      {result && (
        <div className="space-y-6">
          {/* Conclusion Banner */}
          <div className="p-5 rounded-2xl bg-[#0c1426] border border-cyan-500/30 shadow-xl space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Differential Analysis Verdict</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              {result.conclusion}
            </p>
          </div>

          {/* Side by side component diff table */}
          <div className="p-5 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Component-by-Component Structural Dissection
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1b2742] text-slate-400 font-mono">
                    <th className="py-2.5 px-3">Component</th>
                    <th className="py-2.5 px-3 text-emerald-400">URL A (Reference)</th>
                    <th className="py-2.5 px-3 text-rose-400">URL B (Target)</th>
                    <th className="py-2.5 px-3">Differential Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#152035] font-mono">
                  {result.differences.map((diff, idx) => {
                    return (
                      <tr key={idx} className="hover:bg-[#101b33] transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-300">
                          {diff.component}
                        </td>
                        <td className="py-3 px-3 text-emerald-300 break-all">
                          {diff.legitimateVal}
                        </td>
                        <td className="py-3 px-3 text-rose-300 break-all font-semibold">
                          {diff.targetVal}
                        </td>
                        <td className="py-3 px-3 font-sans text-xs text-slate-300 leading-relaxed max-w-sm">
                          {diff.analysis}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deception Techniques Detector */}
          <div className="p-5 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Deception Attack Vectors Audited
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {result.deceptionTechniquesDetected.map((tech, idx) => {
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      tech.detected
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-[#0a101f] border-[#18253e]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">
                        {tech.technique}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          tech.detected
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {tech.detected ? 'DETECTED' : 'CLEAN'}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {tech.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Educational Explainer Cards */}
          <div className="p-5 rounded-2xl bg-[#0c1426] border border-[#1b2640] space-y-4">
            <div className="flex items-center space-x-2 text-violet-400 font-mono text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Cyber Awareness Primer: Common Lookalike Tricks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-[#080d19] border border-[#1a2744] space-y-1">
                <strong className="text-cyan-300 font-mono block">1. Combosquatting</strong>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Attackers chain legitimate brand names with security terms using hyphens (e.g. <code>paypal-security-auth.com</code>).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080d19] border border-[#1a2744] space-y-1">
                <strong className="text-amber-300 font-mono block">2. Subdomain Camouflage</strong>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Placing the brand inside subdomains (e.g. <code>paypal.com.attacker-server.xyz</code>). The true owner is the apex host before the first slash.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080d19] border border-[#1a2744] space-y-1">
                <strong className="text-rose-300 font-mono block">3. IDN Homoglyphs</strong>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Using Cyrillic or Greek characters that look identical to ASCII letters (e.g. Cyrillic &apos;а&apos; instead of Latin &apos;a&apos;).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
