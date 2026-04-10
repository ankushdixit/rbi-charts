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
          Then came the reversal — a crash to 4.9% as spending normalized and
          borrowing surged. Now at 6%, the composition has fundamentally changed:
          bank deposits are out, mutual funds and equity are in.
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
                Mutual funds doubled in a single year
              </p>
              <p className="text-zinc-400 text-sm">
                Mutual fund inflows exploded from ₹2.4 lakh crore (FY24) to
                ₹4.7 lakh crore (FY25) — nearly doubling. Direct equity
                investments tripled from ₹29,000 crore to ₹73,500 crore.
                Indians are moving from deposits to markets at unprecedented speed.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                COVID created an artificial peak — then reality hit
              </p>
              <p className="text-zinc-400 text-sm">
                In FY 2020-21, lockdowns meant people couldn&apos;t spend, pushing
                net savings to 12% of GDP — an anomalous all-time high. By FY
                2022-23, the reversal was complete: savings crashed to 4.9% as
                revenge spending, personal loans, and credit card debt surged.
                The real question is whether 6% is the new normal.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Household borrowing actually fell in FY25
              </p>
              <p className="text-zinc-400 text-sm">
                Total financial liabilities dropped from ₹18.8 lakh crore (FY24)
                to ₹15.7 lakh crore (FY25) — a 17% decline. This is why net
                savings recovered to 6% of GDP despite slower asset growth.
                Households deleveraged after the post-COVID borrowing binge.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Q3 is always the weakest quarter
              </p>
              <p className="text-zinc-400 text-sm">
                Net savings as % of GDP drops every Q3 (Oct-Dec): 4.3% in FY23,
                3.8% in FY24, 3.2% in FY25. This is festive season spending —
                Diwali, weddings, and year-end consumption drain household
                finances before Q4 tax-saving season replenishes them.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
