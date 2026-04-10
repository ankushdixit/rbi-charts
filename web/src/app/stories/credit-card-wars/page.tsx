import ContinueExploring from "@/components/ContinueExploring";
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
            Top 15 by current outstanding
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <CreditCardWarsChart data={raceData} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="border-t border-zinc-800 pt-8">
          <p className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-6">
            Key Insights
          </p>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
            <div>
              <p className="text-lg font-bold text-white mb-2">
                RBI bans are reshaping the market
              </p>
              <p className="text-zinc-400 text-sm">
                When the RBI banned HDFC from issuing new cards (Dec 2020 - Aug 2021),
                competitors like SBI and ICICI surged to fill the gap. History repeated
                with Kotak in April 2024 — down 23% from its peak of 6M cards and still
                falling. The regulator has become the most powerful force in credit card
                market share.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Devaluation kills cards faster than bans
              </p>
              <p className="text-zinc-400 text-sm">
                RBL Bank wasn&apos;t banned — it chose to slash rewards, add spend
                requirements, and introduce new fees in mid-2024. Customers voted
                with their feet: 5.3M cards down to 4.6M (-13%) in 18 months. American
                Express paused new applications entirely in March 2025 and is down 10%
                from its peak. Loyalty programs are the real moat.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                Bank of Baroda: the quiet 260% surge
              </p>
              <p className="text-zinc-400 text-sm">
                The biggest percentage gainer isn&apos;t a private bank — it&apos;s
                PSU lender Bank of Baroda, which grew from 0.9M to 3.1M cards since
                Jan 2022 (+260%), fueled by its massive branch network and the merger
                of Dena Bank and Vijaya Bank customer bases. Yes Bank (+159%) also
                staged a remarkable comeback after its 2020 moratorium crisis.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">
                India crossed 100M credit cards in Feb 2024
              </p>
              <p className="text-zinc-400 text-sm">
                From just 25 million cards a decade ago to over 100 million in
                February 2024 — a 12% CAGR. Credit card spending surged 27% YoY
                to Rs 18.26 trillion in FY24. Yet penetration remains under 8% of
                the population. The next 100 million will come from smaller banks,
                fintechs, and tier-2 cities.
              </p>
            </div>
          </div>
        </div>
      </section>
      <ContinueExploring currentSlug="credit-card-wars" />
      <ContinueExploring currentSlug="credit-card-wars" />
    </div>
  );
}
