import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "../../marketing/context/LanguageContext";

const copy = {
  pt: {
    noData: "Sem telemetria nas ultimas 24h.",
    tempLine: "Temp interna (C)",
    dutyLine: "Duty (%)",
    targetLine: "Target Temperature (C)",
  },
  en: {
    noData: "No telemetry for the last 24h.",
    tempLine: "Internal temp (C)",
    dutyLine: "Duty (%)",
    targetLine: "Target Temperature (C)",
  },
};

export function TelemetryChart({ points, showDuty = true, targetTemperature }) {
  const { language } = useLanguage();
  const text = copy[language] ?? copy.en;
  const hasTarget = Number.isFinite(Number(targetTemperature));

  const data = points.map((point) => ({
    ...point,
    time: new Date(point.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    dutyPercent: point.duty !== null ? Math.round(point.duty * 100) : null,
    targetTemperature: hasTarget ? Number(targetTemperature) : null,
  }));

  if (data.length === 0) {
    return <p className="control-muted-box">{text.noData}</p>;
  }

  return (
    <div className="control-chart-frame">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data} margin={{ top: 18, right: 14, left: -12, bottom: 4 }}>
          <CartesianGrid stroke="#dce4ef" strokeDasharray="4 4" vertical={false} />
          <XAxis axisLine={{ stroke: "#b9c6d9" }} dataKey="time" minTickGap={28} tick={{ fill: "#0c1938", fontSize: 12 }} tickLine={false} />
          <YAxis
            axisLine={false}
            domain={["auto", "auto"]}
            tick={{ fill: "#0c1938", fontSize: 12 }}
            tickFormatter={(value) => `${value}C`}
            tickLine={false}
            yAxisId="temp"
          />
          {showDuty ? (
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              orientation="right"
              tick={{ fill: "#53617d", fontSize: 12 }}
              tickLine={false}
              yAxisId="duty"
            />
          ) : null}
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              borderColor: "#e4eaf3",
              backgroundColor: "#ffffff",
              boxShadow: "0 12px 30px rgba(28,48,85,.12)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="t_internal"
            name={text.tempLine}
            stroke="#ef7b2f"
            dot={false}
            strokeWidth={2.4}
            connectNulls
          />
          {hasTarget ? (
            <Line
              connectNulls
              dataKey="targetTemperature"
              dot={false}
              name={text.targetLine}
              stroke="#064bc4"
              strokeDasharray="8 6"
              strokeWidth={2.4}
              type="monotone"
              yAxisId="temp"
            />
          ) : null}
          {showDuty ? (
            <Line
              yAxisId="duty"
              type="stepAfter"
              dataKey="dutyPercent"
              name={text.dutyLine}
              stroke="#1f6bff"
              dot={false}
              strokeWidth={2.4}
              connectNulls
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
