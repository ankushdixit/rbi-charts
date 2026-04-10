interface Props {
  data: number[];
  color: string;
  type: "area" | "bars" | "rising" | "volatile";
  width?: number;
  height?: number;
}

export default function Sparkline({
  data,
  color,
  type,
  width = 200,
  height = 60,
}: Props) {
  if (type === "bars") {
    const barWidth = width / data.length - 2;
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {data.map((v, i) => {
          const barH = v * (height - 4);
          const x = i * (width / data.length) + 1;
          const y = height - barH;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx={2}
              fill={color}
              opacity={0.3 + v * 0.5}
            />
          );
        })}
      </svg>
    );
  }

  // Line/area types
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - v * (height - 4) - 2;
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {(type === "area" || type === "rising") && (
        <path d={areaPath} fill={`url(#spark-${color.replace("#", "")})`} />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dot at the end */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - data[data.length - 1] * (height - 4) - 2}
          r={3}
          fill={color}
        />
      )}
    </svg>
  );
}
