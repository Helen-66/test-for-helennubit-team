import type { ReactNode } from 'react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => void;
  children: ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const { pulling, pullDistance, onTouchStart, onTouchMove, onTouchEnd } =
    usePullToRefresh(onRefresh);

  return (
    <div
      className="pull-to-refresh"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {pulling && (
        <div
          className="pull-indicator"
          style={{ height: pullDistance, opacity: Math.min(pullDistance / 80, 1) }}
        >
          <span className="pull-indicator__text">
            {pullDistance >= 80 ? '释放刷新' : '下拉刷新'}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
