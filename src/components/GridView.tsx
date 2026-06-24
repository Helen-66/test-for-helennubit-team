import type { DiaryEntry } from '../types/diary';

interface GridViewProps {
  entries: DiaryEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function GridView({ entries, onEdit, onDelete }: GridViewProps) {
  return (
    <div className="grid-view">
      {entries.map((entry) => (
        <div key={entry.id} className="grid-card">
          <div className="grid-card__poster-wrap">
            {entry.posterPath ? (
              <img
                className="grid-card__poster"
                src={entry.posterPath}
                alt={entry.movieTitle}
              />
            ) : (
              <div className="grid-card__poster-placeholder">🎬</div>
            )}
            <div className="grid-card__overlay">
              <button type="button" className="btn btn--secondary" onClick={() => onEdit(entry.id)}>
                编辑
              </button>
              <button type="button" className="btn btn--danger" onClick={() => onDelete(entry.id)}>
                删除
              </button>
            </div>
          </div>
          <div className="grid-card__body">
            <h3 className="grid-card__title" title={entry.movieTitle}>{entry.movieTitle}</h3>
            <div className="grid-card__rating">
              {'★'.repeat(entry.rating)}
              {'☆'.repeat(5 - entry.rating)}
            </div>
            <span className="grid-card__date">{entry.watchDate}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
