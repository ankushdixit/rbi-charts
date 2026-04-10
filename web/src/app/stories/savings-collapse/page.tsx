import StoryLayout from "@/components/StoryLayout";
import SavingsCollapseChart from "@/components/charts/SavingsCollapseChart";
import savingsData from "../../../../public/data/household_savings.json";
import gdpData from "../../../../public/data/household_savings_gdp.json";

export const metadata = {
  title: "The Great Rebalancing — India in Charts",
  description: "How Indian households shifted from bank deposits to mutual funds and equity.",
};

export default function SavingsCollapsePage() {
  const netGdp = gdpData.filter(
    (d: any) => d.period.includes("Annual") && d.item === "net_financial_assets_pct_gdp"
  );

  return (
    <StoryLayout
      slug="savings-collapse"
      subtitle="COVID lockdowns forced savings to an all-time high of 12% of GDP. Then came the reversal — a crash to 4.9% as borrowing nearly tripled. Now recovering at 6%, the story isn't just about how much Indians save — it's about where the money goes and how much they borrow."
      stats={netGdp.map((d: any) => ({
        label: `Net Savings FY${d.period.replace(" Annual", "").slice(2)}`,
        value: `${d.value}%`,
        accent: true,
      }))}
      meta={[
        { label: "Data source", value: "RBI Bulletin Table 50(a)" },
        { label: "Period", value: "FY 2019-20 to FY 2024-25 (quarterly)" },
      ]}
      insights={[
        { title: "It was the borrowing, not the saving", body: "The drop from 12% to 4.9% of GDP wasn't about Indians saving less — total financial assets stayed at ₹29-35 lakh crore annually. The real driver was a borrowing explosion: household liabilities nearly tripled from ₹5.9L Cr (FY22) to ₹18.8L Cr (FY24)." },
        { title: "Mutual funds: from ₹60K Cr to ₹4.7L Cr in 6 years", body: "The one trend that's genuinely new: mutual fund inflows grew 8x from ₹60,000 crore (FY20) to ₹4.7 lakh crore (FY25). But context matters — mutual funds are still only 13% of total savings. Bank deposits and provident funds remain far larger." },
        { title: "Provident funds: the quiet, steady giant", body: "While headlines focus on mutual funds and equity, provident and pension funds have grown every single year without exception — ₹5.0L Cr (FY20) to ₹7.9L Cr (FY25). No dips, no drama." },
        { title: "The COVID anomaly distorts everything", body: "FY 2020-21 savings (12% of GDP) were an anomaly, not a baseline. Lockdowns forced ₹31.6L Cr in asset accumulation while borrowing stayed at ₹7.9L Cr. The real pre-COVID baseline was FY 2019-20 at 8.1% — and the current 6.0% is indeed lower." },
      ]}
    >
      <SavingsCollapseChart data={savingsData} />
    </StoryLayout>
  );
}
