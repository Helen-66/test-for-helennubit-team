import { useState, useRef, useCallback } from 'react';

const PULL_THRESHOLD = 80;

export function usePullToRefresh(onRefresh: () => void) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      setPulling(true);
      setPullDistance(Math.min(dy * 0.5, PULL_THRESHOLD * 1.5));
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (pullDistance >= PULL_THRESHOLD) {
      onRefresh();
    }
    isPulling.current = false;
    setPulling(false);
    setPullDistance(0);
  }, [pullDistance, onRefresh]);

  return { pulling, pullDistance, onTouchStart, onTouchMove, onTouchEnd };
}
