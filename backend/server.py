#!/usr/bin/env python3
"""
PhishGuard AI — Advanced Cybersecurity Heuristics Server
Runs with zero external dependencies using Python's built-in http.server.
Fully compatible with Python 3.10 - 3.14+.
"""

import http.server
import json
import math
import re
import socketserver
import time
from urllib.parse import urlparse

PORT = 8000

KNOWN_BRANDS = {
    "paypal": ["paypal.com"],
    "apple": ["apple.com", "icloud.com"],
    "microsoft": ["microsoft.com", "live.com", "office.com", "outlook.com", "azure.com"],
    "google": ["google.com", "gmail.com", "youtube.com"],
    "netflix": ["netflix.com"],
    "amazon": ["amazon.com", "aws.amazon.com"],
    "chase": ["chase.com"],
    "wellsfargo": ["wellsfargo.com"],
    "bankofamerica": ["bankofamerica.com"],
    "binance": ["binance.com"],
    "coinbase": ["coinbase.com"],
    "docusign": ["docusign.com", "docusign.net"],
    "usps": ["usps.com"],
    "fedex": ["fedex.com"],
    "dhl": ["dhl.com"],
    "facebook": ["facebook.com", "fb.com", "meta.com"],
    "instagram": ["instagram.com"],
    "steam": ["steampowered.com", "steamcommunity.com"],
}

SUSPICIOUS_TLDS = {
    "xyz", "top", "work", "click", "loan", "fit", "gq", "cf", "tk", "ml", "ga",
    "buzz", "rest", "icu", "vip", "monster", "country", "stream", "kim", "science",
    "party", "trade", "accountant", "date", "faith", "racing", "cricket", "win"
}

URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly", "cutt.ly",
    "rb.gy", "shorturl.at", "goo.gl", "bl.ink", "trib.al"
}

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "verification", "account", "banking", "secure",
    "security", "update", "wallet", "confirm", "confirmation", "authenticate",
    "auth", "billing", "recover", "recovery", "password", "support", "helpdesk",
    "validation", "suspended", "alert", "session", "unlock", "portal"
]

def calculate_entropy(s: str) -> float:
    if not s:
        return 0.0
    frequencies = {}
    for c in s:
        frequencies[c] = frequencies.get(c, 0) + 1
    entropy = 0.0
    length = len(s)
    for count in frequencies.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 2)

def parse_domain_components(hostname: str):
    parts = hostname.lower().split('.')
    if len(parts) <= 1:
        return {"apexDomain": hostname, "subdomains": [], "tld": ""}

    multi_part_tlds = {"co.uk", "gov.uk", "ac.uk", "com.au", "net.au", "co.nz", "co.jp", "com.br", "com.mx"}
    last_two = ".".join(parts[-2:])
    
    if last_two in multi_part_tlds and len(parts) >= 3:
        tld = last_two
        apex_domain = ".".join(parts[-3:])
        subdomains = parts[:-3]
    else:
        tld = parts[-1]
        apex_domain = ".".join(parts[-2:])
        subdomains = parts[:-2]

    return {"apexDomain": apex_domain, "subdomains": subdomains, "tld": tld}

