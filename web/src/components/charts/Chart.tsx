"use client";

import { useEffect, useState } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import {
  LineChart,
  BarChart,
  PieChart,
  TreemapChart,
} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkAreaComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  TreemapChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkAreaComponent,
  CanvasRenderer,
]);

interface ChartProps {
  option: EChartsOption;
  height?: string;
  mobileHeight?: string;
  className?: string;
}

function applyMobileOverrides(option: EChartsOption): EChartsOption {
  // Deep clone to avoid mutating the original
  const opt = JSON.parse(JSON.stringify(option));

  // Smaller grid margins
  if (opt.grid && !Array.isArray(opt.grid)) {
    opt.grid.left = Math.min(opt.grid.left || 60, 45);
    opt.grid.right = Math.min(opt.grid.right || 20, 10);
    opt.grid.top = Math.min(opt.grid.top || 20, 15);
  }

  // Smaller x-axis labels with auto interval
  const fixAxis = (ax: Record<string, unknown>) => {
    if (ax && typeof ax === "object") {
      if (ax.axisLabel && typeof ax.axisLabel === "object") {
        (ax.axisLabel as Record<string, unknown>).fontSize = 9;
        (ax.axisLabel as Record<string, unknown>).interval = "auto";
      }
      if (ax.nameTextStyle && typeof ax.nameTextStyle === "object") {
        (ax.nameTextStyle as Record<string, unknown>).fontSize = 9;
      }
    }
  };

  if (Array.isArray(opt.xAxis)) opt.xAxis.forEach(fixAxis);
  else if (opt.xAxis) fixAxis(opt.xAxis as Record<string, unknown>);

  if (Array.isArray(opt.yAxis)) opt.yAxis.forEach(fixAxis);
  else if (opt.yAxis) fixAxis(opt.yAxis as Record<string, unknown>);

  // Smaller legend
  if (opt.legend && !Array.isArray(opt.legend)) {
    if (opt.legend.textStyle) opt.legend.textStyle.fontSize = 9;
    opt.legend.itemWidth = 10;
    opt.legend.itemHeight = 8;
    opt.legend.itemGap = 6;
  }

  // Hide markLine annotation labels
  if (Array.isArray(opt.series)) {
    for (const s of opt.series) {
      if (s && typeof s === "object" && "markLine" in s && s.markLine) {
        if (typeof s.markLine === "object") {
          (s.markLine as Record<string, unknown>).label = { show: false };
        }
      }
    }
  }

  return opt;
}

export default function Chart({
  option,
  height = "400px",
  mobileHeight = "320px",
  className,
}: ChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const finalOption = isMobile ? applyMobileOverrides(option) : option;

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={finalOption}
      style={{ height: isMobile ? mobileHeight : height, width: "100%" }}
      className={className}
      notMerge
      lazyUpdate
    />
  );
}
