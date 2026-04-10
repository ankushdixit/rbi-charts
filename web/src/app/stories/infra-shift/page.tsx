import InfraShiftChart from "@/components/charts/InfraShiftChart";
import infraData from "../../../../public/data/infra_shift.json";

export const metadata = {
  title: "3,600 QR Codes for Every ATM — India in Charts",
  description:
    "How India's payment infrastructure transformed from ATMs to QR codes in 15 years.",
};

export default function InfraShiftPage() {
  const latest = infraData[infraData.length - 1];
  const first = infraData[0];
  const peakATM = infraData.reduce((a, b) => (a.atms > b.atms ? a : b));
  const qrToAtm = Math.round(latest.upi_qr / latest.atms);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-sm font-semibold text-cyan-400 tracking-widest uppercase mb-4">
          Payments Revolution
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          {qrToAtm.toLocaleString()} QR Codes for Every ATM
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          India built {(first.atms / 1000).toFixed(0)}K ATMs over decades.
          Then in just 3 years, it deployed {(latest.upi_qr / 1000000).toFixed(0)}M
          UPI QR codes. ATMs are now declining while digital acceptance points
          multiply at a pace no country has matched.
        </p>

        <div className="flex gap-8 mb-8 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">ATMs</p>
            <p className="text-3xl font-black text-red-400">
              {(latest.atms / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-zinc-500">peaked {(peakATM.atms / 1000).toFixed(0)}K ({peakATM.date})</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">PoS Terminals</p>
            <p className="text-3xl font-black text-amber-400">
              {(latest.pos / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-zinc-500">{Math.round(latest.pos / first.pos)}x since {first.date}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">UPI QR Codes</p>
            <p className="text-3xl font-black text-emerald-400">
              {(latest.upi_qr / 1000000).toFixed(0)}M
            </p>
            <p className="text-sm text-zinc-500">{qrToAtm.toLocaleString()}x more than ATMs</p>
          </div>
        </div>

        <div className="flex gap-6 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">Data source:</span>{" "}
            RBI Bank-wise ATM/Card Statistics
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Period:</span>{" "}
            {first.date} to {latest.date} ({infraData.length} months)
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <InfraShiftChart data={infraData} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-cyan-400 tracking-widest uppercase mb-6">
            Key Insights
          </p>
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
            <div>
              <p className="text-lg font-bold text-white mb-2">
                ATMs peaked in {peakATM.date} and are declining
              </p>
              <p className="text-zinc-400 text-sm">
                After growing from {(first.atms / 1000).toFixed(0)}K ({first.date})
                to {(peakATM.atms / 1000).toFixed(0)}K ({peakATM.date}), ATMs have
                been shrinking — down to {(latest.atms / 1000).toFixed(0)}K. Banks
                are closing unprofitable ATMs as UPI makes cash withdrawal less
                necessary. This is the first sustained decline in India&apos;s ATM
                count in history.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">
                UPI QR: 98M to {(latest.upi_qr / 1000000).toFixed(0)}M — with a counting shake-up
              </p>
              <p className="text-zinc-400 text-sm">
                UPI QR codes grew from 98M (May 2021) to ~330M by Jul 2024, then
                jumped to 591M in Aug 2024 — an overnight 80% increase that
                reflects a change in how QR codes are counted (likely including
                all aggregator-deployed QR codes). Regardless of the methodology
                shift, the scale is staggering: at {(latest.upi_qr / 1000000).toFixed(0)}M,
                a QR code exists for every Indian adult.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">
                PoS terminals grew 20x but are now plateauing
              </p>
              <p className="text-zinc-400 text-sm">
                PoS terminals grew from {(first.pos / 1000).toFixed(0)}K to{" "}
                {(latest.pos / 1000000).toFixed(1)}M — a 20x increase driven by card
                adoption. But growth has slowed recently as merchants find QR codes
                cheaper and easier to deploy. PoS may follow ATMs into decline as
                QR becomes the default acceptance point.
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-2">
                Bharat QR stalled — UPI QR ate its lunch
              </p>
              <p className="text-zinc-400 text-sm">
                Bharat QR (the card-network-based QR system) peaked around 6M and
                is now declining to {(latest.bharat_qr / 1000000).toFixed(1)}M.
                UPI QR, which is simpler and doesn&apos;t need a merchant bank
                account relationship, made Bharat QR irrelevant. Two QR
                standards competed — the open-source one won decisively.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
