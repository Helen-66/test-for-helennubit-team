export type ViewMode = 'timeline' | 'grid' | 'list';

export type SortField = 'watchDate' | 'rating' | 'movieTitle';
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  order: SortOrder;
}

export interface FilterState {
  year: string;
  tag: string;
  minRating: number;
}

export const ITEMS_PER_PAGE = 12;
