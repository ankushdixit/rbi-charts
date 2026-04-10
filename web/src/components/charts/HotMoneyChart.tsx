"use client";

import { useMemo } from "react";
import Chart from "./Chart";
import type { EChartsOption } from "echarts";

interface BoPRecord {
  quarter: string;
  type: string;
  net_usd_mn: number;
}

interface Props {
  data: BoPRecord[];
}

export default function HotMoneyChart({ data }: Props) {
  const option = useMemo<EChartsOption>(() => {
    // Get unique quarters in order, exclude annual aggregates
    const quarters = Array.from(
      new Set(data.map((d) => d.quarter))
    )
      .filter((q) => !q.includes("April-March") && !q.includes("April-December"))
      .sort((a, b) => {
        // Parse "April-June 2024 PR" -> sortable string
        const qMap: Record<string, string> = {
          "April-June": "Q1", "July-September": "Q2",
          "October-December": "Q3", "January-March": "Q4",
        };
        const parseQ = (s: string) => {
          for (const [k, v] of Object.entries(qMap)) {
            if (s.includes(k)) {
              const year = parseInt(s.match(/\d{4}/)?.[0] || "0");
              // Q4 (Jan-Mar 2022) belongs to FY ending Mar 2022
              // It should sort AFTER Q3 (Oct-Dec 2021) which is FY starting Apr 2021
              // So Q4's sort key uses year-1 for the FY start year, then Q4
              const fyStartYear = v === "Q4" ? year - 1 : year;
              return `${fyStartYear}-${v}`;
            }
          }
          return s;
        };
        return parseQ(a).localeCompare(parseQ(b));
      });

    const shortLabels = quarters.map((q) => {
      const year = parseInt(q.match(/\d{4}/)?.[0] || "0");
      // Use Indian FY notation: Apr-Jun 2021 = Q1 FY22, Jan-Mar 2022 = Q4 FY22
      if (q.includes("April-June")) return `Q1 FY${String(year + 1).slice(2)}`;
      if (q.includes("July-Sep")) return `Q2 FY${String(year + 1).slice(2)}`;
      if (q.includes("October-Dec")) return `Q3 FY${String(year + 1).slice(2)}`;
      if (q.includes("January-Mar")) return `Q4 FY${String(year).slice(2)}`;
      return q;
    });

    const fdiData = quarters.map((q) => {
      const rec = data.find((d) => d.quarter === q && d.type === "FDI");
      return rec ? +(rec.net_usd_mn / 1000).toFixed(1) : null;
    });

    const fiiData = quarters.map((q) => {
      const rec = data.find((d) => d.quarter === q && d.type === "FII");
      return rec ? +(rec.net_usd_mn / 1000).toFixed(1) : null;
    });

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
                <span style="font-weight:600;color:${color}">$${p.value > 0 ? "+" : ""}${p.value.toFixed(1)}B</span>
              </div>`;
            }
          }
          return html;
        },
      },
      legend: {
        data: ["FDI (Net)", "Portfolio / FII (Net)"],
        bottom: 10,
        textStyle: { color: "#78716c", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 3,
      },
      grid: { left: 60, right: 20, top: 20, bottom: 50 },
      xAxis: {
        type: "category",
        data: shortLabels,
        axisLabel: { fontSize: 11, color: "#78716c" },
        axisLine: { lineStyle: { color: "#e7e1d8" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "US$ Billion (Net)",
        nameTextStyle: { color: "#a8a29e", fontSize: 11 },
        axisLabel: {
          color: "#78716c", fontSize: 11,
          formatter: (v: number) => `$${v}B`,
        },
        splitLine: { lineStyle: { color: "#f0ebe4" } },
      },
      series: [
        {
          name: "FDI (Net)",
          type: "bar",
          data: fdiData,
          itemStyle: {
            color: (params: any) => params.value >= 0 ? "#3b82f6" : "#3b82f6",
          },
          barWidth: "30%",
        },
        {
          name: "Portfolio / FII (Net)",
          type: "bar",
          data: fiiData,
          itemStyle: {
            color: (params: any) => params.value >= 0 ? "#f59e0b" : "#f59e0b",
          },
          barWidth: "30%",
        },
      ],
    };
  }, [data]);

  return (
    <div className="">
      <Chart option={option} height="450px" />
    </div>
  );
}
