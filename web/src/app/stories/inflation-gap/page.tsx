import ContinueExploring from "@/components/ContinueExploring";
import InflationGapChart from "@/components/charts/InflationGapChart";
import inflationData from "../../../../public/data/inflation_expectations.json";

export const metadata = {
  title: "The Expectation Escalator — India in Charts",
  description:
    "Households always expect inflation to get worse. 17 years of data proves the pattern.",
};

export default function InflationGapPage() {
  const latest = inflationData[inflationData.length - 1];
  const rounds = inflationData.length;
  const first = inflationData[0];

  // Count how many rounds have 1Y > current
  const escalatorCount = inflationData.filter(
    (d: any) => d.one_year_mean && d.current_mean && d.one_year_mean > d.current_mean
  ).length;

  // Find the range
  const currentVals = inflationData
    .map((d: any) => d.current_mean)
    .filter((v: any) => v != null);
  const minPerception = Math.min(...currentVals);
  const maxPerception = Math.max(...currentVals);

  // COVID peak
  const covidPeak = inflationData
    .filter((d: any) => d.date >= "2020-06" && d.date <= "2022-06")
    .reduce(
      (a: any, b: any) =>
        (b.current_mean || 0) > (a.current_mean || 0) ? b : a,
      { current_mean: 0 }
    );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-sm font-semibold text-red-400 tracking-widest uppercase mb-4">
          Deep Dives
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          The Expectation Escalator
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          Ask Indian households what inflation is today, and they&apos;ll say{" "}
          {latest.current_mean}%. Ask what it will be in a year, and they&apos;ll
          say {latest.one_year_mean}%. This pattern — always expecting worse —
          has held for {escalatorCount} out of {rounds} survey rounds since 2008.
        </p>

        <div className="flex gap-8 mb-8 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Current Perception
            </p>
            <p className="text-3xl font-black text-red-400">
              {latest.current_mean}%
            </p>
            <p className="text-sm text-zinc-500">
              {latest.date} (Round {latest.round})
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              3-Month Expectation
            </p>
            <p className="text-3xl font-black text-amber-400">
              {latest.three_month_mean}%
            </p>
            <p className="text-sm text-zinc-500">always higher than current</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              1-Year Expectation
            </p>
            <p className="text-3xl font-black text-purple-400">
              {latest.one_year_mean}%
            </p>
            <p className="text-sm text-zinc-500">
              escalator pattern: {escalatorCount}/{rounds} rounds
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">Data source:</span>{" "}
            RBI Inflation Expectations Survey of Households
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Period:</span>{" "}
            {first.date} to {latest.date} ({rounds} bi-monthly rounds)
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <InflationGapChart data={inflationData} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-red-400 tracking-widest uppercase mb-6">
            Key Insights
          </p>
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
            <div>
              <p className="text-lg font-bold text-white mb-2">
                The three lines never converge
              </p>
              <p className="text-zinc-400 text-sm">
                In {escalatorCount} out of {rounds} rounds (97%), households
                expect 1-year-ahead inflation to be higher than current
                perception. The gap between current and 1-year ahead has averaged
                about 1-1.5 percentage points. This is a structural behavioral
                pattern, not a response to specific economic conditions.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">
                Perceptions range from {minPerception.toFixed(1)}% to{" "}
                {maxPerception.toFixed(1)}%
              </p>
              <p className="text-zinc-400 text-sm">
                Household inflation perception has swung from{" "}
                {minPerception.toFixed(1)}% (when actual CPI was around 3-4%)
                to {maxPerception.toFixed(1)}% (during post-COVID price surges).
                These numbers are consistently 3-5 percentage points above
                actual CPI — households feel inflation more acutely than
                official statistics suggest.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">
                COVID pushed perception to {covidPeak.current_mean}%
              </p>
              <p className="text-zinc-400 text-sm">
                The post-COVID inflation surge (Round {covidPeak.round},{" "}
                {covidPeak.date}) pushed current perception to{" "}
                {covidPeak.current_mean}%. Unlike the 2008-2013 high-inflation
                era where perceptions were consistently above 10%, the COVID
                spike was sharper but shorter — perceptions recovered to{" "}
                {latest.current_mean}% by {latest.date}.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">
                Why it matters for RBI policy
              </p>
              <p className="text-zinc-400 text-sm">
                The RBI watches these expectations closely because they can
                become self-fulfilling. If households expect 9% inflation,
                workers demand higher wages, businesses raise prices, and
                inflation actually rises. The persistent gap between perception
                and reality is why the RBI struggles to anchor expectations
                around its 4% target.
              </p>
            </div>
          </div>
        </div>
      </section>
      <ContinueExploring currentSlug="inflation-gap" />
    </div>
  );
}
