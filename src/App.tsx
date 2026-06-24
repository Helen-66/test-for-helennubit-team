import { useState, useCallback } from 'react';
import type { DiaryEntry, DiaryEntryDraft } from './types/diary';
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from './services/diaryStorage';
import DiaryForm from './components/DiaryForm';
import DiaryCard from './components/DiaryCard';
import StatsDashboard from './components/StatsDashboard';
import './App.css';

type View = 'list' | 'create' | 'edit' | 'stats';

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getAllEntries());
  const [view, setView] = useState<View>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const editingEntry = editingId ? entries.find((e) => e.id === editingId) : undefined;

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 观影日记</h1>
        {view === 'list' && (
          <div className="app-header__actions">
            <button className="btn btn--secondary" onClick={() => setView('stats')}>
              📊 统计
            </button>
            <button className="btn btn--primary" onClick={() => setView('create')}>
              + 新建日记
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {view === 'stats' && (
          <StatsDashboard entries={entries} onBack={() => setView('list')} />
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
