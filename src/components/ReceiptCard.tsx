import { useState } from 'react';
import type { Receipt } from '../types';
import './ReceiptCard.css';

interface ReceiptCardProps {
  receipt: Receipt;
  onOpenReceipts?: () => void;
}

export function ReceiptCard({ receipt, onOpenReceipts }: ReceiptCardProps) {
  const [copied, setCopied] = useState(false);

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
        <div className="receipt-card__actions">
          <button
            className="receipt-card__button receipt-card__button--copy"
            onClick={handleCopy}
            aria-label="Copy share text"
          >
            {copied ? '✓ Copied' : 'Copy'}
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
