import StoryLayout from "@/components/StoryLayout";
import InfraShiftChart from "@/components/charts/InfraShiftChart";
import infraData from "../../../../public/data/infra_shift.json";

export const metadata = {
  title: "3,600 QR Codes for Every ATM — India in Charts",
  description: "How India's payment infrastructure transformed from ATMs to QR codes.",
};

export default function InfraShiftPage() {
  const latest = infraData[infraData.length - 1];
  const first = infraData[0];
  const peakATM = infraData.reduce((a: any, b: any) => (a.atms > b.atms ? a : b));
  const qrToAtm = Math.round(latest.upi_qr / latest.atms);

  return (
    <StoryLayout
      slug="infra-shift"
      stats={[
        { label: `ATMs (peaked ${(peakATM.atms / 1000).toFixed(0)}K)`, value: `${(latest.atms / 1000).toFixed(0)}K`, accent: false },
        { label: "PoS Terminals", value: `${(latest.pos / 1000000).toFixed(1)}M`, accent: true },
        { label: "UPI QR Codes", value: `${(latest.upi_qr / 1000000).toFixed(0)}M`, accent: true },
      ]}
      meta={[
        { label: "Data source", value: "RBI Bank-wise ATM/Card Statistics + PSI Part III" },
        { label: "Period", value: `${first.date} to ${latest.date} (${infraData.length} months)` },
      ]}
      insights={[
        { title: `ATMs peaked in ${peakATM.date} and are declining`, body: `After growing from ${(first.atms / 1000).toFixed(0)}K to ${(peakATM.atms / 1000).toFixed(0)}K, ATMs have been shrinking — down to ${(latest.atms / 1000).toFixed(0)}K. Banks are closing unprofitable ATMs as UPI makes cash withdrawal less necessary.` },
        { title: `UPI QR: 98M to ${(latest.upi_qr / 1000000).toFixed(0)}M — with a counting shake-up`, body: `UPI QR codes grew from 98M (May 2021) to ~330M by Jul 2024, then jumped to 591M in Aug 2024 — an overnight 80% increase that reflects a change in how QR codes are counted. At ${(latest.upi_qr / 1000000).toFixed(0)}M, a QR code exists for every Indian adult.` },
        { title: "PoS terminals grew 20x but are now plateauing", body: `PoS terminals grew from ${(first.pos / 1000).toFixed(0)}K to ${(latest.pos / 1000000).toFixed(1)}M — a 20x increase. But growth has slowed as merchants find QR codes cheaper and easier to deploy.` },
        { title: "Bharat QR stalled — UPI QR ate its lunch", body: `Bharat QR peaked around 6M and is now declining to ${(latest.bharat_qr / 1000000).toFixed(1)}M. UPI QR, which is simpler and doesn't need a merchant bank account relationship, made Bharat QR irrelevant.` },
      ]}
    >
      <InfraShiftChart data={infraData} />
    </StoryLayout>
  );
}
