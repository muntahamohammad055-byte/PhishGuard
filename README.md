# 🛡️ PhishGuard AI — Smart Phishing Detection & Cyber Awareness Platform

A modern, responsive, explainable cybersecurity web application designed to help users identify deceptive URLs, analyze suspicious emails, decompile lookalike domain tactics, and build cyber threat awareness through interactive simulations.

---

## 🌟 Key Features

### 1. Smart URL Security Scanner
- **Paste & Scan**: Input any URL or select from realistic demonstration presets.
- **Deep Heuristic Indicators**:
  - IP address hostnames (e.g. `http://185.220.101.5/login`)
  - Subdomain camouflage & stacking (`paypal.security.account-update.xyz`)
  - Brand combosquatting (detects targeted brands like PayPal, Apple, Microsoft, Chase, Netflix embedded in unauthorized domains)
  - URL shorteners detection (`bit.ly`, `tinyurl.com`, `t.co`, etc.)
  - High-risk / disposable TLDs (`.xyz`, `.top`, `.work`, `.click`, `.loan`, `.fit`, `.vip`, etc.)
  - IDN Homoglyphs & Punycode lookalike spoofing (`xn--` or Cyrillic characters mimicking ASCII)
  - Deceptive `@` credential injection tricks (`http://legit.com@attacker.com`)
  - Non-standard port analysis (`:8080`, `:8443`, `:8000`)
  - Unencrypted plain HTTP vs HTTPS encryption verification
  - Shannon lexical entropy calculation for algorithmic randomness
- **Explainable Threat Breakdown**: Every indicator features plain-English descriptions, technical context, and exact score impacts.
- **Safe Decomposition Anatomy**: Breaks down protocol, apex domain, subdomain stack, and path without visiting the target.
- **Heuristic Assessment Disclaimer**: Explicitly framed as heuristic security analysis, never falsely claiming definitive malware infallibility.

### 2. AI-Style Phishing Email Analyzer
- **Input Inspection**: Paste email subject, sender header, and body text.
- **Heuristic Pattern Categories**:
  - High-pressure urgency & artificial deadlines (*"immediate action required"*, *"within 24 hours"*, *"account will be suspended"*)
  - Coercive threats & fear appeals (*"law enforcement"*, *"unauthorized transaction"*, *"legal penalty"*)
  - Credential harvesting & identity theft (*"confirm password"*, *"verify SSN"*, *"enter 2FA code"*)
  - Financial fraud & wire requests (*"wire transfer"*, *"gift card"*, *"overdue invoice"*, *"crypto"*)
  - Impersonation & generic greetings (*"Dear Customer"*, *"IT Helpdesk"*, *"Executive Office"*)
  - Mismatched hyperlink anchor deception (e.g. text says `https://paypal.com` but link points to `evil-site.com`)
- **Transparent Rule-Based Heuristic Security Model**: Explicitly acknowledges deterministic heuristic rules with zero external AI API calls, preserving 100% data confidentiality.

### 3. Explainable Threat Intelligence Dashboard
- **Telemetry Metric Cards**: Total Scans, High-Risk Detections, Suspicious Alerts, Low Risk Scans, Average Risk Score.
- **Visual Analytics**:
  - Circular animated risk score gauge (0 to 100)
  - Risk distribution metrics (High vs Suspicious vs Low)
  - Threat indicator frequency breakdown
- **Searchable Scan Telemetry History**: Filter by target, type (URL vs Email), and verdict. Inspect complete past scan records.
- **Data Portability**: Export scan history to JSON or CSV, or wipe local records with one click.

### 4. Interactive Phishing Awareness Lab
- **5 Realistic Fictional Attack Scenarios**:
  1. *Unpaid Package Redelivery Fee* (USPS / Postal custom fee scam)
  2. *Critical Banking Wire Transfer Alert* (Chase unauthorized debit panic)
  3. *Lucrative Remote Job Offer & Equipment Advance* (Fake check scam)
  4. *Urgent Microsoft 365 SSO Session Expiration* (Corporate credential theft)
  5. *Executive Wire Transfer Request / BEC* (CEO spoofing finance manager)
- **Simulated Email Client**: Interactive email mockup with From, To, Date, Subject, and formatted HTML body.
- **Red Flag Inspection**: Toggle interactive cues explaining why specific indicators are dangerous.
- **Interactive Quiz & Real-Time Scoring**: Immediate feedback, awareness score calculation (0–100%), rank badges (*Cyber Cadet*, *Vigilant Scout*, *Threat Hunter*, *Cyber Sentinel*), and celebratory confetti animations upon completion!

