import type { DiaryEntry } from '../types/diary';
import ReactMarkdown from 'react-markdown';
import LazyImage from './LazyImage';

interface DiaryCardProps {
  entry: DiaryEntry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DiaryCard({ entry, onEdit, onDelete }: DiaryCardProps) {
  return (
    <div className="diary-card">
      <div className="diary-card__header">
        {entry.posterPath && (
          <LazyImage
            className="diary-card__poster"
            src={entry.posterPath}
            alt={entry.movieTitle}
            width={60}
            height={90}
          />
        )}
        <div className="diary-card__info">
          <h3 className="diary-card__title">{entry.movieTitle}</h3>
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
          {entry.tags.map((tag) => (
            <span key={tag} className="diary-card__tag">
              {tag}
            </span>
          ))}
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
