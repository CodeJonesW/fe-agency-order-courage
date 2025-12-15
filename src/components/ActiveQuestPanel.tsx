import type { QuestCardDTO } from '../types';
import './ActiveQuestPanel.css';

interface ActiveQuestPanelProps {
  quest: QuestCardDTO;
  onComplete: (questId: string) => void;
  onAbandon: () => void;
  disabled?: boolean;
}

export function ActiveQuestPanel({
  quest,
  onComplete,
  onAbandon,
  disabled,
}: ActiveQuestPanelProps) {
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

  return (
    <div className="active-quest-panel">
      <div className="active-quest-panel__header">
        <div
          className="active-quest-panel__badge"
          style={{ backgroundColor: typeColors[quest.type] }}
        >
          {typeLabels[quest.type]}
        </div>
        <h2 className="active-quest-panel__title">Active Quest</h2>
      </div>
      <div className="active-quest-panel__content">
        <p className="active-quest-panel__context">{quest.context}</p>
        <div className="active-quest-panel__action">
          <strong>Action:</strong> {quest.realWorldAction}
        </div>
        <div className="active-quest-panel__constraint">
          <strong>Constraint:</strong> {quest.constraint}
        </div>
        {quest.reflection && (
          <div className="active-quest-panel__reflection">
            <em>{quest.reflection}</em>
          </div>
        )}
      </div>
      <div className="active-quest-panel__actions">
        <button
          className="active-quest-panel__button active-quest-panel__button--primary"
          onClick={() => onComplete(quest.id)}
          disabled={disabled}
        >
          I did it
        </button>
        <button
          className="active-quest-panel__button active-quest-panel__button--secondary"
          onClick={onAbandon}
          disabled={disabled}
        >
          Abandon
        </button>
      </div>
    </div>
  );
}
