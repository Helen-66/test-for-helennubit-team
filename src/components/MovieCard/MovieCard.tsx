import { StarRating } from '../StarRating/StarRating';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  title: string;
  year?: number;
  posterUrl?: string;
  rating?: number;
  onClick?: () => void;
}

export function MovieCard({ title, year, posterUrl, rating, onClick }: MovieCardProps) {
  return (
    <div className={styles.movieCard} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.posterWrapper}>
        {posterUrl ? (
          <img className={styles.poster} src={posterUrl} alt={`${title} poster`} />
        ) : (
          <div className={styles.placeholder}>🎬</div>
        )}
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <div className={styles.overlayTitle}>{title}</div>
            {rating != null && <StarRating value={rating} size="sm" readonly />}
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>
          {year && <span className={styles.year}>{year}</span>}
          {rating != null && <StarRating value={rating} size="sm" readonly />}
        </div>
      </div>
    </div>
  );
}
