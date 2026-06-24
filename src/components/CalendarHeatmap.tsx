import { useMemo } from 'react';
import type { CalendarDay } from '../services/statsUtils';

interface Props {
  data: CalendarDay[];
  year: number;
}

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const DAYS = ['日','一','二','三','四','五','六'];

function getColor(count: number): string {
  if (count === 0) return 'var(--color-surface-hover)';
  if (count === 1) return '#4c1d95';
  if (count === 2) return '#6d28d9';
  if (count === 3) return '#7c3aed';
  return '#8b5cf6';
}

export default function CalendarHeatmap({ data, year }: Props) {
  const { weeks, monthLabels } = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const d of data) {
      countMap.set(d.date, d.count);
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const weeksArr: { date: string; count: number; dayOfWeek: number }[][] = [];
    let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];

    const padStart = startDate.getDay();
    for (let i = 0; i < padStart; i++) {
      currentWeek.push({ date: '', count: -1, dayOfWeek: i });
    }

    const current = new Date(startDate);
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const dow = current.getDay();
      const month = current.getMonth();

      if (dow === 0 && currentWeek.length > 0) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }

      if (month !== lastMonth) {
        labels.push({ month: MONTHS[month], weekIndex: weeksArr.length });
        lastMonth = month;
      }

      currentWeek.push({
        date: dateStr,
        count: countMap.get(dateStr) ?? 0,
        dayOfWeek: dow,
      });

      current.setDate(current.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeksArr.push(currentWeek);
    }

    return { weeks: weeksArr, monthLabels: labels };
  }, [data, year]);

  const cellSize = 13;
  const cellGap = 2;
  const labelOffset = 20;

  return (
    <div className="stats-card">
      <h3 className="stats-card__title">观影日历 - {year}</h3>
      <div className="calendar-heatmap" style={{ overflowX: 'auto' }}>
        <svg
          width={weeks.length * (cellSize + cellGap) + 30}
          height={7 * (cellSize + cellGap) + labelOffset + 10}
        >
          {/* Day labels */}
          {DAYS.map((d, i) => (
            <text
              key={d}
              x={0}
              y={labelOffset + i * (cellSize + cellGap) + cellSize / 2 + 4}
              fill="#94a3b8"
              fontSize={10}
              style={{ display: i % 2 === 0 ? undefined : 'none' }}
            >
              {d}
            </text>
          ))}

          {/* Month labels */}
          {monthLabels.map(({ month, weekIndex }) => (
            <text
              key={month}
              x={20 + weekIndex * (cellSize + cellGap)}
              y={12}
              fill="#94a3b8"
              fontSize={10}
            >
              {month}
            </text>
          ))}

          {/* Cells */}
          {weeks.map((week, wi) =>
            week.map((day) => {
              if (day.count < 0) return null;
              return (
                <rect
                  key={day.date}
                  x={20 + wi * (cellSize + cellGap)}
                  y={labelOffset + day.dayOfWeek * (cellSize + cellGap)}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  fill={getColor(day.count)}
                  data-testid={`cal-cell-${day.date}`}
                >
                  <title>{`${day.date}: ${day.count} 部电影`}</title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>
      <div className="calendar-legend">
        <span className="calendar-legend__label">少</span>
        {[0, 1, 2, 3, 4].map((v) => (
          <span
            key={v}
            className="calendar-legend__cell"
            style={{ background: getColor(v) }}
          />
        ))}
        <span className="calendar-legend__label">多</span>
      </div>
    </div>
  );
}
