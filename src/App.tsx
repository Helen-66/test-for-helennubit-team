import { useState, useCallback } from 'react';
import type { DiaryEntry, DiaryEntryDraft } from './types/diary';
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from './services/diaryStorage';
import { useCollection } from './hooks/useCollection';
import DiaryForm from './components/DiaryForm';
import CollectionToolbar from './components/CollectionToolbar';
import TimelineView from './components/TimelineView';
import GridView from './components/GridView';
import ListView from './components/ListView';
import EmptyCollection from './components/EmptyCollection';
import Pagination from './components/Pagination';
import './App.css';

type View = 'collection' | 'create' | 'edit';

export default function App() {
  const [allEntries, setAllEntries] = useState<DiaryEntry[]>(() => getAllEntries());
  const [view, setView] = useState<View>('collection');
  const [editingId, setEditingId] = useState<string | null>(null);

  const collection = useCollection(allEntries);

  const refresh = useCallback(() => setAllEntries(getAllEntries()), []);

  const handleCreate = (draft: DiaryEntryDraft) => {
    createEntry(draft);
    refresh();
    setView('collection');
  };

  const handleUpdate = (draft: DiaryEntryDraft) => {
    if (editingId) {
      updateEntry(editingId, draft);
      refresh();
      setEditingId(null);
      setView('collection');
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
    setView('collection');
  };

  const editingEntry = editingId ? allEntries.find((e) => e.id === editingId) : undefined;

  const renderViewContent = () => {
    switch (collection.viewMode) {
      case 'timeline':
        return (
          <TimelineView
            entries={collection.entries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case 'grid':
        return (
          <GridView
            entries={collection.entries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case 'list':
        return (
          <ListView
            entries={collection.entries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 观影日记</h1>
        {view === 'collection' && (
          <button className="btn btn--primary" onClick={() => setView('create')}>
            + 新建日记
          </button>
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

        {view === 'collection' && (
          <>
            {allEntries.length === 0 && !collection.hasActiveFilters ? (
              <EmptyCollection
                hasFilters={false}
                onReset={collection.resetFilters}
                onCreate={() => setView('create')}
              />
            ) : (
              <>
                <CollectionToolbar
                  viewMode={collection.viewMode}
                  onViewModeChange={collection.setViewMode}
                  sort={collection.sort}
                  onSortChange={collection.updateSort}
                  filter={collection.filter}
                  onFilterChange={collection.updateFilter}
                  search={collection.search}
                  onSearchChange={collection.updateSearch}
                  onReset={collection.resetFilters}
                  hasActiveFilters={collection.hasActiveFilters}
                  availableYears={collection.availableYears}
                  availableTags={collection.availableTags}
                  totalFiltered={collection.totalFiltered}
                  totalEntries={allEntries.length}
                />

                {collection.entries.length === 0 ? (
                  <EmptyCollection
                    hasFilters={collection.hasActiveFilters}
                    onReset={collection.resetFilters}
                    onCreate={() => setView('create')}
                  />
                ) : (
                  <>
                    {renderViewContent()}
                    <Pagination
                      page={collection.page}
                      totalPages={collection.totalPages}
                      onPageChange={collection.setPage}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
