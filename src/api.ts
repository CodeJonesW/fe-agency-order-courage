/**
 * API client for backend communication.
 * Uses environment-based API URLs (proxy in dev, direct in prod).
 */

import { getApiBaseUrl } from './config';
import type {
  StateResponse,
  QuestsResponse,
  QuestActionResponse,
  QuestCardDTO,
  ReceiptsResponse,
  Receipt,
} from './types';

/**
 * Fetches current player state.
 */
export async function getState(): Promise<StateResponse> {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/state`, {
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
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/quests`, {
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
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/quests/${questId}/start`, {
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
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/quests/${questId}/complete`, {
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

/**
 * Fetches all receipts.
 */
export async function getReceipts(): Promise<Receipt[]> {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/receipts`, {
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch receipts: ${response.statusText}`);
  }

  const data: ReceiptsResponse = await response.json();
  return data.receipts;
}

/**
 * Creates a share link for a receipt.
 */
export async function createShareLink(receiptId: string): Promise<{ url: string; token: string }> {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/receipts/${receiptId}/share`, {
    method: 'POST',
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create share link: ${response.statusText}`);
  }

  return response.json();
}
