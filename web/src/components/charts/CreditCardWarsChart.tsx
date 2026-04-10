"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface Props {
  data: Record<string, any>[];
}

const BANK_COLORS: Record<string, string> = {
  "HDFC BANK": "#3b82f6",
  "STATE BANK OF INDIA": "#10b981",
  "ICICI BANK": "#f59e0b",
  "AXIS BANK": "#ef4444",
  "KOTAK MAHINDRA BANK": "#8b5cf6",
  "RBL BANK": "#06b6d4",
  "IDFC FIRST BANK": "#ec4899",
  "BANK OF BARODA": "#14b8a6",
  "INDUSIND BANK": "#f97316",
  "YES BANK": "#a855f7",
  "FEDERAL BANK": "#84cc16",
  "AMERICAN EXPRESS BANKING CORPORATION": "#fbbf24",
  "CANARA BANK": "#22d3ee",
  "AU SMALL FINANCE BANK": "#fb923c",
  "HSBC": "#e879f9",
};

const SHORT_NAMES: Record<string, string> = {
  "HDFC BANK": "HDFC",
  "STATE BANK OF INDIA": "SBI",
  "ICICI BANK": "ICICI",
  "AXIS BANK": "Axis",
  "KOTAK MAHINDRA BANK": "Kotak",
  "RBL BANK": "RBL",
  "IDFC FIRST BANK": "IDFC First",
  "BANK OF BARODA": "BoB",
  "INDUSIND BANK": "IndusInd",
  "YES BANK": "Yes Bank",
  "FEDERAL BANK": "Federal",
  "AMERICAN EXPRESS BANKING CORPORATION": "Amex",
  "CANARA BANK": "Canara",
  "AU SMALL FINANCE BANK": "AU SFB",
  "HSBC": "HSBC",
};

const MILESTONES = [
  { date: "Dec 2020", label: "RBI bans HDFC\nnew cards" },
  { date: "Aug 2021", label: "HDFC ban\nlifted" },
  { date: "Aug 2022", label: "Unused cards\ndeactivated" },
  { date: "Mar 2023", label: "Axis acquires\nCiti cards" },
  { date: "Apr 2024", label: "RBI bans Kotak\nnew cards" },
];

export default function CreditCardWarsChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    const dates = data.map((d) => {
      const [y, m] = d.date.split("-");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[parseInt(m) - 1]} ${y}`;
    });

    const banks = Object.keys(data[0]).filter((k) => k !== "date");

    const markLineConfig = {
      silent: true,
      symbol: ["none", "none"],
      lineStyle: { color: "#c8c0b4", type: "dashed" as const, width: 1 },
      data: MILESTONES.map((m) => ({
        xAxis: m.date,
        label: {
          show: true,
          formatter: m.label,
          color: "#78716c",
          fontSize: 9,
          position: "insideEndTop" as const,
        },
      })),
    };

    const series = banks.map((bank, idx) => {
      const base = {
        name: SHORT_NAMES[bank] || bank,
        type: "line" as const,
        data: data.map((d) => {
          const v = d[bank];
          return v != null && !isNaN(v) ? +(v / 1000000).toFixed(2) : null;
        }),
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2.5,
          color: BANK_COLORS[bank] || "#64748b",
        },
        itemStyle: {
          color: BANK_COLORS[bank] || "#64748b",
        },
        connectNulls: true,
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
          const sorted = [...params].filter((p: any) => p.value != null).sort(
            (a: any, b: any) => (b.value ?? 0) - (a.value ?? 0)
          );
          let html = `<div style="font-weight:600;margin-bottom:6px">${params[0].axisValue}</div>`;
          for (const p of sorted) {
            html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
              <span style="flex:1">${p.seriesName}</span>
              <span style="font-weight:600">${p.value?.toFixed(1)}M</span>
            </div>`;
          }
          return html;
        },
      },
      legend: {
        data: banks.map((b) => SHORT_NAMES[b] || b),
        top: 0,
        textStyle: { color: "#78716c", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 3,
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
        name: "Million Cards",
        nameTextStyle: { color: "#a8a29e", fontSize: 11 },
        axisLabel: {
          color: "#78716c",
          fontSize: 11,
          formatter: (v: number) => `${v}M`,
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
      <Chart option={option} height="560px" />
    </div>
  );
}
