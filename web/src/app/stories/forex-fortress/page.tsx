import StoryLayout from "@/components/StoryLayout";
import ForexFortressChart from "@/components/charts/ForexFortressChart";
import forexData from "../../../../public/data/forex_reserves.json";

export const metadata = {
  title: "The Forex Fortress — India in Charts",
  description: "From $5.8B to $668B. How India built the world's 4th largest reserves.",
};

export default function ForexFortressPage() {
  const latest = forexData[forexData.length - 1];
  const crisis1991 = forexData.find((d: any) => d.date === "1990-91");

  return (
    <StoryLayout
      slug="forex-fortress"
      subtitle="From $5.8B during the 1991 balance of payments crisis to $668B today. How India built the world's 4th largest foreign exchange reserve — its insurance policy against external shocks."
      stats={[
        { label: "1991 Crisis", value: `$${crisis1991?.total_bn ?? 5.8}B`, accent: false },
        { label: "Current", value: `$${latest.total_bn}B`, accent: true },
        { label: "Gold Reserves", value: `$${latest.gold_bn}B`, accent: true },
        { label: "Growth", value: `${crisis1991?.total_bn ? Math.round(latest.total_bn / crisis1991.total_bn) : 115}x` },
      ]}
      meta={[
        { label: "Data source", value: "RBI Handbook Tables 147 & 214" },
        { label: "Period", value: `${forexData[0].date} to ${latest.date}` },
        { label: "Data points", value: `${forexData.length} (annual + weekly)` },
      ]}
      insights={[
        { title: "Three weeks from bankruptcy to world's 4th largest", body: `In 1991, India had just $5.8B in reserves — barely 3 weeks of import cover. The government pledged 47 tonnes of gold to avoid default. Today, at $${latest.total_bn}B, India holds more reserves than the UK, France, or Saudi Arabia.` },
        { title: "Gold went from insurance to investment", body: `Gold reserves surged from $20B (2015) to $${latest.gold_bn}B today. In 2009, RBI bought 200 tonnes from the IMF. Since then, it has steadily accumulated gold as a hedge against dollar dominance.` },
        { title: "Reserves plateaued in 2022-23", body: "After hitting $607B in March 2022, reserves actually declined to $578B by March 2023 as the RBI sold dollars to defend the rupee during the Ukraine war and Fed rate hikes. A reminder that reserves are meant to be used during crises." },
        { title: "The post-2000 exponential phase", body: "It took India 35 years (1967-2002) to build $70B in reserves. It took just 5 years (2002-2007) to reach $300B, driven by IT services exports, remittances, and capital flows." },
      ]}
    >
      <ForexFortressChart data={forexData} />
    </StoryLayout>
  );
}
