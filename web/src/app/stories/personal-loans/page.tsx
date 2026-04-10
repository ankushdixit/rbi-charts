import StoryLayout from "@/components/StoryLayout";
import PersonalLoansChart from "@/components/charts/PersonalLoansChart";
import creditData from "../../../../public/data/sectoral_credit.json";

export const metadata = {
  title: "The Personal Loan Explosion - India in Charts",
  description:
    "India's personal loans doubled from 30 lakh crore to 62 lakh crore in four years.",
};

export default function PersonalLoansPage() {
  const personalSectors = [
    "personal_housing",
    "personal_other",
    "personal_vehicle",
    "personal_credit_card",
    "personal_education",
    "personal_fd",
    "personal_consumer_durables",
    "personal_shares",
  ];

  const personalData = (creditData as any[]).filter((d: any) =>
    personalSectors.includes(d.sector)
  );

  // Compute stats from data
  const dates = Array.from(new Set(personalData.map((d: any) => d.date))).sort();
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];

  const totalFirst =
    personalData
      .filter((d: any) => d.date === firstDate)
      .reduce((s: number, d: any) => s + (d.outstanding_crore || 0), 0) / 100000;

  const totalLast =
    personalData
      .filter((d: any) => d.date === lastDate)
      .reduce((s: number, d: any) => s + (d.outstanding_crore || 0), 0) / 100000;

  // Growth by category
  const catGrowth = personalSectors.map((sector) => {
    const first = personalData.find(
      (d: any) => d.date === firstDate && d.sector === sector
    );
    const last = personalData.find(
      (d: any) => d.date === lastDate && d.sector === sector
    );
    const growth =
      first && last && first.outstanding_crore > 0
        ? ((last.outstanding_crore / first.outstanding_crore - 1) * 100).toFixed(0)
        : "0";
    return {
      sector,
      firstVal: first?.outstanding_crore || 0,
      lastVal: last?.outstanding_crore || 0,
      growth: parseInt(growth),
    };
  });

  const ccGrowth = catGrowth.find((c) => c.sector === "personal_credit_card");
  const housingGrowth = catGrowth.find((c) => c.sector === "personal_housing");
  const vehicleGrowth = catGrowth.find((c) => c.sector === "personal_vehicle");
  const otherGrowth = catGrowth.find((c) => c.sector === "personal_other");

  return (
    <StoryLayout
      slug="personal-loans"
      subtitle={`India's personal loan outstanding doubled from ${totalFirst.toFixed(0)} lakh crore to ${totalLast.toFixed(0)} lakh crore between March 2021 and June 2025. Housing dominates, but credit cards grew the fastest. Every category expanded as banks shifted focus from corporate lending to retail.`}
      stats={[
        {
          label: "Total Personal Loans",
          value: `${totalLast.toFixed(0)}L Cr`,
          accent: true,
        },
        {
          label: "4-Year Growth",
          value: `${Math.round(((totalLast / totalFirst) - 1) * 100)}%`,
          accent: true,
        },
        {
          label: "Housing Share",
          value: `${Math.round(((housingGrowth?.lastVal || 0) / (totalLast * 100000)) * 100)}%`,
        },
        {
          label: "CC Outstanding Growth",
          value: `+${ccGrowth?.growth}%`,
        },
      ]}
      meta={[
        {
          label: "Data source",
          value: "RBI Handbook Tables 45 & 167 (Sectoral Credit Deployment)",
        },
        {
          label: "Period",
          value: `Mar 2021 to Jun 2025 (${dates.length} data points)`,
        },
      ]}
      insights={[
        {
          title: `Housing is half the story at ${Math.round(((housingGrowth?.lastVal || 0) / (totalLast * 100000)) * 100)}% share`,
          body: `Housing loans grew from ${(housingGrowth?.firstVal || 0) / 100000 | 0} lakh crore to ${(housingGrowth?.lastVal || 0) / 100000 | 0} lakh crore (+${housingGrowth?.growth}%). It remains the single largest personal loan category, driven by urbanization and government housing incentives.`,
        },
        {
          title: `Credit card outstanding grew ${ccGrowth?.growth}% - the fastest`,
          body: `Credit card outstanding more than doubled from ${((ccGrowth?.firstVal || 0) / 100000).toFixed(1)} lakh crore to ${((ccGrowth?.lastVal || 0) / 100000).toFixed(1)} lakh crore. This reflects both card adoption (110M+ active cards) and higher revolving balances as consumers use credit for everyday spending.`,
        },
        {
          title: `"Other personal loans" is the fastest-growing pool`,
          body: `The "other personal loans" category - which includes unsecured personal loans, fintech lending, and buy-now-pay-later - grew from ${((otherGrowth?.firstVal || 0) / 100000).toFixed(1)}L Cr to ${((otherGrowth?.lastVal || 0) / 100000).toFixed(1)}L Cr (+${otherGrowth?.growth}%). The RBI has flagged this segment for supervisory attention.`,
        },
        {
          title: "Vehicle loans show the steadiest growth",
          body: `Auto and vehicle loans grew from ${((vehicleGrowth?.firstVal || 0) / 100000).toFixed(1)}L Cr to ${((vehicleGrowth?.lastVal || 0) / 100000).toFixed(1)}L Cr (+${vehicleGrowth?.growth}%). This tracks with India's auto sales recovery post-COVID and the shift to electric vehicles requiring financing.`,
        },
      ]}
    >
      <PersonalLoansChart data={personalData} />
    </StoryLayout>
  );
}
