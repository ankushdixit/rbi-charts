import SavingsCollapseChart from "@/components/charts/SavingsCollapseChart";
import savingsData from "../../../../public/data/household_savings.json";
import gdpData from "../../../../public/data/household_savings_gdp.json";

export const metadata = {
  title: "The Savings Collapse — India in Charts",
  description:
    "Household financial savings fell from 11% to 5.3% of GDP. Where did the money go?",
};

export default function SavingsCollapsePage() {
  const annualGdp = gdpData.filter((d: any) => d.period.includes("Annual"));

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-sm font-semibold text-red-400 tracking-widest uppercase mb-4">
          India&apos;s Money Story
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          The Savings Collapse
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          Household financial savings fell from 11% to 5.3% of GDP in just two
          years — then partially recovered to 6%. Where did the money go? The
          answer reveals a generational shift in how Indians save and invest.
        </p>

        <div className="flex gap-8 mb-8 flex-wrap">
          {annualGdp.map((d: any) => (
            <div key={d.period}>
              <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
                FY{d.period.replace(" Annual", "").slice(2)}
              </p>
              <p className="text-3xl font-black" style={{
                color: d.value < 5 ? "#ef4444" : d.value < 5.5 ? "#f59e0b" : "#10b981",
              }}>
                {d.value}%
              </p>
              <p className="text-sm text-zinc-500">of GDP</p>
            </div>
          ))}
        </div>

        <div className="flex gap-6 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">Data source:</span>{" "}
            RBI Bulletin Table 50(a)
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Period:</span>{" "}
            FY 2022-23 to FY 2024-25
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <SavingsCollapseChart data={savingsData} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-red-400 tracking-widest uppercase mb-6">
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
                Bank deposits are losing their grip
              </p>
              <p className="text-zinc-400 text-sm">
                Bank deposits fell from ₹14.2 lakh crore (FY24) to ₹11.9 lakh
                crore (FY25) — a 17% decline. For decades, bank FDs were India&apos;s
                default savings instrument. That era is ending as retail investors
                discover equity returns.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Liabilities are rising faster than assets
              </p>
              <p className="text-zinc-400 text-sm">
                The real reason net savings fell: household borrowing surged.
                Financial liabilities grew from ₹15.9 lakh crore (FY23) to
                ₹15.7 lakh crore (FY25). Personal loans, credit cards, and BNPL
                are eating into the savings buffer.
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
