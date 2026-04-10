"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface ForexRecord {
  date: string;
  total_bn: number | null;
  gold_bn: number | null;
  fca_bn: number | null;
  sdr_bn: number | null;
}

interface Props {
  data: ForexRecord[];
}

// Dates must match the shortened x-axis labels
const MILESTONES = [
  { date: "1991", label: "BoP crisis\n$5.8B" },
  { date: "2009", label: "Global\nfinancial crisis" },
  { date: "2014", label: "Taper\ntantrum" },
  { date: "2021", label: "COVID\n+QE inflows" },
];

export default function ForexFortressChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    const dates = data.map((d) => d.date);
    const total = data.map((d) => d.total_bn);
    const gold = data.map((d) => d.gold_bn);
    const fca = data.map((d) => d.fca_bn);

    const markLineConfig = {
      silent: true,
      symbol: ["none", "none"],
      lineStyle: { color: "#475569", type: "dashed" as const, width: 1 },
      data: MILESTONES.map((m) => ({
        xAxis: m.date,
        label: {
          show: true,
          formatter: m.label,
          color: "#94a3b8",
          fontSize: 9,
          position: "insideEndTop" as const,
        },
      })),
    };

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#e2e8f0", fontSize: 12 },
        formatter: (params: any) => {
          let html = `<div style="font-weight:600;margin-bottom:4px">${params[0].axisValue}</div>`;
          for (const p of params) {
            if (p.value != null) {
              html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
                <span>${p.seriesName}: $${p.value.toFixed(1)}B</span>
              </div>`;
            }
          }
          return html;
        },
      },
      legend: {
        data: ["Total Reserves", "Foreign Currency Assets", "Gold"],
        bottom: 45,
        textStyle: { color: "#94a3b8", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 3,
      },
      grid: {
        left: 60,
        right: 20,
        top: 20,
        bottom: 100,
      },
      xAxis: {
        type: "category",
        data: dates.map((d) => {
          // Shorten annual labels: "1967-68" → "1968", "2024-25" → "2025"
          if (d.match(/^\d{4}-\d{2}$/)) {
            const startYear = parseInt(d.slice(0, 4));
            return String(startYear + 1);
          }
          // Shorten weekly labels: "2023-04-07" → "Apr 23"
          if (d.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [y, m] = d.split("-");
            const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            return `${months[parseInt(m)]} ${y.slice(2)}`;
          }
          return d;
        }),
        axisLabel: {
          fontSize: 11,
          color: "#94a3b8",
          interval: (index: number) => {
            const d = dates[index];
            // Weekly labels: show every 13th (~quarterly)
            if (d.length > 7) return index % 13 === 0;
            // Annual labels: show every 5 years
            const year = parseInt(d.slice(0, 4));
            return year % 5 === 0;
          },
          rotate: 0,
        },
        axisLine: { lineStyle: { color: "#334155" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "US$ Billion",
        nameTextStyle: { color: "#64748b", fontSize: 11 },
        axisLabel: {
          color: "#94a3b8",
          fontSize: 11,
          formatter: (v: number) => `$${v}B`,
        },
        splitLine: { lineStyle: { color: "#1e293b" } },
      },
      dataZoom: [
        { type: "inside", start: 0, end: 100 },
        {
          type: "slider",
          start: 0,
          end: 100,
          height: 25,
          bottom: 8,
          borderColor: "#334155",
          backgroundColor: "#0f172a",
          fillerColor: "rgba(59, 130, 246, 0.1)",
          handleStyle: { color: "#3b82f6" },
          textStyle: { color: "#64748b" },
        },
      ],
      series: [
        {
          name: "Total Reserves",
          type: "line",
          data: total,
          smooth: true,
          symbol: "none",
          lineStyle: { width: 3, color: "#10b981" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(16, 185, 129, 0.3)" },
                { offset: 1, color: "rgba(16, 185, 129, 0.02)" },
              ],
            },
          },
          markLine: markLineConfig,
        },
        {
          name: "Foreign Currency Assets",
          type: "line",
          data: fca,
          smooth: true,
          symbol: "none",
          lineStyle: { width: 2, color: "#3b82f6" },
          itemStyle: { color: "#3b82f6" },
        },
        {
          name: "Gold",
          type: "line",
          data: gold,
          smooth: true,
          symbol: "none",
          lineStyle: { width: 2, color: "#f59e0b" },
          itemStyle: { color: "#f59e0b" },
        },
      ],
    };
  }, [data]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0f172a] p-6">
      <Chart option={option} height="520px" />
    </div>
  );
}
