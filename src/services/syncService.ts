import { supabase } from '../lib/supabase';
import type { DiaryEntry } from '../types/diary';

const STORAGE_KEY = 'movie-diary-entries';
const MIGRATED_KEY = 'movie-diary-migrated';

function getLocalEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function migrateLocalToCloud(userId: string): Promise<{ migrated: number; error: string | null }> {
  if (localStorage.getItem(MIGRATED_KEY) === userId) {
    return { migrated: 0, error: null };
  }

  const localEntries = getLocalEntries();
  if (localEntries.length === 0) {
    localStorage.setItem(MIGRATED_KEY, userId);
    return { migrated: 0, error: null };
  }

  const rows = localEntries.map((e) => ({
    user_id: userId,
    movie_id: e.movieId,
    movie_title: e.movieTitle,
    poster_path: e.posterPath,
    rating: e.rating,
    review: e.review,
    watch_date: e.watchDate,
    mood: e.mood,
    tags: e.tags,
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  }));

  const { error } = await supabase.from('diary_entries').upsert(rows, {
    onConflict: 'id',
    ignoreDuplicates: true,
  });

  if (error) {
    return { migrated: 0, error: error.message };
  }

  localStorage.setItem(MIGRATED_KEY, userId);
  return { migrated: localEntries.length, error: null };
}

export async function fetchCloudEntries(userId: string): Promise<DiaryEntry[]> {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    movieId: row.movie_id,
    movieTitle: row.movie_title,
    posterPath: row.poster_path,
    rating: row.rating,
    review: row.review,
    watchDate: row.watch_date,
    mood: row.mood,
    tags: row.tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function createCloudEntry(
  userId: string,
  entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<DiaryEntry | null> {
  const { data, error } = await supabase
    .from('diary_entries')
    .insert({
      user_id: userId,
      movie_id: entry.movieId,
      movie_title: entry.movieTitle,
      poster_path: entry.posterPath,
      rating: entry.rating,
      review: entry.review,
      watch_date: entry.watchDate,
      mood: entry.mood,
      tags: entry.tags,
    })
    .select()
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    movieId: data.movie_id,
    movieTitle: data.movie_title,
    posterPath: data.poster_path,
    rating: data.rating,
    review: data.review,
    watchDate: data.watch_date,
    mood: data.mood,
    tags: data.tags,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateCloudEntry(
  entryId: string,
  updates: Partial<Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<boolean> {
  const mapped: Record<string, unknown> = {};
  if (updates.movieId !== undefined) mapped.movie_id = updates.movieId;
  if (updates.movieTitle !== undefined) mapped.movie_title = updates.movieTitle;
  if (updates.posterPath !== undefined) mapped.poster_path = updates.posterPath;
  if (updates.rating !== undefined) mapped.rating = updates.rating;
  if (updates.review !== undefined) mapped.review = updates.review;
  if (updates.watchDate !== undefined) mapped.watch_date = updates.watchDate;
  if (updates.mood !== undefined) mapped.mood = updates.mood;
  if (updates.tags !== undefined) mapped.tags = updates.tags;

  const { error } = await supabase
    .from('diary_entries')
    .update(mapped)
    .eq('id', entryId);

  return !error;
}

export async function deleteCloudEntry(entryId: string): Promise<boolean> {
  const { error } = await supabase
    .from('diary_entries')
    .delete()
    .eq('id', entryId);

  return !error;
}
