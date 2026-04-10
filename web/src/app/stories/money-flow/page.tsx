import StoryLayout from "@/components/StoryLayout";
import MoneyFlowChart from "@/components/charts/MoneyFlowChart";
import PersonalLoansChart from "@/components/charts/PersonalLoansChart";
import summaryData from "../../../../public/data/sectoral_credit_summary.json";
import creditData from "../../../../public/data/sectoral_credit.json";

export const metadata = {
  title: "Where Does India's Money Flow? - India in Charts",
  description:
    "Personal loans overtook industry. Credit cards doubled. Follow the rupee from farms to fintech.",
};

export default function MoneyFlowPage() {
  // Sector-level data
  const allDates = Array.from(new Set(summaryData.map((d: any) => d.date))).sort();
  const latestDate = allDates[allDates.length - 1];
  const latest = summaryData.filter((d: any) => d.date === latestDate);
  const getSector = (key: string) =>
    latest.find((d: any) => d.sector === key)?.outstanding_crore ?? 0;
  const agri = getSector("agriculture");
  const industry = getSector("industry_total");
  const services = getSector("services");
  const personal = getSector("personal_loans");
  const latestFull = (creditData as any[]).filter(
    (d: any) => d.date === latestDate
  );
  const getFullSector = (key: string) =>
    latestFull.find((d: any) => d.sector === key)?.outstanding_crore ?? 0;
  const totalCredit =
    getFullSector("non_food_credit") || agri + industry + services + personal;

  // Personal loan breakdown data
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
  const personalDates = Array.from(
    new Set(personalData.map((d: any) => d.date))
  ).sort();
  const firstDate = personalDates[0];
  const totalFirst =
    personalData
      .filter((d: any) => d.date === firstDate)
      .reduce((s: number, d: any) => s + (d.outstanding_crore || 0), 0) /
    100000;
  const totalLast =
    personalData
      .filter((d: any) => d.date === latestDate)
      .reduce((s: number, d: any) => s + (d.outstanding_crore || 0), 0) /
    100000;

  const catGrowth = personalSectors.map((sector) => {
    const first = personalData.find(
      (d: any) => d.date === firstDate && d.sector === sector
    );
    const last = personalData.find(
      (d: any) => d.date === latestDate && d.sector === sector
    );
    const growth =
      first && last && first.outstanding_crore > 0
        ? Math.round(
            (last.outstanding_crore / first.outstanding_crore - 1) * 100
          )
        : 0;
    return {
      sector,
      firstVal: first?.outstanding_crore || 0,
      lastVal: last?.outstanding_crore || 0,
      growth,
    };
  });

  const ccGrowth = catGrowth.find((c) => c.sector === "personal_credit_card");
  const housingGrowth = catGrowth.find(
    (c) => c.sector === "personal_housing"
  );
  const otherGrowth = catGrowth.find((c) => c.sector === "personal_other");

  return (
    <StoryLayout
      slug="money-flow"
      subtitle={`India's banks deploy over ₹${Math.round(totalCredit / 100000)} lakh crore in credit. Personal loans - at ${((personal / totalCredit) * 100).toFixed(0)}% of total credit - have overtaken industry. Zoom in and the personal loan category itself doubled from ${totalFirst.toFixed(0)}L Cr to ${totalLast.toFixed(0)}L Cr in four years, with credit cards growing the fastest at ${ccGrowth?.growth}%.`}
      stats={[
        {
          label: "Personal Loans Share",
          value: `${((personal / totalCredit) * 100).toFixed(0)}%`,
          accent: true,
        },
        {
          label: "Personal Loans Total",
          value: `${totalLast.toFixed(0)}L Cr`,
          accent: true,
        },
        {
          label: "Industry Share",
          value: `${((industry / totalCredit) * 100).toFixed(0)}%`,
        },
        {
          label: "CC Growth (4yr)",
          value: `+${ccGrowth?.growth}%`,
        },
      ]}
      meta={[
        {
          label: "Data source",
          value: "RBI Sectoral Deployment of Bank Credit (Tables 45 & 167)",
        },
        {
          label: "Period",
          value: `FY 2020-21 to Jun 2025 (${allDates.length} data points)`,
        },
      ]}
      insights={[
        {
          title: "Personal loans are 1.5x industry credit",
          body: `At ₹${(personal / 100000).toFixed(1)} lakh crore, personal loans are 1.5x total industrial credit (₹${(industry / 100000).toFixed(1)}L Cr). The gap has widened every single year since FY 2020-21. Banks find retail lending more profitable and less risky than large corporate exposures.`,
        },
        {
          title: "Services is the fastest growing sector",
          body: `Services credit grew 12.4% YoY (Mar 2024 to Mar 2025) - the fastest among all sectors - reaching ₹${(services / 100000).toFixed(1)} lakh crore. NBFCs, commercial real estate, and trade are driving this.`,
        },
        {
          title: `Housing is half of personal loans at ${Math.round(((housingGrowth?.lastVal || 0) / (totalLast * 100000)) * 100)}% share`,
          body: `Housing loans grew from ${Math.round((housingGrowth?.firstVal || 0) / 100000)} lakh crore to ${Math.round((housingGrowth?.lastVal || 0) / 100000)} lakh crore (+${housingGrowth?.growth}%). It remains the single largest personal loan category, driven by urbanization and government housing incentives.`,
        },
        {
          title: `Credit card outstanding grew ${ccGrowth?.growth}% - the fastest`,
          body: `Credit card outstanding more than doubled from ${((ccGrowth?.firstVal || 0) / 100000).toFixed(1)} lakh crore to ${((ccGrowth?.lastVal || 0) / 100000).toFixed(1)} lakh crore. This reflects both card adoption (110M+ active cards) and higher revolving balances as consumers use credit for everyday spending.`,
        },
        {
          title: `"Other personal loans" - the RBI's concern`,
          body: `The "other personal loans" category - unsecured personal loans, fintech lending, buy-now-pay-later - grew from ${((otherGrowth?.firstVal || 0) / 100000).toFixed(1)}L Cr to ${((otherGrowth?.lastVal || 0) / 100000).toFixed(1)}L Cr (+${otherGrowth?.growth}%). The RBI has flagged this segment for supervisory attention and raised risk weights.`,
        },
        {
          title: "Agriculture: growing but losing share",
          body: `Agriculture credit grew 10.4% YoY to ₹${(agri / 100000).toFixed(1)}L Cr - healthy growth in absolute terms. But its share of non-food credit is just ${((agri / totalCredit) * 100).toFixed(0)}%, the smallest of the four sectors.`,
        },
      ]}
    >
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[1.5px] text-[#78716c] mb-3 font-medium">
            Credit by Sector (FY2021-Jun 2025)
          </p>
          <MoneyFlowChart data={summaryData} />
        </div>
        <div className="border-t border-[#e7e1d8] pt-6">
          <p className="text-xs uppercase tracking-[1.5px] text-[#78716c] mb-3 font-medium">
            Personal Loan Breakdown
          </p>
          <PersonalLoansChart data={personalData} />
        </div>
      </div>
    </StoryLayout>
  );
}
