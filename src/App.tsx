import { useState, useCallback } from 'react';
import type { DiaryEntry, DiaryEntryDraft } from './types/diary';
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleFavorite,
} from './services/diaryStorage';
import DiaryForm from './components/DiaryForm';
import DiaryCard from './components/DiaryCard';
import TagFilter from './components/TagFilter';
import TagManager from './components/TagManager';
import WatchlistManager from './components/WatchlistManager';
import WatchlistDetail from './components/WatchlistDetail';
import './App.css';

type View =
  | 'list'
  | 'create'
  | 'edit'
  | 'tags'
  | 'watchlists'
  | 'watchlist-detail'
  | 'favorites';

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getAllEntries());
  const [view, setView] = useState<View>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const refresh = useCallback(() => setEntries(getAllEntries()), []);

  const handleCreate = (draft: DiaryEntryDraft) => {
    createEntry(draft);
    refresh();
    setView('list');
  };

  const handleUpdate = (draft: DiaryEntryDraft) => {
    if (editingId) {
      updateEntry(editingId, draft);
      refresh();
      setEditingId(null);
      setView('list');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这篇日记吗？')) {
      deleteEntry(id);
      refresh();
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setView('edit');
  };

  const handleCancel = () => {
    setEditingId(null);
    setView('list');
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    refresh();
  };

  const editingEntry = editingId ? entries.find((e) => e.id === editingId) : undefined;

  const filteredEntries = entries.filter((entry) => {
    if (showFavoritesOnly && !entry.isFavorite) return false;
    if (filterTags.length > 0 && !filterTags.some((t) => entry.tags.includes(t)))
      return false;
    return true;
  });

  const goToList = () => {
    setView('list');
    setShowFavoritesOnly(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={goToList} className="app-header__title">📝 观影日记</h1>
        {(view === 'list' || view === 'favorites') && (
          <nav className="app-nav">
            <button
              type="button"
              className={`btn btn--secondary btn--sm ${showFavoritesOnly ? 'btn--active' : ''}`}
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                setView('list');
              }}
            >
              ❤️ 收藏
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => setView('tags')}
            >
              🏷️ 标签
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => setView('watchlists')}
            >
              📋 片单
            </button>
            <button className="btn btn--primary" onClick={() => setView('create')}>
              + 新建日记
            </button>
          </nav>
        )}
      </header>

      <main className="app-main">
        {view === 'create' && (
          <DiaryForm onSubmit={handleCreate} onCancel={handleCancel} />
        )}

        {view === 'edit' && editingEntry && (
          <DiaryForm
            initial={editingEntry}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
          />
        )}

        {view === 'tags' && <TagManager onClose={goToList} />}

        {view === 'watchlists' && (
          <WatchlistManager
            onSelect={(id) => {
              setSelectedWatchlistId(id);
              setView('watchlist-detail');
            }}
            onClose={goToList}
          />
        )}

        {view === 'watchlist-detail' && selectedWatchlistId && (
          <WatchlistDetail
            watchlistId={selectedWatchlistId}
            onBack={() => setView('watchlists')}
          />
        )}

        {view === 'list' && (
          <>
            <TagFilter selectedTags={filterTags} onChange={setFilterTags} />
            {showFavoritesOnly && (
              <div className="filter-indicator">
                <span>❤️ 仅显示收藏</span>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => setShowFavoritesOnly(false)}
                >
                  清除
                </button>
              </div>
            )}
            {filteredEntries.length === 0 ? (
              <div className="empty-state">
                <p>
                  {entries.length === 0
                    ? '还没有日记，点击「新建日记」开始记录吧！'
                    : '没有符合筛选条件的日记'}
                </p>
              </div>
            ) : (
              <div className="diary-list">
                {filteredEntries.map((entry) => (
                  <DiaryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
