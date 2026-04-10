import ContinueExploring from "@/components/ContinueExploring";
import UPIExplosionChart from "@/components/charts/UPIExplosionChart";
import upiData from "../../../../public/data/psi_upi.json";

export const metadata = {
  title: "The UPI Explosion — India in Charts",
  description:
    "From zero to 20 billion monthly transactions. The fastest payment system adoption in history.",
};

export default function UPIExplosionPage() {
  const latestPoint = upiData[upiData.length - 1];
  const latestBillions = (latestPoint.volume_lakh / 10000).toFixed(1);
  const latestValueLakhCr = (latestPoint.value_crore! / 100000).toFixed(1);

  const [latestYear, latestMonth] = latestPoint.date.split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const latestMonthName = monthNames[parseInt(latestMonth) - 1];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-sm font-semibold text-blue-400 tracking-widest uppercase mb-4">
          Payments Revolution
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          The UPI Explosion
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          From near-zero to {latestBillions} billion monthly transactions in under
          a decade. The fastest adoption of any payment system in history.
        </p>

        <div className="flex gap-8 mb-8">
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Latest Monthly Volume
            </p>
            <p className="text-4xl font-black text-blue-400">
              {latestBillions}B
            </p>
            <p className="text-sm text-zinc-500">
              transactions in {latestMonthName} {latestYear}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Monthly Value
            </p>
            <p className="text-4xl font-black text-emerald-400">
              ₹{latestValueLakhCr}L Cr
            </p>
            <p className="text-sm text-zinc-500">
              ~${Math.round(latestPoint.value_crore! / 8400)}B USD equivalent
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Data Points
            </p>
            <p className="text-4xl font-black text-zinc-300">
              {upiData.length}
            </p>
            <p className="text-sm text-zinc-500">
              months of data ({upiData[0].date} to {latestPoint.date})
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">Data source:</span>{" "}
            RBI Payment System Indicators
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Updated:</span>{" "}
            Monthly
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Period:</span>{" "}
            {upiData[0].date} to {latestPoint.date}
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <UPIExplosionChart data={upiData} />
      </section>

      {/* Insights */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-blue-400 tracking-widest uppercase mb-6">
            Key Insights
          </p>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
            <div>
              <p className="text-lg font-bold text-white mb-2">
                Bigger than Visa and Mastercard combined
              </p>
              <p className="text-zinc-400 text-sm">
                In {latestMonthName} {latestYear}, UPI handled {latestBillions} billion
                transactions — more than Visa and Mastercard process globally in a
                month. India now accounts for 46% of all real-time payment
                transactions worldwide. No other country comes close.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Growth is slowing — but still massive
              </p>
              <p className="text-zinc-400 text-sm">
                Year-on-year growth has decelerated from 97% (Feb 2022) to 66%
                (Feb 2023) to 61% (Feb 2024) to 33% (Feb 2025). This is natural
                at scale — adding 5 billion transactions a year to a 20B base is
                harder than doubling from 4B to 8B. But 33% growth on a $320B
                monthly system is still extraordinary.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                COVID barely dented it
              </p>
              <p className="text-zinc-400 text-sm">
                When India locked down in April 2020, cheques crashed 75%, credit
                cards fell 53%, and IMPS dropped 44%. UPI? Down just 20% — and
                recovered within a month. The lockdown actually accelerated UPI
                adoption as cash became impractical. By June 2020, UPI was already
                above pre-COVID levels.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Average transaction value is falling
              </p>
              <p className="text-zinc-400 text-sm">
                The average UPI transaction was ₹1,657 in Jan 2020. By Jan 2026,
                it&apos;s ₹1,306 — a 21% decline. This means UPI is penetrating
                deeper into small, everyday purchases: chai, auto rides, vegetable
                vendors. The system that started as a bank transfer tool is now
                India&apos;s digital cash for micro-transactions.
              </p>
            </div>
          </div>
        </div>
      </section>
      <ContinueExploring currentSlug="upi-explosion" />
      <ContinueExploring currentSlug="upi-explosion" />
    </div>
  );
}
