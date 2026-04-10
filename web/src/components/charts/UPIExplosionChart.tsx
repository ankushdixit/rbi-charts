"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface DataPoint {
  date: string;
  volume_lakh: number;
  value_crore: number | null;
}

interface Props {
  data: DataPoint[];
}

export default function UPIExplosionChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    const dates = data.map((d) => {
      const [y, m] = d.date.split("-");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[parseInt(m) - 1]} ${y}`;
    });

    // Convert lakh to billions: 1 lakh = 100,000; billion = 1e9
    const volumeBillions = data.map((d) => +(d.volume_lakh / 10000).toFixed(2));
    const valueLakhCrore = data.map((d) =>
      d.value_crore ? +(d.value_crore / 100000).toFixed(2) : null
    );

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: "#e7e1d8",
        textStyle: { color: "#1c1917", fontSize: 13 },
        formatter: (params: any) => {
          const p = params[0];
          const idx = p.dataIndex;
          const vol = volumeBillions[idx];
          const val = valueLakhCrore[idx];
          let html = `<div style="font-weight:600;margin-bottom:4px">${p.name}</div>`;
          html += `<div>${vol.toFixed(2)}B transactions</div>`;
          if (val) html += `<div>₹${val.toFixed(1)} lakh crore</div>`;
          return html;
        },
      },
      grid: {
        left: 60,
        right: 30,
        top: 20,
        bottom: 80,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: {
          fontSize: 11,
          color: "#78716c",
          interval: 5,
          rotate: 0,
        },
        axisLine: { lineStyle: { color: "#e7e1d8" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Billion Txns",
        nameTextStyle: { color: "#a8a29e", fontSize: 11 },
        axisLabel: {
          color: "#78716c",
          fontSize: 11,
          formatter: (v: number) => `${v}B`,
        },
        splitLine: { lineStyle: { color: "#f0ebe4" } },
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
        {
          type: "slider",
          start: 0,
          end: 100,
          height: 30,
          bottom: 10,
          borderColor: "#e7e1d8",
          backgroundColor: "#ffffff",
          fillerColor: "rgba(59, 130, 246, 0.08)",
          handleStyle: { color: "#3b82f6" },
          textStyle: { color: "#a8a29e" },
          dataBackground: {
            lineStyle: { color: "#3b82f6", opacity: 0.3 },
            areaStyle: { color: "#3b82f6", opacity: 0.05 },
          },
        },
      ],
      series: [
        {
          name: "UPI Volume",
          type: "line",
          data: volumeBillions,
          smooth: true,
          symbol: "none",
          lineStyle: { width: 3, color: "#3b82f6" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
                { offset: 1, color: "rgba(59, 130, 246, 0.02)" },
              ],
            },
          },
          markLine: {
            silent: true,
            symbol: ["none", "none"],
            lineStyle: { color: "#c8c0b4", type: "dashed", width: 1 },
            data: [
              {
                xAxis: "Apr 2020",
                label: {
                  show: true,
                  formatter: "COVID\nlockdown",
                  color: "#78716c",
                  fontSize: 11,
                  position: "insideEndTop",
                },
              },
            ],
          },
        },
      ],
    };
  }, [data]);

  return (
    <div className="">
      <Chart option={option} height="500px" />
    </div>
  );
}
