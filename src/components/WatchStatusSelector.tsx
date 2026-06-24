import type { WatchStatus } from '../types/diary';

const STATUS_OPTIONS: { value: WatchStatus; label: string; icon: string }[] = [
  { value: '想看', label: '想看', icon: '👀' },
  { value: '在看', label: '在看', icon: '▶️' },
  { value: '已看', label: '已看', icon: '✅' },
];

interface WatchStatusSelectorProps {
  value: WatchStatus;
  onChange: (status: WatchStatus) => void;
}

export default function WatchStatusSelector({ value, onChange }: WatchStatusSelectorProps) {
  return (
    <div className="watch-status-selector">
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`watch-status-chip ${value === opt.value ? 'watch-status-chip--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}
