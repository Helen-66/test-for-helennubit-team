interface EmptyCollectionProps {
  hasFilters: boolean;
  onReset: () => void;
  onCreate: () => void;
}

export default function EmptyCollection({ hasFilters, onReset, onCreate }: EmptyCollectionProps) {
  if (hasFilters) {
    return (
      <div className="empty-collection">
        <div className="empty-collection__icon">🔍</div>
        <h3>没有找到匹配的电影</h3>
        <p>试试调整筛选条件或搜索关键词</p>
        <button type="button" className="btn btn--primary" onClick={onReset}>
          清除筛选
        </button>
      </div>
    );
  }

  return (
    <div className="empty-collection">
      <div className="empty-collection__icon">🎬</div>
      <h3>你的电影收藏是空的</h3>
      <p>开始记录你的观影旅程吧！每一部电影都值得被记住。</p>
      <div className="empty-collection__tips">
        <div className="empty-collection__tip">
          <span className="empty-collection__tip-icon">📝</span>
          <span>写下观影感受和心得</span>
        </div>
        <div className="empty-collection__tip">
          <span className="empty-collection__tip-icon">⭐</span>
          <span>为电影打分评级</span>
        </div>
        <div className="empty-collection__tip">
          <span className="empty-collection__tip-icon">🏷️</span>
          <span>用标签整理你的电影</span>
        </div>
      </div>
      <button type="button" className="btn btn--primary" onClick={onCreate}>
        + 记录第一部电影
      </button>
    </div>
  );
}
