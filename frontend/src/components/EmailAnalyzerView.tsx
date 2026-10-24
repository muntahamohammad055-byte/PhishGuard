import React, { useState } from 'react';
import {
  Mail,
  Search,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Info,
  Clock,
  KeyRound,
  DollarSign,
  UserX,
  FileWarning,
  Copy,
  Check,
  CheckCircle,
  HelpCircle,
  AlertOctagon
} from 'lucide-react';
import { EmailScanResult } from '../types';
import { SAMPLE_EMAILS, DemoEmailSample } from '../data/sampleData';
import { RiskGauge } from './RiskGauge';
import { scanEmail } from '../services/api';

interface EmailAnalyzerViewProps {
  onScanComplete: (result: EmailScanResult) => void;
}

export const EmailAnalyzerView: React.FC<EmailAnalyzerViewProps> = ({
  onScanComplete,
}) => {
  const [senderInput, setSenderInput] = useState<string>('');
  const [subjectInput, setSubjectInput] = useState<string>('');
  const [bodyInput, setBodyInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [result, setResult] = useState<EmailScanResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAnalyze = async (sampleData?: DemoEmailSample) => {
    const sdr = sampleData ? sampleData.sender : senderInput;
    const subj = sampleData ? sampleData.subject : subjectInput;
    const body = sampleData ? sampleData.body : bodyInput;

    if (!subj.trim() && !body.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    setAnalysisStep('Scanning for high-pressure urgency & artificial deadlines...');
    await new Promise((r) => setTimeout(r, 250));

    setAnalysisStep('Evaluating coercive threats & emotional fear appeals...');
    await new Promise((r) => setTimeout(r, 250));

    setAnalysisStep('Inspecting credential harvesting patterns & sensitive data requests...');
    await new Promise((r) => setTimeout(r, 250));

    setAnalysisStep('Extracting embedded URLs & checking for anchor text mismatches...');
    await new Promise((r) => setTimeout(r, 200));

    try {
      const { result: scanRes } = await scanEmail(subj, body, sdr);
      setResult(scanRes);
      onScanComplete(scanRes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleSelectSample = (sample: DemoEmailSample) => {
    setSenderInput(sample.sender);
    setSubjectInput(sample.subject);
    setBodyInput(sample.body);
    handleAnalyze(sample);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const text = `PhishGuard AI Email Inspection Report:
Subject: ${result.subject}
Verdict: ${result.verdict} (${result.riskScore}/100)
Indicators Triggered: ${result.indicators.length}
Summary: ${result.summary}
Recommendations:
${result.recommendations.map(r => `• ${r}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Form Card */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-violet-400" />
            <span>Phishing Email Inspection Console</span>
          </label>
          <span className="text-[11px] text-cyan-400 font-mono">
            100% Rule-Based Heuristic Security Model
          </span>
        </div>

        <div className="space-y-3">
          {/* Sender Input (Optional) */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Sender Address / Header (Optional):
            </label>
            <input
              type="text"
              value={senderInput}
              onChange={(e) => setSenderInput(e.target.value)}
              placeholder="e.g. support@paypa1-security-desk.xyz"
              className="w-full px-3.5 py-2.5 bg-[#080d19] border border-[#1f2b47] rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Email Subject Line:
            </label>
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="e.g. Urgent: Unauthorized wire transfer flagged on your account"
              className="w-full px-3.5 py-2.5 bg-[#080d19] border border-[#1f2b47] rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Email Body */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Email Message Body:
            </label>
            <textarea
              rows={6}
              value={bodyInput}
              onChange={(e) => setBodyInput(e.target.value)}
              placeholder="Paste raw email body text or HTML content here..."
              className="w-full p-3.5 bg-[#080d19] border border-[#1f2b47] rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 leading-relaxed"
            />
          </div>

          {/* Actions row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex gap-2">
              <button
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing || (!subjectInput.trim() && !bodyInput.trim())}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-blue-600 hover:from-violet-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-glow-violet transition-all flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Email</span>
                  </>
                )}
              </button>

              {(subjectInput || bodyInput || senderInput) && (
                <button
                  onClick={() => {
                    setSenderInput('');
                    setSubjectInput('');
                    setBodyInput('');
                    setResult(null);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#141d33] hover:bg-[#1b2744] text-slate-400 hover:text-white border border-[#22304f] text-xs font-mono transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              Never transmits email text to third-party APIs
            </span>
          </div>
        </div>

        {/* Live scanning progress banner */}
        {isAnalyzing && (
          <div className="mt-4 p-3 rounded-xl bg-violet-950/30 border border-violet-500/30 flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin shrink-0" />
            <span className="text-xs font-mono text-violet-300 animate-pulse">
              {analysisStep}
            </span>
          </div>
        )}

        {/* Demo Samples Presets */}
        <div className="mt-5 pt-3 border-t border-[#17233c]">
          <div className="text-[11px] text-slate-400 font-mono mb-2">
            Preset Demonstrations (Click to load):
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_EMAILS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all flex items-center gap-1.5 ${
                  sample.category === 'Phishing'
                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    sample.category === 'Phishing' ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
                />
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Main Verdict Card */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              result.riskLevel === 'high'
                ? 'bg-[#180f1d] border-rose-500/40 glow-border-red'
                : result.riskLevel === 'suspicious'
                ? 'bg-[#1a1712] border-amber-500/40'
                : 'bg-[#0b191c] border-emerald-500/40 glow-border-cyan'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <RiskGauge
                  score={result.riskScore}
                  riskLevel={result.riskLevel}
                  verdict={result.verdict}
                  size="lg"
                  showLabel={false}
                />

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        result.riskLevel === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : result.riskLevel === 'suspicious'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {result.verdict}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Transparent Rule-Based Inspection
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-white">
                    Subject: &quot;{result.subject || '(No Subject Line)'}&quot;
                  </h3>

                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyReport}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1a253e] hover:bg-[#223253] text-slate-200 border border-[#2d3f66] text-xs font-medium transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-400" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>

            {/* Mandatory Transparency Alert */}
            <div className="mt-5 pt-4 border-t border-slate-700/40 flex items-start space-x-2 text-[11px] text-slate-400 font-mono">
              <Info className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero External AI Transparency Statement:</strong> This analyzer runs purely on deterministic regular expression rules and lexical heuristics. It does NOT invoke OpenAI, Anthropic, or external neural networks, preserving 100% of your email confidentiality and privacy.
              </span>
            </div>
          </div>

          {/* Social Engineering Triggers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0c1426] border border-[#1b2640]">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold mb-1">
                <Clock className="w-4 h-4" />
                <span>Urgency Traps</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {result.urgencyTriggers.length}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Artificial deadlines</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0c1426] border border-[#1b2640]">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold mb-1">
                <AlertOctagon className="w-4 h-4" />
                <span>Threat Appeals</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {result.threatTriggers.length}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Coercion / Legal fear</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0c1426] border border-[#1b2640]">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
                <KeyRound className="w-4 h-4" />
                <span>Credential Solicitations</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {result.credentialTriggers.length}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Password/SSN harvesting</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0c1426] border border-[#1b2640]">
              <div className="flex items-center space-x-2 text-violet-400 text-xs font-bold mb-1">
                <DollarSign className="w-4 h-4" />
                <span>Financial / Wire</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {result.financialTriggers.length}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Payment/Card hooks</p>
            </div>
          </div>

          {/* Trigger Details Breakdown */}
          <div className="p-5 rounded-2xl bg-[#0c1426] border border-[#1b2640] space-y-4">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Detected Threat Indicators & Forensic Explanations ({result.indicators.length})
            </h4>

            <div className="space-y-3">
              {result.indicators.map((ind) => (
                <div
                  key={ind.id}
                  className="p-4 rounded-xl bg-[#0e172a] border border-[#1d2d4c] space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          ind.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {ind.severity}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {ind.title}
                      </span>
                    </div>

                    {ind.scoreImpact > 0 && (
                      <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        +{ind.scoreImpact} Risk Pts
                      </span>
                    )}
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    {ind.description}
                  </p>

                  {ind.snippet && (
                    <div className="p-2 rounded bg-[#080d1a] border border-[#182643] text-amber-300 font-mono text-[11px]">
                      Trigger quote: {ind.snippet}
                    </div>
                  )}

                  {ind.technicalDetails && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      <span className="text-cyan-400">Social Engineering Analysis: </span>
                      {ind.technicalDetails}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="p-5 rounded-2xl bg-[#0c1426] border border-[#1b2640] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Recommended Security Actions
            </h4>
            <div className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-[#0e172a] border border-[#1c2c4d] text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
