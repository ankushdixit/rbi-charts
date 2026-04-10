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
        backgroundColor: "#ffffff",
        borderColor: "#e7e1d8",
        textStyle: { color: "#1c1917", fontSize: 12 },
      },
      legend: {
        data: ["ATMs", "PoS Terminals", "Micro ATMs", "Bharat QR", "UPI QR"],
        top: 0,
        textStyle: { color: "#78716c", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 3,
      },
      grid: { left: 70, right: 20, top: 40, bottom: 75 },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: { fontSize: 11, color: "#78716c", interval: 11 },
        axisLine: { lineStyle: { color: "#e7e1d8" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "log",
        name: "Count (log scale)",
        nameTextStyle: { color: "#a8a29e", fontSize: 11 },
        axisLabel: {
          color: "#78716c",
          fontSize: 11,
          formatter: (v: number) => {
            if (v >= 1000000) return `${(v / 1000000).toFixed(0)}M`;
            if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
            return `${v}`;
          },
        },
        splitLine: { lineStyle: { color: "#f0ebe4" } },
        min: 10000,
      },
      dataZoom: [
        { type: "inside", start: 0, end: 100 },
        {
          type: "slider", start: 0, end: 100, height: 25, bottom: 8,
          borderColor: "#e7e1d8", backgroundColor: "#ffffff",
          fillerColor: "rgba(59, 130, 246, 0.08)",
          handleStyle: { color: "#3b82f6" },
          textStyle: { color: "#a8a29e" },
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
    <div className="">
      <Chart option={option} height="520px" />
    </div>
  );
}
