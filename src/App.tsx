import { useState, useEffect } from 'react';
import { getQuests, startQuest, completeQuest, getReceipts } from './api';
import { NarrativeBox } from './components/NarrativeBox';
import { QuestCard } from './components/QuestCard';
import { ActiveQuestPanel } from './components/ActiveQuestPanel';
import { ReceiptCard } from './components/ReceiptCard';
import { ReceiptsDrawer } from './components/ReceiptsDrawer';
import type { QuestCardDTO, NarrativeSummary, Receipt } from './types';
import './App.css';

function App() {
  const [quests, setQuests] = useState<QuestCardDTO[]>([]);
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [narrative, setNarrative] = useState<NarrativeSummary | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  console.log('receipts', receipts);
  const [latestReceipt, setLatestReceipt] = useState<Receipt | null>(null);
  const [receiptsDrawerOpen, setReceiptsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [fetchedQuests, fetchedReceipts] = await Promise.all([
          getQuests(),
          getReceipts().catch(() => []), // Don't fail if receipts fail
        ]);
        setQuests(fetchedQuests);
        setReceipts(fetchedReceipts.slice(0, 50)); // Cap at 50 client-side
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quests');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleStartQuest = async (questId: string) => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await startQuest(questId);
      setActiveQuestId(questId);
      setNarrative(response.narrative);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start quest');
      console.error('Error starting quest:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteQuest = async (questId: string) => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await completeQuest(questId);
      setActiveQuestId(null);
      setNarrative(response.narrative);
      
      // Handle receipt
      if (response.receipt) {
        setLatestReceipt(response.receipt);
        // Prepend new receipt, dedupe by id, cap at 50
        setReceipts((prev) => {
          const filtered = prev.filter((r) => r.id !== response.receipt!.id);
          return [response.receipt!, ...filtered].slice(0, 50);
        });
      }
      
      // Refetch quests after completion
      const fetchedQuests = await getQuests();
      setQuests(fetchedQuests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete quest');
      console.error('Error completing quest:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAbandonQuest = () => {
    setActiveQuestId(null);
  };

  const activeQuest = activeQuestId
    ? quests.find((q) => q.id === activeQuestId)
    : null;

  const availableQuests = quests.filter((q) => q.id !== activeQuestId);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Game 1</h1>
        <button
          className="app__receipts-button"
          onClick={() => setReceiptsDrawerOpen(true)}
          aria-label="Open receipts"
        >
          Receipts
        </button>
      </header>
      <main className="app__main">
        <NarrativeBox narrative={narrative} />
        {latestReceipt && (
          <ReceiptCard
            receipt={latestReceipt}
            onOpenReceipts={() => setReceiptsDrawerOpen(true)}
          />
        )}
        {error && <div className="app__error">Error: {error}</div>}
        {loading ? (
          <div className="app__loading">Loading...</div>
        ) : (
          <>
            {activeQuest && (
              <ActiveQuestPanel
                quest={activeQuest}
                onComplete={handleCompleteQuest}
                onAbandon={handleAbandonQuest}
                disabled={actionLoading}
              />
            )}
            {availableQuests.length > 0 ? (
              <div className="app__quests">
                <h2 className="app__quests-title">Available Quests</h2>
                {availableQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onStart={handleStartQuest}
                    disabled={actionLoading || activeQuestId !== null}
                  />
                ))}
              </div>
            ) : (
              !activeQuest && (
                <div className="app__no-quests">
                  No quests available at this time.
                </div>
              )
            )}
          </>
        )}
      </main>
      <ReceiptsDrawer
        isOpen={receiptsDrawerOpen}
        onClose={() => setReceiptsDrawerOpen(false)}
      />
    </div>
  );
}

export default App;
