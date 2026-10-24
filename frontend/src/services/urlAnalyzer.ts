import { ThreatIndicator, UrlScanResult } from '../types';

const KNOWN_BRANDS: { [key: string]: string[] } = {
  paypal: ['paypal.com'],
  apple: ['apple.com', 'icloud.com'],
  microsoft: ['microsoft.com', 'live.com', 'office.com', 'outlook.com', 'azure.com'],
  google: ['google.com', 'gmail.com', 'youtube.com'],
  netflix: ['netflix.com'],
  amazon: ['amazon.com', 'aws.amazon.com'],
  chase: ['chase.com'],
  wellsfargo: ['wellsfargo.com'],
  bankofamerica: ['bankofamerica.com'],
  binance: ['binance.com'],
  coinbase: ['coinbase.com'],
  docusign: ['docusign.com', 'docusign.net'],
  usps: ['usps.com'],
  fedex: ['fedex.com'],
  dhl: ['dhl.com'],
  facebook: ['facebook.com', 'fb.com', 'meta.com'],
  instagram: ['instagram.com'],
  steam: ['steampowered.com', 'steamcommunity.com'],
};

const SUSPICIOUS_TLDS = [
  'xyz', 'top', 'work', 'click', 'loan', 'fit', 'gq', 'cf', 'tk', 'ml', 'ga', 
  'buzz', 'rest', 'icu', 'vip', 'monster', 'country', 'stream', 'kim', 'science',
  'party', 'trade', 'accountant', 'date', 'faith', 'racing', 'cricket', 'win'
];

const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'buff.ly', 'ow.ly', 'cutt.ly', 
  'rb.gy', 'shorturl.at', 'goo.gl', 'bl.ink', 'trib.al'
];

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'account', 'banking', 'secure', 
  'security', 'update', 'wallet', 'confirm', 'confirmation', 'authenticate', 
  'auth', 'billing', 'recover', 'recovery', 'password', 'support', 'helpdesk',
  'validation', 'suspended', 'alert', 'session', 'unlock', 'portal'
];

// Calculate Shannon entropy of a string (higher = more random/generated)
function calculateEntropy(str: string): number {
  if (!str) return 0;
  const frequencies: { [key: string]: number } = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(2));
}

// Extract base apex domain handling common compound ccTLDs like .co.uk, .com.au
export function parseDomainParts(hostname: string) {
  const parts = hostname.toLowerCase().split('.');
  if (parts.length <= 1) {
    return { apexDomain: hostname, subdomains: [] as string[], tld: '' };
  }

  const multiPartTlds = ['co.uk', 'gov.uk', 'ac.uk', 'com.au', 'net.au', 'co.nz', 'co.jp', 'com.br', 'com.mx'];
  const lastTwo = parts.slice(-2).join('.');
  let apexDomain = '';
  let subdomains: string[] = [];
  let tld = '';

  if (multiPartTlds.includes(lastTwo) && parts.length >= 3) {
    tld = lastTwo;
    apexDomain = parts.slice(-3).join('.');
    subdomains = parts.slice(0, -3);
  } else {
    tld = parts[parts.length - 1];
    apexDomain = parts.slice(-2).join('.');
    subdomains = parts.slice(0, -2);
  }

  return { apexDomain, subdomains, tld };
}

