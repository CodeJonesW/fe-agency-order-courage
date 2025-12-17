/**
 * API client for backend communication.
 * Uses environment-based API URLs (proxy in dev, direct in prod).
 * 
 * Includes localStorage fallback for playerId (mobile Safari blocks third-party cookies).
 */

import { getApiBaseUrl } from './config';
import type {
  StateResponse,
  QuestsResponse,
  QuestActionResponse,
  ReceiptsResponse,
  Receipt,
} from './types';

const PLAYER_ID_KEY = 'playerId';

/**
 * Gets playerId from localStorage (fallback for when cookies don't work).
 */
function getPlayerIdFromStorage(): string | null {
  try {
    const playerId = localStorage.getItem(PLAYER_ID_KEY);
    if (playerId) {
      // Verify localStorage is working by checking we can read what we wrote
      return playerId;
    }
    return null;
  } catch (error) {
    // localStorage might be disabled (private browsing, etc.)
    console.warn('[PlayerId] localStorage not available:', error);
    return null;
  }
}

/**
 * Stores playerId in localStorage (fallback for when cookies don't work).
 */
function setPlayerIdInStorage(playerId: string): void {
  try {
    localStorage.setItem(PLAYER_ID_KEY, playerId);
    // Verify it was stored correctly
    const stored = localStorage.getItem(PLAYER_ID_KEY);
    if (stored !== playerId) {
      console.warn('[PlayerId] Failed to store playerId in localStorage');
    }
  } catch (error) {
    // localStorage might be disabled (private browsing, etc.)
    console.warn('[PlayerId] Failed to store playerId in localStorage:', error);
  }
}

/**
 * Creates headers with playerId if available (for mobile browsers where cookies may not persist).
 * Always sends playerId header as a fallback, even if cookies might work.
 */
function createHeaders(additionalHeaders?: Record<string, string>): HeadersInit {
  const headers: HeadersInit = {
    ...additionalHeaders,
  };
  
  // Always send playerId from localStorage as a fallback
  // This ensures persistence even if cookies are blocked or cleared
  const playerId = getPlayerIdFromStorage();
  if (playerId) {
    headers['X-Player-Id'] = playerId;
  }
  
  return headers;
}

/**
 * Extracts and stores playerId from response if present.
 * This ensures localStorage is always kept in sync with the backend.
 */
function handlePlayerIdResponse(data: any): void {
  if (data && typeof data.playerId === 'string') {
    // Always update localStorage with the playerId from the backend
    // This ensures we have the correct ID even if cookies aren't working
    const existingId = getPlayerIdFromStorage();
    if (existingId !== data.playerId) {
      // Only log if there's a mismatch (helps debug)
      if (existingId) {
        console.log('[PlayerId] Updating localStorage playerId:', data.playerId);
      } else {
        console.log('[PlayerId] Storing new playerId in localStorage:', data.playerId);
      }
    }
    setPlayerIdInStorage(data.playerId);
  }
}

/**
 * Fetches current player state.
 */
export async function getState(): Promise<StateResponse> {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/state`, {
    credentials: 'include', // Include cookies
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch state: ${response.statusText}`);
  }

  const data = await response.json();
  handlePlayerIdResponse(data);
  return data;
}

/**
 * Fetches available quests.
 */
export async function getQuests(): Promise<QuestsResponse> {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/quests`, {
    credentials: 'include', // Include cookies
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quests: ${response.statusText}`);
  }

  const data: QuestsResponse = await response.json();
  handlePlayerIdResponse(data);
  return data;
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
    headers: createHeaders({
      'Content-Type': 'application/json',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start quest: ${response.statusText}`);
  }

  const data = await response.json();
  handlePlayerIdResponse(data);
  return data;
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
    headers: createHeaders({
      'Content-Type': 'application/json',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to complete quest: ${response.statusText}`);
  }

  const data = await response.json();
  handlePlayerIdResponse(data);
  return data;
}

/**
 * Fetches all receipts.
 */
export async function getReceipts(): Promise<Receipt[]> {
  const apiBase = getApiBaseUrl();
  const response = await fetch(`${apiBase}/api/receipts`, {
    credentials: 'include', // Include cookies
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch receipts: ${response.statusText}`);
  }

  const data: ReceiptsResponse = await response.json();
  handlePlayerIdResponse(data);
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
    headers: createHeaders({
      'Content-Type': 'application/json',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create share link: ${response.statusText}`);
  }

  const data = await response.json();
  handlePlayerIdResponse(data);
  return data;
}
