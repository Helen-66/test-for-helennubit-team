import { v4 as uuidv4 } from 'uuid';
import type { DiaryEntry, DiaryEntryDraft } from '../types/diary';

const STORAGE_KEY = 'movie-diary-entries';

function migrateEntry(entry: DiaryEntry): DiaryEntry {
  return {
    ...entry,
    isFavorite: entry.isFavorite ?? false,
  };
}

function readAll(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DiaryEntry[]).map(migrateEntry) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: DiaryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getAllEntries(): DiaryEntry[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getEntryById(id: string): DiaryEntry | undefined {
  return readAll().find((e) => e.id === id);
}

export function createEntry(draft: DiaryEntryDraft): DiaryEntry {
  const now = new Date().toISOString();
  const entry: DiaryEntry = {
    ...draft,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  const entries = readAll();
  entries.push(entry);
  writeAll(entries);
  return entry;
}

export function updateEntry(id: string, draft: Partial<DiaryEntryDraft>): DiaryEntry | null {
  const entries = readAll();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  entries[idx] = {
    ...entries[idx],
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  writeAll(entries);
  return entries[idx];
}

export function deleteEntry(id: string): boolean {
  const entries = readAll();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  writeAll(filtered);
  return true;
}

export function toggleFavorite(id: string): DiaryEntry | null {
  const entries = readAll();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  entries[idx].isFavorite = !entries[idx].isFavorite;
  entries[idx].updatedAt = new Date().toISOString();
  writeAll(entries);
  return entries[idx];
}
