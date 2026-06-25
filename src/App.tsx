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
import DiaryCardSkeleton from './components/DiaryCardSkeleton';
import BottomTabBar from './components/BottomTabBar';
import PageTransition from './components/PageTransition';
import PullIndicator from './components/PullIndicator';
import { useIsMobile } from './hooks/useMediaQuery';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import './App.css';

type View = 'list' | 'create' | 'edit';

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getAllEntries());
  const [view, setView] = useState<View>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
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

  const handleTabChange = (tab: 'list' | 'create') => {
    if (tab === 'create') {
      setEditingId(null);
      setView('create');
    } else {
      setView('list');
    }
  };

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (view === 'list') {
        setEditingId(null);
        setView('create');
      }
    },
    onSwipeRight: () => {
      if (view !== 'list') {
        handleCancel();
      }
    },
  });

  const { pullDistance, isRefreshing, handlers: pullHandlers } = usePullToRefresh({
    onRefresh: async () => {
      await new Promise((r) => setTimeout(r, 500));
      refresh();
    },
  });

  const editingEntry = editingId ? entries.find((e) => e.id === editingId) : undefined;

  const touchProps = view === 'list'
    ? {
        onTouchStart: (e: React.TouchEvent) => {
          swipeHandlers.onTouchStart(e);
          pullHandlers.onTouchStart(e);
        },
        onTouchMove: pullHandlers.onTouchMove,
        onTouchEnd: (e: React.TouchEvent) => {
          swipeHandlers.onTouchEnd(e);
          pullHandlers.onTouchEnd();
        },
      }
    : {
        onTouchStart: swipeHandlers.onTouchStart,
        onTouchEnd: swipeHandlers.onTouchEnd,
      };

  return (
    <div className={`app ${isMobile ? 'app--mobile' : ''}`} {...touchProps}>
      <header className="app-header">
        <h1>📝 观影日记</h1>
        {view === 'list' && !isMobile && (
          <button className="btn btn--primary" onClick={() => setView('create')}>
            + 新建日记
          </button>
        )}
        {view !== 'list' && isMobile && (
          <button className="btn btn--secondary btn--back" onClick={handleCancel}>
            ← 返回
          </button>
        )}
      </header>

      <main className="app-main">
        {view === 'list' && (
          <PullIndicator
            pullDistance={pullDistance}
            isRefreshing={isRefreshing}
            threshold={80}
          />
        )}

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
            <>
              {isLoading ? (
                <div className="diary-list">
                  <DiaryCardSkeleton />
                  <DiaryCardSkeleton />
                  <DiaryCardSkeleton />
                </div>
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
            </>
          )}
        </PageTransition>
      </main>

      <BottomTabBar
        activeTab={view === 'list' ? 'list' : 'create'}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
