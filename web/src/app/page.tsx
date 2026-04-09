import SampleChart from "@/components/charts/SampleChart";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          India in Charts
        </h1>
        <p className="text-lg text-zinc-600 max-w-2xl">
          Beautiful, interactive visualizations of Reserve Bank of India data.
          Payments, credit, savings, and the Indian economy — updated
          automatically from official RBI releases.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Sample Chart</h2>
        <div className="rounded-lg border border-zinc-200 p-6">
          <SampleChart />
        </div>
      </section>
    </div>
  );
}
