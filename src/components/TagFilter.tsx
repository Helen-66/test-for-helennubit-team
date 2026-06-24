import { useState, useEffect } from 'react';
import type { Tag } from '../types/diary';
import { getAllTags } from '../services/tagStorage';

interface TagFilterProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagFilter({ selectedTags, onChange }: TagFilterProps) {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setTags(getAllTags());
  }, []);

  const toggle = (tagName: string) => {
    onChange(
      selectedTags.includes(tagName)
        ? selectedTags.filter((t) => t !== tagName)
        : [...selectedTags, tagName],
    );
  };

  if (tags.length === 0) return null;

  return (
    <div className="tag-filter">
      <span className="tag-filter__label">按标签筛选：</span>
      <div className="tag-filter__options">
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            className={`tag-chip ${selectedTags.includes(tag.name) ? 'tag-chip--active' : ''}`}
            style={
              selectedTags.includes(tag.name)
                ? { background: tag.color, borderColor: tag.color, color: '#fff' }
                : { borderColor: tag.color, color: tag.color }
            }
            onClick={() => toggle(tag.name)}
          >
            {tag.name}
          </button>
        ))}
        {selectedTags.length > 0 && (
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => onChange([])}
          >
            清除筛选
          </button>
        )}
      </div>
    </div>
  );
}
