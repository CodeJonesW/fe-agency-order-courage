import type { QuestCardDTO } from '../types';
import './QuestCard.css';

interface QuestCardProps {
  quest: QuestCardDTO;
  onStart: (questId: string) => void;
  disabled?: boolean;
}

export function QuestCard({ quest, onStart, disabled }: QuestCardProps) {
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
    <div className="quest-card">
      <div
        className="quest-card__badge"
        style={{ backgroundColor: typeColors[quest.type] }}
      >
        {typeLabels[quest.type]}
      </div>
      <div className="quest-card__content">
        <p className="quest-card__context">{quest.context}</p>
        <div className="quest-card__action">
          <strong>Action:</strong> {quest.realWorldAction}
        </div>
        <div className="quest-card__constraint">
          <strong>Constraint:</strong> {quest.constraint}
        </div>
        {quest.reflection && (
          <div className="quest-card__reflection">
            <em>{quest.reflection}</em>
          </div>
        )}
      </div>
      <button
        className="quest-card__button"
        onClick={() => onStart(quest.id)}
        disabled={disabled}
      >
        Start
      </button>
    </div>
  );
}
