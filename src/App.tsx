import { useState, useEffect } from 'react';
import { getQuests, startQuest, completeQuest } from './api';
import { NarrativeBox } from './components/NarrativeBox';
import { QuestCard } from './components/QuestCard';
import { ActiveQuestPanel } from './components/ActiveQuestPanel';
import type { QuestCardDTO, NarrativeSummary } from './types';
import './App.css';

function App() {
  const [quests, setQuests] = useState<QuestCardDTO[]>([]);
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [narrative, setNarrative] = useState<NarrativeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const fetchedQuests = await getQuests();
        setQuests(fetchedQuests);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quests');
        console.error('Error fetching quests:', err);
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
      </header>
      <main className="app__main">
        <NarrativeBox narrative={narrative} />
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
    </div>
  );
}

export default App;
