import { useState, useCallback, useEffect } from 'react';
import type { DiaryEntry, DiaryEntryDraft } from './types/diary';
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from './services/diaryStorage';
import {
  migrateLocalToCloud,
  fetchCloudEntries,
  createCloudEntry,
  updateCloudEntry,
  deleteCloudEntry,
} from './services/syncService';
import { useAuth } from './contexts/AuthContext';
import DiaryForm from './components/DiaryForm';
import DiaryCard from './components/DiaryCard';
import AuthForm from './components/AuthForm';
import ProfilePage from './components/ProfilePage';
import './App.css';

type View = 'list' | 'create' | 'edit' | 'profile';

export default function App() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const isAuthenticated = !!user;

  const [entries, setEntries] = useState<DiaryEntry[]>(() =>
    isAuthenticated ? [] : getAllEntries(),
  );
  const [view, setView] = useState<View>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const refreshLocal = useCallback(() => setEntries(getAllEntries()), []);

  const refreshCloud = useCallback(async () => {
    if (!user) return;
    const cloudEntries = await fetchCloudEntries(user.id);
    setEntries(cloudEntries);
  }, [user]);

  useEffect(() => {
    if (!user) {
      refreshLocal();
      return;
    }
    setSyncing(true);
    migrateLocalToCloud(user.id)
      .then(() => refreshCloud())
      .finally(() => setSyncing(false));
  }, [user, refreshLocal, refreshCloud]);

  const handleCreate = async (draft: DiaryEntryDraft) => {
    if (user) {
      await createCloudEntry(user.id, draft);
      await refreshCloud();
    } else {
      createEntry(draft);
      refreshLocal();
    }
    setView('list');
  };

  const handleUpdate = async (draft: DiaryEntryDraft) => {
    if (!editingId) return;
    if (user) {
      await updateCloudEntry(editingId, draft);
      await refreshCloud();
    } else {
      updateEntry(editingId, draft);
      refreshLocal();
    }
    setEditingId(null);
    setView('list');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这篇日记吗？')) return;
    if (user) {
      await deleteCloudEntry(id);
      await refreshCloud();
    } else {
      deleteEntry(id);
      refreshLocal();
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

  const editingEntry = editingId ? entries.find((e) => e.id === editingId) : undefined;

  if (authLoading) {
    return (
      <div className="app">
        <div className="loading-state">
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>📝 观影日记</h1>
        </header>
        <main className="app-main">
          <AuthForm />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 观影日记</h1>
        <div className="header-actions">
          {view === 'list' && (
            <button className="btn btn--primary" onClick={() => setView('create')}>
              + 新建日记
            </button>
          )}
          <button
            className="btn btn--secondary user-btn"
            onClick={() => setView(view === 'profile' ? 'list' : 'profile')}
            title="个人资料"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="user-avatar-small" />
            ) : (
              <span className="user-avatar-placeholder-small">
                {profile?.nickname?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
            <span className="user-name">
              {profile?.nickname ?? user.email?.split('@')[0] ?? '用户'}
            </span>
          </button>
          <button className="btn btn--secondary" onClick={signOut} title="退出登录">
            退出
          </button>
        </div>
      </header>

      <main className="app-main">
        {syncing && <p className="sync-notice">正在同步数据...</p>}

        {view === 'profile' && (
          <ProfilePage onBack={() => setView('list')} />
        )}

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
            {entries.length === 0 ? (
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
      </main>
    </div>
  );
}
