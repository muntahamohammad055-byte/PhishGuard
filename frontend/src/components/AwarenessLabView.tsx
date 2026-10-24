import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Lightbulb,
  ExternalLink,
  Mail,
  User,
  Calendar,
  Layers
} from 'lucide-react';
import { AWARENESS_SCENARIOS } from '../data/awarenessScenarios';
import { ScenarioQuestion } from '../types';
import { getAwarenessProgress, saveAwarenessProgress, AwarenessProgress } from '../services/storage';

export const AwarenessLabView: React.FC = () => {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [scenarioId: string]: string }>({});
  const [revealedFlags, setRevealedFlags] = useState<{ [scenarioId: string]: boolean }>({});
  const [progress, setProgress] = useState<AwarenessProgress>(getAwarenessProgress());

  const currentScenario: ScenarioQuestion = AWARENESS_SCENARIOS[activeScenarioIndex];
  const userSelectedOptionId = selectedAnswers[currentScenario.id];
  const hasAnsweredCurrent = Boolean(userSelectedOptionId);
  const isAnswerCorrect = currentScenario.options.find(o => o.id === userSelectedOptionId)?.isCorrect;
  const isRedFlagsVisible = revealedFlags[currentScenario.id];

  // Calculate overall awareness percentage
  const totalScenarios = AWARENESS_SCENARIOS.length;
  const completedCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(([scenId, optId]) => {
    const scen = AWARENESS_SCENARIOS.find(s => s.id === scenId);
    return scen?.options.find(o => o.id === optId)?.isCorrect;
  }).length;

  const awarenessScore = completedCount > 0 ? Math.round((correctCount / totalScenarios) * 100) : 0;

  // Badge tier calculation
  const getBadgeTier = (score: number) => {
    if (score >= 90) return { title: 'Cyber Sentinel', color: 'text-cyan-300 bg-cyan-500/20 border-cyan-500/40' };
    if (score >= 70) return { title: 'Threat Hunter', color: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40' };
    if (score >= 50) return { title: 'Vigilant Scout', color: 'text-amber-300 bg-amber-500/20 border-amber-500/40' };
    return { title: 'Cyber Cadet', color: 'text-slate-300 bg-slate-500/20 border-slate-500/40' };
  };

  const currentBadge = getBadgeTier(awarenessScore);

  const handleSelectOption = (optionId: string) => {
    if (hasAnsweredCurrent) return; // locked once answered

    const updatedAnswers = { ...selectedAnswers, [currentScenario.id]: optionId };
    setSelectedAnswers(updatedAnswers);

    const isCorrect = currentScenario.options.find(o => o.id === optionId)?.isCorrect;
    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    // Save to storage
    const newProgress: AwarenessProgress = {
      completedScenarioIds: Object.keys(updatedAnswers),
      userScoreSum: correctCount + (isCorrect ? 1 : 0),
      totalQuestionsAttempted: Object.keys(updatedAnswers).length,
      highestBadge: currentBadge.title,
    };
    setProgress(newProgress);
    saveAwarenessProgress(newProgress);
  };

  const handleToggleRedFlags = () => {
    setRevealedFlags(prev => ({
      ...prev,
      [currentScenario.id]: !prev[currentScenario.id]
    }));
  };

  const handleResetProgress = () => {
    setSelectedAnswers({});
    setRevealedFlags({});
    const emptyProgress = {
      completedScenarioIds: [],
      userScoreSum: 0,
      totalQuestionsAttempted: 0,
      highestBadge: 'Cyber Cadet',
    };
    setProgress(emptyProgress);
    saveAwarenessProgress(emptyProgress);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Awareness Score & Progress Header */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
                <GraduationCap className="w-5 h-5" />
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white">
                Interactive Phishing Awareness Training Lab
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Sharpen your instincts by diagnosing real-world social engineering scenarios, uncovering red flags, and building cognitive cyber defense reflexes.
            </p>
          </div>

          {/* User Score & Badge Widget */}
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-[#080d19] border border-[#1b2742]">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Awareness Score</span>
              <span className="text-2xl font-extrabold font-mono text-cyan-400">
                {awarenessScore}%
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800" />

            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Rank Tier</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${currentBadge.color}`}>
                <Award className="w-3 h-3" />
                {currentBadge.title}
              </span>
            </div>
          </div>
        </div>

        {/* Scenario Selectors (1 to 5) */}
        <div className="mt-6 pt-4 border-t border-[#17233c] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {AWARENESS_SCENARIOS.map((scen, idx) => {
              const isSelected = idx === activeScenarioIndex;
              const isDone = Boolean(selectedAnswers[scen.id]);
              const scenCorrect = scen.options.find(o => o.id === selectedAnswers[scen.id])?.isCorrect;

              return (
                <button
                  key={scen.id}
                  onClick={() => setActiveScenarioIndex(idx)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : isDone
                      ? scenCorrect
                        ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50'
                        : 'bg-rose-950/30 text-rose-300 border-rose-500/30 hover:border-rose-500/50'
                      : 'bg-[#121c32] text-slate-400 border-[#1f2e4e] hover:text-white'
                  }`}
                >
                  <span>Scenario {idx + 1}</span>
                  {isDone && (
                    scenCorrect ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    )
                  )}
                </button>
              );
            })}
          </div>

          {completedCount > 0 && (
            <button
              onClick={handleResetProgress}
              className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Scenario Workspace (2-Column: Left Email Viewer, Right Investigation & Quiz) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Realistic Fictional Email Mockup */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl overflow-hidden">
            {/* Email Header Bar */}
            <div className="p-4 bg-[#080d19] border-b border-[#1b2742] flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Simulated Email Client Preview</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Untrusted External Origin
              </span>
            </div>

            {/* Email Metadata Fields */}
            <div className="p-4 bg-[#0a101f] border-b border-[#1b2640] space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16">From:</span>
                <span className="text-white font-medium">{currentScenario.senderDisplay}</span>
                <span className="text-amber-400/90">&lt;{currentScenario.senderEmail}&gt;</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16">To:</span>
                <span className="text-slate-300">{currentScenario.recipient}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16">Date:</span>
                <span className="text-slate-400">{currentScenario.date}</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-[#162137]">
                <span className="text-slate-500 w-16">Subject:</span>
                <span className="text-slate-100 font-bold">{currentScenario.subject}</span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-6 bg-[#070b14] text-slate-200 text-sm leading-relaxed font-sans space-y-4 border-b border-[#1b2640]">
              <div
                dangerouslySetInnerHTML={{ __html: currentScenario.bodyHtml }}
                className="prose prose-invert max-w-none text-xs md:text-sm text-slate-300"
              />
            </div>

            {/* Toggle Red Flags Button */}
            <div className="p-4 bg-[#0a101f] flex items-center justify-between">
              <button
                onClick={handleToggleRedFlags}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#141e35] hover:bg-[#1b2949] text-cyan-300 border border-cyan-500/30 text-xs font-medium font-mono transition-colors"
              >
                {isRedFlagsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isRedFlagsVisible ? 'Hide Deception Clues' : `Inspect ${currentScenario.redFlags.length} Hidden Red Flags`}</span>
              </button>

              <span className="text-[11px] text-slate-400 font-mono">
                {currentScenario.category.toUpperCase()} Attack Vector
              </span>
            </div>

            {/* Revealed Red Flags Accordion */}
            {isRedFlagsVisible && (
              <div className="p-4 bg-[#0a1224] border-t border-cyan-500/30 space-y-2.5">
                <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  <span>Annotated Attack Red Flags:</span>
                </h4>

                <div className="space-y-2">
                  {currentScenario.redFlags.map((flag) => (
                    <div key={flag.id} className="p-3 rounded-xl bg-[#080d19] border border-[#1b2a47] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 font-mono">
                          🚩 &quot;{flag.targetText}&quot;
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {flag.description}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {flag.whyDangerous}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quiz Question & Psychological Analysis */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
                Awareness Challenge
              </span>
              <span className="text-xs font-mono text-slate-400">
                Question {activeScenarioIndex + 1} of {totalScenarios}
              </span>
            </div>

            <h3 className="text-sm md:text-base font-bold text-white leading-snug">
              {currentScenario.multipleChoiceQuestion}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentScenario.options.map((opt) => {
                const isSelected = userSelectedOptionId === opt.id;
                let optionStyle = 'bg-[#0f172a] border-[#1e2c4a] hover:border-slate-500 text-slate-200';

                if (hasAnsweredCurrent) {
                  if (opt.isCorrect) {
                    optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-sm';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  } else {
                    optionStyle = 'bg-[#0a0f1d] border-[#152035] text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={hasAnsweredCurrent}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 ${optionStyle}`}
                  >
                    <div className="pt-0.5">
                      {hasAnsweredCurrent ? (
                        opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isSelected ? (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                        )
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                    </div>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Immediate Feedback Box once answered */}
            {hasAnsweredCurrent && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  isAnswerCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold font-mono">
                  {isAnswerCorrect ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>EXCELLENT DETECTION (+20 Awareness Pts)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>LEARNING MOMENT</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {currentScenario.options.find(o => o.id === userSelectedOptionId)?.explanation}
                </p>
              </div>
            )}

            {/* Next Scenario Navigation */}
            {hasAnsweredCurrent && activeScenarioIndex < totalScenarios - 1 && (
              <button
                onClick={() => setActiveScenarioIndex(prev => prev + 1)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-glow-cyan"
              >
                <span>Proceed to Scenario {activeScenarioIndex + 2}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Social Engineering Psychology Explainer */}
          <div className="p-5 rounded-2xl bg-[#0c1426] border border-[#1b2640] text-xs space-y-3">
            <h4 className="font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Behind the Social Engineering Attack</span>
            </h4>

            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="p-2.5 rounded-lg bg-[#080d19] border border-[#192641]">
                <strong className="text-cyan-300 block mb-0.5">Psychological Trigger Lever:</strong>
                {currentScenario.psychologicalTrigger}
              </div>

              <div className="p-2.5 rounded-lg bg-[#080d19] border border-[#192641]">
                <strong className="text-emerald-300 block mb-0.5">Real-World Defense Protocol:</strong>
                {currentScenario.realWorldDefense}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
