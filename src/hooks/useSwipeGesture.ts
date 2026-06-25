import { useRef, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_TIME_LIMIT = 300;

export function useSwipeGesture(handlers: SwipeHandlers) {
  const touchState = useRef<TouchState | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchState.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchState.current.startX;
      const dy = touch.clientY - touchState.current.startY;
      const dt = Date.now() - touchState.current.startTime;

      if (dt > SWIPE_TIME_LIMIT) return;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx > absDy && absDx > SWIPE_THRESHOLD) {
        if (dx > 0) handlers.onSwipeRight?.();
        else handlers.onSwipeLeft?.();
      } else if (absDy > absDx && absDy > SWIPE_THRESHOLD) {
        if (dy > 0) handlers.onSwipeDown?.();
        else handlers.onSwipeUp?.();
      }

      touchState.current = null;
    },
    [handlers],
  );

  return { onTouchStart, onTouchEnd };
}