export function analyzeUrlLocally(rawInput: string): UrlScanResult {
  const trimmed = rawInput.trim();
  let normalizedUrl = trimmed;
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    // If lacks protocol, default to https:// for inspection if not IP
    normalizedUrl = 'https://' + normalizedUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalizedUrl);
  } catch {
    // If still fails, try with http
    parsed = new URL('http://' + trimmed.replace(/^[a-zA-Z]+:\/\//, ''));
  }

  const hostname = parsed.hostname;
  const pathname = parsed.pathname;
  const protocol = parsed.protocol.replace(':', '');
  const search = parsed.search;
  const fullHref = parsed.href;

  const indicators: ThreatIndicator[] = [];
  let rawScore = 0;

  // Breakdown scores (0-100 sub-scores)
  let protocolScore = 0;
  let domainReputationScore = 0;
  let subdomainStructureScore = 0;
  let brandSpoofingScore = 0;
  let lexicalEntropyScore = 0;

  // 1. IP Address Check
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const isIpAddress = ipv4Regex.test(hostname);
  if (isIpAddress) {
    indicators.push({
      id: 'ind-ip-host',
      category: 'domain',
      severity: 'critical',
      title: 'Direct IP Address Hostname Detected',
      description: `URL uses an IP address (${hostname}) instead of a registered domain name.`,
      technicalDetails: 'Legitimate businesses virtually always use branded domain names with verified SSL certificates. Attackers use raw IP addresses to bypass domain reputation blocklists.',
      scoreImpact: 35,
    });
    rawScore += 35;
    domainReputationScore += 40;
  }

  // 2. Protocol Check (Plain HTTP vs HTTPS)
  if (protocol.toLowerCase() === 'http') {
    indicators.push({
      id: 'ind-unencrypted-http',
      category: 'protocol',
      severity: 'warning',
      title: 'Unencrypted Connection (Plain HTTP)',
      description: 'The connection uses unencrypted HTTP. Data sent over this link can be intercepted or manipulated via man-in-the-middle attacks.',
      technicalDetails: 'Modern web standards and legitimate services mandate HTTPS encryption for user security.',
      scoreImpact: 20,
    });
    rawScore += 20;
    protocolScore += 35;
  }

  // 3. Decompose domain
  const { apexDomain, subdomains, tld } = parseDomainParts(hostname);

  // 4. Suspicious TLD
  if (SUSPICIOUS_TLDS.includes(tld.toLowerCase())) {
    indicators.push({
      id: 'ind-suspicious-tld',
      category: 'tld',
      severity: 'warning',
      title: `High-Risk Top-Level Domain (.${tld})`,
      description: `The top-level domain '.${tld}' has an elevated statistical correlation with disposable phishing and spam campaigns.`,
      technicalDetails: 'Certain generic TLDs offer bulk disposable registrations with minimal identity verification, making them frequent favorites of automated phishing kits.',
      scoreImpact: 22,
    });
    rawScore += 22;
    domainReputationScore += 25;
  }

  // 5. URL Shortener Detection
  const isShortener = URL_SHORTENERS.includes(hostname.toLowerCase());
  if (isShortener) {
    indicators.push({
      id: 'ind-url-shortener',
      category: 'domain',
      severity: 'caution',
      title: 'URL Redirection Shortener Detected',
      description: `Service '${hostname}' is a URL shortener that conceals the ultimate landing destination.`,
      technicalDetails: 'Shorteners are commonly abused in social engineering campaigns to bypass automated email security filters and conceal deceptive domains.',
      scoreImpact: 15,
    });
    rawScore += 15;
    domainReputationScore += 15;
  }

  // 6. Subdomain Depth / Nesting Abuse
  if (subdomains.length >= 3) {
    indicators.push({
      id: 'ind-excessive-subdomains',
      category: 'subdomain',
      severity: 'critical',
      title: `Excessive Subdomain Stacking (${subdomains.length} Levels)`,
      description: `URL contains an unusually high number of subdomains: '${subdomains.join('.')}' pointing to base '${apexDomain}'.`,
      technicalDetails: 'Attackers create long chains of subdomains to push the real registered domain out of visible view on mobile screens or browsers.',
      scoreImpact: 25,
    });
    rawScore += 25;
    subdomainStructureScore += 35;
  } else if (subdomains.length === 2) {
    subdomainStructureScore += 10;
  }

  // 7. Brand Impersonation & Combosquatting
  let brandSpoofed = false;
  let detectedBrandName = '';
  for (const [brand, legitimateDomains] of Object.entries(KNOWN_BRANDS)) {
    const brandInHost = hostname.toLowerCase().includes(brand);
    const brandInPath = pathname.toLowerCase().includes(brand);

    if (brandInHost || brandInPath) {
      const isLegit = legitimateDomains.some(legit => 
        apexDomain.toLowerCase() === legit || hostname.toLowerCase().endsWith('.' + legit)
      );

      if (!isLegit) {
        brandSpoofed = true;
        detectedBrandName = brand.toUpperCase();
        indicators.push({
          id: `ind-brand-spoof-${brand}`,
          category: 'brand',
          severity: 'critical',
          title: `Brand Impersonation / Combosquatting (${detectedBrandName})`,
          description: `URL references the well-known brand '${detectedBrandName}', but the actual registered root domain is '${apexDomain}', NOT an official domain.`,
          technicalDetails: `Legitimate official domains for ${detectedBrandName} include: ${legitimateDomains.join(', ')}. This technique is known as combosquatting or deceptive subdomain targeting.`,
          scoreImpact: 35,
        });
        rawScore += 35;
        brandSpoofingScore += 45;
        break;
      }
    }
  }

  // 8. Hyphen Abuse in Domain Name
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    indicators.push({
      id: 'ind-excessive-hyphens',
      category: 'domain',
      severity: 'warning',
      title: `Excessive Hyphenation in Hostname (${hyphenCount} hyphens)`,
      description: `Domain contains ${hyphenCount} hyphens ('${hostname}'), a common tactic to craft synthetic lookalike domain strings.`,
      technicalDetails: 'Phishing domains frequently chain together trusted keywords separated by hyphens (e.g., "paypal-security-account-check").',
      scoreImpact: 18,
    });
    rawScore += 18;
    domainReputationScore += 20;
  } else if (hyphenCount === 2) {
    indicators.push({
      id: 'ind-multiple-hyphens',
      category: 'domain',
      severity: 'caution',
      title: 'Multiple Hyphens in Hostname',
      description: `Domain contains ${hyphenCount} hyphens.`,
      scoreImpact: 8,
    });
    rawScore += 8;
  }

  // 9. Punycode & IDN Homoglyph Detection
  const isPunycode = hostname.toLowerCase().includes('xn--');
  // Check for non-ASCII characters in raw input
  const nonAsciiInHost = /[^\u0000-\u007F]/.test(hostname);
  if (isPunycode || nonAsciiInHost) {
    indicators.push({
      id: 'ind-homoglyph-punycode',
      category: 'domain',
      severity: 'critical',
      title: 'IDN Homoglyph / Punycode Lookalike Tactic Detected',
      description: `Domain utilizes Internationalized Domain Name (Punycode 'xn--' or Cyrillic/Greek characters) to visually mimic ASCII letters.`,
      technicalDetails: 'Homoglyph spoofing exploits visually identical characters across Unicode alphabets (e.g. Cyrillic "о" vs Latin "o") to mislead human inspection.',
      scoreImpact: 35,
    });
    rawScore += 35;
    brandSpoofingScore += 30;
  }

  // 10. Deceptive At-Symbol (@) in URL Authority
  const hasCredentials = rawInput.includes('@');
  if (hasCredentials) {
    indicators.push({
      id: 'ind-at-symbol-trick',
      category: 'domain',
      severity: 'critical',
      title: 'Deceptive Credential / @-Symbol Redirection',
      description: 'The URL includes an "@" symbol in the authority component. Browsers discard everything before the "@" as userinfo and navigate to the domain after the "@".',
      technicalDetails: 'Example: "http://google.com@evil-site.com" leads directly to "evil-site.com", deceiving users who only look at the start of the URL.',
      scoreImpact: 40,
    });
    rawScore += 40;
    domainReputationScore += 35;
  }

  // 11. Non-standard Port
  const hasPort = Boolean(parsed.port && parsed.port !== '80' && parsed.port !== '443');
  if (hasPort) {
    indicators.push({
      id: 'ind-nonstandard-port',
      category: 'protocol',
      severity: 'caution',
      title: `Non-Standard Network Port (:${parsed.port})`,
      description: `URL specifies port :${parsed.port} rather than standard web ports 80 (HTTP) or 443 (HTTPS).`,
      technicalDetails: 'Phishing kits and rogue proxies often run on temporary non-standard ports to evade standard web monitoring.',
      scoreImpact: 14,
    });
    rawScore += 14;
    protocolScore += 20;
  }

  // 12. Suspicious Security Keywords in Host or Path
  const fullTextToInspect = `${hostname} ${pathname}`.toLowerCase();
  const matchedKeywords: string[] = [];
  for (const kw of SUSPICIOUS_KEYWORDS) {
    if (fullTextToInspect.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }

  if (matchedKeywords.length >= 2 && !brandSpoofed) {
    indicators.push({
      id: 'ind-suspicious-keywords',
      category: 'domain',
      severity: 'warning',
      title: `Suspicious Security Keywords Present (${matchedKeywords.slice(0, 3).join(', ')})`,
      description: `URL contains sensitive authentication keywords: ${matchedKeywords.join(', ')}.`,
      technicalDetails: 'Attackers frequently embed words like "verify", "secure", and "account" to fabricate a false sense of legitimacy.',
      scoreImpact: 15,
    });
    rawScore += 15;
    subdomainStructureScore += 15;
  }

  // 13. URL Length & Shannon Entropy
  const urlLength = fullHref.length;
  const hostEntropy = calculateEntropy(hostname);
  if (urlLength > 100) {
    indicators.push({
      id: 'ind-excessive-length',
      category: 'entropy',
      severity: 'caution',
      title: `Abnormally Long URL (${urlLength} characters)`,
      description: 'Long URLs are commonly generated by phishing frameworks to embed obfuscated payload strings or session tracking tokens.',
      scoreImpact: 10,
    });
    rawScore += 10;
    lexicalEntropyScore += 15;
  }

  if (hostEntropy > 3.8 && !isIpAddress) {
    indicators.push({
      id: 'ind-high-entropy',
      category: 'entropy',
      severity: 'caution',
      title: `High Hostname Lexical Randomness (Entropy: ${hostEntropy})`,
      description: `Domain has high character randomness (${hostEntropy}), characteristic of Domain Generation Algorithms (DGA) or automated phishing campaigns.`,
      scoreImpact: 12,
    });
    rawScore += 12;
    lexicalEntropyScore += 25;
  }

  // 14. Suspicious File Extensions in Path
  const dangerousExtRegex = /\.(exe|scr|bat|vbs|cmd|zip|iso|apk|hta|pif)($|\?)/i;
  if (dangerousExtRegex.test(pathname)) {
    indicators.push({
      id: 'ind-executable-download',
      category: 'attachment',
      severity: 'critical',
      title: 'Direct Executable or Archive File Extension in Path',
      description: `URL targets a downloadable payload or archive: ${pathname.split('/').pop()}`,
      technicalDetails: 'Malicious URLs frequently disguise trojan downloaders as invoices, updates, or receipts.',
      scoreImpact: 35,
    });
    rawScore += 35;
  }

  // If completely clean, add positive safe indicators
  if (indicators.length === 0) {
    indicators.push({
      id: 'ind-clean-domain',
      category: 'domain',
      severity: 'info',
      title: 'Standard Domain Structure & Secure Protocol',
      description: 'Standard domain structure, verified HTTPS protocol, no suspicious keywords or spoofed brands detected.',
      scoreImpact: 0,
    });
  }

  // Normalize final risk score to 0 - 100
  const normalizedScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Risk Level classification
  let riskLevel: 'low' | 'suspicious' | 'high' = 'low';
  let verdict: 'Low Risk' | 'Suspicious' | 'High Risk' = 'Low Risk';

  if (normalizedScore >= 70) {
    riskLevel = 'high';
    verdict = 'High Risk';
  } else if (normalizedScore >= 35) {
    riskLevel = 'suspicious';
    verdict = 'Suspicious';
  } else {
    riskLevel = 'low';
    verdict = 'Low Risk';
  }

  // Summary builder
  let summary = '';
  if (riskLevel === 'high') {
    summary = `CRITICAL WARNING: This URL exhibits strong phishing indicators with a heuristic risk score of ${normalizedScore}/100. Do not enter credentials, credit card details, or download files from this site.`;
  } else if (riskLevel === 'suspicious') {
    summary = `CAUTION ADVISED: This URL displays questionable characteristics (score: ${normalizedScore}/100). Verify the destination independently before interacting or providing any personal information.`;
  } else {
    summary = `LOW HEURISTIC RISK (Score: ${normalizedScore}/100): No prominent deceptive markers or known brand spoofing patterns were detected. Note that zero heuristic risk does not guarantee complete safety.`;
  }

  // Recommendations
  const recommendations: string[] = [];
  if (riskLevel === 'high') {
    recommendations.push('Do NOT open this link or click through security warnings.');
    recommendations.push('Never input login credentials, two-factor codes, or financial information.');
    recommendations.push('If this was received via email or message, report it to your security team or IT helpdesk.');
  } else if (riskLevel === 'suspicious') {
    recommendations.push('Inspect the apex domain carefully. Ensure it matches the legitimate company you intend to visit.');
    recommendations.push('Avoid following links from unverified text messages or unsolicited emails.');
    recommendations.push('Manually type the trusted official URL into your browser address bar instead.');
  } else {
    recommendations.push('Verify that the address bar displays a valid TLS padlock.');
    recommendations.push('Always confirm that the domain name precisely matches the intended service.');
  }

  return {
    id: 'scan-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    target: rawInput,
    normalizedUrl,
    hostname,
    protocol,
    riskScore: normalizedScore,
    riskLevel,
    verdict,
    confidence: indicators.length > 2 ? 94 : indicators.length > 0 ? 86 : 80,
    indicators,
    breakdown: {
      protocolScore: Math.min(100, protocolScore),
      domainReputationScore: Math.min(100, domainReputationScore),
      subdomainStructureScore: Math.min(100, subdomainStructureScore),
      brandSpoofingScore: Math.min(100, brandSpoofingScore),
      lexicalEntropyScore: Math.min(100, lexicalEntropyScore),
    },
    summary,
    recommendations,
    safePreview: {
      apexDomain,
      subdomains,
      tld,
      path: pathname,
      hasPort,
      hasCredentials,
      isIpAddress,
      isShortener,
      isPunycode,
    }
  };
}
