import { useState } from 'react';
import type { NarrativeSummary } from '../types';
import './NarrativeBox.css';

interface NarrativeBoxProps {
  narrative?: NarrativeSummary | null;
  defaultMessage?: string;
}

export function NarrativeBox({
  narrative,
  defaultMessage = "Nothing urgent. Return when ready.",
}: NarrativeBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (narrative?.shareText) {
      try {
        await navigator.clipboard.writeText(narrative.shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const displayNarrative = narrative || {
    tone: 'calm' as const,
    title: '',
    line: defaultMessage,
  };

  return (
    <div className={`narrative-box narrative-box--${displayNarrative.tone}`}>
      <div className="narrative-box__content">
        {displayNarrative.title && (
          <h2 className="narrative-box__title">{displayNarrative.title}</h2>
        )}
        <p className="narrative-box__line">{displayNarrative.line}</p>
      </div>
      {narrative?.shareText && (
        <button
          className="narrative-box__copy"
          onClick={handleCopy}
          aria-label="Copy share text"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      )}
    </div>
  );
}
