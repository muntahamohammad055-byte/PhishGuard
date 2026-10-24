import React, { useState } from 'react';
import {
  BookOpen,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  FileWarning,
  Send,
  Lock,
  Smartphone,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const SecurityGuidesView: React.FC = () => {
  const [activeScenarioTab, setActiveScenarioTab] = useState<'clicked' | 'entered_creds' | 'downloaded'>('entered_creds');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-2">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </span>
          <h2 className="text-lg md:text-xl font-bold text-white">
            Security Recommendations & Incident Response Playbooks
          </h2>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl">
          Comprehensive step-by-step guidance for mitigating cyber threats, responding to accidental clicks or credential exposure, and reporting fraudulent infrastructure.
        </p>
      </div>

      {/* Emergency Incident Response Matrix */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Incident Triage Protocol</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Immediate Actions</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-[#1b2742] pb-3">
          <button
            onClick={() => setActiveScenarioTab('entered_creds')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeScenarioTab === 'entered_creds'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
                : 'bg-[#0f172a] text-slate-400 hover:text-white border border-[#1f2d4a]'
            }`}
          >
            I Entered My Password or Credentials
          </button>

          <button
            onClick={() => setActiveScenarioTab('clicked')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeScenarioTab === 'clicked'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'bg-[#0f172a] text-slate-400 hover:text-white border border-[#1f2d4a]'
            }`}
          >
            I Clicked the Link but Closed it
          </button>

          <button
            onClick={() => setActiveScenarioTab('downloaded')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeScenarioTab === 'downloaded'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
                : 'bg-[#0f172a] text-slate-400 hover:text-white border border-[#1f2d4a]'
            }`}
          >
            I Downloaded / Opened an Attachment
          </button>
        </div>

        {/* Tab 1: Entered Credentials */}
        {activeScenarioTab === 'entered_creds' && (
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>CRITICAL PRIORITY:</strong> Assume credentials are compromised in real-time. Automated bots harvest and test passwords across multiple accounts within seconds.
              </span>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside font-sans">
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Change the Password Immediately on Official Domain:</strong> Do not use the link in the message. Open a new clean browser window, navigate directly to the legitimate website (e.g. login.microsoftonline.com or chase.com), and reset your password.
              </li>
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Revoke All Active Sessions:</strong> Use the service&apos;s security settings to &quot;Sign out of all devices and active sessions&quot; to invalidate any captured session cookies.
              </li>
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Review Authorized MFA Devices & Recovery Emails:</strong> Ensure the attacker did not add an unauthorized phone number, authenticator app, or email forwarding rule.
              </li>
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Update Any Accounts Reusing This Password:</strong> If you used the same password elsewhere, change those passwords immediately and adopt a password manager.
              </li>
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Notify Corporate IT / Security Operations:</strong> If this is a work account, inform your SOC or IT team immediately so they can monitor for unusual IP logins.
              </li>
            </ol>
          </div>
        )}

        {/* Tab 2: Clicked Link Only */}
        {activeScenarioTab === 'clicked' && (
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>MODERATE RISK:</strong> If you did not enter credentials or download files, the primary risks are drive-by exploits, browser fingerprinting, and session confirmation.
              </span>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside">
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Close the Browser Tab and Clear Cache/Cookies:</strong> Clear temporary browser storage for that domain to prevent tracking scripts from persisting.
              </li>
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Verify Your Browser is Up-to-Date:</strong> Ensure Chrome, Firefox, Safari, or Edge is on the latest version with current security sandbox patches.
              </li>
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Expect Elevated Spam / Smishing:</strong> Clicking confirms to attackers that your phone number or email address is active, which may trigger follow-up scams.
              </li>
            </ol>
          </div>
        )}

        {/* Tab 3: Downloaded File */}
        {activeScenarioTab === 'downloaded' && (
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>CRITICAL MALWARE RISK:</strong> Disconnect from the network if an executable, script (.vbs/.bat), or macro-enabled document was opened.
              </span>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside">
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Isolate the Device:</strong> Disconnect Wi-Fi and unplug ethernet cables to prevent lateral malware movement across the local network.
              </li>
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Run a Full Antivirus / Endpoint Detection Scan:</strong> Execute a full scan with Windows Defender, macOS XProtect/Malwarebytes, or your enterprise EDR.
              </li>
              <li className="p-3 rounded-xl bg-[#080d19] border border-[#182643]">
                <strong className="text-white">Never Enable Office Macros:</strong> If prompted to &quot;Enable Content&quot; or &quot;Enable Macros&quot;, immediately reject and delete the file.
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Multifactor Authentication (MFA) Hygiene Guide */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <KeyRound className="w-4 h-4" />
          <span>Multifactor Authentication (MFA) Security Hierarchy</span>
        </div>

        <p className="text-xs text-slate-300">
          Not all 2FA is created equal. Phishing-resistant credentials neutralize over 99% of automated AiTM credential attacks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* FIDO2 / Passkeys */}
          <div className="p-4 rounded-xl bg-[#080d19] border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 font-mono">FIDO2 / Passkeys</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                Phishing Proof
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Hardware security keys (YubiKey) or device Passkeys (Touch ID, Face ID). The browser cryptographically binds the authentication token directly to the registered domain name. If you visit a fake lookalike URL, the key simply refuses to send the credentials!
            </p>
          </div>

          {/* Authenticator Apps (TOTP) */}
          <div className="p-4 rounded-xl bg-[#080d19] border border-blue-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 font-mono">Authenticator Apps</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold font-mono">
                Strong Protection
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Google Authenticator, Microsoft Authenticator, or Bitwarden. 6-digit rolling codes generated locally. Much safer than SMS, but susceptible to real-time AiTM phishing proxies if entered immediately.
            </p>
          </div>

          {/* SMS / Email OTP */}
          <div className="p-4 rounded-xl bg-[#080d19] border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 font-mono">SMS / Voice Codes</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold font-mono">
                Vulnerable
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              One-time text message codes are vulnerable to SIM-swapping, mobile carrier interception, and straightforward relaying by phishing landing pages. Migrate to Authenticator apps or Passkeys whenever available.
            </p>
          </div>
        </div>
      </div>

      {/* Reporting Phishing Channel Directory */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0c1426] border border-[#1b2640] shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-violet-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Send className="w-4 h-4" />
          <span>Official Channels to Report Phishing Attacks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#080d19] border border-[#1b2848] space-y-1">
            <strong className="text-white block font-mono">Anti-Phishing Working Group (APWG)</strong>
            <p className="text-slate-400 text-[11px]">Forward phishing emails directly to:</p>
            <code className="text-cyan-300 bg-slate-900 px-2 py-0.5 rounded font-mono text-xs block">
              reportphishing@apwg.org
            </code>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080d19] border border-[#1b2848] space-y-1">
            <strong className="text-white block font-mono">Federal Trade Commission (FTC)</strong>
            <p className="text-slate-400 text-[11px]">Forward malicious text messages / smishing to:</p>
            <code className="text-cyan-300 bg-slate-900 px-2 py-0.5 rounded font-mono text-xs block">
              7726 (SPAM) &bull; reportfraud.ftc.gov
            </code>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080d19] border border-[#1b2848] space-y-1">
            <strong className="text-white block font-mono">Google Safe Browsing & Microsoft Defender</strong>
            <p className="text-slate-400 text-[11px]">Submit deceptive URLs directly to browser blocklists:</p>
            <span className="text-slate-300 text-[11px] block">
              safebrowsing.google.com/safebrowsing/report_phish
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080d19] border border-[#1b2848] space-y-1">
            <strong className="text-white block font-mono">Targeted Organization Abuse Desk</strong>
            <p className="text-slate-400 text-[11px]">Most brands operate dedicated abuse addresses:</p>
            <span className="text-slate-300 text-[11px] block">
              phishing@paypal.com &bull; abuse@chase.com &bull; reportphishing@apple.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
