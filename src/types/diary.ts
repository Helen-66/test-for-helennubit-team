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
  createdAt: string;
  updatedAt: string;
}

export type DiaryEntryDraft = Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>;

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

export const TAG_OPTIONS = [
  '经典',
  '催泪',
  '烧脑',
  '治愈',
  '搞笑',
  '恐怖',
  '浪漫',
  '动作',
  '科幻',
  '纪录片',
] as const;
