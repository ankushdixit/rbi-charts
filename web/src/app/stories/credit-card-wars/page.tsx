import CreditCardWarsChart from "@/components/charts/CreditCardWarsChart";
import raceData from "../../../../public/data/credit_card_race.json";

export const metadata = {
  title: "Credit Card Wars — India in Charts",
  description:
    "HDFC vs SBI vs ICICI vs Axis: a decade of credit card competition.",
};

export default function CreditCardWarsPage() {
  const latest = raceData[raceData.length - 1];
  const [latestYear, latestMonth] = latest.date.split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const latestMonthName = monthNames[parseInt(latestMonth) - 1];

  // Top 4 banks
  const banks = Object.entries(latest)
    .filter(([k]) => k !== "date")
    .map(([bank, cards]) => ({ bank, cards: cards as number }))
    .filter((b) => b.cards)
    .sort((a, b) => b.cards - a.cards);

  const totalCards = banks.reduce((sum, b) => sum + b.cards, 0);

  const shortName = (b: string) => {
    const map: Record<string, string> = {
      "HDFC BANK": "HDFC", "STATE BANK OF INDIA": "SBI",
      "ICICI BANK": "ICICI", "AXIS BANK": "Axis",
    };
    return map[b] || b;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-sm font-semibold text-amber-400 tracking-widest uppercase mb-4">
          Competition
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          Credit Card Wars
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-8">
          {shortName(banks[0].bank)} vs {shortName(banks[1].bank)} vs{" "}
          {shortName(banks[2].bank)} vs {shortName(banks[3].bank)}: a decade of
          credit card competition across India&apos;s top banks.
        </p>

        <div className="flex gap-8 mb-8 flex-wrap">
          {banks.slice(0, 4).map((b, i) => (
            <div key={b.bank}>
              <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
                #{i + 1} {shortName(b.bank)}
              </p>
              <p className="text-3xl font-black" style={{
                color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i],
              }}>
                {(b.cards / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-zinc-500">
                {((b.cards / totalCards) * 100).toFixed(0)}% market share
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-6 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">Data source:</span>{" "}
            RBI Bank-wise ATM/Card Statistics
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Period:</span>{" "}
            {raceData[0].date} to {latest.date}
          </div>
          <div>
            <span className="font-semibold text-zinc-400">Banks tracked:</span>{" "}
            Top 10 by current outstanding
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <CreditCardWarsChart data={raceData} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-4">
            Key Insight
          </p>
          <p className="text-2xl font-bold text-white max-w-3xl mb-4">
            HDFC Bank overtook SBI as India&apos;s largest credit card issuer and
            never looked back.
          </p>
          <p className="text-zinc-400 max-w-3xl">
            In {latestMonthName} {latestYear}, HDFC held{" "}
            {(banks[0].cards / 1000000).toFixed(1)}M credit cards — ahead of
            SBI&apos;s {(banks[1].cards / 1000000).toFixed(1)}M. But the real story
            is the explosive growth of Axis, Kotak, and fintech-backed issuers
            like RBL and IDFC First, who have grown 5-10x in just 5 years. India&apos;s
            credit card market crossed 110 million cards in 2024 — from just 25
            million a decade ago.
          </p>
        </div>
      </section>
    </div>
  );
}
