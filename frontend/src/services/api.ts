import { UrlScanResult, EmailScanResult, UrlComparisonResult } from '../types';
import { analyzeUrlLocally } from './urlAnalyzer';
import { analyzeEmailLocally } from './emailAnalyzer';
import { compareUrls } from './urlComparator';

const API_BASE = 'http://localhost:8000';

let isBackendAvailable: boolean | null = null;
let lastCheckTime = 0;

export async function checkBackendHealth(): Promise<{ online: boolean; details?: any }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    // Try direct backend port first, then relative path
    let res = await fetch(`${API_BASE}/api/health`, { signal: controller.signal }).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch('/api/health', { signal: controller.signal }).catch(() => null);
    }
    clearTimeout(timeoutId);
    
    if (res && res.ok) {
      const data = await res.json();
      isBackendAvailable = true;
      lastCheckTime = Date.now();
      return { online: true, details: data };
    }
  } catch {
    // Backend not responding
  }
  isBackendAvailable = false;
  return { online: false };
}

export async function scanUrl(url: string): Promise<{ result: UrlScanResult; source: 'fastapi' | 'browser' }> {
  // If backend is online or hasn't been checked recently, attempt backend endpoint
  if (isBackendAvailable || Date.now() - lastCheckTime > 30000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      let res = await fetch(`${API_BASE}/api/scan/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('/api/scan/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
          signal: controller.signal,
        }).catch(() => null);
      }
      clearTimeout(timeoutId);

      if (res && res.ok) {
        const data = await res.json();
        isBackendAvailable = true;
        return { result: data, source: 'fastapi' };
      }
    } catch {
      isBackendAvailable = false;
    }
  }

  // Standalone browser heuristic engine fallback
  const localResult = analyzeUrlLocally(url);
  return { result: localResult, source: 'browser' };
}

export async function scanEmail(subject: string, body: string, sender: string = ''): Promise<{ result: EmailScanResult; source: 'fastapi' | 'browser' }> {
  if (isBackendAvailable || Date.now() - lastCheckTime > 30000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      let res = await fetch(`${API_BASE}/api/scan/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, sender }),
        signal: controller.signal,
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('/api/scan/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, body, sender }),
          signal: controller.signal,
        }).catch(() => null);
      }
      clearTimeout(timeoutId);

      if (res && res.ok) {
        const data = await res.json();
        isBackendAvailable = true;
        return { result: data, source: 'fastapi' };
      }
    } catch {
      isBackendAvailable = false;
    }
  }

  const localResult = analyzeEmailLocally(subject, body, sender);
  return { result: localResult, source: 'browser' };
}

export async function compareTwoUrls(urlA: string, urlB: string): Promise<UrlComparisonResult> {
  return compareUrls(urlA, urlB);
}
