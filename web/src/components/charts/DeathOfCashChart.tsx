"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface TrendPoint {
  date: string;
  [key: string]: any;
}

interface Props {
  data: TrendPoint[];
}

const SERIES_CONFIG = [
  { key: "upi", name: "UPI", color: "#3b82f6" },
  { key: "neft", name: "NEFT", color: "#06b6d4" },
  { key: "imps", name: "IMPS", color: "#8b5cf6" },
  { key: "debit_cards_payments", name: "Debit Cards (POS)", color: "#f97316" },
  { key: "credit_cards", name: "Credit Cards", color: "#f59e0b" },
  { key: "wallets", name: "Wallets", color: "#10b981" },
  { key: "cts", name: "Cheques (CTS)", color: "#ef4444" },
];

export default function DeathOfCashChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    const dates = data.map((d) => {
      const [y, m] = d.date.split("-");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[parseInt(m) - 1]} ${y}`;
    });

    const toBillions = (v: number | null | undefined) =>
      v != null && !isNaN(v) ? +(v / 10000).toFixed(4) : null;

    const milestones = [
      { date: "Apr 2016", label: "UPI\nlaunches" },
      { date: "Nov 2016", label: "Demon-\netization" },
      { date: "Apr 2020", label: "COVID\nlockdown" },
    ];

    const markLineConfig = {
      silent: true,
      symbol: ["none", "none"],
      lineStyle: { color: "#c8c0b4", type: "dashed" as const, width: 1 },
      data: milestones.map((m) => ({
        xAxis: m.date,
        label: {
          show: true,
          formatter: m.label,
          color: "#78716c",
          fontSize: 10,
          position: "insideEndTop" as const,
        },
      })),
    };

    const series = SERIES_CONFIG.map(({ key, name, color }, idx) => {
      const base = {
        name,
        type: "line" as const,
        stack: "total",
        data: data.map((d) => toBillions(d[key])),
        smooth: true,
        symbol: "none",
        lineStyle: { width: 0, color },
        itemStyle: { color },
        areaStyle: { color, opacity: 0.85 },
        emphasis: { focus: "series" as const },
      };
      if (idx === 0) {
        return { ...base, markLine: markLineConfig };
      }
      return base;
    });

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
          let total = 0;
          for (const p of sorted) {
            total += p.value;
            html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
              <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
              <span>${p.seriesName}: ${p.value.toFixed(2)}B</span>
            </div>`;
          }
          html += `<div style="border-top:1px solid #e7e1d8;margin-top:4px;padding-top:4px;font-weight:600">Total: ${total.toFixed(2)}B txns</div>`;
          return html;
        },
      },
      legend: {
        data: SERIES_CONFIG.map((s) => s.name),
        top: 0,
        textStyle: { color: "#78716c", fontSize: 11 },
        itemWidth: 12,
        itemHeight: 12,
      },
      grid: {
        left: 55,
        right: 20,
        top: 40,
        bottom: 55,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: { fontSize: 11, color: "#78716c", interval: 11 },
        axisLine: { lineStyle: { color: "#e7e1d8" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Billion Txns / month",
        nameTextStyle: { color: "#a8a29e", fontSize: 11 },
        axisLabel: {
          color: "#78716c",
          fontSize: 11,
          formatter: (v: number) => `${v}B`,
        },
        splitLine: { lineStyle: { color: "#f0ebe4" } },
      },
      dataZoom: [
        { type: "inside", start: 0, end: 100 },
        {
          type: "slider",
          start: 0,
          end: 100,
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
      <Chart option={option} height="520px" />
    </div>
  );
}
