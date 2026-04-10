import StoryLayout from "@/components/StoryLayout";
import CreditCardWarsChart from "@/components/charts/CreditCardWarsChart";
import raceData from "../../../../public/data/credit_card_race.json";

export const metadata = {
  title: "Credit Card Wars - India in Charts",
  description: "HDFC vs SBI vs ICICI vs Axis: a decade of credit card competition.",
};

export default function CreditCardWarsPage() {
  const latest = raceData[raceData.length - 1];
  const banks = Object.entries(latest)
    .filter(([k]) => k !== "date")
    .map(([bank, cards]) => ({ bank, cards: cards as number }))
    .filter((b) => b.cards)
    .sort((a, b) => b.cards - a.cards);
  const shortName = (b: string) => {
    const map: Record<string, string> = { "HDFC BANK": "HDFC", "STATE BANK OF INDIA": "SBI", "ICICI BANK": "ICICI", "AXIS BANK": "Axis" };
    return map[b] || b;
  };

  return (
    <StoryLayout
      slug="credit-card-wars"
      subtitle="HDFC vs SBI vs ICICI vs Axis: a decade of credit card competition across India's top banks. RBI bans, mergers, and devaluations have reshaped the market."
      stats={banks.slice(0, 4).map((b, i) => ({
        label: `#${i + 1} ${shortName(b.bank)}`,
        value: `${(b.cards / 1000000).toFixed(1)}M`,
        accent: i === 0,
      }))}
      meta={[
        { label: "Data source", value: "RBI Bank-wise ATM/Card Statistics" },
        { label: "Period", value: `${raceData[0].date} to ${latest.date}` },
        { label: "Banks tracked", value: "Top 15 by current outstanding" },
      ]}
      insights={[
        { title: "RBI bans are reshaping the market", body: "When the RBI banned HDFC from issuing new cards (Dec 2020 - Aug 2021), competitors like SBI and ICICI surged to fill the gap. History repeated with Kotak in April 2024 - down 23% from its peak of 6M cards and still falling." },
        { title: "Devaluation kills cards faster than bans", body: "RBL Bank wasn't banned - it chose to slash rewards, add spend requirements, and introduce new fees in mid-2024. Customers voted with their feet: 5.3M cards down to 4.6M (-13%) in 18 months." },
        { title: "Bank of Baroda: the quiet 260% surge", body: "The biggest percentage gainer isn't a private bank - it's PSU lender Bank of Baroda, which grew from 0.9M to 3.1M cards since Jan 2022 (+260%), fueled by its massive branch network." },
        { title: "India crossed 100M credit cards in Feb 2024", body: "From just 25 million cards a decade ago to over 100 million in February 2024 - a 12% CAGR. Yet penetration remains under 8% of the population." },
      ]}
    >
      <CreditCardWarsChart data={raceData} />
    </StoryLayout>
  );
}
