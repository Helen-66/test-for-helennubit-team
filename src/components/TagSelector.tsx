import { useState, useEffect } from 'react';
import type { Tag } from '../types/diary';
import { getAllTags } from '../services/tagStorage';

interface TagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function TagSelector({ value, onChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setTags(getAllTags());
  }, []);

  const toggle = (tagName: string) => {
    onChange(
      value.includes(tagName) ? value.filter((t) => t !== tagName) : [...value, tagName],
    );
  };

  return (
    <div className="tag-selector">
      <span className="tag-selector__label">标签</span>
      <div className="tag-selector__options">
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            className={`tag-chip ${value.includes(tag.name) ? 'tag-chip--active' : ''}`}
            style={
              value.includes(tag.name)
                ? { background: tag.color, borderColor: tag.color, color: '#fff' }
                : { borderColor: tag.color, color: tag.color }
            }
            onClick={() => toggle(tag.name)}
          >
            {tag.name}
          </button>
        ))}
        {tags.length === 0 && (
          <span className="tag-selector__hint">请先在标签管理中创建标签</span>
        )}
      </div>
    </div>
  );
}
