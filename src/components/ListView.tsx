import type { DiaryEntry } from '../types/diary';

interface ListViewProps {
  entries: DiaryEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ListView({ entries, onEdit, onDelete }: ListViewProps) {
  return (
    <div className="list-view">
      <div className="list-view__header">
        <span className="list-view__col list-view__col--title">片名</span>
        <span className="list-view__col list-view__col--rating">评分</span>
        <span className="list-view__col list-view__col--date">日期</span>
        <span className="list-view__col list-view__col--mood">心情</span>
        <span className="list-view__col list-view__col--tags">标签</span>
        <span className="list-view__col list-view__col--actions">操作</span>
      </div>
      {entries.map((entry) => (
        <div key={entry.id} className="list-view__row">
          <span className="list-view__col list-view__col--title">
            {entry.posterPath && (
              <img
                className="list-view__poster"
                src={entry.posterPath}
                alt=""
              />
            )}
            {entry.movieTitle}
          </span>
          <span className="list-view__col list-view__col--rating">
            {'★'.repeat(entry.rating)}
            {'☆'.repeat(5 - entry.rating)}
          </span>
          <span className="list-view__col list-view__col--date">{entry.watchDate}</span>
          <span className="list-view__col list-view__col--mood">{entry.mood || '—'}</span>
          <span className="list-view__col list-view__col--tags">
            {entry.tags.length > 0 ? entry.tags.join('、') : '—'}
          </span>
          <span className="list-view__col list-view__col--actions">
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => onEdit(entry.id)}>
              编辑
            </button>
            <button type="button" className="btn btn--danger btn--sm" onClick={() => onDelete(entry.id)}>
              删除
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
