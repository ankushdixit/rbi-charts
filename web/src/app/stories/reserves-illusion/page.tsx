import StoryLayout from "@/components/StoryLayout";
import ReservesVariationChart from "@/components/charts/ReservesVariationChart";
import rvData from "../../../../public/data/reserves_variation.json";

export const metadata = {
  title: "The Reserve Illusion - India in Charts",
  description:
    "India's forex reserves grew $19.4B in Apr-Dec 2025 - but $50.2B was just valuation. On a BoP basis, reserves actually fell $30.8B.",
};

export default function ReservesIllusionPage() {
  const { annual, press_release: pressRelease } = rvData;
  const pr25 = pressRelease.apr_dec_2025;
  const pr24 = pressRelease.apr_dec_2024;

  // FY2024-25 data
  const fy25 = annual.find((a: any) => a.period === "FY2024-25");
  const fy23 = annual.find((a: any) => a.period === "FY2022-23");

  return (
    <StoryLayout
      slug="reserves-illusion"
      subtitle="India's forex reserves grew by $19.4 billion during April-December 2025. But dig beneath the headline and the picture inverts: on a balance of payments basis, reserves actually fell by $30.8 billion. The entire increase - and more - came from valuation effects: rising gold prices, a weaker dollar, and lower bond yields."
      stats={[
        {
          label: "Reserves Change (Apr-Dec 2025)",
          value: `+$${pr25.total_change_usd_bn}B`,
          accent: true,
        },
        {
          label: "Valuation Effect",
          value: `+$${pr25.valuation_usd_bn}B`,
          accent: true,
        },
        {
          label: "BoP-Based Change",
          value: `$${pr25.bop_change_usd_bn}B`,
        },
      ]}
      meta={[
        {
          label: "Data source",
          value: "RBI Handbook Table 127 + FX Reserves Variation Press Release",
        },
        {
          label: "Period",
          value: `FY2019-20 to Apr-Dec 2025 (${annual.length} annual + press release)`,
        },
      ]}
      insights={[
        {
          title: "$50.2 billion from valuation alone",
          body: `During April-December 2025, valuation gains of $${pr25.valuation_usd_bn}B - from higher gold prices, a weaker US dollar, and lower bond yields - more than offset the BoP deficit of $${Math.abs(pr25.bop_change_usd_bn)}B. Without valuation, reserves would have fallen.`,
        },
        {
          title: "The current account remains a persistent drain",
          body: `India ran a current account deficit of $${Math.abs(pr25.current_account_usd_bn ?? 0)}B in Apr-Dec 2025. The trade deficit (imports exceeding exports) is structural - India imports oil, gold, and electronics while exporting services. IT exports partially offset this, but not entirely.`,
        },
        {
          title: "Capital flows turned negative",
          body: `The capital account, which usually brings in foreign investment and loans, turned negative at $${Math.abs(pr25.capital_account_usd_bn ?? 0)}B in Apr-Dec 2025. Portfolio investors pulled out $${Math.abs(pr25.portfolio_usd_bn ?? 0)}B even as FDI contributed +$${pr25.fdi_usd_bn ?? 0}B.`,
        },
        {
          title: "FY2023 was the red flag year",
          body: `In FY2022-23, India's current account deficit hit $${Math.abs((fy23?.current_account_net_usd_mn ?? 0) / 1000).toFixed(0)}B - the worst in the dataset. Capital inflows of $${((fy23?.capital_account_net_usd_mn ?? 0) / 1000).toFixed(0)}B couldn't fully cover it, and reserves fell $${Math.abs((fy23?.overall_balance_net_usd_mn ?? 0) / 1000).toFixed(0)}B on a BoP basis.`,
        },
      ]}
    >
      <ReservesVariationChart annual={annual} pressRelease={pressRelease} />
    </StoryLayout>
  );
}
