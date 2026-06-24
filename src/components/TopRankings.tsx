import type { RankedMovie, TagCount } from '../services/statsUtils';

interface Props {
  topMovies: RankedMovie[];
  topTags: TagCount[];
  topMoods: TagCount[];
}

export default function TopRankings({ topMovies, topTags, topMoods }: Props) {
  return (
    <div className="stats-card">
      <h3 className="stats-card__title">TOP 排行</h3>
      <div className="rankings-grid">
        <div className="ranking-section">
          <h4 className="ranking-section__title">🏆 最高评分电影</h4>
          {topMovies.length === 0 ? (
            <p className="stats-card__empty">暂无数据</p>
          ) : (
            <ol className="ranking-list">
              {topMovies.map((m, i) => (
                <li key={`${m.movieTitle}-${i}`} className="ranking-item">
                  <span className="ranking-item__rank">#{i + 1}</span>
                  <span className="ranking-item__name">{m.movieTitle}</span>
                  <span className="ranking-item__value">
                    {'★'.repeat(m.rating)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="ranking-section">
          <h4 className="ranking-section__title">🏷️ 最爱标签</h4>
          {topTags.length === 0 ? (
            <p className="stats-card__empty">暂无数据</p>
          ) : (
            <ol className="ranking-list">
              {topTags.slice(0, 5).map((t, i) => (
                <li key={t.name} className="ranking-item">
                  <span className="ranking-item__rank">#{i + 1}</span>
                  <span className="ranking-item__name">{t.name}</span>
                  <span className="ranking-item__value">{t.count} 次</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="ranking-section">
          <h4 className="ranking-section__title">💭 最常心情</h4>
          {topMoods.length === 0 ? (
            <p className="stats-card__empty">暂无数据</p>
          ) : (
            <ol className="ranking-list">
              {topMoods.slice(0, 5).map((m, i) => (
                <li key={m.name} className="ranking-item">
                  <span className="ranking-item__rank">#{i + 1}</span>
                  <span className="ranking-item__name">{m.name}</span>
                  <span className="ranking-item__value">{m.count} 次</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
