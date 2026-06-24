import { v4 as uuidv4 } from 'uuid';
import type { Tag } from '../types/diary';
import { DEFAULT_TAGS } from '../types/diary';

const STORAGE_KEY = 'movie-diary-tags';

function readAll(): Tag[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const defaults = initDefaults();
    return defaults;
  } catch {
    return initDefaults();
  }
}

function initDefaults(): Tag[] {
  const tags = DEFAULT_TAGS.map((t) => ({ ...t, id: uuidv4() }));
  writeAll(tags);
  return tags;
}

function writeAll(tags: Tag[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
}

export function getAllTags(): Tag[] {
  return readAll().sort((a, b) => a.order - b.order);
}

export function getTagById(id: string): Tag | undefined {
  return readAll().find((t) => t.id === id);
}

export function getTagByName(name: string): Tag | undefined {
  return readAll().find((t) => t.name === name);
}

export function createTag(name: string, color: string): Tag {
  const tags = readAll();
  const tag: Tag = {
    id: uuidv4(),
    name,
    color,
    order: tags.length,
  };
  tags.push(tag);
  writeAll(tags);
  return tag;
}

export function updateTag(id: string, updates: Partial<Omit<Tag, 'id'>>): Tag | null {
  const tags = readAll();
  const idx = tags.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tags[idx] = { ...tags[idx], ...updates };
  writeAll(tags);
  return tags[idx];
}

export function deleteTag(id: string): boolean {
  const tags = readAll();
  const filtered = tags.filter((t) => t.id !== id);
  if (filtered.length === tags.length) return false;
  writeAll(filtered);
  return true;
}

export function reorderTags(orderedIds: string[]): void {
  const tags = readAll();
  const reordered = orderedIds
    .map((id, index) => {
      const tag = tags.find((t) => t.id === id);
      return tag ? { ...tag, order: index } : null;
    })
    .filter((t): t is Tag => t !== null);
  writeAll(reordered);
}
