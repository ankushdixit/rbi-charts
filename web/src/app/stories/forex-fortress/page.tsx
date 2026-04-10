import ContinueExploring from "@/components/ContinueExploring";
import ForexFortressChart from "@/components/charts/ForexFortressChart";
import forexData from "../../../../public/data/forex_reserves.json";

export const metadata = {
  title: "$5B to $688B: India's Forex Fortress — India in Charts",
  description:
    "From the 1991 BoP crisis to the world's 4th largest reserves. The story of India's financial insurance policy.",
};

export default function ForexFortressPage() {
  const latest = forexData[forexData.length - 1];
  const crisis1991 = forexData.find((d: any) => d.date === "1990-91");

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-sm font-semibold text-emerald-400 tracking-widest uppercase mb-4">
          India&apos;s Money Story
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          The Forex Fortress
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          From ${crisis1991?.total_bn ?? 5.8}B during the 1991 balance of payments
          crisis to ${latest.total_bn}B today. How India built the
          world&apos;s 4th largest foreign exchange reserve — its insurance
          policy against external shocks.
        </p>

        <div className="flex gap-8 mb-8 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              1991 Crisis
            </p>
            <p className="text-4xl font-black text-red-400">
              ${crisis1991?.total_bn ?? 5.8}B
            </p>
            <p className="text-sm text-zinc-500">3 weeks of imports</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Current
            </p>
            <p className="text-4xl font-black text-emerald-400">
              ${latest.total_bn}B
            </p>
            <p className="text-sm text-zinc-500">{latest.date}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Gold Reserves
            </p>
            <p className="text-4xl font-black text-amber-400">
              ${latest.gold_bn}B
            </p>
            <p className="text-sm text-zinc-500">
              {latest.gold_bn && latest.total_bn
                ? ((latest.gold_bn / latest.total_bn) * 100).toFixed(0)
                : 0}
              % of total
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Growth
            </p>
            <p className="text-4xl font-black text-blue-400">
              {crisis1991?.total_bn
                ? Math.round(latest.total_bn / crisis1991.total_bn)
                : 115}x
            </p>
            <p className="text-sm text-zinc-500">since 1991</p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">Data source:</span>{" "}
            RBI Handbook Tables 147 & 214
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Period:</span>{" "}
            {forexData[0].date} to {latest.date}
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Data points:</span>{" "}
            {forexData.length} (annual + weekly)
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <ForexFortressChart data={forexData} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-6">
            Key Insights
          </p>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
            <div>
              <p className="text-lg font-bold text-white mb-2">
                Three weeks from bankruptcy to world&apos;s 4th largest
              </p>
              <p className="text-zinc-400 text-sm">
                In 1991, India had just $5.8B in reserves — barely 3 weeks of
                import cover. The government pledged 47 tonnes of gold to avoid
                default. Today, at ${latest.total_bn}B, India holds more reserves
                than the UK, France, or Saudi Arabia. Only China, Japan, and
                Switzerland have more.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Gold went from insurance to investment
              </p>
              <p className="text-zinc-400 text-sm">
                Gold reserves surged from $20B (2015) to ${latest.gold_bn}B
                today. In 2009, RBI bought 200 tonnes from the IMF. Since then,
                it has steadily accumulated gold as a hedge against dollar
                dominance. Gold now represents{" "}
                {latest.gold_bn && latest.total_bn
                  ? ((latest.gold_bn / latest.total_bn) * 100).toFixed(0)
                  : 12}
                % of reserves — the highest share in decades.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Reserves plateaued in 2022-23
              </p>
              <p className="text-zinc-400 text-sm">
                After hitting $607B in March 2022, reserves actually declined to
                $578B by March 2023 as the RBI sold dollars to defend the rupee
                during the Ukraine war and Fed rate hikes. This was the first
                significant drawdown since 2018 — a reminder that reserves are
                meant to be used during crises.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                The post-2000 exponential phase
              </p>
              <p className="text-zinc-400 text-sm">
                It took India 35 years (1967-2002) to build $70B in reserves. It
                took just 5 years (2002-2007) to reach $300B, driven by IT
                services exports, remittances, and capital flows. The growth rate
                slowed after 2008 but resumed post-2020 with massive FPI inflows
                and current account surpluses during COVID.
              </p>
            </div>
          </div>
        </div>
      </section>
      <ContinueExploring currentSlug="forex-fortress" />
      <ContinueExploring currentSlug="forex-fortress" />
    </div>
  );
}
