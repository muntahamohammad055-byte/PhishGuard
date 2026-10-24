import React from 'react';
import { RiskLevel } from '../types';

interface RiskGaugeProps {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  verdict?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  riskLevel,
  verdict,
  size = 'md',
  showLabel = true,
}) => {
  const radius = size === 'lg' ? 68 : size === 'md' ? 52 : 38;
  const strokeWidth = size === 'lg' ? 10 : size === 'md' ? 8 : 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10b981'; // green / low risk
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let textColor = 'text-emerald-400';
  let badgeBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';

  if (riskLevel === 'high') {
    strokeColor = '#f43f5e';
    glowColor = 'rgba(244, 63, 94, 0.45)';
    textColor = 'text-rose-400';
    badgeBg = 'bg-rose-500/10 border-rose-500/30 text-rose-300';
  } else if (riskLevel === 'suspicious') {
    strokeColor = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.4)';
    textColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/10 border-amber-500/30 text-amber-300';
  }

  const dim = radius * 2 + 10;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        <svg
          height={dim}
          width={dim}
          className="transform -rotate-90"
          style={{ filter: `drop-shadow(0px 0px 8px ${glowColor})` }}
        >
          {/* Background circle */}
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={dim / 2}
            cy={dim / 2}
          />
          {/* Animated progress circle */}
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease',
              strokeLinecap: 'round',
            }}
            r={normalizedRadius}
            cx={dim / 2}
            cy={dim / 2}
          />
        </svg>

        {/* Center score */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span
            className={`font-mono font-bold leading-none ${
              size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-lg'
            } ${textColor}`}
          >
            {score}
          </span>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {showLabel && verdict && (
        <div className="mt-2 text-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeBg}`}>
            {verdict}
          </span>
        </div>
      )}
    </div>
  );
};
