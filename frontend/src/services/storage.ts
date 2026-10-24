import { ScanHistoryItem } from '../types';

const STORAGE_KEY_HISTORY = 'phishguard_scan_history_v1';
const STORAGE_KEY_AWARENESS = 'phishguard_awareness_scores_v1';

// Initial realistic default scans to populate dashboard gracefully on first run
const INITIAL_DEMO_HISTORY: ScanHistoryItem[] = [
  {
    id: 'demo-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    type: 'url',
    target: 'http://paypal-security-update.com.id834.xyz/auth/signin',
    riskScore: 92,
    riskLevel: 'high',
    verdict: 'High Risk',
    primaryThreat: 'Brand Impersonation & Suspicious TLD (.xyz)',
    indicatorCount: 5,
  },
  {
    id: 'demo-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'email',
    target: 'Urgent: Your Chase Banking Access has been Suspended',
    riskScore: 88,
    riskLevel: 'high',
    verdict: 'High Risk',
    primaryThreat: 'Urgency Pressure & Credential Harvesting Request',
    indicatorCount: 4,
  },
  {
    id: 'demo-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    type: 'url',
    target: 'https://www.microsoft.com/en-us/security',
    riskScore: 5,
    riskLevel: 'low',
    verdict: 'Low Risk',
    primaryThreat: 'Verified Enterprise Domain & HTTPS',
    indicatorCount: 0,
  },
  {
    id: 'demo-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    type: 'url',
    target: 'http://185.220.101.5/login.html?session=token',
    riskScore: 95,
    riskLevel: 'high',
    verdict: 'High Risk',
    primaryThreat: 'Direct IP Hostname & Plain HTTP Connection',
    indicatorCount: 4,
  },
  {
    id: 'demo-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    type: 'url',
    target: 'https://bit.ly/3x8K9mQ',
    riskScore: 42,
    riskLevel: 'suspicious',
    verdict: 'Suspicious',
    primaryThreat: 'Masked URL Redirection Shortener',
    indicatorCount: 2,
  },
  {
    id: 'demo-6',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    type: 'email',
    target: 'Internal Q3 Company All-Hands Presentation Slide Deck',
    riskScore: 12,
    riskLevel: 'low',
    verdict: 'Low Risk',
    primaryThreat: 'Standard Corporate Internal Communication',
    indicatorCount: 0,
  }
];

export function getScanHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(INITIAL_DEMO_HISTORY));
      return INITIAL_DEMO_HISTORY;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_HISTORY;
  }
}

export function saveScanHistoryItem(item: ScanHistoryItem): ScanHistoryItem[] {
  try {
    const existing = getScanHistory();
    // Add to top, limit to 100 items
    const updated = [item, ...existing.filter(i => i.id !== item.id)].slice(0, 100);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save to localStorage', e);
    return [];
  }
}

export function deleteScanHistoryItem(id: string): ScanHistoryItem[] {
  try {
    const existing = getScanHistory();
    const updated = existing.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearScanHistory(): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}

export interface AwarenessProgress {
  completedScenarioIds: string[];
  userScoreSum: number;
  totalQuestionsAttempted: number;
  highestBadge: string;
}

export function getAwarenessProgress(): AwarenessProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AWARENESS);
    if (!raw) {
      return {
        completedScenarioIds: [],
        userScoreSum: 0,
        totalQuestionsAttempted: 0,
        highestBadge: 'Cyber Cadet',
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      completedScenarioIds: [],
      userScoreSum: 0,
      totalQuestionsAttempted: 0,
      highestBadge: 'Cyber Cadet',
    };
  }
}

export function saveAwarenessProgress(progress: AwarenessProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY_AWARENESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save awareness progress', e);
  }
}
