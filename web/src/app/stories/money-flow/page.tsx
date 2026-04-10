import StoryLayout from "@/components/StoryLayout";
import MoneyFlowChart from "@/components/charts/MoneyFlowChart";
import creditData from "../../../../public/data/sectoral_credit_summary.json";

export const metadata = {
  title: "Where Does India's Money Flow? - India in Charts",
  description: "Follow the rupee from agriculture to personal loans.",
};

export default function MoneyFlowPage() {
  const allDates = Array.from(new Set(creditData.map((d: any) => d.date))).sort();
  const latestDate = allDates[allDates.length - 1];
  const latest = creditData.filter((d: any) => d.date === latestDate);
  const getSector = (key: string) => latest.find((d: any) => d.sector === key)?.outstanding_crore ?? 0;
  const agri = getSector("agriculture");
  const industry = getSector("industry_total");
  const services = getSector("services");
  const personal = getSector("personal_loans");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fullData = require("../../../../public/data/sectoral_credit.json");
  const latestFull = fullData.filter((d: any) => d.date === latestDate);
  const getFullSector = (key: string) => latestFull.find((d: any) => d.sector === key)?.outstanding_crore ?? 0;
  const totalCredit = getFullSector("non_food_credit") || (agri + industry + services + personal);

  return (
    <StoryLayout
      slug="money-flow"
      subtitle="India's banks deploy over ₹184 lakh crore in credit. Where it goes reveals the economy's structural transformation - from farms and factories to homes and phones."
      stats={[
        { label: "Personal Loans", value: `${((personal / totalCredit) * 100).toFixed(0)}%`, accent: true },
        { label: "Services", value: `${((services / totalCredit) * 100).toFixed(0)}%`, accent: true },
        { label: "Industry", value: `${((industry / totalCredit) * 100).toFixed(0)}%` },
        { label: "Agriculture", value: `${((agri / totalCredit) * 100).toFixed(0)}%` },
      ]}
      meta={[
        { label: "Data source", value: "RBI Sectoral Deployment of Bank Credit" },
        { label: "Period", value: `FY 2020-21 to Jun 2025 (${allDates.length} data points)` },
      ]}
      insights={[
        { title: "Personal loans are 1.5x industry credit", body: `At ₹${(personal / 100000).toFixed(1)} lakh crore, personal loans are 1.5x total industrial credit (₹${(industry / 100000).toFixed(1)}L Cr). The gap has widened every single year since FY 2020-21.` },
        { title: "Services is the fastest growing sector", body: `Services credit grew 12.4% YoY (Mar 2024 to Mar 2025) - the fastest among all sectors - reaching ₹${(services / 100000).toFixed(1)} lakh crore. NBFCs, commercial real estate, and trade are driving this.` },
        { title: "The aspiration economy is credit-fueled", body: `Vehicle loans hit ₹${(getFullSector("personal_vehicle") / 100000).toFixed(1)}L Cr and credit card outstanding reached ₹${(getFullSector("personal_credit_card") / 100000).toFixed(1)}L Cr. These are the fastest growing segments.` },
        { title: "Agriculture: growing but losing share", body: `Agriculture credit grew 10.4% YoY to ₹${(agri / 100000).toFixed(1)}L Cr - healthy growth in absolute terms. But its share of non-food credit is just ${((agri / totalCredit) * 100).toFixed(0)}%, the smallest of the four sectors.` },
      ]}
    >
      <MoneyFlowChart data={creditData} />
    </StoryLayout>
  );
}
