import StoryLayout from "@/components/StoryLayout";
import ITExportsChart from "@/components/charts/ITExportsChart";
import itData from "../../../../public/data/it_exports.json";

export const metadata = {
  title: "India's IT Export Machine - India in Charts",
  description:
    "India's software services exports nearly doubled in 5 years - from $93B to $181B annually.",
};

export default function ITExportsPage() {
  const annual = itData.annual;
  const quarterly = itData.quarterly;
  const firstA = annual[0];
  const lastA = annual[annual.length - 1];
  const creditGrowth = Math.round(
    ((lastA.credit_usd_mn ?? 0) / (firstA.credit_usd_mn ?? 1) - 1) * 100
  );

  // FY26 9-month total (3 quarters available)
  const fy26Qs = quarterly.filter((q: any) => q.period.includes("FY2025-26"));
  const fy26Total = fy26Qs.reduce(
    (s: number, q: any) => s + (q.credit_usd_mn || 0),
    0
  );
  const fy26Annualized = Math.round((fy26Total * 4) / 3 / 1000);

  // FY25 YoY
  const fy24 = annual.find((a: any) => a.period === "FY2023-24");
  const fy25 = annual.find((a: any) => a.period === "FY2024-25");
  const yoy = fy24 && fy25
    ? ((fy25.credit_usd_mn ?? 0) / (fy24.credit_usd_mn ?? 1) - 1) * 100
    : 0;

  return (
    <StoryLayout
      slug="it-exports"
      subtitle="India's software services exports have nearly doubled in five years, growing from $93 billion in FY2020 to $181 billion in FY2025. Every quarter, Indian IT companies earn more from overseas clients than the previous quarter. At the current pace, FY2026 is on track to cross $200 billion."
      stats={[
        {
          label: "FY2025 Receipts",
          value: `$${Math.round((lastA.credit_usd_mn ?? 0) / 1000)}B`,
          accent: true,
        },
        {
          label: "5-Year Growth",
          value: `${creditGrowth}%`,
          accent: true,
        },
        {
          label: "FY2026 Annualized",
          value: `~$${fy26Annualized}B`,
        },
        {
          label: "FY25 YoY",
          value: `+${yoy.toFixed(0)}%`,
        },
      ]}
      meta={[
        {
          label: "Data source",
          value: "RBI Handbook Table 127 + Invisibles Press Release",
        },
        {
          label: "Period",
          value: `${firstA.period} to Q3 FY2025-26 (${annual.length} annual + ${quarterly.length} quarterly)`,
        },
      ]}
      insights={[
        {
          title: `$93B to $181B in five years`,
          body: `Software services receipts grew from $${Math.round((firstA.credit_usd_mn ?? 0) / 1000)}B in ${firstA.period} to $${Math.round((lastA.credit_usd_mn ?? 0) / 1000)}B in ${lastA.period} - a ${creditGrowth}% increase. Net earnings (after deducting payments to foreign firms) grew from $${Math.round((firstA.net_usd_mn ?? 0) / 1000)}B to $${Math.round((lastA.net_usd_mn ?? 0) / 1000)}B.`,
        },
        {
          title: "IT is India's single largest forex earner",
          body: `Software services consistently account for 43-48% of all services receipts. In FY2025, $181B in IT receipts dwarfed merchandise exports and every other services category. This is why the rupee stays relatively stable despite persistent trade deficits.`,
        },
        {
          title: `FY2026 is tracking above $200 billion`,
          body: `The first three quarters of FY2026 have already brought in $${Math.round(fy26Total / 1000)}B. At this pace, the full-year figure will cross $${fy26Annualized}B - more than double what it was just five years ago.`,
        },
        {
          title: "COVID barely made a dent",
          body: `Even in FY2021 - the worst pandemic year - IT receipts grew from $93B to $100B. Remote work accelerated digital transformation budgets globally, and Indian IT companies were the primary beneficiaries.`,
        },
      ]}
    >
      <ITExportsChart quarterly={quarterly} />
    </StoryLayout>
  );
}
