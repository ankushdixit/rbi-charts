"use client";

import Chart from "./Chart";
import type { EChartsOption } from "echarts";

// Sample data to verify ECharts is working — will be replaced with real RBI data
const option: EChartsOption = {
  title: {
    text: "UPI Transaction Volume (sample data)",
    subtext: "Millions of transactions per month",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: [
      "Jan 2023",
      "Apr 2023",
      "Jul 2023",
      "Oct 2023",
      "Jan 2024",
      "Apr 2024",
      "Jul 2024",
      "Oct 2024",
      "Jan 2025",
    ],
  },
  yAxis: {
    type: "value",
    name: "Mn Txns",
  },
  dataZoom: [{ type: "inside" }, { type: "slider" }],
  series: [
    {
      name: "UPI Volume",
      type: "line",
      smooth: true,
      areaStyle: {
        opacity: 0.15,
      },
      data: [8030, 8890, 9960, 11400, 12020, 13300, 14440, 15500, 16580],
      lineStyle: { width: 3 },
      itemStyle: { color: "#2563eb" },
    },
  ],
};

export default function SampleChart() {
  return <Chart option={option} height="450px" />;
}
