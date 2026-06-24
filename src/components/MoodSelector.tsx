import { MOOD_OPTIONS } from '../types/diary';

interface MoodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="mood-selector">
      <span className="mood-selector__label">心情</span>
      <div className="mood-selector__options">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood}
            type="button"
            className={`mood-chip ${value === mood ? 'mood-chip--active' : ''}`}
            onClick={() => onChange(value === mood ? '' : mood)}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}
