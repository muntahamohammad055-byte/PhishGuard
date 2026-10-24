import { EmailScanResult, ThreatIndicator } from '../types';
import { analyzeUrlLocally } from './urlAnalyzer';

const URGENCY_PATTERNS = [
  /\b(immediate|immediately|urgent|urgently)\b/i,
  /\b(within \d+ hours?|within 24 hours|within 48 hours)\b/i,
  /\b(act now|act immediately|take action now)\b/i,
  /\b(final warning|final reminder|final notice)\b/i,
  /\b(account will be (closed|suspended|terminated|deleted|locked))\b/i,
  /\b(time[- ]sensitive|requires immediate attention)\b/i,
  /\b(expires (today|soon|in \d+ hours?))\b/i,
  /\b(do not delay|without delay)\b/i,
];

const THREAT_PATTERNS = [
  /\b(legal action|law enforcement|police|fbi|arrest)\b/i,
  /\b(unauthorized (access|transaction|activity|charge))\b/i,
  /\b(security (breach|incident|compromise|alert))\b/i,
  /\b(fraudulent activity|identity theft)\b/i,
  /\b(penalty|financial loss|held liable)\b/i,
  /\b(restricted access|frozen account|blocked account)\b/i,
];

const CREDENTIAL_PATTERNS = [
  /\b(confirm|verify|update|validate) (your )?(password|credentials|login|passcode|pin)\b/i,
  /\b(enter|type|input) (your )?(password|ssn|social security)\b/i,
  /\b(social security number|ssn|birth date|dob)\b/i,
  /\b(update (your )?(billing|credit card|payment method|banking details))\b/i,
  /\b(re-enter (your )?credentials)\b/i,
  /\b(two-factor|2fa|otp|one-time code|security questions)\b/i,
  /\b(verify your identity|identity verification required)\b/i,
];

