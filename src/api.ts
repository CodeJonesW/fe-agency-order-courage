/**
 * API client for backend communication.
 * Uses relative URLs (same origin) with Vite proxy.
 */

import type {
  StateResponse,
  QuestsResponse,
  QuestActionResponse,
  QuestCardDTO,
} from './types';

/**
 * Fetches current player state.
 */
export async function getState(): Promise<StateResponse> {
  const response = await fetch('/api/state', {
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch state: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches available quests.
 */
export async function getQuests(): Promise<QuestCardDTO[]> {
  const response = await fetch('/api/quests', {
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quests: ${response.statusText}`);
  }

  const data: QuestsResponse = await response.json();
  return data.quests;
}

/**
 * Starts a quest.
 */
export async function startQuest(
  questId: string
): Promise<QuestActionResponse> {
  const response = await fetch(`/api/quests/${questId}/start`, {
    method: 'POST',
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to start quest: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Completes a quest.
 */
export async function completeQuest(
  questId: string
): Promise<QuestActionResponse> {
  const response = await fetch(`/api/quests/${questId}/complete`, {
    method: 'POST',
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to complete quest: ${response.statusText}`);
  }

  return response.json();
}
