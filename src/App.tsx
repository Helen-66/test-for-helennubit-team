import { useState, useCallback, useEffect } from 'react';
import type { DiaryEntry, DiaryEntryDraft } from './types/diary';
import type { PetCareRegistration, PetCareDraft } from './types/petCare';
import type { AppTab, Section } from './types/navigation';
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from './services/diaryStorage';
import {
  getAllRegistrations,
  createRegistration,
  updateRegistration,
  deleteRegistration,
} from './services/petCareStorage';
import DiaryForm from './components/DiaryForm';
import DiaryCard from './components/DiaryCard';
import DiaryCardSkeleton from './components/DiaryCardSkeleton';
import PetCareForm from './components/PetCareForm';
import PetCareCard from './components/PetCareCard';
import BottomTabBar from './components/BottomTabBar';
import PageTransition from './components/PageTransition';
import PullIndicator from './components/PullIndicator';
import { useIsMobile } from './hooks/useMediaQuery';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import './App.css';

type DiaryView = 'list' | 'create' | 'edit';
type PetView = 'list' | 'register' | 'edit';

export default function App() {
  const [section, setSection] = useState<Section>('diary');
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getAllEntries());
  const [registrations, setRegistrations] = useState<PetCareRegistration[]>(() =>
    getAllRegistrations(),
  );
  const [view, setView] = useState<DiaryView>('list');
  const [petView, setPetView] = useState<PetView>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [petEditingId, setPetEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const refreshDiary = useCallback(() => setEntries(getAllEntries()), []);
  const refreshPets = useCallback(() => setRegistrations(getAllRegistrations()), []);

  const handleCreate = (draft: DiaryEntryDraft) => {
    createEntry(draft);
    refreshDiary();
    setView('list');
  };

  const handleUpdate = (draft: DiaryEntryDraft) => {
    if (editingId) {
      updateEntry(editingId, draft);
      refreshDiary();
      setEditingId(null);
      setView('list');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这篇日记吗？')) {
      deleteEntry(id);
      refreshDiary();
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setView('edit');
  };

  const handlePetCreate = (draft: PetCareDraft) => {
    createRegistration(draft);
    refreshPets();
    setPetView('list');
  };

  const handlePetUpdate = (draft: PetCareDraft) => {
    if (petEditingId) {
      updateRegistration(petEditingId, draft);
      refreshPets();
      setPetEditingId(null);
      setPetView('list');
    }
  };

  const handlePetDelete = (id: string) => {
    if (window.confirm('确定要取消这条喂养预约吗？')) {
      deleteRegistration(id);
      refreshPets();
    }
  };

  const handlePetEdit = (id: string) => {
    setPetEditingId(id);
    setPetView('edit');
  };

  const handleCancel = () => {
    if (section === 'diary') {
      setEditingId(null);
      setView('list');
    } else {
      setPetEditingId(null);
      setPetView('list');
    }
  };

  const switchSection = (next: Section) => {
    setSection(next);
    if (next === 'diary') {
      setPetEditingId(null);
      setPetView('list');
    } else {
      setEditingId(null);
      setView('list');
    }
  };

  const handleTabChange = (tab: AppTab) => {
    if (tab === 'diary') {
      switchSection('diary');
      setView('list');
    } else if (tab === 'create') {
      switchSection('diary');
      setEditingId(null);
      setView('create');
    } else {
      switchSection('pets');
    }
  };

  const isListView =
    section === 'diary' ? view === 'list' : petView === 'list';

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (section === 'diary' && view === 'list') {
        setEditingId(null);
        setView('create');
      } else if (section === 'pets' && petView === 'list') {
        setPetEditingId(null);
        setPetView('register');
      }
    },
    onSwipeRight: () => {
      if (!isListView) {
        handleCancel();
      }
    },
  });

  const { pullDistance, isRefreshing, handlers: pullHandlers } = usePullToRefresh({
    onRefresh: async () => {
      await new Promise((r) => setTimeout(r, 500));
      if (section === 'diary') refreshDiary();
      else refreshPets();
    },
  });

  const editingEntry = editingId
    ? entries.find((e) => e.id === editingId)
    : undefined;
  const editingReg = petEditingId
    ? registrations.find((r) => r.id === petEditingId)
    : undefined;

  const activeTab: AppTab =
    section === 'pets'
      ? 'pets'
      : view === 'list'
        ? 'diary'
        : 'create';

  const touchProps = isListView
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
        <h1>{section === 'diary' ? '📝 观影日记' : '🐾 宠物上门喂养'}</h1>
        <div className="app-header__actions">
          {!isMobile && (
            <div className="section-switch" role="tablist" aria-label="切换模块">
              <button
                type="button"
                role="tab"
                aria-selected={section === 'diary'}
                className={`section-switch__btn ${section === 'diary' ? 'section-switch__btn--active' : ''}`}
                onClick={() => switchSection('diary')}
              >
                日记
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={section === 'pets'}
                className={`section-switch__btn ${section === 'pets' ? 'section-switch__btn--active' : ''}`}
                onClick={() => switchSection('pets')}
              >
                宠物
              </button>
            </div>
          )}
          {section === 'diary' && view === 'list' && !isMobile && (
            <button className="btn btn--primary" onClick={() => setView('create')}>
              + 新建日记
            </button>
          )}
          {section === 'pets' && petView === 'list' && !isMobile && (
            <button
              className="btn btn--primary"
              onClick={() => setPetView('register')}
            >
              + 新建预约
            </button>
          )}
          {isMobile && !isListView && (
            <button className="btn btn--secondary btn--back" onClick={handleCancel}>
              ← 返回
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {isListView && (
          <PullIndicator
            pullDistance={pullDistance}
            isRefreshing={isRefreshing}
            threshold={80}
          />
        )}

        <PageTransition viewKey={`${section}-${section === 'diary' ? view : petView}`}>
          {section === 'diary' && view === 'create' && (
            <DiaryForm onSubmit={handleCreate} onCancel={handleCancel} />
          )}

          {section === 'diary' && view === 'edit' && editingEntry && (
            <DiaryForm
              initial={editingEntry}
              onSubmit={handleUpdate}
              onCancel={handleCancel}
            />
          )}

          {section === 'diary' && view === 'list' && (
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

          {section === 'pets' && petView === 'register' && (
            <PetCareForm onSubmit={handlePetCreate} onCancel={handleCancel} />
          )}

          {section === 'pets' && petView === 'edit' && editingReg && (
            <PetCareForm
              initial={editingReg}
              onSubmit={handlePetUpdate}
              onCancel={handleCancel}
            />
          )}

          {section === 'pets' && petView === 'list' && (
            <>
              {isLoading ? (
                <div className="diary-list">
                  <DiaryCardSkeleton />
                  <DiaryCardSkeleton />
                </div>
              ) : registrations.length === 0 ? (
                <div className="empty-state">
                  <p>还没有喂养预约，点击「新建预约」开始登记吧！</p>
                </div>
              ) : (
                <div className="pet-list">
                  {registrations.map((reg) => (
                    <PetCareCard
                      key={reg.id}
                      registration={reg}
                      onEdit={handlePetEdit}
                      onDelete={handlePetDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </PageTransition>
      </main>

      <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
