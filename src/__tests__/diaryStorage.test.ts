import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getAllEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
} from '../services/diaryStorage';
import type { DiaryEntryDraft } from '../types/diary';

const sampleDraft: DiaryEntryDraft = {
  movieId: 123,
  movieTitle: 'Inception',
  posterPath: '/poster.jpg',
  rating: 5,
  review: 'Amazing movie!',
  watchDate: '2024-01-15',
  mood: '震撼',
  tags: ['烧脑', '科幻'],
};

beforeEach(() => {
  localStorage.clear();
});

describe('diaryStorage', () => {
  it('returns empty array when no entries exist', () => {
    expect(getAllEntries()).toEqual([]);
  });

  it('creates an entry with generated id and timestamps', () => {
    const entry = createEntry(sampleDraft);
    expect(entry.id).toBeDefined();
    expect(entry.movieTitle).toBe('Inception');
    expect(entry.rating).toBe(5);
    expect(entry.createdAt).toBeDefined();
    expect(entry.updatedAt).toBeDefined();
  });

  it('retrieves all entries sorted by most recent', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    createEntry({ ...sampleDraft, movieTitle: 'First' });
    vi.setSystemTime(new Date('2024-01-02T00:00:00Z'));
    createEntry({ ...sampleDraft, movieTitle: 'Second' });
    vi.useRealTimers();
    const all = getAllEntries();
    expect(all).toHaveLength(2);
    expect(all[0].movieTitle).toBe('Second');
  });

  it('retrieves entry by id', () => {
    const entry = createEntry(sampleDraft);
    const found = getEntryById(entry.id);
    expect(found).toBeDefined();
    expect(found!.movieTitle).toBe('Inception');
  });

  it('returns undefined for unknown id', () => {
    expect(getEntryById('nonexistent')).toBeUndefined();
  });

  it('updates an existing entry', () => {
    const entry = createEntry(sampleDraft);
    const updated = updateEntry(entry.id, { rating: 3 });
    expect(updated).not.toBeNull();
    expect(updated!.rating).toBe(3);
    expect(updated!.movieTitle).toBe('Inception');
    expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(entry.updatedAt).getTime(),
    );
  });

  it('returns null when updating nonexistent entry', () => {
    expect(updateEntry('fake', { rating: 1 })).toBeNull();
  });

  it('deletes an entry', () => {
    const entry = createEntry(sampleDraft);
    expect(deleteEntry(entry.id)).toBe(true);
    expect(getAllEntries()).toHaveLength(0);
  });

  it('returns false when deleting nonexistent entry', () => {
    expect(deleteEntry('fake')).toBe(false);
  });
});
