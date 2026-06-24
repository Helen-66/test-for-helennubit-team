interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
}

export default function FavoriteButton({ isFavorite, onClick }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={`favorite-btn ${isFavorite ? 'favorite-btn--active' : ''}`}
      onClick={onClick}
      aria-label={isFavorite ? '取消收藏' : '收藏'}
      title={isFavorite ? '取消收藏' : '收藏'}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}
