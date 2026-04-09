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

const MILESTONES = [
  { date: "1990-91", label: "BoP crisis\n$5.8B" },
  { date: "2008-09", label: "Global\nfinancial crisis" },
  { date: "2013-14", label: "Taper\ntantrum" },
  { date: "2020-21", label: "COVID\n+QE inflows" },
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
        data: dates,
        axisLabel: {
          fontSize: 11,
          color: "#94a3b8",
          interval: (index: number) => {
            // Show every 5th annual label, then all weekly labels
            const d = dates[index];
            if (d.includes("-") && d.length > 7) return false; // hide weekly labels
            return index % 5 === 0;
          },
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
