import type { AnnualSummary } from '../services/statsUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#6366f1'];

interface Props {
  summary: AnnualSummary;
  onClose: () => void;
}

export default function AnnualReport({ summary, onClose }: Props) {
  return (
    <div className="annual-report">
      <div className="annual-report__header">
        <h2>{summary.year} 年度观影总结</h2>
        <button type="button" className="btn btn--secondary" onClick={onClose}>
          关闭
        </button>
      </div>

      <div className="annual-report__highlights">
        <div className="highlight-card">
          <span className="highlight-card__icon">🎬</span>
          <span className="highlight-card__value">{summary.totalEntries}</span>
          <span className="highlight-card__label">观影记录</span>
        </div>
        <div className="highlight-card">
          <span className="highlight-card__icon">🎥</span>
          <span className="highlight-card__value">{summary.uniqueMovies}</span>
          <span className="highlight-card__label">部不同电影</span>
        </div>
        <div className="highlight-card">
          <span className="highlight-card__icon">⭐</span>
          <span className="highlight-card__value">{summary.averageRating}</span>
          <span className="highlight-card__label">平均评分</span>
        </div>
      </div>

      {summary.mostActiveMonth && (
        <div className="annual-report__section">
          <h3>📅 最活跃月份</h3>
          <p className="annual-report__detail">{summary.mostActiveMonth}</p>
        </div>
      )}

      {summary.favoriteTag && (
        <div className="annual-report__section">
          <h3>🏷️ 最爱标签</h3>
          <p className="annual-report__detail">{summary.favoriteTag}</p>
        </div>
      )}

      {summary.favoriteMood && (
        <div className="annual-report__section">
          <h3>💭 最常心情</h3>
          <p className="annual-report__detail">{summary.favoriteMood}</p>
        </div>
      )}

      {summary.topRatedMovies.length > 0 && (
        <div className="annual-report__section">
          <h3>🏆 年度最佳</h3>
          <ol className="ranking-list">
            {summary.topRatedMovies.map((m, i) => (
              <li key={`${m.movieTitle}-${i}`} className="ranking-item">
                <span className="ranking-item__rank">#{i + 1}</span>
                <span className="ranking-item__name">{m.movieTitle}</span>
                <span className="ranking-item__value">{'★'.repeat(m.rating)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="annual-report__section">
        <h3>📊 评分分布</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={summary.ratingDistribution} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="rating" tickFormatter={(v: number) => `${v}★`} stroke="#94a3b8" />
            <YAxis allowDecimals={false} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            />
            <Bar dataKey="count" name="数量" radius={[4, 4, 0, 0]}>
              {summary.ratingDistribution.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
