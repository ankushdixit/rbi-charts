import StoryLayout from "@/components/StoryLayout";
import ForexFortressChart from "@/components/charts/ForexFortressChart";
import ReservesVariationChart from "@/components/charts/ReservesVariationChart";
import forexData from "../../../../public/data/forex_reserves.json";
import rvData from "../../../../public/data/reserves_variation.json";

export const metadata = {
  title: "The Forex Fortress - India in Charts",
  description:
    "From $5.8B to $695B in 58 years. But look closer: the latest growth is driven by valuation, not real inflows.",
};

export default function ForexFortressPage() {
  const latest = forexData[forexData.length - 1];
  const crisis1991 = forexData.find((d: any) => d.date === "1990-91");

  const { annual, press_release: pressRelease } = rvData;
  const pr25 = pressRelease.apr_dec_2025;
  const fy23 = annual.find((a: any) => a.period === "FY2022-23");

  return (
    <StoryLayout
      slug="forex-fortress"
      subtitle={`From $5.8B during the 1991 balance of payments crisis to $${latest.total_bn}B today. India built the world's 4th largest foreign exchange reserve over five decades. But the recent growth tells a different story: in April-December 2025, reserves grew $19.4B on paper - while the actual balance of payments showed a $30.8B outflow. The difference? $50.2B in valuation gains from rising gold prices and a weaker dollar.`}
      stats={[
        {
          label: "1991 Crisis",
          value: `$${crisis1991?.total_bn ?? 5.8}B`,
        },
        {
          label: "Current",
          value: `$${latest.total_bn}B`,
          accent: true,
        },
        {
          label: "Gold Reserves",
          value: `$${latest.gold_bn}B`,
          accent: true,
        },
        {
          label: "Growth",
          value: `${crisis1991?.total_bn ? Math.round(latest.total_bn / crisis1991.total_bn) : 115}x`,
        },
      ]}
      meta={[
        {
          label: "Data source",
          value:
            "RBI Handbook Tables 127, 147, 214 + FX Variation Press Release",
        },
        {
          label: "Period",
          value: `${forexData[0].date} to ${latest.date} (${forexData.length} data points)`,
        },
      ]}
      insights={[
        {
          title: "Three weeks from bankruptcy to world's 4th largest",
          body: `In 1991, India had just $5.8B in reserves - barely 3 weeks of import cover. The government pledged 47 tonnes of gold to avoid default. Today, at $${latest.total_bn}B, India holds more reserves than the UK, France, or Saudi Arabia.`,
        },
        {
          title: "The post-2000 exponential phase",
          body: "It took India 35 years (1967-2002) to build $70B in reserves. It took just 5 years (2002-2007) to reach $300B, driven by IT services exports, remittances, and capital flows.",
        },
        {
          title: "Gold went from insurance to investment",
          body: `Gold reserves surged from $20B (2015) to $${latest.gold_bn}B today. In 2009, RBI bought 200 tonnes from the IMF. Since then, it has steadily accumulated gold as a hedge against dollar dominance.`,
        },
        {
          title: "Reserves plateaued in 2022-23",
          body: `After hitting $607B in March 2022, reserves actually declined to $578B by March 2023 as the RBI sold dollars to defend the rupee during the Ukraine war and Fed rate hikes. India's current account deficit hit $${Math.abs((fy23?.current_account_net_usd_mn ?? 0) / 1000).toFixed(0)}B that year - the worst in the dataset.`,
        },
        {
          title: `$50.2 billion was just valuation`,
          body: `During April-December 2025, reserves grew $${pr25.total_change_usd_bn}B on paper. But on a balance of payments basis, they fell $${Math.abs(pr25.bop_change_usd_bn)}B. The entire increase came from valuation: higher gold prices, depreciation of the US dollar against major currencies, and lower bond yields.`,
        },
        {
          title: "Capital flows turned negative in 2025",
          body: `The capital account turned negative at -$${Math.abs(pr25.capital_account_usd_bn ?? 0)}B in Apr-Dec 2025. Portfolio investors pulled out $${Math.abs(pr25.portfolio_usd_bn ?? 0)}B even as FDI contributed +$${pr25.fdi_usd_bn ?? 0}B. The current account deficit of $${Math.abs(pr25.current_account_usd_bn ?? 0)}B added to the drain.`,
        },
      ]}
    >
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[1.5px] text-[#78716c] mb-3 font-medium">
            Reserves Growth (1968-2025)
          </p>
          <ForexFortressChart data={forexData} />
        </div>
        <div className="border-t border-[#e7e1d8] pt-6">
          <p className="text-xs uppercase tracking-[1.5px] text-[#78716c] mb-3 font-medium">
            What Drives Reserves: BoP Flows vs Valuation (FY2020-FY2025)
          </p>
          <ReservesVariationChart annual={annual} />
        </div>
      </div>
    </StoryLayout>
  );
}
