import type { DiaryEntry } from '../types/diary';

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface TagCount {
  name: string;
  count: number;
}

export interface MonthlyTrend {
  month: string; // "YYYY-MM"
  count: number;
}

export interface CalendarDay {
  date: string; // "YYYY-MM-DD"
  count: number;
}

export interface RankedMovie {
  movieTitle: string;
  rating: number;
  watchDate: string;
}

export interface OverviewStats {
  totalEntries: number;
  averageRating: number;
  totalTags: number;
  uniqueMovies: number;
}

export function computeOverview(entries: DiaryEntry[]): OverviewStats {
  if (entries.length === 0) {
    return { totalEntries: 0, averageRating: 0, totalTags: 0, uniqueMovies: 0 };
  }
  const totalRating = entries.reduce((sum, e) => sum + e.rating, 0);
  const uniqueMovies = new Set(entries.map((e) => e.movieTitle)).size;
  const totalTags = entries.reduce((sum, e) => sum + e.tags.length, 0);
  return {
    totalEntries: entries.length,
    averageRating: Math.round((totalRating / entries.length) * 10) / 10,
    totalTags,
    uniqueMovies,
  };
}

export function computeRatingDistribution(entries: DiaryEntry[]): RatingDistribution[] {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const e of entries) {
    if (e.rating >= 1 && e.rating <= 5) {
      counts[e.rating]++;
    }
  }
  return [1, 2, 3, 4, 5].map((r) => ({ rating: r, count: counts[r] }));
}

export function computeTagPreference(entries: DiaryEntry[]): TagCount[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    for (const tag of e.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeMoodPreference(entries: DiaryEntry[]): TagCount[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    if (e.mood) {
      map.set(e.mood, (map.get(e.mood) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeMonthlyTrend(entries: DiaryEntry[]): MonthlyTrend[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    const month = e.watchDate.slice(0, 7); // "YYYY-MM"
    map.set(month, (map.get(month) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function computeCalendarData(entries: DiaryEntry[], year: number): CalendarDay[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    if (e.watchDate.startsWith(String(year))) {
      map.set(e.watchDate, (map.get(e.watchDate) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function computeTopRatedMovies(entries: DiaryEntry[], limit = 5): RankedMovie[] {
  return [...entries]
    .sort((a, b) => b.rating - a.rating || a.watchDate.localeCompare(b.watchDate))
    .slice(0, limit)
    .map((e) => ({ movieTitle: e.movieTitle, rating: e.rating, watchDate: e.watchDate }));
}

export function getAvailableYears(entries: DiaryEntry[]): number[] {
  const years = new Set<number>();
  for (const e of entries) {
    const y = parseInt(e.watchDate.slice(0, 4), 10);
    if (!isNaN(y)) years.add(y);
  }
  return Array.from(years).sort((a, b) => b - a);
}

export interface AnnualSummary {
  year: number;
  totalEntries: number;
  uniqueMovies: number;
  averageRating: number;
  topRatedMovies: RankedMovie[];
  favoriteTag: string | null;
  favoriteMood: string | null;
  mostActiveMonth: string | null;
  ratingDistribution: RatingDistribution[];
}

export function computeAnnualSummary(entries: DiaryEntry[], year: number): AnnualSummary {
  const yearEntries = entries.filter((e) => e.watchDate.startsWith(String(year)));
  const overview = computeOverview(yearEntries);
  const tags = computeTagPreference(yearEntries);
  const moods = computeMoodPreference(yearEntries);
  const monthly = computeMonthlyTrend(yearEntries);
  const topRated = computeTopRatedMovies(yearEntries, 5);

  const mostActiveMonth = monthly.length > 0
    ? monthly.reduce((a, b) => (b.count > a.count ? b : a)).month
    : null;

  return {
    year,
    totalEntries: overview.totalEntries,
    uniqueMovies: overview.uniqueMovies,
    averageRating: overview.averageRating,
    topRatedMovies: topRated,
    favoriteTag: tags.length > 0 ? tags[0].name : null,
    favoriteMood: moods.length > 0 ? moods[0].name : null,
    mostActiveMonth,
    ratingDistribution: computeRatingDistribution(yearEntries),
  };
}
