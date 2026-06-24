import { v4 as uuidv4 } from 'uuid';
import type { Watchlist, WatchlistMovie, WatchStatus } from '../types/diary';

const STORAGE_KEY = 'movie-diary-watchlists';

function readAll(): Watchlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(lists: Watchlist[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

function generateShareCode(): string {
  return uuidv4().replace(/-/g, '').slice(0, 10);
}

export function getAllWatchlists(): Watchlist[] {
  return readAll().sort((a, b) => a.order - b.order);
}

export function getWatchlistById(id: string): Watchlist | undefined {
  return readAll().find((w) => w.id === id);
}

export function getWatchlistByShareCode(code: string): Watchlist | undefined {
  return readAll().find((w) => w.isPublic && w.shareCode === code);
}

export function createWatchlist(name: string, description: string): Watchlist {
  const lists = readAll();
  const now = new Date().toISOString();
  const watchlist: Watchlist = {
    id: uuidv4(),
    name,
    description,
    movies: [],
    isPublic: false,
    shareCode: generateShareCode(),
    createdAt: now,
    updatedAt: now,
    order: lists.length,
  };
  lists.push(watchlist);
  writeAll(lists);
  return watchlist;
}

export function updateWatchlist(
  id: string,
  updates: Partial<Omit<Watchlist, 'id' | 'createdAt' | 'shareCode'>>,
): Watchlist | null {
  const lists = readAll();
  const idx = lists.findIndex((w) => w.id === id);
  if (idx === -1) return null;
  lists[idx] = { ...lists[idx], ...updates, updatedAt: new Date().toISOString() };
  writeAll(lists);
  return lists[idx];
}

export function deleteWatchlist(id: string): boolean {
  const lists = readAll();
  const filtered = lists.filter((w) => w.id !== id);
  if (filtered.length === lists.length) return false;
  writeAll(filtered);
  return true;
}

export function addMovieToWatchlist(
  watchlistId: string,
  movie: Omit<WatchlistMovie, 'addedAt'>,
): Watchlist | null {
  const lists = readAll();
  const idx = lists.findIndex((w) => w.id === watchlistId);
  if (idx === -1) return null;
  const exists = lists[idx].movies.some((m) => m.movieId === movie.movieId);
  if (exists) return lists[idx];
  lists[idx].movies.push({ ...movie, addedAt: new Date().toISOString() });
  lists[idx].updatedAt = new Date().toISOString();
  writeAll(lists);
  return lists[idx];
}

export function removeMovieFromWatchlist(watchlistId: string, movieId: string): Watchlist | null {
  const lists = readAll();
  const idx = lists.findIndex((w) => w.id === watchlistId);
  if (idx === -1) return null;
  lists[idx].movies = lists[idx].movies.filter((m) => m.movieId !== movieId);
  lists[idx].updatedAt = new Date().toISOString();
  writeAll(lists);
  return lists[idx];
}

export function updateMovieStatus(
  watchlistId: string,
  movieId: string,
  status: WatchStatus,
): Watchlist | null {
  const lists = readAll();
  const idx = lists.findIndex((w) => w.id === watchlistId);
  if (idx === -1) return null;
  const movieIdx = lists[idx].movies.findIndex((m) => m.movieId === movieId);
  if (movieIdx === -1) return null;
  lists[idx].movies[movieIdx].status = status;
  lists[idx].updatedAt = new Date().toISOString();
  writeAll(lists);
  return lists[idx];
}

export function reorderWatchlists(orderedIds: string[]): void {
  const lists = readAll();
  const reordered = orderedIds
    .map((id, index) => {
      const list = lists.find((w) => w.id === id);
      return list ? { ...list, order: index } : null;
    })
    .filter((w): w is Watchlist => w !== null);
  writeAll(reordered);
}

export function reorderMoviesInWatchlist(watchlistId: string, orderedMovieIds: string[]): Watchlist | null {
  const lists = readAll();
  const idx = lists.findIndex((w) => w.id === watchlistId);
  if (idx === -1) return null;
  const reordered = orderedMovieIds
    .map((id) => lists[idx].movies.find((m) => m.movieId === id))
    .filter((m): m is WatchlistMovie => m !== undefined);
  lists[idx].movies = reordered;
  lists[idx].updatedAt = new Date().toISOString();
  writeAll(lists);
  return lists[idx];
}

export function toggleWatchlistPublic(id: string): Watchlist | null {
  const lists = readAll();
  const idx = lists.findIndex((w) => w.id === id);
  if (idx === -1) return null;
  lists[idx].isPublic = !lists[idx].isPublic;
  lists[idx].updatedAt = new Date().toISOString();
  writeAll(lists);
  return lists[idx];
}

export function getShareLink(watchlist: Watchlist): string {
  return `${window.location.origin}${window.location.pathname}?share=${watchlist.shareCode}`;
}
