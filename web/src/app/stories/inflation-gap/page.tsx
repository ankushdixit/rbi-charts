import StoryLayout from "@/components/StoryLayout";
import InflationGapChart from "@/components/charts/InflationGapChart";
import inflationData from "../../../../public/data/inflation_expectations.json";

export const metadata = {
  title: "The Expectation Escalator - India in Charts",
  description: "Households always expect inflation to get worse. 17 years of data proves the pattern.",
};

export default function InflationGapPage() {
  const latest = inflationData[inflationData.length - 1];
  const rounds = inflationData.length;
  const escalatorCount = inflationData.filter(
    (d: any) => d.one_year_mean && d.current_mean && d.one_year_mean > d.current_mean
  ).length;

  return (
    <StoryLayout
      slug="inflation-gap"
      subtitle="Ask Indian households what inflation is today, and they'll overestimate. Ask what it will be in a year, and they'll say even higher. This pattern has held for 68 out of 70 survey rounds since 2008."
      stats={[
        { label: `Current Perception (R${latest.round})`, value: `${latest.current_mean}%`, accent: true },
        { label: "3-Month Expectation", value: `${latest.three_month_mean}%`, accent: true },
        { label: "1-Year Expectation", value: `${latest.one_year_mean}%`, accent: true },
      ]}
      meta={[
        { label: "Data source", value: "RBI Inflation Expectations Survey of Households" },
        { label: "Period", value: `${inflationData[0].date} to ${latest.date} (${rounds} rounds)` },
      ]}
      insights={[
        { title: "The three lines never converge", body: `In ${escalatorCount} out of ${rounds} rounds (97%), households expect 1-year-ahead inflation to be higher than current perception. The gap has averaged about 1-1.5 percentage points. This is a structural behavioral pattern, not a response to specific economic conditions.` },
        { title: "Perceptions are consistently 3-5pp above actual CPI", body: "Household inflation perception has swung from 5.2% to 12.7%. These numbers are consistently 3-5 percentage points above actual CPI - households feel inflation more acutely than official statistics suggest." },
        { title: `COVID pushed perception to 10.5%`, body: "The post-COVID inflation surge pushed current perception to 10.5%. Unlike the 2008-2013 high-inflation era where perceptions were consistently above 10%, the COVID spike was sharper but shorter." },
        { title: "Why it matters for RBI policy", body: "The RBI watches these expectations closely because they can become self-fulfilling. If households expect 9% inflation, workers demand higher wages, businesses raise prices, and inflation actually rises. The persistent gap is why the RBI struggles to anchor expectations around its 4% target." },
      ]}
    >
      <InflationGapChart data={inflationData} />
    </StoryLayout>
  );
}
