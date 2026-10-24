import { UrlComparisonResult } from '../types';
import { analyzeUrlLocally, parseDomainParts } from './urlAnalyzer';

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function compareUrls(urlLegitInput: string, urlTargetInput: string): UrlComparisonResult {
  const analysisA = analyzeUrlLocally(urlLegitInput);
  const analysisB = analyzeUrlLocally(urlTargetInput);

  let parsedA: URL;
  let parsedB: URL;
  try {
    parsedA = new URL(analysisA.normalizedUrl);
  } catch {
    parsedA = new URL('http://unknown-domain.com');
  }
  try {
    parsedB = new URL(analysisB.normalizedUrl);
  } catch {
    parsedB = new URL('http://unknown-domain.com');
  }

  const domainPartsA = parseDomainParts(parsedA.hostname);
  const domainPartsB = parseDomainParts(parsedB.hostname);

  const differences: UrlComparisonResult['differences'] = [];
  const deceptionTechniques: UrlComparisonResult['deceptionTechniquesDetected'] = [];

  // 1. Protocol Comparison
  const protoMatch = parsedA.protocol === parsedB.protocol;
  differences.push({
    component: 'Protocol / Encryption',
    legitimateVal: parsedA.protocol.replace(':', '').toUpperCase(),
    targetVal: parsedB.protocol.replace(':', '').toUpperCase(),
    isMismatch: !protoMatch,
    severity: parsedB.protocol === 'http:' ? 'critical' : 'info',
    analysis: !protoMatch 
      ? `Protocol mismatch! The target URL uses unencrypted ${parsedB.protocol.toUpperCase()}, leaving traffic vulnerable.`
      : `Both use ${parsedA.protocol.toUpperCase()}. Note: Phishing sites frequently use HTTPS certificates today as well.`,
  });

  // 2. Registered Apex Domain Comparison
  const apexMatch = domainPartsA.apexDomain.toLowerCase() === domainPartsB.apexDomain.toLowerCase();
  differences.push({
    component: 'Registered Root Domain (Apex)',
    legitimateVal: domainPartsA.apexDomain,
    targetVal: domainPartsB.apexDomain,
    isMismatch: !apexMatch,
    severity: !apexMatch ? 'critical' : 'info',
    analysis: !apexMatch 
      ? `CRITICAL ROOT MISMATCH: The true destination host is owned by '${domainPartsB.apexDomain}', completely different from '${domainPartsA.apexDomain}'.`
      : 'Root domain matches.',
  });

  // 3. Subdomain Structure Comparison
  const subdomainsAStr = domainPartsA.subdomains.join('.') || '(none)';
  const subdomainsBStr = domainPartsB.subdomains.join('.') || '(none)';
  const subMatch = subdomainsAStr === subdomainsBStr;
  
  // Check if legitimate apex domain is embedded in target's subdomains! (Subdomain Deception)
  const isSubdomainDeception = domainPartsB.subdomains.some(sub => 
    sub.includes(domainPartsA.apexDomain.split('.')[0])
  );

  differences.push({
    component: 'Subdomains',
    legitimateVal: subdomainsAStr,
    targetVal: subdomainsBStr,
    isMismatch: !subMatch,
    severity: isSubdomainDeception ? 'critical' : (!subMatch ? 'warning' : 'info'),
    analysis: isSubdomainDeception
      ? `SUBDOMAIN DECEPTION DETECTED: The target crafts a subdomain named after '${domainPartsA.apexDomain}', but the actual recipient server is '${domainPartsB.apexDomain}'!`
      : (subMatch ? 'Subdomains match.' : 'Different subdomain structure.'),
  });

  // 4. Top-Level Domain (TLD)
  const tldMatch = domainPartsA.tld.toLowerCase() === domainPartsB.tld.toLowerCase();
  differences.push({
    component: 'Top-Level Domain (TLD)',
    legitimateVal: '.' + domainPartsA.tld,
    targetVal: '.' + domainPartsB.tld,
    isMismatch: !tldMatch,
    severity: !tldMatch ? 'warning' : 'info',
    analysis: !tldMatch
      ? `TLD Swap: Legitimate uses '.${domainPartsA.tld}', but target uses '.${domainPartsB.tld}'. Attackers often register existing names on cheap or unregulated TLDs.`
      : 'TLDs match.',
  });

  // 5. Typosquatting / Edit Distance Detection
  const hostDistance = levenshteinDistance(domainPartsA.apexDomain, domainPartsB.apexDomain);
  const isTyposquat = hostDistance > 0 && hostDistance <= 2;
  
  // 6. Combosquatting detection (e.g. brand + "-login")
  const brandWord = domainPartsA.apexDomain.split('.')[0];
  const isCombosquat = domainPartsB.apexDomain.includes(brandWord) && domainPartsB.apexDomain !== domainPartsA.apexDomain;

  // 7. IDN Homoglyph detection
  const isHomoglyph = domainPartsB.apexDomain.includes('xn--') || /[^\u0000-\u007F]/.test(parsedB.hostname);

  deceptionTechniques.push({
    technique: 'Subdomain Camouflage',
    detected: isSubdomainDeception,
    explanation: isSubdomainDeception 
      ? `The target places the brand '${brandWord}' inside the subdomain (${subdomainsBStr}) while the apex domain is actually '${domainPartsB.apexDomain}'.`
      : 'No subdomain camouflage detected.',
  });

  deceptionTechniques.push({
    technique: 'Combosquatting (Keyword Appending)',
    detected: isCombosquat,
    explanation: isCombosquat
      ? `The target incorporates the brand '${brandWord}' together with hyphenated terms (e.g. '${domainPartsB.apexDomain}') to simulate official affiliation.`
      : 'No combosquatting detected.',
  });

  deceptionTechniques.push({
    technique: 'Typosquatting (Character Substitution)',
    detected: isTyposquat,
    explanation: isTyposquat
      ? `The target domain has an edit distance of only ${hostDistance} characters from the legitimate domain, suggesting a typo-trap intended to catch mistyped URLs.`
      : 'No close typographical misspelling detected.',
  });

  deceptionTechniques.push({
    technique: 'IDN Homoglyph / Punycode Spoofing',
    detected: isHomoglyph,
    explanation: isHomoglyph
      ? 'The target uses Punycode (xn--) or non-ASCII characters that visually mimic standard letters (such as Cyrillic "а" instead of Latin "a").'
      : 'Standard ASCII character set used.',
  });

  let conclusion = '';
  if (!apexMatch || isSubdomainDeception || isCombosquat || isTyposquat || isHomoglyph) {
    conclusion = `HIGH DECEPTION DETECTED: Target URL is an engineered lookalike impersonating '${domainPartsA.apexDomain}'. It relies on social engineering and deceptive domain structures. Do NOT treat it as the legitimate service.`;
  } else {
    conclusion = 'COMPARISON RESOLUTION: Both URLs share the same registered domain entity or exhibit low comparative discrepancy.';
  }

  return {
    urlA: {
      raw: urlLegitInput,
      protocol: parsedA.protocol.replace(':', ''),
      hostname: parsedA.hostname,
      apexDomain: domainPartsA.apexDomain,
      subdomains: domainPartsA.subdomains,
      tld: domainPartsA.tld,
      path: parsedA.pathname,
      riskScore: analysisA.riskScore,
      riskLevel: analysisA.riskLevel,
    },
    urlB: {
      raw: urlTargetInput,
      protocol: parsedB.protocol.replace(':', ''),
      hostname: parsedB.hostname,
      apexDomain: domainPartsB.apexDomain,
      subdomains: domainPartsB.subdomains,
      tld: domainPartsB.tld,
      path: parsedB.pathname,
      riskScore: analysisB.riskScore,
      riskLevel: analysisB.riskLevel,
    },
    differences,
    deceptionTechniquesDetected: deceptionTechniques,
    conclusion,
  };
}
