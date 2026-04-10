"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface QuarterlyRecord {
  period: string;
  type: string;
  credit_usd_mn: number | null;
  debit_usd_mn: number | null;
  net_usd_mn: number | null;
  total_services_credit_usd_mn?: number | null;
  share_of_services_pct?: number | null;
}

interface Props {
  quarterly: QuarterlyRecord[];
}

export default function ITExportsChart({ quarterly }: Props) {
  const option = useMemo<EChartsOption>(() => {
    // Sort quarters chronologically
    const sorted = [...quarterly].sort((a, b) => {
      const qOrder: Record<string, number> = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
      const parseQ = (s: string) => {
        const q = s.match(/Q(\d)/)?.[1] || "0";
        const fy = s.match(/FY(\d{4})-(\d{2})/);
        if (fy) {
          return parseInt(fy[1]) * 10 + qOrder[`Q${q}`];
        }
        return 0;
      };
      return parseQ(a.period) - parseQ(b.period);
    });

    const labels = sorted.map((d) => {
      // "Q1 FY2021-22" -> "Q1 FY22"
      const match = d.period.match(/Q(\d) FY\d{2}(\d{2})-(\d{2})/);
      if (match) return `Q${match[1]} FY${match[3]}`;
      return d.period;
    });

    const creditData = sorted.map((d) =>
      d.credit_usd_mn ? +(d.credit_usd_mn / 1000).toFixed(1) : null
    );

    const netData = sorted.map((d) =>
      d.net_usd_mn ? +(d.net_usd_mn / 1000).toFixed(1) : null
    );

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: "#e7e1d8",
        textStyle: { color: "#1c1917", fontSize: 12 },
        formatter: (params: any) => {
          let html = `<div style="font-weight:600;margin-bottom:4px">${params[0].axisValue}</div>`;
          for (const p of params) {
            if (p.value != null) {
              html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
                <span style="flex:1">${p.seriesName}</span>
                <span style="font-weight:600">$${p.value.toFixed(1)}B</span>
              </div>`;
            }
          }
          return html;
        },
      },
      legend: {
        data: ["IT Services Receipts", "Net Export Earnings"],
        top: 0,
        textStyle: { color: "#78716c", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 3,
      },
      grid: { left: 60, right: 20, top: 35, bottom: 55 },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { fontSize: 10, color: "#78716c", rotate: 40, interval: 0 },
        axisLine: { lineStyle: { color: "#e7e1d8" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "US$ Billion",
        nameTextStyle: { color: "#a8a29e", fontSize: 11 },
        axisLabel: {
          color: "#78716c",
          fontSize: 11,
          formatter: (v: number) => `$${v}B`,
        },
        splitLine: { lineStyle: { color: "#f0ebe4" } },
      },
      series: [
        {
          name: "IT Services Receipts",
          type: "bar",
          data: creditData,
          itemStyle: { color: "#6190e8" },
          barWidth: "50%",
        },
        {
          name: "Net Export Earnings",
          type: "line",
          data: netData,
          lineStyle: { color: "#e08a6d", width: 2.5 },
          itemStyle: { color: "#e08a6d" },
          symbol: "circle",
          symbolSize: 5,
        },
      ],
    };
  }, [quarterly]);

  return <Chart option={option} height="450px" />;
}
