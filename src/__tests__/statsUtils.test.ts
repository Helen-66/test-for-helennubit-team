import { describe, it, expect } from 'vitest';
import type { DiaryEntry } from '../types/diary';
import {
  computeOverview,
  computeRatingDistribution,
  computeTagPreference,
  computeMoodPreference,
  computeMonthlyTrend,
  computeCalendarData,
  computeTopRatedMovies,
  computeAnnualSummary,
  getAvailableYears,
} from '../services/statsUtils';

function makeEntry(overrides: Partial<DiaryEntry> = {}): DiaryEntry {
  return {
    id: 'test-id',
    movieId: 1,
    movieTitle: 'Test Movie',
    posterPath: '',
    rating: 4,
    review: '',
    watchDate: '2024-06-15',
    mood: '愉悦',
    tags: ['科幻'],
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
    ...overrides,
  };
}

describe('statsUtils', () => {
  describe('computeOverview', () => {
    it('returns zeros for empty entries', () => {
      const result = computeOverview([]);
      expect(result).toEqual({
        totalEntries: 0,
        averageRating: 0,
        totalTags: 0,
        uniqueMovies: 0,
      });
    });

    it('computes correct overview stats', () => {
      const entries = [
        makeEntry({ id: '1', rating: 5, tags: ['科幻', '烧脑'], movieTitle: 'A' }),
        makeEntry({ id: '2', rating: 3, tags: ['治愈'], movieTitle: 'B' }),
        makeEntry({ id: '3', rating: 4, tags: [], movieTitle: 'A' }),
      ];
      const result = computeOverview(entries);
      expect(result.totalEntries).toBe(3);
      expect(result.averageRating).toBe(4);
      expect(result.totalTags).toBe(3);
      expect(result.uniqueMovies).toBe(2);
    });
  });

  describe('computeRatingDistribution', () => {
    it('returns zero counts for each rating when empty', () => {
      const result = computeRatingDistribution([]);
      expect(result).toHaveLength(5);
      expect(result.every((r) => r.count === 0)).toBe(true);
    });

    it('counts ratings correctly', () => {
      const entries = [
        makeEntry({ rating: 5 }),
        makeEntry({ rating: 5 }),
        makeEntry({ rating: 3 }),
        makeEntry({ rating: 1 }),
      ];
      const result = computeRatingDistribution(entries);
      expect(result.find((r) => r.rating === 5)?.count).toBe(2);
      expect(result.find((r) => r.rating === 3)?.count).toBe(1);
      expect(result.find((r) => r.rating === 1)?.count).toBe(1);
      expect(result.find((r) => r.rating === 2)?.count).toBe(0);
    });
  });

  describe('computeTagPreference', () => {
    it('returns empty for no entries', () => {
      expect(computeTagPreference([])).toEqual([]);
    });

    it('aggregates and sorts tags by count', () => {
      const entries = [
        makeEntry({ tags: ['科幻', '烧脑'] }),
        makeEntry({ tags: ['科幻', '治愈'] }),
        makeEntry({ tags: ['烧脑'] }),
      ];
      const result = computeTagPreference(entries);
      expect(result[0]).toEqual({ name: '科幻', count: 2 });
      expect(result[1]).toEqual({ name: '烧脑', count: 2 });
      expect(result[2]).toEqual({ name: '治愈', count: 1 });
    });
  });

  describe('computeMoodPreference', () => {
    it('aggregates moods correctly', () => {
      const entries = [
        makeEntry({ mood: '愉悦' }),
        makeEntry({ mood: '愉悦' }),
        makeEntry({ mood: '感动' }),
        makeEntry({ mood: '' }),
      ];
      const result = computeMoodPreference(entries);
      expect(result[0]).toEqual({ name: '愉悦', count: 2 });
      expect(result[1]).toEqual({ name: '感动', count: 1 });
    });
  });

  describe('computeMonthlyTrend', () => {
    it('groups entries by month and sorts', () => {
      const entries = [
        makeEntry({ watchDate: '2024-01-10' }),
        makeEntry({ watchDate: '2024-01-20' }),
        makeEntry({ watchDate: '2024-03-05' }),
      ];
      const result = computeMonthlyTrend(entries);
      expect(result).toEqual([
        { month: '2024-01', count: 2 },
        { month: '2024-03', count: 1 },
      ]);
    });
  });

  describe('computeCalendarData', () => {
    it('filters by year and groups by date', () => {
      const entries = [
        makeEntry({ watchDate: '2024-06-15' }),
        makeEntry({ watchDate: '2024-06-15' }),
        makeEntry({ watchDate: '2023-06-15' }),
      ];
      const result = computeCalendarData(entries, 2024);
      expect(result).toEqual([{ date: '2024-06-15', count: 2 }]);
    });
  });

  describe('computeTopRatedMovies', () => {
    it('returns top movies sorted by rating desc', () => {
      const entries = [
        makeEntry({ movieTitle: 'A', rating: 3, watchDate: '2024-01-01' }),
        makeEntry({ movieTitle: 'B', rating: 5, watchDate: '2024-02-01' }),
        makeEntry({ movieTitle: 'C', rating: 4, watchDate: '2024-03-01' }),
      ];
      const result = computeTopRatedMovies(entries, 2);
      expect(result).toHaveLength(2);
      expect(result[0].movieTitle).toBe('B');
      expect(result[1].movieTitle).toBe('C');
    });
  });

  describe('getAvailableYears', () => {
    it('extracts unique years sorted desc', () => {
      const entries = [
        makeEntry({ watchDate: '2024-01-01' }),
        makeEntry({ watchDate: '2023-05-01' }),
        makeEntry({ watchDate: '2024-12-01' }),
      ];
      expect(getAvailableYears(entries)).toEqual([2024, 2023]);
    });
  });

  describe('computeAnnualSummary', () => {
    it('generates summary for a given year', () => {
      const entries = [
        makeEntry({ id: '1', watchDate: '2024-03-01', rating: 5, movieTitle: 'A', tags: ['科幻'], mood: '震撼' }),
        makeEntry({ id: '2', watchDate: '2024-03-15', rating: 4, movieTitle: 'B', tags: ['科幻', '烧脑'], mood: '震撼' }),
        makeEntry({ id: '3', watchDate: '2024-07-01', rating: 3, movieTitle: 'C', tags: ['治愈'], mood: '愉悦' }),
        makeEntry({ id: '4', watchDate: '2023-01-01', rating: 5, movieTitle: 'D', tags: ['经典'], mood: '感动' }),
      ];
      const summary = computeAnnualSummary(entries, 2024);
      expect(summary.year).toBe(2024);
      expect(summary.totalEntries).toBe(3);
      expect(summary.uniqueMovies).toBe(3);
      expect(summary.averageRating).toBe(4);
      expect(summary.favoriteTag).toBe('科幻');
      expect(summary.favoriteMood).toBe('震撼');
      expect(summary.mostActiveMonth).toBe('2024-03');
      expect(summary.topRatedMovies[0].movieTitle).toBe('A');
    });
  });
});
