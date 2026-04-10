"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface InfraPoint {
  date: string;
  atms: number;
  pos: number;
  micro_atm: number;
  bharat_qr: number;
  upi_qr: number;
}

interface Props {
  data: InfraPoint[];
}

export default function InfraShiftChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    const dates = data.map((d) => {
      const [y, m] = d.date.split("-");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[parseInt(m) - 1]} ${y}`;
    });

    const toK = (v: number) => +(v / 1000).toFixed(0);
    const toM = (v: number) => +(v / 1000000).toFixed(1);

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#e2e8f0", fontSize: 12 },
      },
      legend: {
        data: ["ATMs", "PoS Terminals", "Micro ATMs", "Bharat QR", "UPI QR"],
        bottom: 45,
        textStyle: { color: "#94a3b8", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 3,
      },
      grid: { left: 70, right: 20, top: 20, bottom: 100 },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: { fontSize: 11, color: "#94a3b8", interval: 11 },
        axisLine: { lineStyle: { color: "#334155" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "log",
        name: "Count (log scale)",
        nameTextStyle: { color: "#64748b", fontSize: 11 },
        axisLabel: {
          color: "#94a3b8",
          fontSize: 11,
          formatter: (v: number) => {
            if (v >= 1000000) return `${(v / 1000000).toFixed(0)}M`;
            if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
            return `${v}`;
          },
        },
        splitLine: { lineStyle: { color: "#1e293b" } },
        min: 10000,
      },
      dataZoom: [
        { type: "inside", start: 0, end: 100 },
        {
          type: "slider", start: 0, end: 100, height: 25, bottom: 8,
          borderColor: "#334155", backgroundColor: "#0f172a",
          fillerColor: "rgba(59, 130, 246, 0.1)",
          handleStyle: { color: "#3b82f6" },
          textStyle: { color: "#64748b" },
        },
      ],
      series: [
        {
          name: "ATMs",
          type: "line", data: data.map((d) => d.atms || null),
          smooth: true, symbol: "none",
          lineStyle: { width: 3, color: "#ef4444" },
          itemStyle: { color: "#ef4444" },
        },
        {
          name: "PoS Terminals",
          type: "line", data: data.map((d) => d.pos || null),
          smooth: true, symbol: "none",
          lineStyle: { width: 3, color: "#f59e0b" },
          itemStyle: { color: "#f59e0b" },
        },
        {
          name: "Micro ATMs",
          type: "line", data: data.map((d) => d.micro_atm || null),
          smooth: true, symbol: "none",
          lineStyle: { width: 2.5, color: "#06b6d4" },
          itemStyle: { color: "#06b6d4" },
        },
        {
          name: "Bharat QR",
          type: "line", data: data.map((d) => d.bharat_qr || null),
          smooth: true, symbol: "none",
          lineStyle: { width: 2.5, color: "#8b5cf6" },
          itemStyle: { color: "#8b5cf6" },
        },
        {
          name: "UPI QR",
          type: "line", data: data.map((d) => d.upi_qr || null),
          smooth: true, symbol: "none",
          lineStyle: { width: 3, color: "#10b981" },
          itemStyle: { color: "#10b981" },
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
