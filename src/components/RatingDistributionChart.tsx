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
import type { RatingDistribution } from '../services/statsUtils';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#6366f1'];

interface Props {
  data: RatingDistribution[];
}

export default function RatingDistributionChart({ data }: Props) {
  return (
    <div className="stats-card">
      <h3 className="stats-card__title">评分分布</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="rating"
            tickFormatter={(v: number) => `${v}★`}
            stroke="#94a3b8"
          />
          <YAxis allowDecimals={false} stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelFormatter={(v) => `${v} 星`}
          />
          <Bar dataKey="count" name="数量" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
