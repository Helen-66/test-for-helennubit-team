import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyTrend } from '../services/statsUtils';

interface Props {
  data: MonthlyTrend[];
}

export default function MonthlyTrendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="stats-card">
        <h3 className="stats-card__title">观影趋势</h3>
        <p className="stats-card__empty">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="stats-card">
      <h3 className="stats-card__title">观影趋势</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            tickFormatter={(v: string) => {
              const parts = v.split('-');
              return `${parts[1]}月`;
            }}
          />
          <YAxis allowDecimals={false} stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelFormatter={(v) => String(v)}
          />
          <Line
            type="monotone"
            dataKey="count"
            name="观影数"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: '#6366f1', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
