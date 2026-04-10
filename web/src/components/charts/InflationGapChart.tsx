"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface InflationRecord {
  round: number;
  date: string;
  current_mean: number | null;
  three_month_mean: number | null;
  one_year_mean: number | null;
}

interface Props {
  data: InflationRecord[];
}

export default function InflationGapChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    const dates = data.map((d) => {
      const [y, m] = d.date.split("-");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[parseInt(m) - 1]} ${y}`;
    });

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#e2e8f0", fontSize: 12 },
        formatter: (params: any) => {
          const idx = params[0].dataIndex;
          const round = data[idx].round;
          let html = `<div style="font-weight:600;margin-bottom:4px">${params[0].axisValue} (Round ${round})</div>`;
          for (const p of params) {
            if (p.value != null) {
              html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
                <span style="flex:1">${p.seriesName}</span>
                <span style="font-weight:600">${p.value.toFixed(1)}%</span>
              </div>`;
            }
          }
          return html;
        },
      },
      legend: {
        data: ["Current Perception", "3-Month Ahead", "1-Year Ahead"],
        bottom: 45,
        textStyle: { color: "#94a3b8", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 3,
      },
      grid: { left: 50, right: 20, top: 20, bottom: 100 },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: { fontSize: 11, color: "#94a3b8", interval: 6 },
        axisLine: { lineStyle: { color: "#334155" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Inflation %",
        nameTextStyle: { color: "#64748b", fontSize: 11 },
        axisLabel: {
          color: "#94a3b8", fontSize: 11,
          formatter: (v: number) => `${v}%`,
        },
        splitLine: { lineStyle: { color: "#1e293b" } },
      },
      dataZoom: [
        { type: "inside", start: 0, end: 100 },
        {
          type: "slider", start: 0, end: 100, height: 25, bottom: 8,
          borderColor: "#334155", backgroundColor: "#0f172a",
          fillerColor: "rgba(59, 130, 246, 0.1)",
          handleStyle: { color: "#3b82f6" },
          textStyle: { color: "#64748b" },
        },
      ],
      series: [
        {
          name: "Current Perception",
          type: "line",
          data: data.map((d) => d.current_mean),
          smooth: true, symbol: "none",
          lineStyle: { width: 3, color: "#ef4444" },
          itemStyle: { color: "#ef4444" },
        },
        {
          name: "3-Month Ahead",
          type: "line",
          data: data.map((d) => d.three_month_mean),
          smooth: true, symbol: "none",
          lineStyle: { width: 2.5, color: "#f59e0b" },
          itemStyle: { color: "#f59e0b" },
        },
        {
          name: "1-Year Ahead",
          type: "line",
          data: data.map((d) => d.one_year_mean),
          smooth: true, symbol: "none",
          lineStyle: { width: 2.5, color: "#8b5cf6" },
          itemStyle: { color: "#8b5cf6" },
        },
      ],
    };
  }, [data]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0f172a] p-6">
      <Chart option={option} height="500px" />
    </div>
  );
}
