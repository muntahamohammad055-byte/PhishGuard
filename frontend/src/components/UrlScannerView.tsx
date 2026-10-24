import React, { useState } from 'react';
import {
  Globe,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Info,
  Layers,
  Terminal,
  Lock,
  Unlock,
  Copy,
  Check,
  Cpu,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { UrlScanResult, ThreatIndicator } from '../types';
import { SAMPLE_URLS, DemoUrlSample } from '../data/sampleData';
import { RiskGauge } from './RiskGauge';
import { scanUrl } from '../services/api';

interface UrlScannerViewProps {
  onScanComplete: (result: UrlScanResult) => void;
  initialUrl?: string;
}

export const UrlScannerView: React.FC<UrlScannerViewProps> = ({
  onScanComplete,
  initialUrl = '',
}) => {
  const [urlInput, setUrlInput] = useState<string>(initialUrl);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [scanResult, setScanResult] = useState<UrlScanResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'indicators' | 'decomposition' | 'recommendations'>('indicators');

  const handleScan = async (targetToScan?: string) => {
    const rawTarget = targetToScan || urlInput;
    if (!rawTarget.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    // Realistic multi-stage animation step feedback
    setScanStep('Decomposing domain structure & checking scheme...');
    await new Promise((r) => setTimeout(r, 250));

    setScanStep('Auditing top-level domain & IP address signatures...');
    await new Promise((r) => setTimeout(r, 250));

    setScanStep('Testing for brand combosquatting & IDN homoglyphs...');
    await new Promise((r) => setTimeout(r, 250));

    setScanStep('Calculating Shannon lexical entropy & threat indicators...');
    await new Promise((r) => setTimeout(r, 200));

    try {
      const { result } = await scanUrl(rawTarget);
      setScanResult(result);
      onScanComplete(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const handleSelectSample = (sample: DemoUrlSample) => {
    setUrlInput(sample.url);
    handleScan(sample.url);
  };

  const handleCopyResult = () => {
    if (!scanResult) return;
    const text = `PhishGuard AI Scan Result:
Target: ${scanResult.target}
Verdict: ${scanResult.verdict} (${scanResult.riskScore}/100)
Indicators Detected: ${scanResult.indicators.length}
Summary: ${scanResult.summary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Target URL to Inspect</span>
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            Explainable Heuristic Analysis
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isScanning && handleScan()}
              placeholder="Paste suspicious URL (e.g. http://paypal-security-update.com.id834.xyz/auth)..."
              className="w-full pl-10 pr-4 py-3 bg-[#080d19] border border-[#1f2b47] rounded-xl text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleScan()}
              disabled={isScanning || !urlInput.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm shadow-glow-cyan transition-all flex items-center justify-center gap-2 shrink-0"
            >
              {isScanning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Analysis</span>
                </>
              )}
            </button>

            {urlInput && (
              <button
                onClick={() => {
                  setUrlInput('');
                  setScanResult(null);
                }}
                className="px-3.5 py-3 rounded-xl bg-[#141d33] hover:bg-[#1b2744] text-slate-400 hover:text-white border border-[#22304f] transition-colors"
                title="Clear input"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Scanning step banner */}
        {isScanning && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
            <span className="text-xs font-mono text-cyan-300 animate-pulse">
              {scanStep}
            </span>
          </div>
        )}

        {/* Quick Demo Sample Badges */}
        <div className="mt-4 pt-3 border-t border-[#17233c]">
          <div className="text-[11px] text-slate-400 font-mono mb-2">
            Instant Test Presets (Click to load & analyze):
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS.map((sample, idx) => {
              const isPhish = sample.category === 'Phishing';
              const isSusp = sample.category === 'Suspicious';
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all flex items-center gap-1.5 ${
                    isPhish
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : isSusp
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isPhish ? 'bg-rose-400' : isSusp ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                  <span>{sample.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {scanResult && (
        <div className="space-y-6">
          {/* Main Verdict Card */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              scanResult.riskLevel === 'high'
                ? 'bg-[#180f1d] border-rose-500/40 glow-border-red'
                : scanResult.riskLevel === 'suspicious'
                ? 'bg-[#1a1712] border-amber-500/40'
                : 'bg-[#0b191c] border-emerald-500/40 glow-border-cyan'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <RiskGauge
                  score={scanResult.riskScore}
                  riskLevel={scanResult.riskLevel}
                  verdict={scanResult.verdict}
                  size="lg"
                  showLabel={false}
                />

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        scanResult.riskLevel === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : scanResult.riskLevel === 'suspicious'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {scanResult.verdict}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Confidence: {scanResult.confidence}%
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white break-all font-mono">
                    {scanResult.hostname}
                  </h3>

                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    {scanResult.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyResult}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1a253e] hover:bg-[#223253] text-slate-200 border border-[#2d3f66] text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copied ? 'Copied!' : 'Copy Report'}</span>
                </button>
              </div>
            </div>

            {/* Crucial Heuristic Disclaimer Label */}
            <div className="mt-5 pt-4 border-t border-slate-700/40 flex items-start space-x-2 text-[11px] text-slate-400 font-mono">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Heuristic Assessment Disclaimer:</strong> This score represents rule-based heuristic threat detection. It evaluates domain topology, lexical entropy, brand mimicry, and protocol signatures. It is designed for educational security awareness and does not guarantee complete absence of malware.
              </span>
            </div>
          </div>

          {/* Detailed Tabs: Threat Indicators / Domain Decomposition / Recommendations */}
          <div className="p-5 rounded-2xl bg-[#0c1426] border border-[#1b2640]">
            <div className="flex border-b border-[#1a253c] mb-5">
              <button
                onClick={() => setActiveTab('indicators')}
                className={`pb-3 px-4 text-xs font-bold font-mono transition-colors border-b-2 ${
                  activeTab === 'indicators'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Detected Indicators ({scanResult.indicators.length})
              </button>

              <button
                onClick={() => setActiveTab('decomposition')}
                className={`pb-3 px-4 text-xs font-bold font-mono transition-colors border-b-2 ${
                  activeTab === 'decomposition'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Safe URL Decomposition
              </button>

              <button
                onClick={() => setActiveTab('recommendations')}
                className={`pb-3 px-4 text-xs font-bold font-mono transition-colors border-b-2 ${
                  activeTab === 'recommendations'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Next Steps & Recommendations
              </button>
            </div>

            {/* TAB 1: THREAT INDICATORS */}
            {activeTab === 'indicators' && (
              <div className="space-y-3">
                {scanResult.indicators.map((indicator) => {
                  const isCrit = indicator.severity === 'critical';
                  const isWarn = indicator.severity === 'warning';
                  const isCaution = indicator.severity === 'caution';

                  return (
                    <div
                      key={indicator.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCrit
                          ? 'bg-rose-950/20 border-rose-500/30'
                          : isWarn
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : isCaution
                          ? 'bg-blue-950/20 border-blue-500/30'
                          : 'bg-[#101b33] border-[#1b2c52]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                              isCrit
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : isWarn
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : isCaution
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {indicator.severity}
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {indicator.title}
                          </h4>
                        </div>

                        {indicator.scoreImpact > 0 && (
                          <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            +{indicator.scoreImpact} Risk Pts
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                        {indicator.description}
                      </p>

                      {indicator.technicalDetails && (
                        <div className="p-2.5 rounded-lg bg-[#080d1a] border border-[#182643] text-[11px] text-slate-400 leading-relaxed font-mono">
                          <strong className="text-cyan-400">Security Analysis: </strong>
                          {indicator.technicalDetails}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: SAFE DECOMPOSITION */}
            {activeTab === 'decomposition' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Inspect the structural anatomy of the submitted address safely without visiting the destination:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#0a101f] border border-[#1b2640]">
                    <span className="text-slate-500 block mb-1 uppercase text-[10px]">Protocol / Scheme</span>
                    <div className="flex items-center gap-2">
                      {scanResult.protocol === 'https' ? (
                        <Lock className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Unlock className="w-4 h-4 text-rose-400" />
                      )}
                      <span className={scanResult.protocol === 'https' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {scanResult.protocol.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0a101f] border border-[#1b2640]">
                    <span className="text-slate-500 block mb-1 uppercase text-[10px]">Registered Root Domain (Apex)</span>
                    <span className="text-cyan-300 font-bold text-sm">
                      {scanResult.safePreview.apexDomain}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0a101f] border border-[#1b2640]">
                    <span className="text-slate-500 block mb-1 uppercase text-[10px]">Subdomain Stack</span>
                    <span className="text-slate-200">
                      {scanResult.safePreview.subdomains.length > 0 
                        ? scanResult.safePreview.subdomains.join('.') 
                        : '(No Subdomains)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0a101f] border border-[#1b2640]">
                    <span className="text-slate-500 block mb-1 uppercase text-[10px]">Top-Level Domain (TLD)</span>
                    <span className="text-slate-200">
                      .{scanResult.safePreview.tld}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0a101f] border border-[#1b2640] md:col-span-2">
                    <span className="text-slate-500 block mb-1 uppercase text-[10px]">Resource Path</span>
                    <span className="text-slate-300 break-all">
                      {scanResult.safePreview.path || '/'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RECOMMENDATIONS */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {scanResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-[#0e172a] border border-[#1c2c4d] text-xs text-slate-200">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-slate-300 space-y-1">
                  <h5 className="font-bold text-cyan-300">Defensive Cybersecurity Rule:</h5>
                  <p>
                    Never rely solely on visual appearance. Attackers can clone HTML and CSS templates within minutes. Always verify the registered apex domain in your browser URL bar.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
