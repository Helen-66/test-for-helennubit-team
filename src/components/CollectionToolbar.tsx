import type { ViewMode, SortOption, SortField, FilterState } from '../types/collection';

interface CollectionToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sort: SortOption;
  onSortChange: (option: SortOption) => void;
  filter: FilterState;
  onFilterChange: (patch: Partial<FilterState>) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  availableYears: string[];
  availableTags: string[];
  totalFiltered: number;
  totalEntries: number;
}

const VIEW_ICONS: Record<ViewMode, string> = {
  timeline: '📅',
  grid: '🖼️',
  list: '📋',
};

const VIEW_LABELS: Record<ViewMode, string> = {
  timeline: '时间线',
  grid: '海报墙',
  list: '列表',
};

const SORT_LABELS: Record<SortField, string> = {
  watchDate: '日期',
  rating: '评分',
  movieTitle: '片名',
};

export default function CollectionToolbar({
  viewMode,
  onViewModeChange,
  sort,
  onSortChange,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  onReset,
  hasActiveFilters,
  availableYears,
  availableTags,
  totalFiltered,
  totalEntries,
}: CollectionToolbarProps) {
  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({ field: e.target.value as SortField, order: sort.order });
  };

  const toggleSortOrder = () => {
    onSortChange({ field: sort.field, order: sort.order === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <div className="collection-toolbar">
      <div className="collection-toolbar__row">
        <div className="collection-toolbar__search">
          <input
            type="text"
            placeholder="搜索电影名称、影评、标签..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="collection-toolbar__search-input"
          />
        </div>
        <div className="collection-toolbar__views">
          {(Object.keys(VIEW_ICONS) as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`collection-toolbar__view-btn ${viewMode === mode ? 'collection-toolbar__view-btn--active' : ''}`}
              onClick={() => onViewModeChange(mode)}
              title={VIEW_LABELS[mode]}
            >
              {VIEW_ICONS[mode]}
            </button>
          ))}
        </div>
      </div>

      <div className="collection-toolbar__row">
        <div className="collection-toolbar__filters">
          <select
            value={filter.year}
            onChange={(e) => onFilterChange({ year: e.target.value })}
            className="collection-toolbar__select"
          >
            <option value="">全部年份</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={filter.tag}
            onChange={(e) => onFilterChange({ tag: e.target.value })}
            className="collection-toolbar__select"
          >
            <option value="">全部类型</option>
            {availableTags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={filter.minRating}
            onChange={(e) => onFilterChange({ minRating: Number(e.target.value) })}
            className="collection-toolbar__select"
          >
            <option value={0}>全部评分</option>
            <option value={5}>★★★★★</option>
            <option value={4}>★★★★ 及以上</option>
            <option value={3}>★★★ 及以上</option>
            <option value={2}>★★ 及以上</option>
            <option value={1}>★ 及以上</option>
          </select>

          <div className="collection-toolbar__sort">
            <select
              value={sort.field}
              onChange={handleSortFieldChange}
              className="collection-toolbar__select"
            >
              {(Object.keys(SORT_LABELS) as SortField[]).map((field) => (
                <option key={field} value={field}>{SORT_LABELS[field]}</option>
              ))}
            </select>
            <button
              type="button"
              className="collection-toolbar__sort-btn"
              onClick={toggleSortOrder}
              title={sort.order === 'asc' ? '升序' : '降序'}
            >
              {sort.order === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {hasActiveFilters && (
            <button type="button" className="btn btn--secondary collection-toolbar__reset" onClick={onReset}>
              清除筛选
            </button>
          )}
        </div>

        <span className="collection-toolbar__count">
          {totalFiltered === totalEntries
            ? `共 ${totalEntries} 部`
            : `${totalFiltered} / ${totalEntries} 部`}
        </span>
      </div>
    </div>
  );
}
