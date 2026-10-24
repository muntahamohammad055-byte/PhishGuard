export interface DemoUrlSample {
  label: string;
  category: 'Phishing' | 'Suspicious' | 'Legitimate';
  url: string;
  description: string;
  expectedVerdict: 'High Risk' | 'Suspicious' | 'Low Risk';
}

export const SAMPLE_URLS: DemoUrlSample[] = [
  {
    label: 'PayPal Credential Harvest',
    category: 'Phishing',
    url: 'http://paypal-security-update.com.id834.xyz/auth/signin?token=92841',
    description: 'Combosquatting brand name in subdomain, .xyz suspicious TLD, plain HTTP.',
    expectedVerdict: 'High Risk',
  },
  {
    label: 'Direct IP Login Portal',
    category: 'Phishing',
    url: 'http://185.220.101.5:8080/secure/banking/login.php',
    description: 'Raw IP address host, non-standard port 8080, unencrypted HTTP.',
    expectedVerdict: 'High Risk',
  },
  {
    label: 'Deceptive At-Symbol Redirect',
    category: 'Phishing',
    url: 'http://google.com@auth-security-verification.top/session-restore',
    description: 'Credential @ trick obscuring actual landing domain (.top).',
    expectedVerdict: 'High Risk',
  },
  {
    label: 'Punycode Homoglyph Apple',
    category: 'Phishing',
    url: 'https://xn--appl-43d.com/support/appleid-recovery',
    description: 'Punycode IDN homoglyph using Cyrillic "а" instead of Latin "a".',
    expectedVerdict: 'High Risk',
  },
  {
    label: 'Masked URL Shortener',
    category: 'Suspicious',
    url: 'https://bit.ly/3kX9pLm',
    description: 'Shortened link that obscures the true destination address.',
    expectedVerdict: 'Suspicious',
  },
  {
    label: 'Legitimate Apple Official',
    category: 'Legitimate',
    url: 'https://www.apple.com/shop/buy-iphone',
    description: 'Genuine official corporate domain with valid HTTPS certificate.',
    expectedVerdict: 'Low Risk',
  },
  {
    label: 'Legitimate Microsoft Security',
    category: 'Legitimate',
    url: 'https://www.microsoft.com/en-us/security/business',
    description: 'Official verified enterprise domain with standard structure.',
    expectedVerdict: 'Low Risk',
  }
];

export interface DemoEmailSample {
  label: string;
  category: 'Phishing' | 'Suspicious' | 'Legitimate';
  sender: string;
  subject: string;
  body: string;
  description: string;
}

export const SAMPLE_EMAILS: DemoEmailSample[] = [
  {
    label: 'Geek Squad Renewal Scam',
    category: 'Phishing',
    sender: 'billing-alert@geeksquad-renewals-tech.online',
    subject: 'INVOICE #GS-99381: Your annual protection plan auto-renewed for $499.99',
    description: 'Bogus auto-renewal invoice demanding phone call or wire cancellation.',
    body: `Dear Customer,

Thank you for your continued patronage. This notification confirms that your annual Geek Squad Total Tech Care subscription has been automatically renewed for $499.99 today.

The fee has been debited directly from your checking account or credit card on file.

If you did not authorize this charge or wish to cancel your subscription and receive an immediate refund, you must contact our Billing Disputes Department immediately within 24 hours at +1-888-555-0199 or confirm your banking cancellation details at:
http://geek-squad-refunds-cancellation.xyz/dispute-charge

Do not delay, as charges become irreversible after 24 hours.

Best regards,
Geek Squad Billing Operations`,
  },
  {
    label: 'M365 Account Suspension Warning',
    category: 'Phishing',
    sender: 'admin@corporate-security-microsoft.net',
    subject: 'Urgent: Microsoft 365 Account Termination Notice - Action Required in 6 Hours',
    description: 'Extreme urgency, threat of account termination, SSO credential theft link.',
    body: `Dear User,

We detected multiple unauthorized login attempts on your Microsoft 365 / Corporate mailbox from an unrecognized device in Moscow, Russia.

Due to security compliance violations, your email access and OneDrive files will be permanently locked and terminated within 6 hours unless you verify your identity and confirm your password.

Click below to verify your credentials and retain access:
http://login.microsoftonline.com.account-verify-m365.biz/login.php

Please note: If this step is not completed immediately, your account will be deleted from the corporate directory.

Microsoft Cloud Security Center`,
  },
  {
    label: 'Payroll Direct Deposit Update',
    category: 'Phishing',
    sender: 'hr-payroll@staff-portal-secure.work',
    subject: 'Action Required: Verify Direct Deposit Banking Information for Q4 Payroll',
    description: 'HR impersonation harvesting bank routing numbers and SSN.',
    body: `Good morning,

Our payroll processing provider is conducting an annual audit of employee direct deposit accounts. To avoid any delay or withholding of your upcoming paycheck this Friday, all employees must log in and confirm their banking details, routing number, and Social Security Number.

Please update your direct deposit profile through the HR Employee Portal:
http://hr-employee-directdeposit.work/payroll/update

Failure to complete verification by 5:00 PM today will result in your paycheck being held until the next pay cycle.

Warm regards,
Payroll & Benefits Administration`,
  },
  {
    label: 'Legitimate Team Meeting Reminder',
    category: 'Legitimate',
    sender: 'calendar-notifications@company.com',
    subject: 'Reminder: Weekly Engineering Sync tomorrow at 10:00 AM',
    description: 'Authentic internal calendar invitation without urgency or credential traps.',
    body: `Hi Team,

This is a friendly reminder that our regular weekly engineering sync is scheduled for tomorrow at 10:00 AM PST.

Agenda:
1. Sprint review & release readiness
2. Review architecture documentation for Q4
3. Open floor Q&A

The Google Meet link is attached to your Google Calendar event. Feel free to add agenda topics to our shared team document beforehand.

See you tomorrow!
Alex Rivera, Engineering Manager`,
  }
];

export const URL_COMPARISON_PRESETS = [
  {
    title: 'PayPal: Official vs. Credential Harvester',
    legitUrl: 'https://www.paypal.com/signin',
    targetUrl: 'http://paypal-security-verification.com.id984.xyz/signin',
    description: 'Subdomain brand camouflage combined with .xyz TLD and unencrypted HTTP.',
  },
  {
    title: 'Apple ID: Official vs. IDN Homoglyph',
    legitUrl: 'https://appleid.apple.com/sign-in',
    targetUrl: 'https://xn--appl-43d.com/sign-in',
    description: 'Punycode attack substituting Latin "a" with Cyrillic lookalike "а".',
  },
  {
    title: 'Chase Banking: Official vs. Combosquatted Domain',
    legitUrl: 'https://www.chase.com/personal/banking',
    targetUrl: 'http://www.chase-online-account-security-check.com/banking',
    description: 'Chaining brand keywords with hyphens ("chase-online-account-security-check").',
  },
  {
    title: 'Google Accounts: Official vs. @-Symbol Redirection',
    legitUrl: 'https://accounts.google.com/signin',
    targetUrl: 'http://accounts.google.com@auth-server-redirect.top/signin',
    description: 'Authority trick: Browser ignores everything before the @ symbol and navigates to the attacker host.',
  }
];
