import { ScenarioQuestion } from '../types';

export const AWARENESS_SCENARIOS: ScenarioQuestion[] = [
  {
    id: 'scenario-1',
    title: 'Scenario 1: Unpaid Package Redelivery Fee',
    category: 'delivery',
    senderDisplay: 'US Postal Service Alert Desk',
    senderEmail: 'notifications@usps-tracking-support.services.net',
    recipient: 'victim.user@target-org.com',
    date: 'Today, 08:42 AM',
    subject: 'Urgent: Package Delivery Interrupted — Action Required within 12 Hours',
    bodyHtml: `
      <p>Dear Customer,</p>
      <p>Your package with tracking number <strong>#US-98402-91XZ</strong> arrived at our regional postal distribution hub, but delivery cannot proceed due to an incomplete street address and an unpaid customs handling fee of <strong>$1.95</strong>.</p>
      <p>Failure to settle the fee within <strong>12 hours</strong> will result in the shipment being declared abandoned and returned to international sender or destroyed.</p>
      <div style="margin: 20px 0;">
        <a href="http://usps-parcel-redelivery-center.com.track892.xyz/confirm-address" style="display:inline-block; padding:12px 24px; background-color:#d9534f; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:4px;">
          Update Delivery Address & Pay $1.95
        </a>
      </div>
      <p>Thank you for choosing postal services.<br>USPS Parcel Support Team</p>
    `,
    redFlags: [
      {
        id: 'rf-1',
        targetText: 'notifications@usps-tracking-support.services.net',
        description: 'Suspicious sender address domain',
        whyDangerous: 'Official USPS correspondence arrives exclusively from "@usps.com" or "@usps.gov", never generic multi-part domains like "services.net".',
      },
      {
        id: 'rf-2',
        targetText: 'Action Required within 12 Hours',
        description: 'Fabricated sense of urgency',
        whyDangerous: 'Threatening package destruction within 12 hours forces recipients into a rushed emotional state, preventing calm evaluation.',
      },
      {
        id: 'rf-3',
        targetText: '$1.95 small fee payment',
        description: 'Micro-payment credential hook',
        whyDangerous: 'Attackers ask for tiny amounts ($1.95) so victims feel there is low financial risk, but the landing page harvests complete credit card numbers and CVV codes.',
      },
      {
        id: 'rf-4',
        targetText: 'http://usps-parcel-redelivery-center.com.track892.xyz',
        description: 'Deceptive subdomain with .xyz TLD',
        whyDangerous: 'The actual apex domain is "track892.xyz", using "usps" only as a misleading subdomain. It also uses unencrypted HTTP.',
      }
    ],
    multipleChoiceQuestion: 'What is the most definitive indicator that this delivery email is a malicious phishing campaign?',
    options: [
      {
        id: 'opt-1',
        text: 'The tracking number uses capital letters and numbers.',
        isCorrect: false,
        explanation: 'Real tracking numbers frequently use combinations of uppercase letters and numerals.',
      },
      {
        id: 'opt-2',
        text: 'The sender domain (@usps-tracking-support.services.net) and landing link (track892.xyz) are not legitimate USPS domains.',
        isCorrect: true,
        explanation: 'Correct! Official postal organizations only operate under their registered primary domains (e.g. usps.com). Any alternative domain is attacker-controlled.',
      },
      {
        id: 'opt-3',
        text: 'Postal carriers never deliver packages on weekdays.',
        isCorrect: false,
        explanation: 'Postal carriers deliver six to seven days a week.',
      },
      {
        id: 'opt-4',
        text: 'The email includes a red button instead of a blue one.',
        isCorrect: false,
        explanation: 'Button color is an aesthetic detail, not a definitive technical security signature.',
      }
    ],
    attackVectorExplained: 'Smishing / Phishing Hybrid: Fraudulent delivery notices are the #1 consumer attack vector. Attackers harvest cardholder data via lookalike forms.',
    psychologicalTrigger: 'Urgency & Loss Aversion: The fear of missing a package or having personal property returned/destroyed prompts immediate action.',
    realWorldDefense: 'Never click parcel links in unexpected emails. Instead, manually navigate to usps.com or fedex.com and paste the tracking number directly into the official search tool.'
  },
  {
    id: 'scenario-2',
    title: 'Scenario 2: Critical Banking Unauthorized Transfer Alert',
    category: 'banking',
    senderDisplay: 'Chase Fraud Prevention Center',
    senderEmail: 'security-alerts@chase-secure-verification.online',
    recipient: 'account-holder@corporate-net.com',
    date: 'Yesterday, 11:15 PM',
    subject: 'SECURITY ALERT: Unauthorized wire transfer of $2,480.00 flagged on your account',
    bodyHtml: `
      <p>Dear Valued Customer,</p>
      <p>Our automated fraud monitoring algorithms detected an unusual outward wire transfer of <strong>$2,480.00 USD</strong> from your Checking Account ending in <strong>*4812</strong> to an unverified recipient in Frankfurt, Germany.</p>
      <p>If you authorized this transaction, no further action is required. If this was NOT authorized by you, your account has been temporarily frozen. You must confirm your credentials and 2FA token immediately to cancel the transfer before settlement at midnight.</p>
      <div style="margin: 20px 0;">
        <a href="https://chase-fraud-cancellation-desk.com.account-auth.vip/cancel-transfer" style="display:inline-block; padding:12px 24px; background-color:#005eb8; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:4px;">
          Reverse Transaction & Secure Account
        </a>
      </div>
      <p>Failure to confirm will result in permanent debit of funds.<br>Chase Security Operations</p>
    `,
    redFlags: [
      {
        id: 'rf-b1',
        targetText: 'security-alerts@chase-secure-verification.online',
        description: 'Fraudulent lookalike sender address',
        whyDangerous: 'Legitimate Chase notifications originate from @chase.com, never generic domain registries like .online.',
      },
      {
        id: 'rf-b2',
        targetText: 'Dear Valued Customer',
        description: 'Impersonal generic greeting',
        whyDangerous: 'Banks always address customers by their legal name registered on the account.',
      },
      {
        id: 'rf-b3',
        targetText: 'Confirm credentials and 2FA token',
        description: 'Two-Factor Authentication interception',
        whyDangerous: 'Phishing kits use real-time adversary-in-the-middle (AiTM) proxies to steal session cookies and one-time MFA codes.',
      },
      {
        id: 'rf-b4',
        targetText: 'chase-fraud-cancellation-desk.com.account-auth.vip',
        description: 'Combosquatting and .vip TLD',
        whyDangerous: 'The true domain is "account-auth.vip". The attacker prepends "chase-fraud" to trick unsuspecting users.',
      }
    ],
    multipleChoiceQuestion: 'If you receive an alert about a large suspicious transaction, what is the safest response?',
    options: [
      {
        id: 'opt-b1',
        text: 'Click the link immediately to prevent the bank from sending your money.',
        isCorrect: false,
        explanation: 'Clicking the link brings you directly to the attacker\'s credential harvesting server.',
      },
      {
        id: 'opt-b2',
        text: 'Do not click the email link; independently open your verified banking app or call the number on the back of your physical card.',
        isCorrect: true,
        explanation: 'Spot on! Never use contact methods provided inside a suspicious alert. Always use known, trusted channels (the phone number on your physical card or official app).',
      },
      {
        id: 'opt-b3',
        text: 'Reply to the email with your online banking password so they can verify you.',
        isCorrect: false,
        explanation: 'Banks never ask for passwords, and replying hands your credentials directly to criminals.',
      },
      {
        id: 'opt-b4',
        text: 'Forward the message to your coworkers to see if they got the same charge.',
        isCorrect: false,
        explanation: 'Spreading the email risks having a coworker accidentally click the malicious link.',
      }
    ],
    attackVectorExplained: 'Adversary-in-the-Middle (AiTM) Banking Phishing: Attackers mimic bank security portals to capture login tokens and relay MFA codes live.',
    psychologicalTrigger: 'Fear and Panic: The fear of losing $2,480 causes adrenaline spikes that bypass rational skepticism.',
    realWorldDefense: 'Never click security alerts in emails or SMS. Log in through the official mobile app or dial the phone number printed on the reverse side of your debit card.'
  },
  {
    id: 'scenario-3',
    title: 'Scenario 3: Lucrative Remote Job Offer & Equipment Advance',
    category: 'job',
    senderDisplay: 'Apex Global Talent Acquisition',
    senderEmail: 'hr-talent@apexglobal-careers-portal.work',
    recipient: 'candidate.jobseeker@mail.com',
    date: '3 days ago',
    subject: 'Offer Letter: Senior IT Systems Consultant ($145,000/year - Fully Remote)',
    bodyHtml: `
      <p>Hello Applicant,</p>
      <p>We reviewed your public profile and are thrilled to offer you the position of <strong>Senior IT Systems Consultant</strong> at Apex Global Solutions. This position offers an annual base salary of <strong>$145,000</strong> plus full healthcare coverage and flexible remote hours.</p>
      <p>Because of our rapid team expansion, formal phone or video interviews have been waived. To begin onboarding on Monday, please review the attached employment agreement and fill out the direct deposit form with your banking routing number and Social Security Number.</p>
      <p>We will mail you a certified cashier's check of <strong>$4,500</strong> to purchase your Apple MacBook Pro and home office monitors from our approved hardware vendor.</p>
      <div style="margin: 20px 0;">
        <a href="http://apexglobal-hr-onboarding.work/direct-deposit-form.docm" style="display:inline-block; padding:12px 24px; background-color:#16a34a; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:4px;">
          Download Onboarding Pack (.docm)
        </a>
      </div>
      <p>Welcome to our team!<br>Global Recruitment Lead</p>
    `,
    redFlags: [
      {
        id: 'rf-j1',
        targetText: 'Interviews waived for $145,000 role',
        description: 'Unrealistic hiring premise',
        whyDangerous: 'No legitimate corporate enterprise hires candidates for high-paying technical roles without formal interviews or vetting.',
      },
      {
        id: 'rf-j2',
        targetText: 'Cashier\'s check of $4,500 for equipment',
        description: 'Classic Fake Check scam',
        whyDangerous: 'The check is counterfeit. The victim deposits it, sends money to the "vendor" (the scammer), and when the check bounces days later, the victim loses thousands.',
      },
      {
        id: 'rf-j3',
        targetText: 'Direct-deposit-form.docm',
        description: 'Macro-enabled malicious Word document',
        whyDangerous: 'Files ending in ".docm" contain executable Visual Basic macros capable of downloading ransomware or spyware onto your computer.',
      },
      {
        id: 'rf-j4',
        targetText: 'Immediate SSN and banking routing requests',
        description: 'Identity theft harvesting',
        whyDangerous: 'Collecting SSN and banking details enables attackers to open unauthorized credit lines or drain accounts.',
      }
    ],
    multipleChoiceQuestion: 'What is the primary danger when an employer sends a cashier\'s check and asks you to purchase equipment through their specified vendor?',
    options: [
      {
        id: 'opt-j1',
        text: 'The computer vendor might take more than 3 business days to ship the laptop.',
        isCorrect: false,
        explanation: 'Shipping delays are a minor inconvenience, not an intentional financial scam.',
      },
      {
        id: 'opt-j2',
        text: 'The check is fraudulent; once you send your own money to the fake vendor, the bank reverses the check and you are held liable for the entire lost amount.',
        isCorrect: true,
        explanation: 'Exact mechanics of the Fake Check Scam. Under US banking law, deposited funds appear available before the check clears. When the counterfeit bounces, the bank withdraws the full amount from your pocket.',
      },
      {
        id: 'opt-j3',
        text: 'Apple computers are not compatible with corporate software.',
        isCorrect: false,
        explanation: 'MacBooks are widely supported in corporate environments.',
      },
      {
        id: 'opt-j4',
        text: 'The salary of $145,000 is taxed at a higher bracket.',
        isCorrect: false,
        explanation: 'Tax brackets are normal accounting, not a cybersecurity scam.',
      }
    ],
    attackVectorExplained: 'Recruitment Fraud / Fake Check Overpayment: Scammers capitalize on job hunters by dangling high salaries, then trick them into wiring funds before bogus checks bounce.',
    psychologicalTrigger: 'Greed, Flattery, & Excitement: The thrill of landing a dream job clouds the victim\'s natural skepticism.',
    realWorldDefense: 'Legitimate companies provide company-owned equipment directly or use established procurement portals. They never ask employees to wire money to third-party equipment suppliers.'
  },
  {
    id: 'scenario-4',
    title: 'Scenario 4: Urgent Microsoft 365 SSO Session Expiration',
    category: 'it_reset',
    senderDisplay: 'IT Helpdesk & Identity Services',
    senderEmail: 'identity-service@corporate-m365-auth.biz',
    recipient: 'employee@enterprise.com',
    date: 'Today, 2:30 PM',
    subject: 'Action Required: Your Single Sign-On (SSO) session expires in 30 minutes',
    bodyHtml: `
      <p>Attention Team Member,</p>
      <p>As part of our scheduled cloud tenant security maintenance, your Microsoft 365 / Corporate Active Directory credentials are set to expire today at <strong>3:00 PM</strong>.</p>
      <p>To retain your existing password and prevent disruption to Outlook, OneDrive, and Teams access, you must re-authenticate your single sign-on token using our self-service portal immediately.</p>
      <div style="margin: 20px 0;">
        <a href="http://login.microsoftonline.com.corporate-portal-login.net/sso/auth" style="display:inline-block; padding:12px 24px; background-color:#0078d4; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:4px;">
          Re-Authenticate SSO Session
        </a>
      </div>
      <p>If not completed before 3:00 PM, an IT technician will have to manually reset your workstation.<br>Internal Identity Management Team</p>
    `,
    redFlags: [
      {
        id: 'rf-it1',
        targetText: 'identity-service@corporate-m365-auth.biz',
        description: 'External non-company sender address',
        whyDangerous: 'Internal IT departments send communications from your organization\'s internal email domain, not external ".biz" domains.',
      },
      {
        id: 'rf-it2',
        targetText: 'Expires in 30 minutes',
        description: 'Extreme artificial urgency',
        whyDangerous: 'Short deadlines create panic, prompting employees to click without contacting their internal service desk.',
      },
      {
        id: 'rf-it3',
        targetText: 'login.microsoftonline.com.corporate-portal-login.net',
        description: 'Subdomain brand camouflage',
        whyDangerous: '"login.microsoftonline.com" is placed as a subdomain, but the real destination is "corporate-portal-login.net".',
      },
      {
        id: 'rf-it4',
        targetText: 'To retain your existing password',
        description: 'Luring users to bypass genuine security hygiene',
        whyDangerous: 'Attackers promise you can "keep your old password" because people dislike having to invent new passwords.',
      }
    ],
    multipleChoiceQuestion: 'Why is the link "http://login.microsoftonline.com.corporate-portal-login.net" deceptively dangerous?',
    options: [
      {
        id: 'opt-it1',
        text: 'Because Microsoft online links must always be in all-capital letters.',
        isCorrect: false,
        explanation: 'Web addresses are case-insensitive and rarely written in all caps.',
      },
      {
        id: 'opt-it2',
        text: 'It places "login.microsoftonline.com" into the subdomain, while the actual web server is corporate-portal-login.net.',
        isCorrect: true,
        explanation: 'Bingo! The domain immediately before the first single slash and TLD determines the actual destination. Here, that is "corporate-portal-login.net", which is 100% attacker-controlled.',
      },
      {
        id: 'opt-it3',
        text: 'Because 365 accounts can never be accessed via a web browser.',
        isCorrect: false,
        explanation: 'Microsoft 365 web access is common; the danger is the fake host.',
      },
      {
        id: 'opt-it4',
        text: 'Because it uses the word "portal".',
        isCorrect: false,
        explanation: 'The word portal is common; the structural domain masquerading is the actual threat.',
      }
    ],
    attackVectorExplained: 'Enterprise Credential Harvesting / Subdomain Deception: The leading cause of enterprise corporate network intrusions is stolen SSO credentials from spoofed M365 portals.',
    psychologicalTrigger: 'Inconvenience Avoidance: Employees dread having their accounts locked and undergoing an IT ticket reset, making them quick to click.',
    realWorldDefense: 'Never click password-reset or session-renewal links in emails. If an alert claims your password expired, open your browser and navigate directly to your company\'s known SSO portal (e.g. portal.office.com).'
  },
  {
    id: 'scenario-5',
    title: 'Scenario 5: Executive Wire Transfer Request (CEO Fraud / BEC)',
    category: 'executive',
    senderDisplay: 'David Sterling (Chief Executive Officer)',
    senderEmail: 'ceo-office@company-corp-secure.net',
    recipient: 'maria.garcia@company.com (Finance Lead)',
    date: 'Today, 3:45 PM',
    subject: 'CONFIDENTIAL: Urgent acquisition payment required before 5:00 PM',
    bodyHtml: `
      <p>Maria,</p>
      <p>I am currently locked in a strictly confidential board of directors meeting finalizing our acquisition of Orion Tech. Due to NDA stipulations, I cannot discuss this openly with the general staff.</p>
      <p>We need an immediate wire transfer of <strong>$48,500.00</strong> remitted to the escrow account before close of business today (5:00 PM EST) to avoid legal penalties and ensure exclusivity.</p>
      <p>I have attached the updated routing and escrow banking details. Please execute the wire from our primary operating account immediately and email me the confirmation receipt.</p>
      <p><strong>Do not call my cell phone</strong> as I cannot step out of the boardroom. Reply directly to this email if you need anything.</p>
      <p>Thank you for your discretion,<br>David Sterling, CEO</p>
    `,
    redFlags: [
      {
        id: 'rf-e1',
        targetText: 'ceo-office@company-corp-secure.net',
        description: 'Lookalike executive email address',
        whyDangerous: 'The real company domain is "company.com", but the email originates from "company-corp-secure.net", a cheap lookalike registered by hackers.',
      },
      {
        id: 'rf-e2',
        targetText: 'Do not call my cell phone',
        description: 'Deliberate prevention of out-of-band verification',
        whyDangerous: 'Attackers explicitly forbid phone calls so victims cannot verify the request with the real executive.',
      },
      {
        id: 'rf-e3',
        targetText: 'Urgent acquisition payment before 5:00 PM',
        description: 'High-stakes urgency combined with confidentiality',
        whyDangerous: 'Invoking "confidential acquisition" intimidates finance employees into bypassing dual-authorization controls.',
      },
      {
        id: 'rf-e4',
        targetText: 'Updated routing and escrow banking details',
        description: 'Fraudulent bank account substitution',
        whyDangerous: 'The money is wired directly to a criminal money mule account and instantly funneled overseas.',
      }
    ],
    multipleChoiceQuestion: 'What protocol MUST the finance team follow before releasing any wire transfer, even if signed by the CEO?',
    options: [
      {
        id: 'opt-e1',
        text: 'Send the wire right away to avoid angering the CEO during a board meeting.',
        isCorrect: false,
        explanation: 'Bypassing controls out of fear is exactly what attackers rely upon to steal millions in BEC scams.',
      },
      {
        id: 'opt-e2',
        text: 'Perform an out-of-band verbal verification using a pre-established, trusted phone number or require dual-signoff authorization.',
        isCorrect: true,
        explanation: 'Mandatory standard security control: Never transfer funds based on an email alone. Always perform out-of-band voice confirmation via a known phone number.',
      },
      {
        id: 'opt-e3',
        text: 'Reply to the email asking the sender to confirm their favorite sports team.',
        isCorrect: false,
        explanation: 'Casual email replies remain within the attacker\'s compromised channel.',
      },
      {
        id: 'opt-e4',
        text: 'Wait until the next day to see if the money is still needed.',
        isCorrect: false,
        explanation: 'Waiting does not verify authenticity; formal out-of-band verification is required.',
      }
    ],
    attackVectorExplained: 'Business Email Compromise (BEC) / CEO Fraud: BEC causes billions in losses annually. Attackers use social engineering, executive impersonation, and pressure to divert funds.',
    psychologicalTrigger: 'Authority Bias & Secrecy: Employees naturally defer to executive authority and hesitate to challenge orders marked "Strictly Confidential".',
    realWorldDefense: 'Enforce strict dual-custody authorization for all financial wires. Establish a strict policy that no wire is ever approved via email alone without verbal out-of-band voice verification.'
  }
];