### 5. URL Safety & Lookalike Comparison Tool
- **Side-by-Side Differential Diff**: Compare a verified legitimate URL against a suspicious target.
- **Component Breakdown Table**: Protocol, apex domain, subdomains, TLD, and resource path.
- **Deception Technique Audit**:
  - Combosquatting (appending words like `-security`, `-login`)
  - Subdomain Camouflage (placing brand names in subdomains)
  - Typosquatting (Levenshtein edit distance of 1–2 characters)
  - IDN Homoglyph / Punycode spoofing

### 6. Security Recommendations & Incident Playbook
- **Interactive Triage Protocol**:
  - *"I entered my password or credentials"* (Immediate password rotation, session revocation, MFA audit)
  - *"I clicked the link but closed it"* (Cache clearance, browser updates)
  - *"I downloaded / opened an attachment"* (Network isolation, AV scan, macro warnings)
- **MFA Security Hierarchy**: Passkeys/FIDO2 vs Authenticator Apps (TOTP) vs SMS OTP vulnerabilities.
- **Official Reporting Directory**: Anti-Phishing Working Group (APWG), FTC, Google Safe Browsing, and brand abuse desks.

---

## 🛠️ Technology Stack

- **Frontend**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) (Cyber dark navy palette, neon cyan & violet accents)
  - [Lucide React](https://lucide.dev/) (Cybersecurity iconography)
  - [Canvas Confetti](https://www.kirilv.com/canvas-confetti/) (Interactive achievement celebrations)
  - [Vite](https://vitejs.dev/) (Fast bundling and dev server)
- **Backend**:
  - Python 3.10+ compatible server (`backend/server.py` and `backend/main.py`)
  - REST API endpoints for `/api/health`, `/api/scan/url`, `/api/scan/email`
- **Dual-Engine Architecture**:
  - Works **100% in-browser offline** using TypeScript heuristic rules without requiring a backend.
  - Automatically connects to the local Python backend when running.
  - **Zero paid APIs required**: No OpenAI/Anthropic keys, no paid subscriptions, no external tracking.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Run the Frontend
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. (Optional) Run the Python Backend
The frontend is fully functional standalone with its in-browser heuristic engine. To optionally run the Python backend:
```bash
# In the project root:
python3 backend/server.py
```
The backend starts on `http://localhost:8000`. The frontend will detect it and illuminate the status pill green (**"FastAPI / Python Connected"**).

---

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx             # Responsive left navigation bar
│   │   │   ├── Header.tsx              # Top bar with status pill & quick scan
│   │   │   ├── RiskGauge.tsx           # Animated SVG circular risk gauge
│   │   │   ├── DashboardView.tsx       # Threat telemetry dashboard & metrics
│   │   │   ├── UrlScannerView.tsx      # Heuristic URL scanner with safe decomposition
│   │   │   ├── EmailAnalyzerView.tsx   # Social engineering email analyzer
│   │   │   ├── AwarenessLabView.tsx    # 5 interactive scenarios & quiz scoring
│   │   │   ├── UrlComparisonView.tsx   # Side-by-side lookalike URL diff tool
│   │   │   ├── SecurityGuidesView.tsx  # Incident triage matrix & MFA guide
│   │   │   ├── ScanHistoryView.tsx     # Searchable history table with CSV/JSON export
│   │   │   ├── ScanDetailModal.tsx     # Full inspection modal for past scans
│   │   │   └── SettingsView.tsx        # System architecture & connection settings
│   │   ├── services/
│   │   │   ├── urlAnalyzer.ts          # Comprehensive client-side URL heuristic engine
│   │   │   ├── emailAnalyzer.ts        # Comprehensive client-side email heuristic engine
│   │   │   ├── urlComparator.ts        # URL differential comparison engine
│   │   │   ├── storage.ts              # LocalStorage persistence & export utilities
│   │   │   └── api.ts                  # Dual-engine API client with seamless fallback
│   │   ├── data/
│   │   │   ├── awarenessScenarios.ts   # 5 real-world attack scenarios with red flags
│   │   │   └── sampleData.ts           # 1-click preset test samples
│   │   ├── types.ts                    # TypeScript interface definitions
│   │   ├── App.tsx                     # Main layout & navigation state
│   │   ├── main.tsx                    # React DOM entry
│   │   └── index.css                   # Tailwind CSS styling & custom glow classes
│   ├── index.html                      # HTML5 template with Google fonts
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/
│   ├── server.py                       # Zero-dependency Python heuristic server
│   ├── main.py                         # FastAPI implementation
│   └── requirements.txt                # Python dependencies
└── README.md
```

---

## 🔒 Security & Privacy Notice
- **Educational & Defensive Tool**: PhishGuard AI is intended for defensive security awareness and education. While its heuristic scoring evaluates dozens of known phishing techniques, zero heuristic risk does not guarantee complete absence of malicious code.
- **No Remote Transmission**: Entered text and URLs are never dispatched to external AI platforms or commercial cloud loggers. All data remains local to your device and local backend.
