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

const PERSONAL_CATEGORIES = [
  { key: "personal_housing", label: "Housing", color: "#6190e8" },
  { key: "personal_other", label: "Other Personal", color: "#9b8ec4" },
  { key: "personal_vehicle", label: "Vehicle", color: "#5ea88e" },
  { key: "personal_credit_card", label: "Credit Card", color: "#e08a6d" },
  { key: "personal_education", label: "Education", color: "#c9a46c" },
  { key: "personal_fd", label: "Against FD/Shares", color: "#5b9ea6" },
  { key: "personal_consumer_durables", label: "Consumer Durables", color: "#d4827a" },
];

export default function PersonalLoansChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    // Get unique dates in order
    const dates = Array.from(new Set(data.map((d) => d.date))).sort();

    const labels = dates.map((d) => {
      // "2021-03" -> "Mar 21"
      const [y, m] = d.split("-");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
    });

    const series = PERSONAL_CATEGORIES.map((cat) => ({
      name: cat.label,
      type: "bar" as const,
      stack: "total",
      data: dates.map((d) => {
        const rec = data.find((r) => r.date === d && r.sector === cat.key);
        return rec ? +(rec.outstanding_crore / 100000).toFixed(1) : null;
      }),
      itemStyle: { color: cat.color },
      emphasis: { focus: "series" as const },
    }));

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: "#e7e1d8",
        textStyle: { color: "#1c1917", fontSize: 12 },
        formatter: (params: any) => {
          let html = `<div style="font-weight:600;margin-bottom:4px">${params[0].axisValue}</div>`;
          let total = 0;
          for (const p of [...params].reverse()) {
            if (p.value != null) {
              total += p.value;
              html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
                <span style="flex:1">${p.seriesName}</span>
                <span style="font-weight:600">${p.value.toFixed(1)}L Cr</span>
              </div>`;
            }
          }
          html += `<div style="border-top:1px solid #e7e1d8;margin-top:4px;padding-top:4px;font-weight:600">Total: ${total.toFixed(1)}L Cr</div>`;
          return html;
        },
      },
      legend: {
        data: PERSONAL_CATEGORIES.map((c) => c.label),
        top: 0,
        textStyle: { color: "#78716c", fontSize: 10 },
        itemWidth: 12,
        itemHeight: 8,
        itemGap: 8,
      },
      grid: { left: 60, right: 20, top: 35, bottom: 55 },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { fontSize: 10, color: "#78716c", interval: 0, rotate: 40 },
        axisLine: { lineStyle: { color: "#e7e1d8" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Outstanding (Lakh Crore)",
        nameTextStyle: { color: "#a8a29e", fontSize: 11 },
        axisLabel: {
          color: "#78716c",
          fontSize: 11,
          formatter: (v: number) => `${v}L`,
        },
        splitLine: { lineStyle: { color: "#f0ebe4" } },
      },
      series,
    };
  }, [data]);

  return <Chart option={option} height="450px" />;
}
