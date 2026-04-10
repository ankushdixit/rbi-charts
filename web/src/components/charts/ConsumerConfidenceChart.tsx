"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface SurveyRecord {
  date: string;
  category: string;
  current_net_response: number | null;
  future_net_response: number | null;
}

interface Props {
  data: SurveyRecord[];
}

export default function ConsumerConfidenceChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

    const labels = sorted.map((d) => {
      // "2012-09" -> "Sep 12"
      const [y, m] = d.date.split("-");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
    });

    const currentData = sorted.map((d) => d.current_net_response);
    const futureData = sorted.map((d) => d.future_net_response);

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
              const color = p.value >= 0 ? "#10b981" : "#ef4444";
              html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
                <span style="flex:1">${p.seriesName}</span>
                <span style="font-weight:600;color:${color}">${p.value > 0 ? "+" : ""}${p.value.toFixed(1)}</span>
              </div>`;
            }
          }
          return html;
        },
      },
      legend: {
        data: ["Current Perception", "Future Expectation (1 Year)"],
        bottom: 10,
        textStyle: { color: "#78716c", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 3,
      },
      grid: { left: 50, right: 20, top: 20, bottom: 50 },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { fontSize: 11, color: "#78716c", interval: "auto" },
        axisLine: { lineStyle: { color: "#e7e1d8" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Net Response",
        nameTextStyle: { color: "#a8a29e", fontSize: 11 },
        axisLabel: {
          color: "#78716c",
          fontSize: 11,
          formatter: (v: number) => (v > 0 ? `+${v}` : `${v}`),
        },
        splitLine: { lineStyle: { color: "#f0ebe4" } },
      },
      series: [
        {
          name: "Future Expectation (1 Year)",
          type: "line",
          data: futureData,
          lineStyle: { color: "#5ea88e", width: 2.5 },
          itemStyle: { color: "#5ea88e" },
          symbol: "none",
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(94, 168, 142, 0.15)" },
                { offset: 1, color: "rgba(94, 168, 142, 0)" },
              ],
            },
          },
        },
        {
          name: "Current Perception",
          type: "line",
          data: currentData,
          lineStyle: { color: "#d4827a", width: 2.5 },
          itemStyle: { color: "#d4827a" },
          symbol: "none",
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(212, 130, 122, 0)" },
                { offset: 1, color: "rgba(212, 130, 122, 0.15)" },
              ],
            },
          },
        },
        {
          name: "Zero Line",
          type: "line",
          data: labels.map(() => 0),
          lineStyle: { color: "#a8a29e", width: 1, type: "dashed" },
          symbol: "none",
          silent: true,
        },
      ],
    };
  }, [data]);

  return <Chart option={option} height="450px" />;
}
