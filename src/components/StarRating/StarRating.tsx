import { useState } from 'react';
import styles from './StarRating.module.css';

interface StarRatingProps {
  value?: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (rating: number) => void;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`${styles.starIcon} ${filled ? styles.filled : styles.empty}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function StarRating({
  value = 0,
  maxStars = 5,
  size = 'md',
  readonly = false,
  onChange,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayValue = hovered ?? value;

  return (
    <div
      className={`${styles.container} ${styles[size]}`}
      onMouseLeave={() => !readonly && setHovered(null)}
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            className={`${styles.star} ${readonly ? styles.readonly : ''}`}
            onClick={() => !readonly && onChange?.(starValue)}
            onMouseEnter={() => !readonly && setHovered(starValue)}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            disabled={readonly}
          >
            <StarIcon filled={starValue <= displayValue} />
          </button>
        );
      })}
    </div>
  );
}
