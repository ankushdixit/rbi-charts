"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface CreditRecord {
  date: string;
  date_label: string;
  sector: string;
  outstanding_crore: number;
}

interface Props {
  data: CreditRecord[];
}

const SECTORS = [
  { key: "agriculture", name: "Agriculture", color: "#10b981" },
  { key: "industry_total", name: "Industry", color: "#3b82f6" },
  { key: "services", name: "Services", color: "#8b5cf6" },
  { key: "personal_loans", name: "Personal Loans", color: "#f59e0b" },
];

export default function MoneyFlowChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    const dates = Array.from(new Set(data.map((d) => d.date))).sort();

    const dateLabels = dates.map((d) => {
      const [y, m] = d.split("-");
      const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[parseInt(m)]} ${y}`;
    });

    const series = SECTORS.map(({ key, name, color }) => ({
      name,
      type: "line" as const,
      data: dates.map((date) => {
        const rec = data.find((d) => d.date === date && d.sector === key);
        return rec ? +(rec.outstanding_crore / 100000).toFixed(1) : null;
      }),
      smooth: true,
      symbol: "circle",
      symbolSize: 4,
      lineStyle: { width: 3, color },
      itemStyle: { color },
      areaStyle: {
        color,
        opacity: 0.08,
      },
    }));

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#e2e8f0", fontSize: 12 },
        formatter: (params: any) => {
          const sorted = [...params]
            .filter((p: any) => p.value != null)
            .sort((a: any, b: any) => (b.value ?? 0) - (a.value ?? 0));
          let html = `<div style="font-weight:600;margin-bottom:6px">${params[0].axisValue}</div>`;
          for (const p of sorted) {
            html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
              <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
              <span style="flex:1">${p.seriesName}</span>
              <span style="font-weight:600">₹${p.value}L Cr</span>
            </div>`;
          }
          return html;
        },
      },
      legend: {
        data: SECTORS.map((s) => s.name),
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
        data: dateLabels,
        axisLabel: { fontSize: 11, color: "#94a3b8", rotate: 30 },
        axisLine: { lineStyle: { color: "#334155" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "₹ Lakh Crore",
        nameTextStyle: { color: "#64748b", fontSize: 11 },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
        splitLine: { lineStyle: { color: "#1e293b" } },
      },
      dataZoom: [
        { type: "inside" },
        {
          type: "slider",
          height: 25,
          bottom: 8,
          borderColor: "#334155",
          backgroundColor: "#0f172a",
          fillerColor: "rgba(59, 130, 246, 0.1)",
          handleStyle: { color: "#3b82f6" },
          textStyle: { color: "#64748b" },
        },
      ],
      series,
    };
  }, [data]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0f172a] p-6">
      <Chart option={option} height="500px" />
    </div>
  );
}
