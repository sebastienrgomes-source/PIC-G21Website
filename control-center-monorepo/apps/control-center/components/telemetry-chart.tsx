'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Point {
  ts: string;
  t_internal: number | null;
  duty: number | null;
}

interface Props {
  points: Point[];
}

export function TelemetryChart({ points }: Props) {
  const data = points.map((point) => ({
    ...point,
    time: new Date(point.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dutyPercent: point.duty !== null ? Math.round(point.duty * 100) : null,
  }));

  if (data.length === 0) {
    return (
      <p className="rounded-xl border border-blue-100/80 bg-[#f5f8ff] p-3 text-sm text-[#3e5186]">
        Sem telemetria nas ultimas 24h.
      </p>
    );
  }

  return (
    <div className="h-80 w-full rounded-2xl border border-blue-100/80 bg-[#f8faff] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 14, right: 10, left: -10, bottom: 4 }}>
          <CartesianGrid stroke="#dbe4ff" strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={24} tick={{ fill: '#3a4f86', fontSize: 12 }} tickLine={false} />
          <YAxis yAxisId="temp" domain={['auto', 'auto']} tick={{ fill: '#3a4f86', fontSize: 12 }} tickLine={false} />
          <YAxis
            yAxisId="duty"
            orientation="right"
            domain={[0, 100]}
            tick={{ fill: '#3a4f86', fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              borderColor: '#d3defe',
              backgroundColor: '#ffffff',
              boxShadow: '0 10px 24px rgba(13,33,88,.13)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="t_internal"
            name="Temp interna (C)"
            stroke="#ef7b2f"
            dot={false}
            strokeWidth={2.4}
            connectNulls
          />
          <Line
            yAxisId="duty"
            type="stepAfter"
            dataKey="dutyPercent"
            name="Duty (%)"
            stroke="#1f6bff"
            dot={false}
            strokeWidth={2.4}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
