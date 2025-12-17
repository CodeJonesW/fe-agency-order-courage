import { useState, useEffect } from 'react';
import { getReceipts } from '../api';
import type { Receipt } from '../types';
import './ReceiptsDrawer.css';

interface ReceiptsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptsDrawer({ isOpen, onClose }: ReceiptsDrawerProps) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadReceipts();
    }
  }, [isOpen]);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedReceipts = await getReceipts();
      setReceipts(fetchedReceipts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load receipts');
      console.error('Error fetching receipts:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="receipts-drawer-overlay" onClick={onClose}>
      <div className="receipts-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="receipts-drawer__header">
          <h2 className="receipts-drawer__title">Receipts</h2>
          <button className="receipts-drawer__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="receipts-drawer__content">
          {loading ? (
            <div className="receipts-drawer__loading">Loading receipts...</div>
          ) : error ? (
            <div className="receipts-drawer__error">Error: {error}</div>
          ) : receipts.length === 0 ? (
            <div className="receipts-drawer__empty">No receipts yet. Complete quests to earn receipts.</div>
          ) : (
            <div className="receipts-drawer__list">
              {receipts.map((receipt) => (
                <div key={receipt.id} className="receipts-drawer__item">
                  <div
                    className="receipts-drawer__item-header"
                    onClick={() => setExpandedId(expandedId === receipt.id ? null : receipt.id)}
                  >
                    <div className="receipts-drawer__item-badge" style={{ backgroundColor: typeColors[receipt.questType] }}>
                      {typeLabels[receipt.questType]}
                    </div>
                    <div className="receipts-drawer__item-info">
                      <h3 className="receipts-drawer__item-title">{receipt.title}</h3>
                      <p className="receipts-drawer__item-line">{receipt.line}</p>
                    </div>
                    <div className="receipts-drawer__item-date">
                      {new Date(receipt.createdAtMs).toLocaleDateString()}
                    </div>
                  </div>
                  {expandedId === receipt.id && (
                    <div className="receipts-drawer__item-expanded">
                      <div className="receipts-drawer__item-share">
                        <p className="receipts-drawer__item-share-text">{receipt.shareText}</p>
                      </div>
                      {receipt.action && (
                        <div className="receipts-drawer__item-action">
                          <div className="receipts-drawer__item-action-label">What you did:</div>
                          <div className="receipts-drawer__item-action-text">{receipt.action}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
