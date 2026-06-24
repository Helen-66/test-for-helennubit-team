interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination__btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ‹ 上一页
      </button>

      <div className="pagination__pages">
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`pagination__page ${p === page ? 'pagination__page--active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="pagination__btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        下一页 ›
      </button>
    </div>
  );
}
