import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { ChallengeList } from './components/challenge/ChallengeList';
import { ChallengeDetail } from './components/challenge/ChallengeDetail';
import { CreateChallengeModal } from './components/challenge/CreateChallengeModal';
import { getChallenges, createChallenge, SCRIPT_URL } from './api/sheetsApi';
import type { Challenge } from './types/challenge';
import './App.css';

function AppContent() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const isConfigured = SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL_HERE';

  const fetchChallenges = useCallback(async () => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getChallenges();
      setChallenges(data);
    } catch (err) {
      setError('Could not load challenges. Check your internet connection or Apps Script configuration.');
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  async function handleCreate(title: string, duration: number) {
    const challenge = await createChallenge(title, duration);
    setChallenges(prev => [...prev, challenge]);
  }

  function handleUpdate(updated: Challenge) {
    setChallenges(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  function handleDelete(id: string) {
    setChallenges(prev => prev.filter(c => c.id !== id));
    setSelectedId(null);
  }

  const selected = selectedId ? challenges.find(c => c.id === selectedId) ?? null : null;

  if (!isConfigured) {
    return (
      <Layout>
        <div className="setup-banner">
          <div className="setup-banner__icon">⚙️</div>
          <h2 className="setup-banner__title">Setup Required</h2>
          <p className="setup-banner__text">
            To get started, deploy the Google Apps Script and paste the deployment URL into{' '}
            <code>src/api/sheetsApi.ts</code>.
          </p>
          <div className="setup-banner__steps">
            <ol>
              <li>Open your Google Sheet and go to <strong>Extensions &gt; Apps Script</strong></li>
              <li>Paste the contents of <code>google-apps-script/Code.gs</code></li>
              <li>Click <strong>Deploy &gt; New deployment</strong> (Web app, Anyone)</li>
              <li>Copy the URL and replace <code>YOUR_APPS_SCRIPT_URL_HERE</code> in <code>src/api/sheetsApi.ts</code></li>
              <li>Restart the dev server</li>
            </ol>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {selected ? (
        <ChallengeDetail
          challenge={selected}
          onBack={() => setSelectedId(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ) : (
        <ChallengeList
          challenges={challenges}
          loading={loading}
          error={error}
          onSelect={setSelectedId}
          onNewChallenge={() => setShowCreate(true)}
          onRetry={fetchChallenges}
        />
      )}

      {showCreate && (
        <CreateChallengeModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
