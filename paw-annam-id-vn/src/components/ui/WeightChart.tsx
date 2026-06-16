"use client";

import React from "react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

type WeightLog = {
  id: string;
  weight: number;
  date: Date | string;
  note?: string | null;
};

type WeightChartProps = {
  data: WeightLog[];
};

export default function WeightChart({ data }: WeightChartProps) {
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-3xl bg-surface/50 text-text-muted text-sm">
        {locale === "vi" ? "Chưa có dữ liệu cân nặng" : "No weight data available"}
      </div>
    );
  }

  // Sort data chronologically
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // SVG dimensions
  const width = 600;
  const height = 300;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find min/max values
  const weights = sortedData.map((d) => d.weight);
  const minWeight = Math.max(0, Math.min(...weights) - 0.5); // pad bottom
  const maxWeight = Math.max(...weights) + 0.5; // pad top
  const weightRange = maxWeight - minWeight || 1;

  const dates = sortedData.map((d) => new Date(d.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const dateRange = maxDate - minDate || 1;

  // Generate points
  const points = sortedData.map((d) => {
    const t = new Date(d.date).getTime();
    const x =
      sortedData.length > 1
        ? paddingLeft + ((t - minDate) / dateRange) * chartWidth
        : paddingLeft + chartWidth / 2;
    const y =
      paddingTop +
      chartHeight -
      ((d.weight - minWeight) / weightRange) * chartHeight;
    return { x, y, ...d };
  });

  // SVG Path strings
  let linePath = "";
  let areaPath = "";

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }

    // Area path closes at the bottom
    areaPath = `${linePath} L ${points[points.length - 1].x} ${
      paddingTop + chartHeight
    } L ${points[0].x} ${paddingTop + chartHeight} Z`;
  }

  // Generate Y axis ticks
  const yTicks = 4;
  const yAxisValues = Array.from(
    { length: yTicks },
    (_, i) => minWeight + (weightRange / (yTicks - 1)) * i
  );

  // Generate X axis ticks (dates)
  const xTicksIndices =
    sortedData.length <= 4
      ? sortedData.map((_, i) => i)
      : [
          0,
          Math.floor(sortedData.length / 3),
          Math.floor((2 * sortedData.length) / 3),
          sortedData.length - 1,
        ];

  return (
    <div className="w-full bg-surface border border-border p-4 sm:p-6 rounded-3xl shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-text">
          {locale === "vi" ? "Biểu đồ phát triển" : "Growth Chart"}
        </h3>
        <p className="text-xs text-text-secondary">
          {locale === "vi"
            ? "Theo dõi cân nặng của bé theo thời gian (kg)"
            : "Monitor your kitty's weight over time (kg)"}
        </p>
      </div>

      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2/1" }}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yAxisValues.map((val, idx) => {
            const y =
              paddingTop +
              chartHeight -
              ((val - minWeight) / weightRange) * chartHeight;
            return (
              <g key={`grid-${idx}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  className="fill-text-muted font-medium"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          {points.length > 1 && (
            <path d={areaPath} fill="url(#chartGradient)" />
          )}

          {/* Line Path */}
          {points.length > 1 && (
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points */}
          {points.map((p, idx) => (
            <g key={`point-${idx}`} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                className="fill-surface stroke-primary stroke-2"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
                className="fill-primary opacity-0 hover:opacity-20 transition-opacity"
              />
              {/* Tooltip on hover (always rendered but visible or styled nicely) */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <rect
                  x={p.x - 45}
                  y={p.y - 35}
                  width="90"
                  height="26"
                  rx="6"
                  fill="var(--color-text)"
                  className="shadow-sm"
                />
                <text
                  x={p.x}
                  y={p.y - 18}
                  textAnchor="middle"
                  fill="var(--color-bg)"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {p.weight} kg
                </text>
              </g>
            </g>
          ))}

          {/* X Axis Labels */}
          {xTicksIndices.map((dataIdx) => {
            const p = points[dataIdx];
            if (!p) return null;
            const formattedDate = format(new Date(p.date), "dd/MM/yy", {
              locale: dateLocale,
            });

            return (
              <text
                key={`x-label-${dataIdx}`}
                x={p.x}
                y={height - 12}
                textAnchor="middle"
                fontSize="10"
                className="fill-text-muted font-medium"
              >
                {formattedDate}
              </text>
            );
          })}

          {/* Baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={width - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="var(--color-border)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
