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
          <p className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-4">
            Key Insight
          </p>
          <p className="text-2xl font-bold text-white max-w-3xl mb-4">
            Cheques now account for just {ctsShare}% of payment volume.
            UPI alone is {upiShare}%.
          </p>
          <p className="text-zinc-400 max-w-3xl">
            In December 2015, cheques (CTS) processed 82 million transactions per
            month. By February 2026, that number had dropped to 43 million — while
            UPI surged from zero to over 20 billion. The stacked area chart above
            shows how each payment method grew (or shrank) over a decade. The red
            sliver at the bottom — that&apos;s cheques, barely visible.
          </p>
        </div>
      </section>
    </div>
  );
}