def analyze_url(raw_input: str):
    normalized_url = raw_input.strip()
    if not re.match(r"^https?://", normalized_url, re.IGNORECASE):
        normalized_url = "https://" + normalized_url

    try:
        parsed = urlparse(normalized_url)
    except Exception:
        parsed = urlparse("http://" + raw_input.strip())

    hostname = parsed.hostname or ""
    pathname = parsed.path or ""
    protocol = parsed.scheme.lower()
    
    indicators = []
    raw_score = 0
    protocol_score = 0
    domain_rep_score = 0
    subdomain_score = 0
    brand_spoof_score = 0
    entropy_score = 0

    # 1. IP Hostname Check
    ipv4_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    is_ip = bool(re.match(ipv4_pattern, hostname))
    if is_ip:
        indicators.append({
            "id": "ind-ip-host",
            "category": "domain",
            "severity": "critical",
            "title": "Direct IP Address Hostname Detected",
            "description": f"URL resolves to raw IP address ({hostname}) without a registered domain identity.",
            "technicalDetails": "Attackers deploy bare IP addresses to evade automated domain reputation blacklists.",
            "scoreImpact": 35,
        })
        raw_score += 35
        domain_rep_score += 40

    # 2. Protocol Check
    if protocol == "http":
        indicators.append({
            "id": "ind-unencrypted-http",
            "category": "protocol",
            "severity": "warning",
            "title": "Unencrypted Connection (Plain HTTP)",
            "description": "Connection lacks TLS/HTTPS encryption, leaving credentials vulnerable to interception.",
            "technicalDetails": "Modern standard requires HTTPS encryption.",
            "scoreImpact": 20,
        })
        raw_score += 20
        protocol_score += 35

    # 3. Domain Decomposition
    decomp = parse_domain_components(hostname)
    apex_domain = decomp["apexDomain"]
    subdomains = decomp["subdomains"]
    tld = decomp["tld"]

    # 4. Suspicious TLD
    if tld.lower() in SUSPICIOUS_TLDS:
        indicators.append({
            "id": "ind-suspicious-tld",
            "category": "tld",
            "severity": "warning",
            "title": f"High-Risk Top-Level Domain (.{tld})",
            "description": f"The TLD '.{tld}' possesses a statistically elevated spam and phishing association.",
            "technicalDetails": "Certain generic TLDs offer bulk disposable registrations with minimal verification.",
            "scoreImpact": 22,
        })
        raw_score += 22
        domain_rep_score += 25

    # 5. URL Shortener
    is_shortener = hostname.lower() in URL_SHORTENERS
    if is_shortener:
        indicators.append({
            "id": "ind-url-shortener",
            "category": "domain",
            "severity": "caution",
            "title": "URL Redirection Shortener Detected",
            "description": f"Service '{hostname}' is an intermediary shortener concealing final landing targets.",
            "scoreImpact": 15,
        })
        raw_score += 15
        domain_rep_score += 15

    # 6. Excessive Subdomain Stacking
    if len(subdomains) >= 3:
        indicators.append({
            "id": "ind-excessive-subdomains",
            "category": "subdomain",
            "severity": "critical",
            "title": f"Excessive Subdomain Stacking ({len(subdomains)} Levels)",
            "description": f"High subdomain nesting ('{'.'.join(subdomains)}') masking apex domain '{apex_domain}'.",
            "scoreImpact": 25,
        })
        raw_score += 25
        subdomain_score += 35

    # 7. Brand Combosquatting & Spoofing
    brand_spoofed = False
    for brand, legits in KNOWN_BRANDS.items():
        if brand in hostname.lower() or brand in pathname.lower():
            is_legit = any(apex_domain.lower() == l.lower() or hostname.lower().endswith("." + l.lower()) for l in legits)
            if not is_legit:
                brand_spoofed = True
                indicators.append({
                    "id": f"ind-brand-spoof-{brand}",
                    "category": "brand",
                    "severity": "critical",
                    "title": f"Brand Impersonation / Combosquatting ({brand.upper()})",
                    "description": f"URL incorporates brand '{brand.upper()}', but apex domain is '{apex_domain}' (unauthorized third party).",
                    "technicalDetails": f"Legitimate domains: {', '.join(legits)}.",
                    "scoreImpact": 35,
                })
                raw_score += 35
                brand_spoof_score += 45
                break

    # 8. Hyphen Abuse
    hyphen_count = hostname.count("-")
    if hyphen_count >= 3:
        indicators.append({
            "id": "ind-excessive-hyphens",
            "category": "domain",
            "severity": "warning",
            "title": f"Excessive Hostname Hyphens ({hyphen_count})",
            "description": f"Domain contains {hyphen_count} hyphens, indicating artificial combo-chaining.",
            "scoreImpact": 18,
        })
        raw_score += 18
        domain_rep_score += 20

    # 9. IDN Homoglyph / Punycode
    is_punycode = "xn--" in hostname.lower()
    has_non_ascii = any(ord(c) > 127 for c in hostname)
    if is_punycode or has_non_ascii:
        indicators.append({
            "id": "ind-homoglyph-punycode",
            "category": "domain",
            "severity": "critical",
            "title": "IDN Homoglyph / Punycode Spoofing Detected",
            "description": "Domain employs non-ASCII or Punycode characters to visually mimic familiar letters.",
            "scoreImpact": 35,
        })
        raw_score += 35
        brand_spoof_score += 30

    # 10. Shannon Entropy
    host_entropy = calculate_entropy(hostname)
    if host_entropy > 3.8 and not is_ip:
        indicators.append({
            "id": "ind-high-entropy",
            "category": "entropy",
            "severity": "caution",
            "title": f"High Hostname Randomness (Entropy: {host_entropy})",
            "description": "Character randomness matches patterns generated by automated DGA phishing kits.",
            "scoreImpact": 12,
        })
        raw_score += 12
        entropy_score += 25

    # 11. Sensitive Keywords
    matched_kws = [kw for kw in SUSPICIOUS_KEYWORDS if kw in f"{hostname} {pathname}".lower()]
    if len(matched_kws) >= 2 and not brand_spoofed:
        indicators.append({
            "id": "ind-suspicious-keywords",
            "category": "domain",
            "severity": "warning",
            "title": f"Sensitive Security Keywords ({', '.join(matched_kws[:3])})",
            "description": "URL leverages authentication and credential verification keywords.",
            "scoreImpact": 15,
        })
        raw_score += 15
        subdomain_score += 15

    # Final score normalization
    final_score = min(100, max(0, int(round(raw_score))))
    if final_score >= 70:
        risk_level = "high"
        verdict = "High Risk"
        summary = f"CRITICAL PHISHING RISK ({final_score}/100): High likelihood of credential harvesting or brand spoofing. Avoid visiting or submitting personal details."
    elif final_score >= 35:
        risk_level = "suspicious"
        verdict = "Suspicious"
        summary = f"SUSPICIOUS TRAITS IDENTIFIED ({final_score}/100): URL displays non-standard structures or questionable TLD indicators."
    else:
        risk_level = "low"
        verdict = "Low Risk"
        summary = f"LOW HEURISTIC RISK ({final_score}/100): Standard domain patterns and no overt deception markers identified."

    return {
        "id": f"py-scan-{int(time.time()*1000)}",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "target": raw_input,
        "normalizedUrl": normalized_url,
        "hostname": hostname,
        "protocol": protocol,
        "riskScore": final_score,
        "riskLevel": risk_level,
        "verdict": verdict,
        "confidence": 92 if len(indicators) > 1 else 84,
        "indicators": indicators,
        "breakdown": {
            "protocolScore": min(100, protocol_score),
            "domainReputationScore": min(100, domain_rep_score),
            "subdomainStructureScore": min(100, subdomain_score),
            "brandSpoofingScore": min(100, brand_spoof_score),
            "lexicalEntropyScore": min(100, entropy_score),
        },
        "summary": summary,
        "recommendations": [
            "Never submit passwords, pins, or credit cards on unverified websites.",
            "Verify the apex root domain in your browser navigation bar before continuing.",
            "If this arrived via unsolicited message, report it to your organization's security team."
        ],
        "safePreview": {
            "apexDomain": apex_domain,
            "subdomains": subdomains,
            "tld": tld,
            "path": pathname,
            "hasPort": bool(parsed.port),
            "hasCredentials": "@" in raw_input,
            "isIpAddress": is_ip,
            "isShortener": is_shortener,
            "isPunycode": is_punycode or has_non_ascii,
        }
    }

