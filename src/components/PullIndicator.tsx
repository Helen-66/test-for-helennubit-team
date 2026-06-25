interface PullIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold: number;
}

export default function PullIndicator({ pullDistance, isRefreshing, threshold }: PullIndicatorProps) {
  if (pullDistance <= 0 && !isRefreshing) return null;

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 360;

  return (
    <div
      className="pull-indicator"
      style={{ height: pullDistance, opacity: Math.min(progress + 0.3, 1) }}
    >
      <span
        className="pull-indicator__icon"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {isRefreshing ? '⏳' : progress >= 1 ? '↻' : '↓'}
      </span>
      <span className="pull-indicator__text">
        {isRefreshing ? '刷新中...' : progress >= 1 ? '释放刷新' : '下拉刷新'}
      </span>
    </div>
  );
}
