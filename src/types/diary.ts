export interface DiaryEntry {
  id: string;
  movieId: number;
  movieTitle: string;
  posterPath: string;
  rating: number; // 1-5
  review: string;
  watchDate: string;
  mood: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DiaryEntryDraft = Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>;

export interface Tag {
  id: string;
  name: string;
  color: string;
  order: number;
}

export type WatchStatus = '想看' | '在看' | '已看';

export interface WatchlistMovie {
  movieId: string;
  movieTitle: string;
  posterPath: string;
  status: WatchStatus;
  addedAt: string;
}

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  movies: WatchlistMovie[];
  isPublic: boolean;
  shareCode: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export const MOOD_OPTIONS = [
  '感动',
  '兴奋',
  '沉思',
  '轻松',
  '紧张',
  '悲伤',
  '愉悦',
  '震撼',
] as const;

export const TAG_PRESET_COLORS = [
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
] as const;

export const DEFAULT_TAGS: Omit<Tag, 'id'>[] = [
  { name: '经典', color: '#6366f1', order: 0 },
  { name: '催泪', color: '#ec4899', order: 1 },
  { name: '烧脑', color: '#f59e0b', order: 2 },
  { name: '治愈', color: '#10b981', order: 3 },
  { name: '搞笑', color: '#3b82f6', order: 4 },
  { name: '恐怖', color: '#ef4444', order: 5 },
  { name: '浪漫', color: '#8b5cf6', order: 6 },
  { name: '动作', color: '#14b8a6', order: 7 },
  { name: '科幻', color: '#f97316', order: 8 },
  { name: '纪录片', color: '#06b6d4', order: 9 },
];
