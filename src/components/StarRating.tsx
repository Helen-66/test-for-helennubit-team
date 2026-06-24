import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export default function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating" role="radiogroup" aria-label="电影评分">
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= (hovered || value);
        return (
          <button
            key={starValue}
            type="button"
            className={`star ${filled ? 'star--filled' : ''}`}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${starValue} 星`}
            role="radio"
            aria-checked={starValue === value}
          >
            ★
          </button>
        );
      })}
      <span className="star-rating__label">{value > 0 ? `${value} / ${max}` : '未评分'}</span>
    </div>
  );
}
