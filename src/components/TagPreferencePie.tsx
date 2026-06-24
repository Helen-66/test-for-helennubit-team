import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TagCount } from '../services/statsUtils';

const COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd',
  '#818cf8', '#60a5fa', '#38bdf8', '#22d3ee',
  '#2dd4bf', '#34d399',
];

interface Props {
  data: TagCount[];
  title: string;
}

export default function TagPreferencePie({ data, title }: Props) {
  if (data.length === 0) {
    return (
      <div className="stats-card">
        <h3 className="stats-card__title">{title}</h3>
        <p className="stats-card__empty">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="stats-card">
      <h3 className="stats-card__title">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) =>
              `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
            }
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
