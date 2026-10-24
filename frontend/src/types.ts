export type RiskLevel = 'low' | 'suspicious' | 'high';

export interface ThreatIndicator {
  id: string;
  category: 'protocol' | 'domain' | 'subdomain' | 'tld' | 'entropy' | 'brand' | 'urgency' | 'credential' | 'financial' | 'impersonation' | 'link' | 'attachment';
  severity: 'critical' | 'warning' | 'caution' | 'info';
  title: string;
  description: string;
  technicalDetails?: string;
  snippet?: string;
  scoreImpact: number;
}

export interface UrlScanResult {
  id: string;
  timestamp: string;
  target: string;
  normalizedUrl: string;
  hostname: string;
  protocol: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  verdict: 'Low Risk' | 'Suspicious' | 'High Risk';
  confidence: number; // 0 - 100%
  indicators: ThreatIndicator[];
  breakdown: {
    protocolScore: number;
    domainReputationScore: number;
    subdomainStructureScore: number;
    brandSpoofingScore: number;
    lexicalEntropyScore: number;
  };
  summary: string;
  recommendations: string[];
  safePreview: {
    apexDomain: string;
    subdomains: string[];
    tld: string;
    path: string;
    hasPort: boolean;
    hasCredentials: boolean;
    isIpAddress: boolean;
    isShortener: boolean;
    isPunycode: boolean;
  };
}

export interface EmailScanResult {
  id: string;
  timestamp: string;
  subject: string;
  sender?: string;
  bodyPreview: string;
  riskScore: number;
  riskLevel: RiskLevel;
  verdict: 'Low Risk' | 'Suspicious' | 'High Risk';
  indicators: ThreatIndicator[];
  detectedLinks: {
    originalText: string;
    extractedUrl: string;
    riskScore: number;
    isMismatched: boolean;
  }[];
  urgencyTriggers: string[];
  credentialTriggers: string[];
  financialTriggers: string[];
  impersonationTriggers: string[];
  threatTriggers: string[];
  summary: string;
  recommendations: string[];
  analysisEngine: 'heuristic_rules' | 'fastapi_local';
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  type: 'url' | 'email';
  target: string; // URL or Subject
  riskScore: number;
  riskLevel: RiskLevel;
  verdict: 'Low Risk' | 'Suspicious' | 'High Risk';
  primaryThreat: string;
  indicatorCount: number;
  urlResult?: UrlScanResult;
  emailResult?: EmailScanResult;
}

export interface ScenarioQuestion {
  id: string;
  title: string;
  category: 'delivery' | 'banking' | 'job' | 'it_reset' | 'executive';
  senderDisplay: string;
  senderEmail: string;
  recipient: string;
  date: string;
  subject: string;
  bodyHtml: string;
  redFlags: {
    id: string;
    targetText: string;
    description: string;
    whyDangerous: string;
  }[];
  multipleChoiceQuestion: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  attackVectorExplained: string;
  psychologicalTrigger: string;
  realWorldDefense: string;
}

export interface UrlComparisonResult {
  urlA: {
    raw: string;
    protocol: string;
    hostname: string;
    apexDomain: string;
    subdomains: string[];
    tld: string;
    path: string;
    riskScore: number;
    riskLevel: RiskLevel;
  };
  urlB: {
    raw: string;
    protocol: string;
    hostname: string;
    apexDomain: string;
    subdomains: string[];
    tld: string;
    path: string;
    riskScore: number;
    riskLevel: RiskLevel;
  };
  differences: {
    component: string;
    legitimateVal: string;
    targetVal: string;
    isMismatch: boolean;
    severity: 'critical' | 'warning' | 'info';
    analysis: string;
  }[];
  deceptionTechniquesDetected: {
    technique: string;
    detected: boolean;
    explanation: string;
  }[];
  conclusion: string;
}
