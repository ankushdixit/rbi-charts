"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface AnnualRecord {
  period: string;
  current_account_net_usd_mn?: number;
  capital_account_net_usd_mn?: number;
  overall_balance_net_usd_mn?: number;
  actual_reserves_change_usd_mn?: number;
  valuation_usd_mn?: number;
}

interface Props {
  annual: AnnualRecord[];
}

export default function ReservesVariationChart({ annual }: Props) {
  const option = useMemo<EChartsOption>(() => {
    const labels = annual.map((a) => a.period);

    const caData = annual.map((a) =>
      a.current_account_net_usd_mn
        ? +(a.current_account_net_usd_mn / 1000).toFixed(1)
        : null
    );

    const kaData = annual.map((a) =>
      a.capital_account_net_usd_mn
        ? +(a.capital_account_net_usd_mn / 1000).toFixed(1)
        : null
    );

    const valuationData = annual.map((a) =>
      a.valuation_usd_mn ? +(a.valuation_usd_mn / 1000).toFixed(1) : null
    );

    const bopData = annual.map((a) =>
      a.overall_balance_net_usd_mn
        ? +(a.overall_balance_net_usd_mn / 1000).toFixed(1)
        : null
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
              const sign = p.value >= 0 ? "+" : "";
              const color = p.value >= 0 ? "#10b981" : "#ef4444";
              html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
                <span style="flex:1">${p.seriesName}</span>
                <span style="font-weight:600;color:${color}">${sign}$${Math.abs(p.value).toFixed(1)}B</span>
              </div>`;
            }
          }
          return html;
        },
      },
      legend: {
        data: [
          "Current Account",
          "Capital Account",
          "Valuation Effect",
          "BoP-Based Reserves Change",
        ],
        top: 0,
        textStyle: { color: "#78716c", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 3,
      },
      grid: { left: 65, right: 20, top: 40, bottom: 30 },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { fontSize: 11, color: "#78716c" },
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
          formatter: (v: number) => `${v >= 0 ? "+" : ""}$${v}B`,
        },
        splitLine: { lineStyle: { color: "#f0ebe4" } },
      },
      series: [
        {
          name: "Current Account",
          type: "bar",
          data: caData,
          itemStyle: { color: "#d4827a" },
          barWidth: "18%",
        },
        {
          name: "Capital Account",
          type: "bar",
          data: kaData,
          itemStyle: { color: "#6190e8" },
          barWidth: "18%",
        },
        {
          name: "Valuation Effect",
          type: "bar",
          data: valuationData,
          itemStyle: { color: "#c9a46c" },
          barWidth: "18%",
        },
        {
          name: "BoP-Based Reserves Change",
          type: "line",
          data: bopData,
          lineStyle: { color: "#1c1917", width: 2.5 },
          itemStyle: { color: "#1c1917" },
          symbol: "diamond",
          symbolSize: 8,
        },
      ],
    };
  }, [annual]);

  return <Chart option={option} height="450px" />;
}
