export default function SkeletonCard() {
  return (
    <div className="diary-card skeleton-card" aria-hidden="true">
      <div className="diary-card__header">
        <div className="skeleton skeleton--poster" />
        <div className="diary-card__info">
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--stars" />
          <div className="skeleton skeleton--date" />
        </div>
      </div>
      <div className="skeleton skeleton--tags" />
      <div className="skeleton skeleton--review" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="diary-list">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
