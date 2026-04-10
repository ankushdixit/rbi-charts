"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface SavingsRecord {
  period: string;
  item: string;
  value: number;
}

interface Props {
  data: SavingsRecord[];
}

const INSTRUMENTS = [
  { key: "deposits_bank", name: "Bank Deposits", color: "#3b82f6" },
  { key: "life_insurance", name: "Life Insurance", color: "#10b981" },
  { key: "provident_pension", name: "Provident & Pension", color: "#8b5cf6" },
  { key: "currency", name: "Currency", color: "#a8a29e" },
  { key: "mutual_funds", name: "Mutual Funds", color: "#f59e0b" },
  { key: "equity", name: "Direct Equity", color: "#ef4444" },
  { key: "small_savings", name: "Small Savings", color: "#06b6d4" },
];

export default function SavingsCollapseChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    // Get quarterly periods (not annual)
    const periods = Array.from(new Set(data.map((d) => d.period)))
      .filter((p) => !p.includes("Annual"))
      .sort();

    const dates = periods.map((p) => {
      const [fy, q] = p.split(" ");
      // Shorten "2019-20" to "19-20"
      const fyShort = fy.replace(/^20(\d{2})-(\d{2})$/, "$1-$2");
      return `${q}\nFY${fyShort}`;
    });

    const series = INSTRUMENTS.map(({ key, name, color }) => ({
      name,
      type: "bar" as const,
      stack: "total",
      data: periods.map((p) => {
        const rec = data.find((d) => d.period === p && d.item === key);
        return rec ? +(rec.value / 100000).toFixed(1) : null; // Convert crore to lakh crore
      }),
      itemStyle: { color },
      emphasis: { focus: "series" as const },
    }));

    // Add net financial assets as % of GDP line
    const gdpLine = periods.map((p) => {
      const rec = data.find(
        (d) => d.period === p && d.item === "net_financial_assets_pct_gdp"
      );
      return rec ? rec.value : null;
    });

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: "#e7e1d8",
        textStyle: { color: "#1c1917", fontSize: 12 },
      },
      legend: {
        data: [...INSTRUMENTS.map((i) => i.name), "Net Savings (% GDP)"],
        bottom: 45,
        textStyle: { color: "#78716c", fontSize: 10 },
        itemWidth: 12,
        itemHeight: 12,
      },
      grid: {
        left: 60,
        right: 50,
        top: 20,
        bottom: 100,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: { fontSize: 10, color: "#78716c", rotate: 30 },
        axisLine: { lineStyle: { color: "#e7e1d8" } },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "₹ Lakh Crore",
          nameTextStyle: { color: "#a8a29e", fontSize: 11 },
          axisLabel: { color: "#78716c", fontSize: 11 },
          splitLine: { lineStyle: { color: "#f0ebe4" } },
        },
        {
          type: "value",
          name: "% of GDP",
          nameTextStyle: { color: "#a8a29e", fontSize: 11 },
          axisLabel: {
            color: "#78716c",
            fontSize: 11,
            formatter: (v: number) => `${v}%`,
          },
          splitLine: { show: false },
        },
      ],
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
      series: [
        ...series,
        {
          name: "Net Savings (% GDP)",
          type: "line",
          yAxisIndex: 1,
          data: gdpLine,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 3, color: "#78716c", type: "dashed" },
          itemStyle: { color: "#78716c" },
        },
      ],
    };
  }, [data]);

  return (
    <div className="">
      <Chart option={option} height="520px" />
    </div>
  );
}
