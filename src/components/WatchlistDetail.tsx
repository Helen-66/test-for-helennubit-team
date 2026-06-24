import { useState, useCallback } from 'react';
import type { Watchlist, WatchStatus } from '../types/diary';
import {
  getWatchlistById,
  updateWatchlist,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  updateMovieStatus,
  toggleWatchlistPublic,
  getShareLink,
  reorderMoviesInWatchlist,
} from '../services/watchlistStorage';
import WatchStatusSelector from './WatchStatusSelector';

interface WatchlistDetailProps {
  watchlistId: string;
  onBack: () => void;
}

export default function WatchlistDetail({ watchlistId, onBack }: WatchlistDetailProps) {
  const [list, setList] = useState<Watchlist | undefined>(() =>
    getWatchlistById(watchlistId),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [movieTitle, setMovieTitle] = useState('');
  const [moviePoster, setMoviePoster] = useState('');
  const [movieStatus, setMovieStatus] = useState<WatchStatus>('想看');
  const [shareMsg, setShareMsg] = useState('');
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<WatchStatus | 'all'>('all');

  const refresh = useCallback(
    () => setList(getWatchlistById(watchlistId)),
    [watchlistId],
  );

  if (!list) {
    return (
      <div className="empty-state">
        <p>片单不存在</p>
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          返回
        </button>
      </div>
    );
  }

  const startEdit = () => {
    setEditName(list.name);
    setEditDesc(list.description);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const name = editName.trim();
    if (!name) return;
    updateWatchlist(list.id, { name, description: editDesc.trim() });
    setIsEditing(false);
    refresh();
  };

  const handleAddMovie = () => {
    const title = movieTitle.trim();
    if (!title) return;
    addMovieToWatchlist(list.id, {
      movieId: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      movieTitle: title,
      posterPath: moviePoster.trim(),
      status: movieStatus,
    });
    setMovieTitle('');
    setMoviePoster('');
    setMovieStatus('想看');
    setShowAddMovie(false);
    refresh();
  };

  const handleRemoveMovie = (movieId: string) => {
    removeMovieFromWatchlist(list.id, movieId);
    refresh();
  };

  const handleStatusChange = (movieId: string, status: WatchStatus) => {
    updateMovieStatus(list.id, movieId, status);
    refresh();
  };

  const handleTogglePublic = () => {
    toggleWatchlistPublic(list.id);
    refresh();
  };

  const handleShare = () => {
    const link = getShareLink(list);
    navigator.clipboard.writeText(link).then(
      () => setShareMsg('链接已复制到剪贴板！'),
      () => setShareMsg(`分享链接：${link}`),
    );
    setTimeout(() => setShareMsg(''), 3000);
  };

  const handleMovieDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleMovieDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;
    const movies = [...list.movies];
    const [moved] = movies.splice(dragIdx, 1);
    movies.splice(targetIdx, 0, moved);
    setList({ ...list, movies });
    setDragIdx(targetIdx);
  };

  const handleMovieDragEnd = () => {
    setDragIdx(null);
    reorderMoviesInWatchlist(list.id, list.movies.map((m) => m.movieId));
  };

  const filteredMovies =
    filterStatus === 'all'
      ? list.movies
      : list.movies.filter((m) => m.status === filterStatus);

  return (
    <div className="watchlist-detail">
      <div className="watchlist-detail__header">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          ← 返回片单列表
        </button>
      </div>

      {isEditing ? (
        <div className="watchlist-detail__edit">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="片单名称"
            maxLength={50}
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="片单描述"
            rows={2}
            maxLength={200}
          />
          <div className="form-actions">
            <button type="button" className="btn btn--primary" onClick={handleSaveEdit}>
              保存
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setIsEditing(false)}
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <div className="watchlist-detail__info">
          <h2>{list.name}</h2>
          {list.description && <p className="watchlist-detail__desc">{list.description}</p>}
          <div className="watchlist-detail__toolbar">
            <button type="button" className="btn btn--secondary btn--sm" onClick={startEdit}>
              编辑信息
            </button>
            <button
              type="button"
              className={`btn btn--sm ${list.isPublic ? 'btn--primary' : 'btn--secondary'}`}
              onClick={handleTogglePublic}
            >
              {list.isPublic ? '🔓 公开' : '🔒 私密'}
            </button>
            {list.isPublic && (
              <button type="button" className="btn btn--secondary btn--sm" onClick={handleShare}>
                📤 分享链接
              </button>
            )}
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => setShowAddMovie(true)}
            >
              + 添加电影
            </button>
          </div>
          {shareMsg && <p className="watchlist-detail__share-msg">{shareMsg}</p>}
        </div>
      )}

      {showAddMovie && (
        <div className="watchlist-detail__add-movie">
          <h3>添加电影</h3>
          <input
            type="text"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            placeholder="电影名称"
            onKeyDown={(e) => e.key === 'Enter' && handleAddMovie()}
          />
          <input
            type="text"
            value={moviePoster}
            onChange={(e) => setMoviePoster(e.target.value)}
            placeholder="海报链接（可选）"
          />
          <WatchStatusSelector value={movieStatus} onChange={setMovieStatus} />
          <div className="form-actions">
            <button type="button" className="btn btn--primary" onClick={handleAddMovie}>
              添加
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setShowAddMovie(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="watchlist-detail__filter">
        <span>筛选：</span>
        {(['all', '想看', '在看', '已看'] as const).map((s) => (
          <button
            key={s}
            type="button"
            className={`watch-status-chip ${filterStatus === s ? 'watch-status-chip--active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s === 'all' ? '全部' : s}
          </button>
        ))}
      </div>

      <div className="watchlist-detail__movies">
        {filteredMovies.map((movie, idx) => (
          <div
            key={movie.movieId}
            className={`watchlist-movie ${dragIdx === idx ? 'watchlist-movie--dragging' : ''}`}
            draggable
            onDragStart={() => handleMovieDragStart(idx)}
            onDragOver={(e) => handleMovieDragOver(e, idx)}
            onDragEnd={handleMovieDragEnd}
          >
            <span className="watchlist-movie__drag-handle">⠿</span>
            {movie.posterPath && (
              <img
                className="watchlist-movie__poster"
                src={movie.posterPath}
                alt={movie.movieTitle}
              />
            )}
            <div className="watchlist-movie__info">
              <span className="watchlist-movie__title">{movie.movieTitle}</span>
              <WatchStatusSelector
                value={movie.status}
                onChange={(s) => handleStatusChange(movie.movieId, s)}
              />
            </div>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => handleRemoveMovie(movie.movieId)}
            >
              移除
            </button>
          </div>
        ))}
        {filteredMovies.length === 0 && (
          <div className="empty-state">
            <p>{list.movies.length === 0 ? '片单为空，添加电影吧！' : '没有符合筛选条件的电影'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
