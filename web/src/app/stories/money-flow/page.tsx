import MoneyFlowChart from "@/components/charts/MoneyFlowChart";
import creditData from "../../../../public/data/sectoral_credit_summary.json";

export const metadata = {
  title: "Where Does India's Money Flow? — India in Charts",
  description:
    "Follow the rupee from agriculture to personal loans. How bank credit allocation reveals India's economic transformation.",
};

export default function MoneyFlowPage() {
  // Get latest date data for stats
  const allDates = Array.from(new Set(creditData.map((d: any) => d.date))).sort();
  const latestDate = allDates[allDates.length - 1];
  const latest = creditData.filter((d: any) => d.date === latestDate);

  const getSector = (key: string) =>
    latest.find((d: any) => d.sector === key)?.outstanding_crore ?? 0;

  const agri = getSector("agriculture");
  const industry = getSector("industry_total");
  const services = getSector("services");
  const personal = getSector("personal_loans");

  // Use full dataset for non-food credit total and sub-sectors
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fullData = require("../../../../public/data/sectoral_credit.json");
  const latestFull = fullData.filter((d: any) => d.date === latestDate);
  const getFullSector = (key: string) =>
    latestFull.find((d: any) => d.sector === key)?.outstanding_crore ?? 0;

  const totalCredit = getFullSector("non_food_credit") || (agri + industry + services + personal);
  const housing = getFullSector("personal_housing");
  const vehicle = getFullSector("personal_vehicle");
  const gold = getFullSector("personal_gold");
  const ccOutstanding = getFullSector("personal_credit_card");

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-sm font-semibold text-purple-400 tracking-widest uppercase mb-4">
          India&apos;s Money Story
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          Where Does India&apos;s Money Flow?
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          India&apos;s banks deploy ₹{(totalCredit / 100000).toFixed(0)} lakh crore
          in credit. Where it goes reveals the economy&apos;s structural
          transformation — from farms and factories to homes and phones.
        </p>

        <div className="flex gap-8 mb-8 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Personal Loans
            </p>
            <p className="text-3xl font-black text-amber-400">
              {((personal / totalCredit) * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-zinc-500">
              ₹{(personal / 100000).toFixed(1)}L Cr
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Services
            </p>
            <p className="text-3xl font-black text-purple-400">
              {((services / totalCredit) * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-zinc-500">
              ₹{(services / 100000).toFixed(1)}L Cr
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Industry
            </p>
            <p className="text-3xl font-black text-blue-400">
              {((industry / totalCredit) * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-zinc-500">
              ₹{(industry / 100000).toFixed(1)}L Cr
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Agriculture
            </p>
            <p className="text-3xl font-black text-emerald-400">
              {((agri / totalCredit) * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-zinc-500">
              ₹{(agri / 100000).toFixed(1)}L Cr
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">Data source:</span>{" "}
            RBI Sectoral Deployment of Bank Credit
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Period:</span>{" "}
            FY 2020-21 to Jun 2025 ({allDates.length} data points)
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <MoneyFlowChart data={creditData} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-purple-400 tracking-widest uppercase mb-6">
            Key Insights
          </p>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
            <div>
              <p className="text-lg font-bold text-white mb-2">
                Personal loans are 1.5x industry credit
              </p>
              <p className="text-zinc-400 text-sm">
                At ₹{(personal / 100000).toFixed(1)} lakh crore, personal loans
                are 1.5x total industrial credit
                (₹{(industry / 100000).toFixed(1)}L Cr). Housing alone at
                ₹{(housing / 100000).toFixed(1)}L Cr is 2.5x larger than the
                entire MSME sector (₹12.3L Cr). The gap has widened every single
                year since FY 2020-21.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Services is the fastest growing sector
              </p>
              <p className="text-zinc-400 text-sm">
                Services credit grew 12.4% YoY (Mar 2024 to Mar 2025) — the
                fastest among all sectors — reaching
                ₹{(services / 100000).toFixed(1)} lakh crore. It now receives{" "}
                {((services / totalCredit) * 100).toFixed(0)}% of all non-food
                credit. NBFCs, commercial real estate, and trade are driving this.
                Services overtook industry around FY 2021-22 and keeps pulling ahead.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                The aspiration economy is credit-fueled
              </p>
              <p className="text-zinc-400 text-sm">
                Vehicle loans hit ₹{(vehicle / 100000).toFixed(1)}L Cr and credit
                card outstanding reached ₹{(ccOutstanding / 100000).toFixed(1)}L Cr.
                Within personal loans, housing (₹{(housing / 100000).toFixed(1)}L Cr)
                remains dominant, but vehicle loans, credit cards, and consumer
                durables are the fastest growing segments — reflecting the rise
                of India&apos;s aspirational middle class.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Agriculture: growing but losing share
              </p>
              <p className="text-zinc-400 text-sm">
                Agriculture credit grew 10.4% YoY to
                ₹{(agri / 100000).toFixed(1)}L Cr — healthy growth in absolute
                terms. But its share of non-food credit is just{" "}
                {((agri / totalCredit) * 100).toFixed(0)}%, the smallest of the
                four sectors. As personal loans and services grow faster, farm
                credit&apos;s relative weight keeps declining despite the RBI&apos;s
                priority sector lending mandate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
