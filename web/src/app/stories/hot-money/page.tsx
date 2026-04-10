import HotMoneyChart from "@/components/charts/HotMoneyChart";
import bopData from "../../../../public/data/bop_fdi_fii.json";

export const metadata = {
  title: "FDI vs FII: Steady Hands vs Quick Exits — India in Charts",
  description:
    "Foreign direct investment stays. Portfolio money runs. Quarterly data reveals the pattern.",
};

export default function HotMoneyPage() {
  // Filter to quarterly only (no annual aggregates)
  const quarterly = bopData.filter(
    (d: any) =>
      !d.quarter.includes("April-March") &&
      !d.quarter.includes("April-December")
  );

  const fdiData = quarterly.filter((d: any) => d.type === "FDI");
  const fiiData = quarterly.filter((d: any) => d.type === "FII");

  const fdiPositive = fdiData.filter((d: any) => d.net_usd_mn > 0).length;
  const fiiPositive = fiiData.filter((d: any) => d.net_usd_mn > 0).length;

  const maxFII = fiiData.reduce(
    (a: any, b: any) => (Math.abs(b.net_usd_mn) > Math.abs(a.net_usd_mn) ? b : a),
    { net_usd_mn: 0 }
  );

  const fdiRange = {
    min: Math.min(...fdiData.map((d: any) => d.net_usd_mn)),
    max: Math.max(...fdiData.map((d: any) => d.net_usd_mn)),
  };
  const fiiRange = {
    min: Math.min(...fiiData.map((d: any) => d.net_usd_mn)),
    max: Math.max(...fiiData.map((d: any) => d.net_usd_mn)),
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-sm font-semibold text-blue-400 tracking-widest uppercase mb-4">
          External Sector
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          Steady Hands vs Quick Exits
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          FDI is the patient capital — factories, subsidiaries, long-term bets.
          Portfolio investment is the hot money — equity trades, bond positions,
          one bad quarter and it flees. The quarterly data shows just how
          different they are.
        </p>

        <div className="flex gap-8 mb-8 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              FDI Range
            </p>
            <p className="text-3xl font-black text-blue-400">
              ${(fdiRange.min / 1000).toFixed(1)}B to +$
              {(fdiRange.max / 1000).toFixed(1)}B
            </p>
            <p className="text-sm text-zinc-500">
              positive {fdiPositive}/{fdiData.length} quarters
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              FII Range
            </p>
            <p className="text-3xl font-black text-amber-400">
              ${(fiiRange.min / 1000).toFixed(1)}B to +$
              {(fiiRange.max / 1000).toFixed(1)}B
            </p>
            <p className="text-sm text-zinc-500">
              positive {fiiPositive}/{fiiData.length} quarters
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">Data source:</span>{" "}
            RBI Balance of Payments (BPM6)
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Period:</span>{" "}
            Q1 FY2025 to Q3 FY2026 ({fdiData.length} quarters)
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <HotMoneyChart data={quarterly} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-blue-400 tracking-widest uppercase mb-6">
            Key Insights
          </p>
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
            <div>
              <p className="text-lg font-bold text-white mb-2">
                FII swings are 5x larger than FDI
              </p>
              <p className="text-zinc-400 text-sm">
                Portfolio investment ranged from ${(fiiRange.min / 1000).toFixed(1)}B
                to +${(fiiRange.max / 1000).toFixed(1)}B — a swing of $
                {((fiiRange.max - fiiRange.min) / 1000).toFixed(0)}B. FDI ranged from
                ${(fdiRange.min / 1000).toFixed(1)}B to +$
                {(fdiRange.max / 1000).toFixed(1)}B — a swing of $
                {((fdiRange.max - fdiRange.min) / 1000).toFixed(0)}B. This
                volatility is why portfolio flows are called &quot;hot money.&quot;
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">
                FDI turned negative — a warning sign
              </p>
              <p className="text-zinc-400 text-sm">
                Net FDI was negative in {fdiData.filter((d: any) => d.net_usd_mn < 0).length} of{" "}
                {fdiData.length} quarters — meaning more foreign investment left
                India than came in. This reflects MNCs repatriating profits and
                a slowdown in new greenfield investment. For a country that
                needs FDI for manufacturing growth, this is concerning.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">
                Q2 FY2025 was the FII sugar rush
              </p>
              <p className="text-zinc-400 text-sm">
                Jul-Sep 2024 saw +${(fiiRange.max / 1000).toFixed(1)}B in
                portfolio inflows — the largest in this dataset. By the next
                quarter (Oct-Dec 2024), it reversed to -$11.4B. This is the
                classic hot money pattern: momentum flows in, then one global
                risk event (US election, Fed signals) and it rushes out.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">
                India needs both — but depends on neither
              </p>
              <p className="text-zinc-400 text-sm">
                With $668B in forex reserves, India can absorb FII outflows
                without crisis (unlike 2013&apos;s taper tantrum with $280B
                reserves). But FDI weakness is harder to compensate — it reflects
                foreign companies&apos; confidence in India&apos;s manufacturing
                story. The data suggests India is more of a trading destination
                for portfolio money than a manufacturing investment target.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
