import { useState, useCallback, useEffect } from 'react';
import type { DiaryEntry, DiaryEntryDraft } from './types/diary';
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from './services/diaryStorage';
import DiaryForm from './components/DiaryForm';
import DiaryCard from './components/DiaryCard';
import BottomTabBar from './components/BottomTabBar';
import PageTransition from './components/PageTransition';
import PullToRefresh from './components/PullToRefresh';
import { SkeletonList } from './components/SkeletonCard';
import { useIsMobile } from './hooks/useMediaQuery';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import './App.css';

type View = 'list' | 'create' | 'edit';

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getAllEntries());
  const [view, setView] = useState<View>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

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

  const handleNavigate = (target: 'list' | 'create') => {
    setEditingId(null);
    setView(target);
  };

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (view === 'list') setView('create');
    },
    onSwipeRight: () => {
      if (view === 'create' || view === 'edit') handleCancel();
    },
  });

  const editingEntry = editingId ? entries.find((e) => e.id === editingId) : undefined;

  return (
    <div className="app" {...swipeHandlers}>
      <header className="app-header">
        <h1>📝 观影日记</h1>
        {view === 'list' && !isMobile && (
          <button className="btn btn--primary" onClick={() => setView('create')}>
            + 新建日记
          </button>
        )}
        {view !== 'list' && isMobile && (
          <button className="btn btn--secondary" onClick={handleCancel}>
            返回
          </button>
        )}
      </header>

      <main className="app-main">
        <PageTransition viewKey={view}>
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

          {view === 'list' && (
            <PullToRefresh onRefresh={refresh}>
              {loading ? (
                <SkeletonList count={3} />
              ) : entries.length === 0 ? (
                <div className="empty-state">
                  <p>还没有日记，点击「新建日记」开始记录吧！</p>
                </div>
              ) : (
                <div className="diary-list">
                  {entries.map((entry) => (
                    <DiaryCard
                      key={entry.id}
                      entry={entry}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </PullToRefresh>
          )}
        </PageTransition>
      </main>

      {isMobile && <BottomTabBar currentView={view} onNavigate={handleNavigate} />}
    </div>
  );
}
