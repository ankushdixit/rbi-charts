"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface CreditRecord {
  date: string;
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
    // Sort dates chronologically
    const allDates = Array.from(new Set(data.map((d) => d.date)));
    allDates.sort((a, b) => {
      // Parse "28.Feb,2026" format
      const parseDate = (s: string) => {
        const m = s.match(/(\d+)\.(\w+),(\d+)/);
        if (!m) return 0;
        const months: Record<string, number> = {
          Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
          Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
        };
        return parseInt(m[3]) * 10000 + (months[m[2]] || 0) * 100 + parseInt(m[1]);
      };
      return parseDate(a) - parseDate(b);
    });

    const series = SECTORS.map(({ key, name, color }) => ({
      name,
      type: "bar" as const,
      stack: "total",
      data: allDates.map((date) => {
        const rec = data.find((d) => d.date === date && d.sector === key);
        return rec ? +(rec.outstanding_crore / 100000).toFixed(1) : null;
      }),
      itemStyle: { color },
      emphasis: { focus: "series" as const },
      barWidth: "60%",
    }));

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#e2e8f0", fontSize: 12 },
        formatter: (params: any) => {
          let html = `<div style="font-weight:600;margin-bottom:6px">${params[0].axisValue}</div>`;
          let total = 0;
          for (const p of params) {
            if (p.value != null) {
              total += p.value;
              html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
                <span style="flex:1">${p.seriesName}</span>
                <span style="font-weight:600">₹${p.value}L Cr</span>
              </div>`;
            }
          }
          html += `<div style="border-top:1px solid #334155;margin-top:4px;padding-top:4px;font-weight:600">Total: ₹${total.toFixed(1)}L Cr</div>`;
          return html;
        },
      },
      legend: {
        data: SECTORS.map((s) => s.name),
        bottom: 45,
        textStyle: { color: "#94a3b8", fontSize: 11 },
        itemWidth: 12,
        itemHeight: 12,
      },
      grid: {
        left: 60,
        right: 20,
        top: 20,
        bottom: 90,
      },
      xAxis: {
        type: "category",
        data: allDates,
        axisLabel: { fontSize: 10, color: "#94a3b8", rotate: 20 },
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
      series,
    };
  }, [data]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0f172a] p-6">
      <Chart option={option} height="500px" />
    </div>
  );
}
