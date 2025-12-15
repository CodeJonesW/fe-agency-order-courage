/**
 * Type definitions matching the backend API.
 */

export type QuestType = 'agency' | 'courage' | 'order';

export type NarrativeTone = 'calm' | 'warm' | 'firm';

export interface QuestCardDTO {
  id: string;
  type: QuestType;
  context: string;
  realWorldAction: string;
  constraint: string;
  reflection?: string;
}

export interface NarrativeSummary {
  tone: NarrativeTone;
  title: string;
  line: string;
  shareText?: string;
}

export interface StateResponse {
  state: {
    stats: { agency: number; courage: number; order: number };
    flags: string[];
    timeContext: {
      range: 'recent' | 'gap' | 'long_gap';
      nowMs: number;
      lastMeaningfulActionMs?: number;
    };
  };
}

export interface QuestsResponse {
  quests: QuestCardDTO[];
}

export interface Receipt {
  id: string;
  createdAtMs: number;
  questId: string;
  questType: QuestType;
  tone: NarrativeTone;
  title: string;
  line: string;
  shareText: string;
}

export interface QuestActionResponse {
  state: StateResponse['state'];
  events: unknown[];
  narrative: NarrativeSummary | null;
  receipt?: Receipt;
}

export interface ReceiptsResponse {
  receipts: Receipt[];
}
