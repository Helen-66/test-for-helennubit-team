import { useState, useEffect } from 'react';
import type { DiaryEntryDraft } from '../types/diary';
import type { DiaryEntry } from '../types/diary';
import StarRating from './StarRating';
import DatePicker from './DatePicker';
import MoodSelector from './MoodSelector';
import TagSelector from './TagSelector';
import MarkdownEditor from './MarkdownEditor';

interface DiaryFormProps {
  initial?: DiaryEntry;
  onSubmit: (draft: DiaryEntryDraft) => void;
  onCancel: () => void;
}

function emptyDraft(): DiaryEntryDraft {
  return {
    movieId: 0,
    movieTitle: '',
    posterPath: '',
    rating: 0,
    review: '',
    watchDate: new Date().toISOString().split('T')[0],
    mood: '',
    tags: [],
  };
}

export default function DiaryForm({ initial, onSubmit, onCancel }: DiaryFormProps) {
  const [draft, setDraft] = useState<DiaryEntryDraft>(emptyDraft());

  useEffect(() => {
    if (initial) {
      const { id: _, createdAt: __, updatedAt: ___, ...rest } = initial;
      setDraft(rest);
    }
  }, [initial]);

  const set = <K extends keyof DiaryEntryDraft>(key: K, val: DiaryEntryDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(draft);
  };

  const isValid = draft.movieTitle.trim() !== '' && draft.rating > 0;

  return (
    <form className="diary-form" onSubmit={handleSubmit}>
      <h2>{initial ? '编辑日记' : '新建日记'}</h2>

      <div className="form-group">
        <label htmlFor="movie-title">电影名称 *</label>
        <input
          id="movie-title"
          type="text"
          value={draft.movieTitle}
          onChange={(e) => set('movieTitle', e.target.value)}
          placeholder="请输入电影名称"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="movie-id">电影 ID</label>
        <input
          id="movie-id"
          type="number"
          value={draft.movieId || ''}
          onChange={(e) => set('movieId', Number(e.target.value))}
          placeholder="TMDB 电影 ID（可选）"
        />
      </div>

      <div className="form-group">
        <label htmlFor="poster-path">海报链接</label>
        <input
          id="poster-path"
          type="text"
          value={draft.posterPath}
          onChange={(e) => set('posterPath', e.target.value)}
          placeholder="海报图片 URL（可选）"
        />
      </div>

      <div className="form-group">
        <label>评分 *</label>
        <StarRating value={draft.rating} onChange={(v) => set('rating', v)} />
      </div>

      <DatePicker value={draft.watchDate} onChange={(v) => set('watchDate', v)} />

      <MoodSelector value={draft.mood} onChange={(v) => set('mood', v)} />

      <TagSelector value={draft.tags} onChange={(v) => set('tags', v)} />

      <MarkdownEditor value={draft.review} onChange={(v) => set('review', v)} />

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={!isValid}>
          {initial ? '保存修改' : '创建日记'}
        </button>
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          取消
        </button>
      </div>
    </form>
  );
}
