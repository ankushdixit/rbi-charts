import StoryLayout from "@/components/StoryLayout";
import ConsumerConfidenceChart from "@/components/charts/ConsumerConfidenceChart";
import ccData from "../../../../public/data/consumer_confidence.json";

export const metadata = {
  title: "The Perpetual Optimist - India in Charts",
  description:
    "Indians are pessimists about today but optimists about tomorrow. 73 surveys prove it.",
};

export default function ConsumerConfidencePage() {
  const econ = (ccData as any).economic_situation as any[];

  const currentVals = econ
    .map((e: any) => e.current_net_response)
    .filter((v: any) => v != null);
  const futureVals = econ
    .map((e: any) => e.future_net_response)
    .filter((v: any) => v != null);

  const currentPositive = currentVals.filter((v: number) => v > 0).length;
  const futurePositive = futureVals.filter((v: number) => v > 0).length;

  const avgGap =
    currentVals.reduce(
      (s: number, _: number, i: number) =>
        s + (futureVals[i] - currentVals[i]),
      0
    ) / currentVals.length;

  const covidWorst = econ.find((e: any) => e.date === "2020-09");
  const latest = econ[econ.length - 1];

  return (
    <StoryLayout
      slug="consumer-confidence"
      subtitle="The RBI has surveyed household consumer confidence 73 times since September 2012. The pattern is striking: people almost always feel the economy is doing poorly right now, but almost always believe it will improve in a year. The gap between current pessimism and future optimism has persisted for over a decade."
      stats={[
        {
          label: "Survey Rounds",
          value: `${econ.length}`,
          accent: true,
        },
        {
          label: "Current Negative",
          value: `${Math.round(((currentVals.length - currentPositive) / currentVals.length) * 100)}%`,
          accent: true,
        },
        {
          label: "Future Positive",
          value: `${Math.round((futurePositive / futureVals.length) * 100)}%`,
        },
        {
          label: "Avg. Gap",
          value: `${avgGap.toFixed(0)} pts`,
        },
      ]}
      meta={[
        {
          label: "Data source",
          value: "RBI Consumer Confidence Survey (UCCS)",
        },
        {
          label: "Period",
          value: `Sep 2012 to Jan 2026 (${econ.length} bi-monthly rounds)`,
        },
      ]}
      insights={[
        {
          title: `Negative about today ${Math.round(((currentVals.length - currentPositive) / currentVals.length) * 100)}% of the time`,
          body: `In ${currentVals.length - currentPositive} out of ${currentVals.length} survey rounds, the net current perception was negative - meaning more people felt the economy had worsened than improved. The current perception was only positive during brief periods, notably around 2014-2015.`,
        },
        {
          title: `But optimistic about tomorrow ${Math.round((futurePositive / futureVals.length) * 100)}% of the time`,
          body: `Future expectations were positive in ${futurePositive} out of ${futureVals.length} rounds. Only during COVID (mid-2020) did future expectations briefly turn negative. By September 2020, even as current sentiment hit -70.6, future expectations had already bounced back to +15.3.`,
        },
        {
          title: "COVID was the only time both lines went negative",
          body: `In May-September 2020, both current perception (${covidWorst?.current_net_response}) and future expectations (${econ.find((e: any) => e.date === "2020-05")?.future_net_response}) turned negative simultaneously. This had never happened before and hasn't happened since. The recovery in optimism was remarkably fast.`,
        },
        {
          title: "The gap averages 38 points and never closes",
          body: `The average gap between future expectations and current perception is ${avgGap.toFixed(0)} points. The gap ranged from 11.5 to 85.9 points but never went to zero. Indians are structurally optimistic about the future regardless of present conditions.`,
        },
      ]}
    >
      <ConsumerConfidenceChart data={econ} />
    </StoryLayout>
  );
}
