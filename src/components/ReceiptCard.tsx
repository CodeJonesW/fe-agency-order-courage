import { useState } from 'react';
import { createShareLink, recordQuestAction } from '../api';
import type { Receipt } from '../types';
import './ReceiptCard.css';

interface ReceiptCardProps {
  receipt: Receipt;
  onOpenReceipts?: () => void;
}

export function ReceiptCard({ receipt, onOpenReceipts }: ReceiptCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [actionText, setActionText] = useState('');
  const [savingAction, setSavingAction] = useState(false);
  const [savedAction, setSavedAction] = useState<string | null>(null);

  const typeColors = {
    agency: '#6b8e9f',
    courage: '#d4a574',
    order: '#8b6f7e',
  };

  const typeLabels = {
    agency: 'Agency',
    courage: 'Courage',
    order: 'Order',
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(receipt.shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareLink = async () => {
    try {
      setSharing(true);
      const { url } = await createShareLink(receipt.id);
      await navigator.clipboard.writeText(url);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to create share link:', err);
      alert('Failed to create share link. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const handleSaveAction = async () => {
    if (!actionText.trim()) {
      return;
    }

    try {
      setSavingAction(true);
      await recordQuestAction(receipt.questId, actionText.trim());
      setSavedAction(actionText.trim());
      setActionText('');
    } catch (err) {
      console.error('Failed to save action:', err);
      alert('Failed to save action. Please try again.');
    } finally {
      setSavingAction(false);
    }
  };

  // Use saved action if available, otherwise use receipt.action
  const displayedAction = savedAction || receipt.action;

  return (
    <div className={`receipt-card receipt-card--${receipt.tone}`}>
      <div className="receipt-card__scroll">
        <div className="receipt-card__badge" style={{ backgroundColor: typeColors[receipt.questType] }}>
          {typeLabels[receipt.questType]}
        </div>
        <div className="receipt-card__content">
          <h2 className="receipt-card__title">{receipt.title}</h2>
          <p className="receipt-card__line">{receipt.line}</p>
          <div className="receipt-card__share">
            <p className="receipt-card__share-text">{receipt.shareText}</p>
          </div>
        </div>
        {displayedAction && (
          <div className="receipt-card__recorded-action">
            <div className="receipt-card__recorded-action-label">What you did:</div>
            <div className="receipt-card__recorded-action-text">{displayedAction}</div>
          </div>
        )}
        {!displayedAction && (
          <div className="receipt-card__action-input">
            <label htmlFor="action-input" className="receipt-card__action-label">
              What did you do? (optional)
            </label>
            <textarea
              id="action-input"
              className="receipt-card__action-textarea"
              value={actionText}
              onChange={(e) => setActionText(e.target.value)}
              placeholder="Describe the action you took..."
              rows={3}
              disabled={savingAction}
            />
            <button
              className="receipt-card__button receipt-card__button--save-action"
              onClick={handleSaveAction}
              disabled={savingAction || !actionText.trim()}
            >
              {savingAction ? 'Saving...' : 'Save Action'}
            </button>
          </div>
        )}
        <div className="receipt-card__actions">
          <button
            className="receipt-card__button receipt-card__button--copy"
            onClick={handleCopy}
            aria-label="Copy share text"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            className="receipt-card__button receipt-card__button--share"
            onClick={handleShareLink}
            disabled={sharing}
            aria-label="Create share link"
          >
            {shareLinkCopied ? '✓ Link copied' : sharing ? 'Creating...' : 'Share link'}
          </button>
          {onOpenReceipts && (
            <button
              className="receipt-card__button receipt-card__button--receipts"
              onClick={onOpenReceipts}
            >
              Open Receipts
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
