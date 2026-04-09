import DeathOfCashChart from "@/components/charts/DeathOfCashChart";
import trendsData from "../../../../public/data/psi_trends.json";

export const metadata = {
  title: "The Death of Cash — India in Charts",
  description:
    "How digital payments replaced cheques and paper instruments in India over 10 years.",
};

export default function DeathOfCashPage() {
  // Calculate stats from the data
  const first = trendsData[0];
  const last = trendsData[trendsData.length - 1];

  const firstCts = first.cts ?? 0;
  const lastCts = last.cts ?? 0;
  const ctsDecline = (((lastCts - firstCts) / firstCts) * 100).toFixed(0);

  const lastUpi = last.upi ?? 0;
  const lastTotal = last.total_payments ?? 1;
  const upiShare = ((lastUpi / lastTotal) * 100).toFixed(1);

  const ctsShare = ((lastCts / lastTotal) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-sm font-semibold text-emerald-400 tracking-widest uppercase mb-4">
          Payments Revolution
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          The Death of Cash
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          Over the last decade, digital payments have entirely consumed India's
          payment landscape. Cheques have gone from a significant share to a
          rounding error.
        </p>

        <div className="flex gap-8 mb-8">
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Cheque Volume Decline
            </p>
            <p className="text-4xl font-black text-red-400">{ctsDecline}%</p>
            <p className="text-sm text-zinc-500">
              since {first.date}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              UPI Share of Total
            </p>
            <p className="text-4xl font-black text-blue-400">{upiShare}%</p>
            <p className="text-sm text-zinc-500">of all payment volume</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
              Cheque Share of Total
            </p>
            <p className="text-4xl font-black text-zinc-400">{ctsShare}%</p>
            <p className="text-sm text-zinc-500">and falling</p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">Data source:</span>{" "}
            RBI Payment System Indicators
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Period:</span>{" "}
            {first.date} to {last.date}
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Data points:</span>{" "}
            {trendsData.length} months
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <DeathOfCashChart data={trendsData} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-6">
            Key Insights
          </p>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
            <div>
              <p className="text-lg font-bold text-white mb-2">
                UPI is now 86% of all digital payments
              </p>
              <p className="text-zinc-400 text-sm">
                UPI&apos;s share of total digital payment volume has grown relentlessly:
                46% in mid-2020, 71% by mid-2022, and 86% by mid-2025. Every other
                payment rail — NEFT, IMPS, cards, wallets — is growing in absolute
                terms but shrinking as a share. UPI hasn&apos;t just won — it&apos;s
                consuming the entire ecosystem.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Demonetization was the inflection point
              </p>
              <p className="text-zinc-400 text-sm">
                In November 2016, India demonetized 86% of currency overnight.
                Cheque volumes actually spiked temporarily (people had no cash),
                but digital payments — especially NEFT and IMPS — surged and never
                looked back. It created the behavioral shift that UPI then
                capitalized on. Without demonetization, UPI&apos;s adoption curve
                would have been far slower.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                IMPS quietly overtook NEFT in 2021
              </p>
              <p className="text-zinc-400 text-sm">
                NEFT was India&apos;s dominant electronic transfer system for over a
                decade. But in January 2021, IMPS (instant mobile transfers)
                surpassed NEFT in monthly volume for the first time and has stayed
                ahead since. IMPS processes 3.5B+ transactions per month now
                — driven by mobile-first banking. The old batch-processing world
                is being replaced by real-time.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Cheques survived COVID — but not UPI
              </p>
              <p className="text-zinc-400 text-sm">
                Cheques have declined {ctsDecline}% since 2015, but the drop wasn&apos;t
                sudden — it was a slow bleed as digital alternatives grew. Even during
                COVID lockdowns (Apr 2020), when cheque volumes crashed 75% in a single
                month, they partially recovered afterwards. What&apos;s killing cheques
                isn&apos;t a single event — it&apos;s the relentless, compounding growth
                of UPI making them irrelevant, one transaction at a time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
