export default function DiaryCardSkeleton() {
  return (
    <div className="diary-card diary-card--skeleton" aria-hidden="true">
      <div className="diary-card__header">
        <div className="skeleton-pulse skeleton-poster" />
        <div className="diary-card__info">
          <div className="skeleton-pulse skeleton-title" />
          <div className="skeleton-pulse skeleton-rating" />
          <div className="skeleton-pulse skeleton-date" />
        </div>
      </div>
      <div className="skeleton-pulse skeleton-review" />
      <div className="diary-card__actions">
        <div className="skeleton-pulse skeleton-btn" />
        <div className="skeleton-pulse skeleton-btn" />
      </div>
    </div>
  );
}
