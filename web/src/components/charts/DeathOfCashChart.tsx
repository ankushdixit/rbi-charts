"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface TrendPoint {
  date: string;
  cts?: number | null;
  neft?: number | null;
  imps?: number | null;
  upi?: number | null;
  cards_total?: number | null;
  ppi_total?: number | null;
  rtgs?: number | null;
  [key: string]: any;
}

interface Props {
  data: TrendPoint[];
}

export default function DeathOfCashChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    const dates = data.map((d) => {
      const [y, m] = d.date.split("-");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[parseInt(m) - 1]} ${y}`;
    });

    // Convert all to billions of transactions (volume_lakh / 10000)
    const toBillions = (v: number | null | undefined) =>
      v != null && !isNaN(v) ? +(v / 10000).toFixed(4) : null;

    const upi = data.map((d) => toBillions(d.upi));
    const neft = data.map((d) => toBillions(d.neft));
    const imps = data.map((d) => toBillions(d.imps));
    const cards = data.map((d) => toBillions(d.cards_total));
    const ppi = data.map((d) => toBillions(d.ppi_total));
    const cts = data.map((d) => toBillions(d.cts));

    const makeSeries = (
      name: string,
      seriesData: (number | null)[],
      color: string,
    ) => ({
      name,
      type: "line" as const,
      stack: "digital",
      data: seriesData,
      smooth: true,
      symbol: "none",
      lineStyle: { width: 0 },
      areaStyle: { color, opacity: 0.85 },
      emphasis: { focus: "series" as const },
    });

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
                <span>${p.seriesName}: ${p.value.toFixed(2)}B</span>
              </div>`;
            }
          }
          html += `<div style="border-top:1px solid #334155;margin-top:4px;padding-top:4px;font-weight:600">Total: ${total.toFixed(2)}B txns</div>`;
          return html;
        },
      },
      legend: {
        data: ["UPI", "NEFT", "IMPS", "Cards", "PPIs", "Cheques (CTS)"],
        bottom: 45,
        textStyle: { color: "#94a3b8", fontSize: 11 },
        itemWidth: 12,
        itemHeight: 12,
      },
      grid: {
        left: 55,
        right: 20,
        top: 15,
        bottom: 100,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: { fontSize: 11, color: "#94a3b8", interval: 11 },
        axisLine: { lineStyle: { color: "#334155" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Billion Txns / month",
        nameTextStyle: { color: "#64748b", fontSize: 11 },
        axisLabel: {
          color: "#94a3b8",
          fontSize: 11,
          formatter: (v: number) => `${v}B`,
        },
        splitLine: { lineStyle: { color: "#1e293b" } },
      },
      dataZoom: [
        { type: "inside", start: 0, end: 100 },
        {
          type: "slider",
          start: 0,
          end: 100,
          height: 25,
          bottom: 8,
          borderColor: "#334155",
          backgroundColor: "#0f172a",
          fillerColor: "rgba(59, 130, 246, 0.1)",
          handleStyle: { color: "#3b82f6" },
          textStyle: { color: "#64748b" },
        },
      ],
      series: [
        makeSeries("UPI", upi, "#3b82f6"),
        makeSeries("NEFT", neft, "#06b6d4"),
        makeSeries("IMPS", imps, "#8b5cf6"),
        makeSeries("Cards", cards, "#f59e0b"),
        makeSeries("PPIs", ppi, "#10b981"),
        {
          name: "Cheques (CTS)",
          type: "line",
          stack: "digital",
          data: cts,
          smooth: true,
          symbol: "none",
          lineStyle: { width: 0 },
          areaStyle: { color: "#ef4444", opacity: 0.85 },
          emphasis: { focus: "series" },
        },
      ],
    };
  }, [data]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0f172a] p-6">
      <Chart option={option} height="520px" />
    </div>
  );
}
