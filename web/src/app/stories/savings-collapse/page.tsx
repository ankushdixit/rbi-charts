import SavingsCollapseChart from "@/components/charts/SavingsCollapseChart";
import savingsData from "../../../../public/data/household_savings.json";
import gdpData from "../../../../public/data/household_savings_gdp.json";

export const metadata = {
  title: "The Great Rebalancing — India in Charts",
  description:
    "How Indian households shifted from bank deposits to mutual funds and equity in just three years.",
};

export default function SavingsCollapsePage() {
  // Only show net savings % of GDP — one per FY
  const netGdp = gdpData.filter(
    (d: any) =>
      d.period.includes("Annual") && d.item === "net_financial_assets_pct_gdp"
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-sm font-semibold text-amber-400 tracking-widest uppercase mb-4">
          India&apos;s Money Story
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          The Great Rebalancing
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          COVID lockdowns forced savings to an all-time high of 12% of GDP.
          Then came the reversal — a crash to 4.9% as borrowing nearly tripled.
          Now recovering at 6%, the story isn&apos;t just about how much Indians
          save — it&apos;s about where the money goes and how much they borrow.
        </p>

        <div className="flex gap-8 mb-8 flex-wrap">
          {netGdp.map((d: any) => {
            const fy = d.period.replace(" Annual", "");
            return (
              <div key={d.period}>
                <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
                  Net Savings FY{fy.slice(2)}
                </p>
                <p
                  className="text-4xl font-black"
                  style={{
                    color:
                      d.value < 5 ? "#ef4444" : d.value < 5.5 ? "#f59e0b" : "#10b981",
                  }}
                >
                  {d.value}%
                </p>
                <p className="text-sm text-zinc-500">of GDP</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-6 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">Data source:</span>{" "}
            RBI Bulletin Table 50(a)
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Period:</span>{" "}
            FY 2019-20 to FY 2024-25 (30 quarters)
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <SavingsCollapseChart data={savingsData} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-6">
            Key Insights
          </p>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
            <div>
              <p className="text-lg font-bold text-white mb-2">
                It was the borrowing, not the saving
              </p>
              <p className="text-zinc-400 text-sm">
                The drop from 12% to 4.9% of GDP wasn&apos;t about Indians
                saving less — total financial assets stayed at ₹29-35 lakh crore
                annually. The real driver was a borrowing explosion: household
                liabilities nearly tripled from ₹5.9L Cr (FY22) to ₹18.8L Cr
                (FY24). Personal loans, credit cards, and BNPL ate into the net
                savings number. FY25&apos;s recovery to 6% came largely because
                borrowing fell back to ₹15.7L Cr.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Mutual funds: from ₹60K Cr to ₹4.7L Cr in 6 years
              </p>
              <p className="text-zinc-400 text-sm">
                The one trend that&apos;s genuinely new: mutual fund inflows grew
                8x from ₹60,000 crore (FY20) to ₹4.7 lakh crore (FY25).
                Direct equity tripled in just one year. But context matters —
                mutual funds are still only 13% of total savings. Bank deposits
                (₹11.9L Cr) and provident funds (₹7.9L Cr) remain far larger.
                The shift is real but still early.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Provident funds: the quiet, steady giant
              </p>
              <p className="text-zinc-400 text-sm">
                While headlines focus on mutual funds and equity, provident and
                pension funds have grown every single year without exception —
                ₹5.0L Cr (FY20) to ₹7.9L Cr (FY25). No dips, no drama. For most
                Indian salaried workers, this mandatory contribution remains the
                largest single component of their financial savings.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                The COVID anomaly distorts everything
              </p>
              <p className="text-zinc-400 text-sm">
                FY 2020-21 savings (12% of GDP) were an anomaly, not a baseline.
                Lockdowns forced ₹31.6L Cr in asset accumulation while borrowing
                stayed at ₹7.9L Cr. Every comparison to &quot;pre-COVID levels&quot;
                is misleading. The real pre-COVID baseline was FY 2019-20 at 8.1%
                — and the current 6.0% is indeed lower, reflecting structurally
                higher household leverage in the personal loan era.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