const FINANCIAL_PATTERNS = [
  /\b(wire transfer|bank wire|swift transfer)\b/i,
  /\b(gift card|apple gift card|google play card|steam card|vanilla card)\b/i,
  /\b(crypto|cryptocurrency|bitcoin|btc|eth|tether|usdt|wallet address)\b/i,
  /\b(cashier'?s check|money order)\b/i,
  /\b(overdue invoice|invoice attached|past due invoice|remit payment)\b/i,
  /\b(direct deposit|payroll update|bank routing number)\b/i,
  /\b(refund pending|claim your refund|tax refund)\b/i,
];

const IMPERSONATION_PATTERNS = [
  /\b(dear (customer|user|client|valued member|account holder|sir\/madam))\b/i,
  /\b(it (support|helpdesk|department|administrator))\b/i,
  /\b(system (administrator|admin|notification))\b/i,
  /\b(security (operations|team|desk|department))\b/i,
  /\b(human resources|hr department|payroll department)\b/i,
  /\b(executive office|chief executive|ceo|cfo)\b/i,
];

const ATTACHMENT_PATTERNS = [
  /\b(see attached|open the attached|download the attachment|find attached invoice)\b/i,
  /\.(exe|scr|bat|cmd|vbs|iso|zip|hta|docm|xlsm)\b/i,
];

export function analyzeEmailLocally(subject: string, body: string, sender: string = ''): EmailScanResult {
  const fullText = `${subject}\n${body}\n${sender}`;
  const indicators: ThreatIndicator[] = [];
  let rawScore = 0;

  const urgencyTriggers: string[] = [];
  const threatTriggers: string[] = [];
  const credentialTriggers: string[] = [];
  const financialTriggers: string[] = [];
  const impersonationTriggers: string[] = [];

  // 1. Urgency detection
  for (const pattern of URGENCY_PATTERNS) {
    const match = fullText.match(pattern);
    if (match && !urgencyTriggers.includes(match[0].toLowerCase())) {
      urgencyTriggers.push(match[0]);
    }
  }

  if (urgencyTriggers.length > 0) {
    const scoreVal = Math.min(30, urgencyTriggers.length * 12);
    indicators.push({
      id: 'email-ind-urgency',
      category: 'urgency',
      severity: urgencyTriggers.length >= 2 ? 'critical' : 'warning',
      title: `High-Pressure Urgency Tactics (${urgencyTriggers.length} phrases)`,
      description: `Email uses psychological urgency triggers to prompt rapid, unreflective compliance.`,
      snippet: urgencyTriggers.slice(0, 3).map(u => `"${u}"`).join(', '),
      technicalDetails: 'Attackers create artificial time pressure ("act within 24 hours") so victims bypass standard verification protocols out of panic.',
      scoreImpact: scoreVal,
    });
    rawScore += scoreVal;
  }

  // 2. Coercive Threats & Fear tactics
  for (const pattern of THREAT_PATTERNS) {
    const match = fullText.match(pattern);
    if (match && !threatTriggers.includes(match[0].toLowerCase())) {
      threatTriggers.push(match[0]);
    }
  }

  if (threatTriggers.length > 0) {
    const scoreVal = Math.min(35, threatTriggers.length * 14);
    indicators.push({
      id: 'email-ind-threats',
      category: 'urgency',
      severity: 'critical',
      title: `Coercive Threat & Fear Appeals (${threatTriggers.length} patterns)`,
      description: `Email cites negative consequences or security panic to provoke emotional reactions.`,
      snippet: threatTriggers.slice(0, 3).map(t => `"${t}"`).join(', '),
      technicalDetails: 'Fear of legal action, account termination, or unauthorized transactions is a classic social engineering manipulation lever.',
      scoreImpact: scoreVal,
    });
    rawScore += scoreVal;
  }

  // 3. Credential Harvesting & Sensitive Info Requests
  for (const pattern of CREDENTIAL_PATTERNS) {
    const match = fullText.match(pattern);
    if (match && !credentialTriggers.includes(match[0].toLowerCase())) {
      credentialTriggers.push(match[0]);
    }
  }

  if (credentialTriggers.length > 0) {
    const scoreVal = Math.min(40, credentialTriggers.length * 18);
    indicators.push({
      id: 'email-ind-credentials',
      category: 'credential',
      severity: 'critical',
      title: `Direct Credential Harvesting Request (${credentialTriggers.length} instances)`,
      description: `Message explicitly prompts the user to submit passwords, SSN, 2FA codes, or billing details.`,
      snippet: credentialTriggers.slice(0, 3).map(c => `"${c}"`).join(', '),
      technicalDetails: 'Legitimate service providers almost never request full passwords, pins, or two-factor codes via unprompted email communications.',
      scoreImpact: scoreVal,
    });
    rawScore += scoreVal;
  }

  // 4. Financial Fraud & Wire / Gift Card Requests
  for (const pattern of FINANCIAL_PATTERNS) {
    const match = fullText.match(pattern);
    if (match && !financialTriggers.includes(match[0].toLowerCase())) {
      financialTriggers.push(match[0]);
    }
  }

  if (financialTriggers.length > 0) {
    const scoreVal = Math.min(30, financialTriggers.length * 12);
    indicators.push({
      id: 'email-ind-financial',
      category: 'financial',
      severity: 'warning',
      title: `Financial Transaction or Payment Solicitation (${financialTriggers.length} keywords)`,
      description: `Message mentions wire transfers, gift cards, cryptocurrency, or unexpected invoice remittals.`,
      snippet: financialTriggers.slice(0, 3).map(f => `"${f}"`).join(', '),
      technicalDetails: 'Business Email Compromise (BEC) and gift card scams routinely masquerade as executives or suppliers demanding non-standard payment methods.',
      scoreImpact: scoreVal,
    });
    rawScore += scoreVal;
  }

  // 5. Impersonation / Generic Greetings
  for (const pattern of IMPERSONATION_PATTERNS) {
    const match = fullText.match(pattern);
    if (match && !impersonationTriggers.includes(match[0].toLowerCase())) {
      impersonationTriggers.push(match[0]);
    }
  }

  if (impersonationTriggers.length > 0) {
    const scoreVal = Math.min(20, impersonationTriggers.length * 8);
    indicators.push({
      id: 'email-ind-impersonation',
      category: 'impersonation',
      severity: 'caution',
      title: `Generic Greeting or Organizational Impersonation`,
      description: `Message relies on generic greetings (e.g. "Dear Customer") or vague administrative authority rather than personalized account metadata.`,
      snippet: impersonationTriggers.slice(0, 3).map(i => `"${i}"`).join(', '),
      technicalDetails: 'Mass phishing campaigns often cannot populate personalized recipient names, relying on boilerplate greetings.',
      scoreImpact: scoreVal,
    });
    rawScore += scoreVal;
  }

  // 6. Dangerous Attachment Mentions
  const attachmentMatches: string[] = [];
  for (const pattern of ATTACHMENT_PATTERNS) {
    const match = fullText.match(pattern);
    if (match) {
      attachmentMatches.push(match[0]);
    }
  }

  if (attachmentMatches.length > 0) {
    indicators.push({
      id: 'email-ind-attachment',
      category: 'attachment',
      severity: 'warning',
      title: 'Suspicious Attachment Reference',
      description: 'The email urges opening or downloading an external file or attachment.',
      snippet: attachmentMatches.join(', '),
      technicalDetails: 'Phishing emails often package malicious HTML forms, malicious macros, or ISO archives as faux invoices.',
      scoreImpact: 18,
    });
    rawScore += 18;
  }

  // 7. Extract URLs and analyze them
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`]+)/gi;
  const detectedUrlsRaw = fullText.match(urlRegex) || [];
  const uniqueUrls = Array.from(new Set(detectedUrlsRaw));
  
  const detectedLinks: {
    originalText: string;
    extractedUrl: string;
    riskScore: number;
    isMismatched: boolean;
  }[] = [];

  let highestUrlRisk = 0;

  for (const urlStr of uniqueUrls) {
    const urlAnalysis = analyzeUrlLocally(urlStr);
    if (urlAnalysis.riskScore > highestUrlRisk) {
      highestUrlRisk = urlAnalysis.riskScore;
    }
    detectedLinks.push({
      originalText: urlStr,
      extractedUrl: urlStr,
      riskScore: urlAnalysis.riskScore,
      isMismatched: false,
    });
  }

  // Check for HTML anchor tag mismatch if body contains HTML tags
  const anchorTagRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  let matchAnchor: RegExpExecArray | null;
  while ((matchAnchor = anchorTagRegex.exec(body)) !== null) {
    const href = matchAnchor[1];
    const text = matchAnchor[2].trim();
    if (/https?:\/\//i.test(text) && !text.includes(new URL(href, 'http://localhost').hostname)) {
      // Clear anchor mismatch! Displayed text is a domain, but actual href points elsewhere
      indicators.push({
        id: 'email-ind-anchor-mismatch',
        category: 'link',
        severity: 'critical',
        title: 'Mismatched Hyperlink Anchor Deception',
        description: `Link displays text "${text}" but actually navigates to a completely different destination: "${href}".`,
        technicalDetails: 'This classic visual deception tricks users into believing they are clicking a trusted domain while directing them to an attacker-controlled site.',
        scoreImpact: 40,
      });
      rawScore += 40;
    }
  }

  if (detectedLinks.length > 0 && highestUrlRisk >= 40) {
    rawScore += Math.round(highestUrlRisk * 0.4);
    indicators.push({
      id: 'email-ind-embedded-url-risk',
      category: 'link',
      severity: highestUrlRisk >= 70 ? 'critical' : 'warning',
      title: `Embedded URL Analyzed with High Suspicion (${highestUrlRisk}/100)`,
      description: `One or more URLs found inside the email body scored high risk in our heuristic URL inspection engine.`,
      technicalDetails: 'Phishing emails are primary delivery vehicles for credential harvesting landing pages.',
      scoreImpact: Math.round(highestUrlRisk * 0.4),
    });
  }

  // If clean, add safe indicator
  if (indicators.length === 0) {
    indicators.push({
      id: 'email-ind-clean',
      category: 'domain',
      severity: 'info',
      title: 'Standard Communication Structure',
      description: 'No aggressive urgency triggers, threat language, or overt credential solicitations detected.',
      scoreImpact: 0,
    });
  }

  // Final score normalization (0 - 100)
  const normalizedScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let riskLevel: 'low' | 'suspicious' | 'high' = 'low';
  let verdict: 'Low Risk' | 'Suspicious' | 'High Risk' = 'Low Risk';

  if (normalizedScore >= 65) {
    riskLevel = 'high';
    verdict = 'High Risk';
  } else if (normalizedScore >= 35) {
    riskLevel = 'suspicious';
    verdict = 'Suspicious';
  } else {
    riskLevel = 'low';
    verdict = 'Low Risk';
  }

  let summary = '';
  if (riskLevel === 'high') {
    summary = `HIGH-CONFIDENCE PHISHING ATTACK DETECTED (Risk: ${normalizedScore}/100). This message contains multiple high-severity social engineering markers, including urgency pressure and credential/payment solicitation.`;
  } else if (riskLevel === 'suspicious') {
    summary = `SUSPICIOUS EMAIL SIGNALS (Risk: ${normalizedScore}/100). The message exhibits questionable characteristics such as urgency or generic impersonation patterns. Exercise caution before clicking links or complying with requests.`;
  } else {
    summary = `LOW HEURISTIC RISK (Risk: ${normalizedScore}/100). No active threat patterns or credential solicitations were identified. Note that sophisticated targeted spear-phishing may omit generic keywords.`;
  }

  const recommendations: string[] = [];
  if (riskLevel === 'high') {
    recommendations.push('Do NOT click on any links or download attached documents.');
    recommendations.push('Do NOT reply to the sender or provide passwords, SSN, or billing information.');
    recommendations.push('Report this message immediately using your corporate "Report Phishing" button or security abuse mailbox.');
    recommendations.push('If you already entered credentials, immediately change your password on the official website and notify your IT administrator.');
  } else if (riskLevel === 'suspicious') {
    recommendations.push('Verify the sender identity through a secondary, out-of-band channel (e.g. phone call or internal chat).');
    recommendations.push('Inspect any embedded URLs without clicking on them.');
    recommendations.push('Look for subtle sender address discrepancies (e.g. support@paypa1-help.com vs support@paypal.com).');
  } else {
    recommendations.push('Always maintain vigilance: even safe-looking messages could be compromised vendor accounts.');
    recommendations.push('Verify large money transfers or account changes directly with known contacts.');
  }

  return {
    id: 'email-scan-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    subject,
    sender,
    bodyPreview: body.slice(0, 240) + (body.length > 240 ? '...' : ''),
    riskScore: normalizedScore,
    riskLevel,
    verdict,
    indicators,
    detectedLinks,
    urgencyTriggers,
    credentialTriggers,
    financialTriggers,
    impersonationTriggers,
    threatTriggers,
    summary,
    recommendations,
    analysisEngine: 'heuristic_rules',
  };
}
