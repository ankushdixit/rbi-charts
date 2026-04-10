import StoryLayout from "@/components/StoryLayout";
import HotMoneyChart from "@/components/charts/HotMoneyChart";
import bopData from "../../../../public/data/bop_fdi_fii.json";

export const metadata = {
  title: "Steady Hands vs Quick Exits - India in Charts",
  description: "FDI stays. Portfolio money runs. Quarterly data reveals the pattern.",
};

export default function HotMoneyPage() {
  const quarterly = bopData.filter(
    (d: any) => !d.quarter.includes("April-March") && !d.quarter.includes("April-December")
  );
  const fdiData = quarterly.filter((d: any) => d.type === "FDI");
  const fiiData = quarterly.filter((d: any) => d.type === "FII");
  const fdiPositive = fdiData.filter((d: any) => d.net_usd_mn > 0).length;
  const fiiPositive = fiiData.filter((d: any) => d.net_usd_mn > 0).length;
  const fdiRange = { min: Math.min(...fdiData.map((d: any) => d.net_usd_mn)), max: Math.max(...fdiData.map((d: any) => d.net_usd_mn)) };
  const fiiRange = { min: Math.min(...fiiData.map((d: any) => d.net_usd_mn)), max: Math.max(...fiiData.map((d: any) => d.net_usd_mn)) };

  return (
    <StoryLayout
      slug="hot-money"
      subtitle="FDI is the patient capital - factories, subsidiaries, long-term bets. Portfolio investment is the hot money - equity trades, bond positions, one bad quarter and it flees. The quarterly data shows just how different they are."
      stats={[
        { label: `FDI Range`, value: `$${(fdiRange.min / 1000).toFixed(1)}B to +$${(fdiRange.max / 1000).toFixed(1)}B`, accent: true },
        { label: `FII Range`, value: `$${(fiiRange.min / 1000).toFixed(1)}B to +$${(fiiRange.max / 1000).toFixed(1)}B`, accent: true },
      ]}
      meta={[
        { label: "Data source", value: "RBI Balance of Payments (BPM6)" },
        { label: "Period", value: `Q1 FY2022 to Q3 FY2026 (${fdiData.length} quarters)` },
      ]}
      insights={[
        { title: "FII swings are 5x larger than FDI", body: `Portfolio investment ranged from $${(fiiRange.min / 1000).toFixed(1)}B to +$${(fiiRange.max / 1000).toFixed(1)}B - a swing of $${((fiiRange.max - fiiRange.min) / 1000).toFixed(0)}B. FDI ranged from $${(fdiRange.min / 1000).toFixed(1)}B to +$${(fdiRange.max / 1000).toFixed(1)}B. This volatility is why portfolio flows are called "hot money."` },
        { title: "FDI turned negative - a warning sign", body: `Net FDI was negative in ${fdiData.filter((d: any) => d.net_usd_mn < 0).length} of ${fdiData.length} quarters - meaning more foreign investment left India than came in. This reflects MNCs repatriating profits and a slowdown in new greenfield investment.` },
        { title: "Q2 FY2025 was the FII sugar rush", body: `Jul-Sep 2024 saw +$${(fiiRange.max / 1000).toFixed(1)}B in portfolio inflows. By the next quarter (Oct-Dec 2024), it reversed to -$11.4B. This is the classic hot money pattern: momentum flows in, then one global risk event and it rushes out.` },
        { title: "India needs both - but depends on neither", body: "With $668B in forex reserves, India can absorb FII outflows without crisis. But FDI weakness is harder to compensate - it reflects foreign companies' confidence in India's manufacturing story." },
      ]}
    >
      <HotMoneyChart data={quarterly} />
    </StoryLayout>
  );
}
