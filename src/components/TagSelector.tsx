import { TAG_OPTIONS } from '../types/diary';

interface TagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function TagSelector({ value, onChange }: TagSelectorProps) {
  const toggle = (tag: string) => {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);
  };

  return (
    <div className="tag-selector">
      <span className="tag-selector__label">标签</span>
      <div className="tag-selector__options">
        {TAG_OPTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`tag-chip ${value.includes(tag) ? 'tag-chip--active' : ''}`}
            onClick={() => toggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