def analyze_email(subject: str, body: str, sender: str = ""):
    full_text = f"{subject}\n{body}\n{sender}"
    
    urgency_patterns = [
        r"\b(immediate|immediately|urgent|urgently)\b",
        r"\b(within \d+ hours?|within 24 hours)\b",
        r"\b(act now|act immediately|take action now)\b",
        r"\b(final warning|final reminder|final notice)\b",
        r"\b(account will be (closed|suspended|terminated|deleted|locked))\b",
    ]
    threat_patterns = [
        r"\b(legal action|law enforcement|police|arrest)\b",
        r"\b(unauthorized (access|transaction|activity|charge))\b",
        r"\b(security (breach|incident|compromise|alert))\b",
        r"\b(frozen account|blocked account)\b",
    ]
    credential_patterns = [
        r"\b(confirm|verify|update|validate) (your )?(password|credentials|login|pin)\b",
        r"\b(enter|type|input) (your )?(password|ssn|social security)\b",
        r"\b(update (your )?(billing|credit card|banking details))\b",
        r"\b(two-factor|2fa|otp|one-time code)\b",
    ]
    financial_patterns = [
        r"\b(wire transfer|bank wire|swift transfer)\b",
        r"\b(gift card|apple gift card|google play card)\b",
        r"\b(crypto|cryptocurrency|bitcoin|btc)\b",
        r"\b(overdue invoice|invoice attached|past due invoice)\b",
    ]

    urgency_hits = [m.group(0) for p in urgency_patterns for m in re.finditer(p, full_text, re.IGNORECASE)]
    threat_hits = [m.group(0) for p in threat_patterns for m in re.finditer(p, full_text, re.IGNORECASE)]
    credential_hits = [m.group(0) for p in credential_patterns for m in re.finditer(p, full_text, re.IGNORECASE)]
    financial_hits = [m.group(0) for p in financial_patterns for m in re.finditer(p, full_text, re.IGNORECASE)]

    indicators = []
    raw_score = 0

    if urgency_hits:
        pts = min(30, len(urgency_hits) * 12)
        raw_score += pts
        indicators.append({
            "id": "email-ind-urgency",
            "category": "urgency",
            "severity": "critical" if len(urgency_hits) >= 2 else "warning",
            "title": f"High-Pressure Urgency Tactics ({len(urgency_hits)} phrases)",
            "description": "Message leverages psychological deadlines to induce panic.",
            "snippet": ", ".join(f'"{u}"' for u in urgency_hits[:3]),
            "scoreImpact": pts,
        })

    if threat_hits:
        pts = min(35, len(threat_hits) * 14)
        raw_score += pts
        indicators.append({
            "id": "email-ind-threats",
            "category": "urgency",
            "severity": "critical",
            "title": f"Coercive Threats & Fear Appeals ({len(threat_hits)} patterns)",
            "description": "Cites penalties, suspensions, or unauthorized transactions.",
            "snippet": ", ".join(f'"{t}"' for t in threat_hits[:3]),
            "scoreImpact": pts,
        })

    if credential_hits:
        pts = min(40, len(credential_hits) * 18)
        raw_score += pts
        indicators.append({
            "id": "email-ind-credentials",
            "category": "credential",
            "severity": "critical",
            "title": f"Direct Credential Harvesting Request ({len(credential_hits)} instances)",
            "description": "Prompts recipient to submit passwords, SSN, or authentication codes.",
            "snippet": ", ".join(f'"{c}"' for c in credential_hits[:3]),
            "scoreImpact": pts,
        })

    if financial_hits:
        pts = min(30, len(financial_hits) * 12)
        raw_score += pts
        indicators.append({
            "id": "email-ind-financial",
            "category": "financial",
            "severity": "warning",
            "title": f"Financial / Wire / Gift Card Solicitation ({len(financial_hits)} hits)",
            "description": "Demands wire transfers, invoices, or gift card reimbursements.",
            "snippet": ", ".join(f'"{f}"' for f in financial_hits[:3]),
            "scoreImpact": pts,
        })

    extracted_urls = list(set(re.findall(r"https?://[^\s<>\"'{}|\\^`]+", full_text, re.IGNORECASE)))

    final_score = min(100, max(0, int(round(raw_score))))
    risk_level = "high" if final_score >= 65 else "suspicious" if final_score >= 35 else "low"
    verdict = "High Risk" if risk_level == "high" else "Suspicious" if risk_level == "suspicious" else "Low Risk"

    return {
        "id": f"py-email-scan-{int(time.time()*1000)}",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "subject": subject,
        "sender": sender,
        "bodyPreview": body[:240] + ("..." if len(body) > 240 else ""),
        "riskScore": final_score,
        "riskLevel": risk_level,
        "verdict": verdict,
        "indicators": indicators,
        "detectedLinks": [{"originalText": u, "extractedUrl": u, "riskScore": 75, "isMismatched": False} for u in extracted_urls],
        "urgencyTriggers": urgency_hits,
        "credentialTriggers": credential_hits,
        "financialTriggers": financial_hits,
        "impersonationTriggers": [],
        "threatTriggers": threat_hits,
        "summary": f"{verdict} social engineering pattern detected. Message exhibits coercive urgency and credentials traps." if risk_level != 'low' else "Standard message format without overt phishing keywords.",
        "recommendations": [
            "Never click embedded links or open unexpected attachments.",
            "Do not reply with passwords, personal info, or gift card codes.",
            "Report this message to your security administrator or spam desk."
        ],
        "analysisEngine": "fastapi_local"
    }

class PhishGuardHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/health" or self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            response = {
                "status": "healthy",
                "engine": "PhishGuard Python Heuristic Intelligence v1.0",
                "timestamp": time.time(),
                "mode": "standalone_native_python",
                "capabilities": [
                    "URL Decomposition & Combosquatting Inspection",
                    "Punycode & IDN Homoglyph Detection",
                    "Shannon Entropy Analysis",
                    "Social Engineering Rule Extraction"
                ]
            }
            self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        
        try:
            payload = json.loads(post_data)
        except Exception:
            payload = {}

        if self.path == "/api/scan/url":
            target_url = payload.get("url", "")
            result = analyze_url(target_url)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(result).encode("utf-8"))

        elif self.path == "/api/scan/email":
            subject = payload.get("subject", "")
            body = payload.get("body", "")
            sender = payload.get("sender", "")
            result = analyze_email(subject, body, sender)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(result).encode("utf-8"))

        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

    def log_message(self, format, *args):
        # Concise logging
        pass

def run_server():
    server_address = ("", PORT)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(server_address, PhishGuardHandler) as httpd:
        print(f"PhishGuard Python Heuristic Server running on http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
