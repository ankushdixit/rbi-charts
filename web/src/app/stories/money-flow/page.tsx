import MoneyFlowChart from "@/components/charts/MoneyFlowChart";
import creditData from "../../../../public/data/sectoral_credit.json";

export const metadata = {
  title: "Where Does India's Money Flow? — India in Charts",
  description:
    "Follow the rupee from agriculture to personal loans. How bank credit allocation reveals India's economic transformation.",
};

export default function MoneyFlowPage() {
  // Get latest date data for stats
  const allDates = Array.from(new Set(creditData.map((d: any) => d.date)));
  const latestDate = allDates[allDates.length - 1];
  const latest = creditData.filter((d: any) => d.date === latestDate);

  const getSector = (key: string) =>
    latest.find((d: any) => d.sector === key)?.outstanding_crore ?? 0;

  const totalCredit = getSector("non_food_credit");
  const agri = getSector("agriculture");
  const industry = getSector("industry_total");
  const services = getSector("services");
  const personal = getSector("personal_loans");
  const housing = getSector("personal_housing");
  const vehicle = getSector("personal_vehicle");
  const gold = getSector("personal_gold");
  const ccOutstanding = getSector("personal_credit_card");

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
            <span className="font-semibold text-zinc-400">Latest:</span>{" "}
            {latestDate}
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
                Personal loans now exceed industry credit
              </p>
              <p className="text-zinc-400 text-sm">
                At ₹{(personal / 100000).toFixed(1)} lakh crore, personal loans
                are larger than total industrial credit
                (₹{(industry / 100000).toFixed(1)}L Cr). Housing alone accounts
                for ₹{(housing / 100000).toFixed(1)}L Cr — more than micro, small,
                and medium industry combined. Banks are funding aspirations, not
                factories.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Services sector is the new growth engine
              </p>
              <p className="text-zinc-400 text-sm">
                Services credit grew 16.3% YoY — the fastest among all sectors —
                reaching ₹{(services / 100000).toFixed(1)} lakh crore. NBFCs,
                commercial real estate, and trade are driving this. Services now
                receives {((services / totalCredit) * 100).toFixed(0)}% of all
                non-food credit, up from ~20% a decade ago.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Vehicle loans and gold loans are exploding
              </p>
              <p className="text-zinc-400 text-sm">
                Vehicle loans hit ₹{(vehicle / 100000).toFixed(1)}L Cr, gold loans
                reached ₹{(gold / 100000).toFixed(1)}L Cr, and credit card
                outstanding is ₹{(ccOutstanding / 100000).toFixed(1)}L Cr. These
                aspirational credit categories are growing 15-30% annually —
                far faster than traditional housing loans.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Agriculture stuck at 12% despite policy push
              </p>
              <p className="text-zinc-400 text-sm">
                Despite the RBI&apos;s priority sector lending mandate (40% of
                credit must go to priority sectors including agriculture),
                farm credit has grown only 12.3% YoY and its share of total
                credit has been declining for years. The gap between policy intent
                and credit reality keeps widening.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
