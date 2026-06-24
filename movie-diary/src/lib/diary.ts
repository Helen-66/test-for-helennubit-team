"use client";

import { DiaryEntry } from "@/types/movie";

const STORAGE_KEY = "movie-diary-entries";

export function getDiaryEntries(): DiaryEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addDiaryEntry(entry: Omit<DiaryEntry, "id" | "createdAt">): DiaryEntry {
  const entries = getDiaryEntries();
  const newEntry: DiaryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return newEntry;
}

export function isDiaryEntryExists(movieId: number): boolean {
  const entries = getDiaryEntries();
  return entries.some((e) => e.movieId === movieId);
}
