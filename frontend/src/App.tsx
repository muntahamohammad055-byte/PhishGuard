import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { UrlScannerView } from './components/UrlScannerView';
import { EmailAnalyzerView } from './components/EmailAnalyzerView';
import { AwarenessLabView } from './components/AwarenessLabView';
import { UrlComparisonView } from './components/UrlComparisonView';
import { ScanHistoryView } from './components/ScanHistoryView';
import { SecurityGuidesView } from './components/SecurityGuidesView';
import { SettingsView } from './components/SettingsView';
import { ScanDetailModal } from './components/ScanDetailModal';
import { UrlScanResult, EmailScanResult, ScanHistoryItem } from './types';
import { getScanHistory, saveScanHistoryItem } from './services/storage';
import { checkBackendHealth } from './services/api';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<ScanHistoryItem[]>(getScanHistory());
  const [selectedScanItem, setSelectedScanItem] = useState<ScanHistoryItem | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [prefilledUrl, setPrefilledUrl] = useState<string>('');

  // Check FastAPI backend availability on startup
  const refreshBackendStatus = async () => {
    const health = await checkBackendHealth();
    setBackendOnline(health.online);
  };

  useEffect(() => {
    refreshBackendStatus();
    const interval = setInterval(refreshBackendStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle new URL scan completion
  const handleUrlScanComplete = (res: UrlScanResult) => {
    const historyItem: ScanHistoryItem = {
      id: res.id,
      timestamp: res.timestamp,
      type: 'url',
      target: res.target,
      riskScore: res.riskScore,
      riskLevel: res.riskLevel,
      verdict: res.verdict,
      primaryThreat: res.indicators[0]?.title || 'Standard Domain Protocol',
      indicatorCount: res.indicators.length,
      urlResult: res,
    };
    const updated = saveScanHistoryItem(historyItem);
    setHistory(updated);
  };

  // Handle new Email scan completion
  const handleEmailScanComplete = (res: EmailScanResult) => {
    const historyItem: ScanHistoryItem = {
      id: res.id,
      timestamp: res.timestamp,
      type: 'email',
      target: res.subject || res.bodyPreview.slice(0, 40),
      riskScore: res.riskScore,
      riskLevel: res.riskLevel,
      verdict: res.verdict,
      primaryThreat: res.indicators[0]?.title || 'Boilerplate Format',
      indicatorCount: res.indicators.length,
      emailResult: res,
    };
    const updated = saveScanHistoryItem(historyItem);
    setHistory(updated);
  };

  const handleQuickUrlScan = (sampleUrl?: string) => {
    if (sampleUrl) {
      setPrefilledUrl(sampleUrl);
    }
    setCurrentTab('url-scanner');
  };

  return (
    <div className="flex min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        backendOnline={backendOnline}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          onQuickScan={() => handleQuickUrlScan()}
          onSelectTab={setCurrentTab}
          backendOnline={backendOnline}
        />

        {/* View Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              history={history}
              onSelectTab={setCurrentTab}
              onOpenScanDetail={setSelectedScanItem}
              onQuickUrlScan={handleQuickUrlScan}
              onQuickEmailScan={() => setCurrentTab('email-analyzer')}
            />
          )}

          {currentTab === 'url-scanner' && (
            <UrlScannerView
              onScanComplete={handleUrlScanComplete}
              initialUrl={prefilledUrl}
            />
          )}

          {currentTab === 'email-analyzer' && (
            <EmailAnalyzerView
              onScanComplete={handleEmailScanComplete}
            />
          )}

          {currentTab === 'awareness-lab' && (
            <AwarenessLabView />
          )}

          {currentTab === 'url-comparison' && (
            <UrlComparisonView />
          )}

          {currentTab === 'history' && (
            <ScanHistoryView
              history={history}
              onHistoryChange={setHistory}
              onOpenDetail={setSelectedScanItem}
            />
          )}

          {currentTab === 'guides' && (
            <SecurityGuidesView />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              backendOnline={backendOnline}
              onRefreshBackend={refreshBackendStatus}
            />
          )}
        </main>
      </div>

      {/* Scan Detail Modal */}
      <ScanDetailModal
        item={selectedScanItem}
        onClose={() => setSelectedScanItem(null)}
      />
    </div>
  );
}

export default App;
