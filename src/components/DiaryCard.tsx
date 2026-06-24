import { useState, useEffect } from 'react';
import type { DiaryEntry, Tag } from '../types/diary';
import { getAllTags } from '../services/tagStorage';
import ReactMarkdown from 'react-markdown';
import FavoriteButton from './FavoriteButton';

interface DiaryCardProps {
  entry: DiaryEntry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function DiaryCard({ entry, onEdit, onDelete, onToggleFavorite }: DiaryCardProps) {
  const [tagsMap, setTagsMap] = useState<Record<string, Tag>>({});

  useEffect(() => {
    const tags = getAllTags();
    const map: Record<string, Tag> = {};
    for (const t of tags) map[t.name] = t;
    setTagsMap(map);
  }, []);

  return (
    <div className="diary-card">
      <div className="diary-card__header">
        {entry.posterPath && (
          <img
            className="diary-card__poster"
            src={entry.posterPath}
            alt={entry.movieTitle}
          />
        )}
        <div className="diary-card__info">
          <div className="diary-card__title-row">
            <h3 className="diary-card__title">{entry.movieTitle}</h3>
            <FavoriteButton
              isFavorite={entry.isFavorite}
              onClick={() => onToggleFavorite(entry.id)}
            />
          </div>
          <div className="diary-card__rating">
            {'★'.repeat(entry.rating)}
            {'☆'.repeat(5 - entry.rating)}
          </div>
          <span className="diary-card__date">📅 {entry.watchDate}</span>
          {entry.mood && <span className="diary-card__mood">💭 {entry.mood}</span>}
        </div>
      </div>
      {entry.tags.length > 0 && (
        <div className="diary-card__tags">
          {entry.tags.map((tag) => {
            const tagData = tagsMap[tag];
            return (
              <span
                key={tag}
                className="diary-card__tag"
                style={
                  tagData
                    ? { borderColor: tagData.color, color: tagData.color }
                    : undefined
                }
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}
      {entry.review && (
        <div className="diary-card__review">
          <ReactMarkdown>{entry.review}</ReactMarkdown>
        </div>
      )}
      <div className="diary-card__actions">
        <button type="button" className="btn btn--secondary" onClick={() => onEdit(entry.id)}>
          编辑
        </button>
        <button type="button" className="btn btn--danger" onClick={() => onDelete(entry.id)}>
          删除
        </button>
      </div>
    </div>
  );
}
