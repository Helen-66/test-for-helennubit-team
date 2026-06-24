import { useState } from 'react';
import type { Watchlist } from '../types/diary';
import {
  getAllWatchlists,
  createWatchlist,
  deleteWatchlist,
  reorderWatchlists,
} from '../services/watchlistStorage';

interface WatchlistManagerProps {
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function WatchlistManager({ onSelect, onClose }: WatchlistManagerProps) {
  const [lists, setLists] = useState<Watchlist[]>(() => getAllWatchlists());
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const refresh = () => setLists(getAllWatchlists());

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    createWatchlist(name, newDesc.trim());
    setNewName('');
    setNewDesc('');
    setShowCreate(false);
    refresh();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个片单吗？')) {
      deleteWatchlist(id);
      refresh();
    }
  };

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...lists];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    setLists(reordered);
    setDragIdx(targetIdx);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    reorderWatchlists(lists.map((l) => l.id));
  };

  const statusCount = (list: Watchlist, status: string) =>
    list.movies.filter((m) => m.status === status).length;

  return (
    <div className="watchlist-manager">
      <div className="watchlist-manager__header">
        <h2>片单管理</h2>
        <div className="watchlist-manager__header-actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setShowCreate(true)}
          >
            + 新建片单
          </button>
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            返回
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="watchlist-manager__create">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="片单名称"
            maxLength={50}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="片单描述（可选）"
            rows={2}
            maxLength={200}
          />
          <div className="form-actions">
            <button type="button" className="btn btn--primary" onClick={handleCreate}>
              创建
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setShowCreate(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="watchlist-manager__list">
        {lists.map((list, idx) => (
          <div
            key={list.id}
            className={`watchlist-card ${dragIdx === idx ? 'watchlist-card--dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelect(list.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(list.id)}
          >
            <span className="watchlist-card__drag-handle">⠿</span>
            <div className="watchlist-card__info">
              <h3 className="watchlist-card__name">{list.name}</h3>
              {list.description && (
                <p className="watchlist-card__desc">{list.description}</p>
              )}
              <div className="watchlist-card__stats">
                <span>共 {list.movies.length} 部</span>
                {list.movies.length > 0 && (
                  <>
                    <span>👀 {statusCount(list, '想看')}</span>
                    <span>▶️ {statusCount(list, '在看')}</span>
                    <span>✅ {statusCount(list, '已看')}</span>
                  </>
                )}
                {list.isPublic && <span className="watchlist-card__public">公开</span>}
              </div>
            </div>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={(e) => handleDelete(e, list.id)}
            >
              删除
            </button>
          </div>
        ))}
        {lists.length === 0 && !showCreate && (
          <div className="empty-state">
            <p>还没有片单，创建一个吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
