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
        backgroundColor: "#ffffff",
        borderColor: "#e7e1d8",
        textStyle: { color: "#1c1917", fontSize: 12 },
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
        top: 0,
        textStyle: { color: "#78716c", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 3,
      },
      grid: {
        left: 60,
        right: 20,
        top: 40,
        bottom: 55,
      },
      xAxis: {
        type: "category",
        data: dateLabels,
        axisLabel: { fontSize: 11, color: "#78716c", rotate: 30 },
        axisLine: { lineStyle: { color: "#e7e1d8" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "₹ Lakh Crore",
        nameTextStyle: { color: "#a8a29e", fontSize: 11 },
        axisLabel: { color: "#78716c", fontSize: 11 },
        splitLine: { lineStyle: { color: "#f0ebe4" } },
      },
      dataZoom: [
        { type: "inside" },
        {
          type: "slider",
          height: 25,
          bottom: 8,
          borderColor: "#e7e1d8",
          backgroundColor: "#ffffff",
          fillerColor: "rgba(59, 130, 246, 0.08)",
          handleStyle: { color: "#3b82f6" },
          textStyle: { color: "#a8a29e" },
        },
      ],
      series,
    };
  }, [data]);

  return (
    <div className="">
      <Chart option={option} height="500px" />
    </div>
  );
}
