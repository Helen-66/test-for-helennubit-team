import type { DiaryEntry } from '../types/diary';
import ReactMarkdown from 'react-markdown';

interface TimelineViewProps {
  entries: DiaryEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function groupByDate(entries: DiaryEntry[]): Map<string, DiaryEntry[]> {
  const map = new Map<string, DiaryEntry[]>();
  for (const entry of entries) {
    const date = entry.watchDate;
    const group = map.get(date);
    if (group) {
      group.push(entry);
    } else {
      map.set(date, [entry]);
    }
  }
  return map;
}

export default function TimelineView({ entries, onEdit, onDelete }: TimelineViewProps) {
  const groups = groupByDate(entries);

  return (
    <div className="timeline-view">
      {Array.from(groups.entries()).map(([date, items]) => (
        <div key={date} className="timeline-group">
          <div className="timeline-group__date">
            <span className="timeline-group__dot" />
            <span>{date}</span>
          </div>
          <div className="timeline-group__entries">
            {items.map((entry) => (
              <div key={entry.id} className="timeline-card">
                <div className="timeline-card__header">
                  {entry.posterPath && (
                    <img
                      className="timeline-card__poster"
                      src={entry.posterPath}
                      alt={entry.movieTitle}
                    />
                  )}
                  <div className="timeline-card__info">
                    <h3 className="timeline-card__title">{entry.movieTitle}</h3>
                    <div className="timeline-card__rating">
                      {'★'.repeat(entry.rating)}
                      {'☆'.repeat(5 - entry.rating)}
                    </div>
                    {entry.mood && <span className="timeline-card__mood">💭 {entry.mood}</span>}
                  </div>
                </div>
                {entry.tags.length > 0 && (
                  <div className="timeline-card__tags">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="timeline-card__tag">{tag}</span>
                    ))}
                  </div>
                )}
                {entry.review && (
                  <div className="timeline-card__review">
                    <ReactMarkdown>{entry.review}</ReactMarkdown>
                  </div>
                )}
                <div className="timeline-card__actions">
                  <button type="button" className="btn btn--secondary" onClick={() => onEdit(entry.id)}>
                    编辑
                  </button>
                  <button type="button" className="btn btn--danger" onClick={() => onDelete(entry.id)}>
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
