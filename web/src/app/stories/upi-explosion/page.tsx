import StoryLayout from "@/components/StoryLayout";
import UPIExplosionChart from "@/components/charts/UPIExplosionChart";
import upiData from "../../../../public/data/psi_upi.json";

export const metadata = {
  title: "The UPI Explosion - India in Charts",
  description:
    "From zero to 20 billion monthly transactions. The fastest payment system adoption in history.",
};

export default function UPIExplosionPage() {
  const latestPoint = upiData[upiData.length - 1];
  const latestBillions = (latestPoint.volume_lakh / 10000).toFixed(1);
  const latestValueLakhCr = (latestPoint.value_crore! / 100000).toFixed(1);

  const [latestYear, latestMonth] = latestPoint.date.split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const latestMonthName = monthNames[parseInt(latestMonth) - 1];

  return (
    <StoryLayout
      slug="upi-explosion"
      subtitle="From near-zero to 20.4 billion monthly transactions in under a decade. The fastest adoption of any payment system in history."
      stats={[
        { label: "Transactions / month", value: `${latestBillions}B`, accent: true },
        { label: "Monthly value", value: `₹${latestValueLakhCr}L Cr`, accent: true },
        { label: "Data points", value: String(upiData.length) },
      ]}
      meta={[
        { label: "Data source", value: "RBI Payment System Indicators" },
        { label: "Updated", value: "Monthly" },
        { label: "Period", value: `${upiData[0].date} to ${latestPoint.date}` },
      ]}
      insights={[
        {
          title: "Bigger than Visa and Mastercard combined",
          body: `In ${latestMonthName} ${latestYear}, UPI handled ${latestBillions} billion transactions - more than Visa and Mastercard process globally in a month. India now accounts for 46% of all real-time payment transactions worldwide.`,
        },
        {
          title: "Growth is slowing - but still massive",
          body: "Year-on-year growth has decelerated from 97% (Feb 2022) to 66% (Feb 2023) to 61% (Feb 2024) to 33% (Feb 2025). This is natural at scale - but 33% growth on a $320B monthly system is still extraordinary.",
        },
        {
          title: "COVID barely dented it",
          body: "When India locked down in April 2020, cheques crashed 75%, credit cards fell 53%, and IMPS dropped 44%. UPI? Down just 20% - and recovered within a month. The lockdown actually accelerated UPI adoption as cash became impractical.",
        },
        {
          title: "Average transaction value is falling",
          body: "The average UPI transaction was ₹1,657 in Jan 2020. By Jan 2026, it's ₹1,306 - a 21% decline. This means UPI is penetrating deeper into small, everyday purchases: chai, auto rides, vegetable vendors.",
        },
      ]}
    >
      <UPIExplosionChart data={upiData} />
    </StoryLayout>
  );
}
