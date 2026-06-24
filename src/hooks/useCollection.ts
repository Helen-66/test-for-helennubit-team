import { useState, useMemo, useCallback } from 'react';
import type { DiaryEntry } from '../types/diary';
import type { SortOption, FilterState, ViewMode } from '../types/collection';
import { ITEMS_PER_PAGE } from '../types/collection';

const DEFAULT_SORT: SortOption = { field: 'watchDate', order: 'desc' };
const DEFAULT_FILTER: FilterState = { year: '', tag: '', minRating: 0 };

export function useCollection(entries: DiaryEntry[]) {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const availableYears = useMemo(() => {
    const years = new Set(entries.map((e) => e.watchDate.slice(0, 4)));
    return Array.from(years).sort().reverse();
  }, [entries]);

  const availableTags = useMemo(() => {
    const tags = new Set(entries.flatMap((e) => e.tags));
    return Array.from(tags).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    let result = entries;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.movieTitle.toLowerCase().includes(q) ||
          e.review.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (filter.year) {
      result = result.filter((e) => e.watchDate.startsWith(filter.year));
    }

    if (filter.tag) {
      result = result.filter((e) => e.tags.includes(filter.tag));
    }

    if (filter.minRating > 0) {
      result = result.filter((e) => e.rating >= filter.minRating);
    }

    return result;
  }, [entries, search, filter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    const { field, order } = sort;
    copy.sort((a, b) => {
      let cmp = 0;
      if (field === 'watchDate') {
        cmp = a.watchDate.localeCompare(b.watchDate);
      } else if (field === 'rating') {
        cmp = a.rating - b.rating;
      } else {
        cmp = a.movieTitle.localeCompare(b.movieTitle);
      }
      return order === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const paged = useMemo(
    () => sorted.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [sorted, safePage],
  );

  const resetFilters = useCallback(() => {
    setFilter(DEFAULT_FILTER);
    setSearch('');
    setPage(1);
  }, []);

  const updateFilter = useCallback(
    (patch: Partial<FilterState>) => {
      setFilter((prev) => ({ ...prev, ...patch }));
      setPage(1);
    },
    [],
  );

  const updateSort = useCallback((option: SortOption) => {
    setSort(option);
    setPage(1);
  }, []);

  const updateSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  return {
    viewMode,
    setViewMode,
    sort,
    updateSort,
    filter,
    updateFilter,
    search,
    updateSearch,
    resetFilters,
    page: safePage,
    setPage,
    totalPages,
    totalFiltered: sorted.length,
    entries: paged,
    availableYears,
    availableTags,
    hasActiveFilters: search.trim() !== '' || filter.year !== '' || filter.tag !== '' || filter.minRating > 0,
  };
}
