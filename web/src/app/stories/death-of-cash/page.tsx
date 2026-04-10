import StoryLayout from "@/components/StoryLayout";
import DeathOfCashChart from "@/components/charts/DeathOfCashChart";
import trendsData from "../../../../public/data/psi_trends.json";

export const metadata = {
  title: "The Death of Cash — India in Charts",
  description: "How digital payments replaced cheques and paper instruments in India over 10 years.",
};

export default function DeathOfCashPage() {
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
    <StoryLayout
      slug="death-of-cash"
      subtitle="Over the last decade, digital payments have entirely consumed India's payment landscape. Cheques have gone from a significant share to a rounding error."
      stats={[
        { label: "Cheque Volume Decline", value: `${ctsDecline}%`, accent: true },
        { label: "UPI Share of Total", value: `${upiShare}%`, accent: true },
        { label: "Cheque Share of Total", value: `${ctsShare}%` },
      ]}
      meta={[
        { label: "Data source", value: "RBI Payment System Indicators" },
        { label: "Period", value: `${first.date} to ${last.date}` },
        { label: "Data points", value: `${trendsData.length} months` },
      ]}
      insights={[
        {
          title: "UPI is now 86% of all digital payments",
          body: "UPI's share of total digital payment volume has grown relentlessly: 46% in mid-2020, 71% by mid-2022, and 86% by mid-2025. Every other payment rail — NEFT, IMPS, cards, wallets — is growing in absolute terms but shrinking as a share.",
        },
        {
          title: "Demonetization was the inflection point",
          body: "In November 2016, India demonetized 86% of currency overnight. Cheque volumes actually spiked temporarily, but digital payments — especially NEFT and IMPS — surged and never looked back. It created the behavioral shift that UPI then capitalized on.",
        },
        {
          title: "IMPS quietly overtook NEFT in 2021",
          body: "NEFT was India's dominant electronic transfer system for over a decade. But in January 2021, IMPS surpassed NEFT in monthly volume for the first time and has stayed ahead since. The old batch-processing world is being replaced by real-time.",
        },
        {
          title: "Cheques survived COVID — but not UPI",
          body: `Cheques have declined ${ctsDecline}% since 2015, but the drop wasn't sudden — it was a slow bleed as digital alternatives grew. What's killing cheques isn't a single event — it's the relentless, compounding growth of UPI making them irrelevant, one transaction at a time.`,
        },
      ]}
    >
      <DeathOfCashChart data={trendsData} />
    </StoryLayout>
  );
}
