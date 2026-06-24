import { useState, useMemo } from 'react';
import type { DiaryEntry } from '../types/diary';
import {
  computeOverview,
  computeRatingDistribution,
  computeTagPreference,
  computeMoodPreference,
  computeMonthlyTrend,
  computeCalendarData,
  computeTopRatedMovies,
  computeAnnualSummary,
  getAvailableYears,
} from '../services/statsUtils';
import RatingDistributionChart from './RatingDistributionChart';
import TagPreferencePie from './TagPreferencePie';
import MonthlyTrendChart from './MonthlyTrendChart';
import CalendarHeatmap from './CalendarHeatmap';
import TopRankings from './TopRankings';
import AnnualReport from './AnnualReport';

interface Props {
  entries: DiaryEntry[];
  onBack: () => void;
}

export default function StatsDashboard({ entries, onBack }: Props) {
  const currentYear = new Date().getFullYear();
  const availableYears = useMemo(() => getAvailableYears(entries), [entries]);
  const [selectedYear, setSelectedYear] = useState(() =>
    availableYears.includes(currentYear) ? currentYear : (availableYears[0] ?? currentYear),
  );
  const [showReport, setShowReport] = useState(false);

  const overview = useMemo(() => computeOverview(entries), [entries]);
  const ratingDist = useMemo(() => computeRatingDistribution(entries), [entries]);
  const tagPref = useMemo(() => computeTagPreference(entries), [entries]);
  const moodPref = useMemo(() => computeMoodPreference(entries), [entries]);
  const monthlyTrend = useMemo(() => computeMonthlyTrend(entries), [entries]);
  const calendarData = useMemo(
    () => computeCalendarData(entries, selectedYear),
    [entries, selectedYear],
  );
  const topMovies = useMemo(() => computeTopRatedMovies(entries), [entries]);
  const annualSummary = useMemo(
    () => computeAnnualSummary(entries, selectedYear),
    [entries, selectedYear],
  );

  if (showReport) {
    return <AnnualReport summary={annualSummary} onClose={() => setShowReport(false)} />;
  }

  if (entries.length === 0) {
    return (
      <div className="stats-dashboard">
        <div className="stats-dashboard__header">
          <button type="button" className="btn btn--secondary" onClick={onBack}>
            ← 返回
          </button>
        </div>
        <div className="empty-state">
          <p>还没有观影记录，快去记录你的第一部电影吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-dashboard">
      <div className="stats-dashboard__header">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          ← 返回
        </button>
        <h2>📊 观影统计</h2>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setShowReport(true)}
        >
          年度报告
        </button>
      </div>

      {/* Overview cards */}
      <div className="stats-overview">
        <div className="stats-metric">
          <span className="stats-metric__value">{overview.totalEntries}</span>
          <span className="stats-metric__label">总记录数</span>
        </div>
        <div className="stats-metric">
          <span className="stats-metric__value">{overview.uniqueMovies}</span>
          <span className="stats-metric__label">不同电影</span>
        </div>
        <div className="stats-metric">
          <span className="stats-metric__value">{overview.averageRating}</span>
          <span className="stats-metric__label">平均评分</span>
        </div>
        <div className="stats-metric">
          <span className="stats-metric__value">{overview.totalTags}</span>
          <span className="stats-metric__label">标签使用</span>
        </div>
      </div>

      {/* Charts row */}
      <div className="stats-charts-row">
        <RatingDistributionChart data={ratingDist} />
        <TagPreferencePie data={tagPref} title="标签偏好" />
      </div>

      <div className="stats-charts-row">
        <MonthlyTrendChart data={monthlyTrend} />
        <TagPreferencePie data={moodPref} title="心情分布" />
      </div>

      {/* Calendar Heatmap */}
      <div className="stats-calendar-section">
        <div className="stats-calendar-controls">
          <label htmlFor="calendar-year">年份：</label>
          <select
            id="calendar-year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="stats-year-select"
          >
            {(availableYears.length > 0 ? availableYears : [currentYear]).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <CalendarHeatmap data={calendarData} year={selectedYear} />
      </div>

      {/* Rankings */}
      <TopRankings topMovies={topMovies} topTags={tagPref} topMoods={moodPref} />
    </div>
  );
}
