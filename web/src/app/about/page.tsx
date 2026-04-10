export const metadata = {
  title: "About - India in Charts",
  description: "About India in Charts, the data, and the methodology.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 md:px-8 py-12 md:py-20">
      <h1
        className="text-3xl md:text-4xl font-black mb-6 md:mb-8"
        style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-1.5px" }}
      >
        About
      </h1>

      <div className="space-y-6 text-[15px] text-[#44403c] leading-relaxed">
        <p>
          <strong className="text-[#1c1917]">India in Charts</strong> is an open-source
          data journalism project that visualizes India&apos;s economic story through
          interactive charts built from official Reserve Bank of India data.
        </p>

        <p>
          The RBI publishes an extraordinary wealth of statistical data - payment
          systems, bank credit, foreign exchange reserves, household savings, inflation
          surveys, corporate performance, and more. Most of it sits in Excel files and
          PDF tables that few people ever see. This project turns that data into visual
          stories that anyone can explore.
        </p>

        <h2
          className="text-2xl font-bold pt-6"
          style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-0.5px" }}
        >
          The Data
        </h2>

        <p>
          Every chart on this site is built from data published by the RBI on{" "}
          <a href="https://www.rbi.org.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1c1917]">
            rbi.org.in
          </a>
          . Data sources include:
        </p>

        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong>Payment System Indicators</strong> - monthly data from 57 PSI pages
            + 62 RBI Bulletin Table 43 pages, covering Dec 2015 to present
          </li>
          <li>
            <strong>Bank-wise ATM/Card Statistics</strong> - 180 monthly HTML pages with
            per-bank data, covering Apr 2011 to present
          </li>
          <li>
            <strong>Household Financial Savings</strong> - RBI Bulletin Table 50(a)/52(a),
            quarterly data for 6 fiscal years
          </li>
          <li>
            <strong>Foreign Exchange Reserves</strong> - Handbook Tables 147 & 214,
            58 years of annual + 2 years of weekly data
          </li>
          <li>
            <strong>Sectoral Credit Deployment</strong> - Handbook Tables 45 & 167,
            annual and monthly sectoral breakdowns
          </li>
          <li>
            <strong>Inflation Expectations Survey</strong> - 70 bi-monthly survey
            rounds since Sep 2008
          </li>
          <li>
            <strong>Balance of Payments</strong> - Handbook Table 194 + press releases,
            19 quarters of FDI vs portfolio flows
          </li>
        </ul>

        <h2
          className="text-2xl font-bold pt-6"
          style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-0.5px" }}
        >
          Methodology
        </h2>

        <p>
          Data is fetched directly from RBI&apos;s website using automated scrapers. HTML
          pages on <code className="text-sm bg-[#f5f0eb] px-1.5 py-0.5 rounded">www.rbi.org.in</code> are
          parsed with BeautifulSoup, while file downloads from{" "}
          <code className="text-sm bg-[#f5f0eb] px-1.5 py-0.5 rounded">rbidocs.rbi.org.in</code> use
          Playwright for browser automation. All parsed data is exported as JSON
          and rendered with Apache ECharts.
        </p>

        <p>
          The RBI has changed data formats multiple times over the years - unit changes
          (Million to Lakh), category restructurings (UPI added in 2020), column layout
          changes across 4 different ATM/Card formats, and more. Each parser handles
          these transitions explicitly, verified by reading actual file headers rather
          than assuming consistency.
        </p>

        <p>
          Every number in every insight is verified against the parsed data. Titles and
          narratives are derived from what the data shows, not pre-decided.
        </p>

        <h2
          className="text-2xl font-bold pt-6"
          style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-0.5px" }}
        >
          Built By
        </h2>

        <p>
          India in Charts is built by{" "}
          <a href="https://ankushdixit.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1c1917]">
            Ankush Dixit
          </a>
          {" "}- a product builder and self-taught developer. The entire project - data
          pipeline, parsers, frontend, and visualizations - was built with the
          assistance of Claude Code.
        </p>

        <h2
          className="text-2xl font-bold pt-6"
          style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-0.5px" }}
        >
          Open Source
        </h2>

        <p>
          The complete source code - data pipeline, parsers, frontend, and all raw
          data - is available on{" "}
          <a href="https://github.com/ankushdixit/rbi-charts" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1c1917]">
            GitHub
          </a>
          . Contributions, corrections, and suggestions are welcome.
        </p>

        <h2
          className="text-2xl font-bold pt-6"
          style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-0.5px" }}
        >
          Disclaimer
        </h2>

        <p className="text-sm text-[#78716c]">
          This project is not affiliated with, endorsed by, or connected to the
          Reserve Bank of India in any way. All data is sourced from publicly
          available releases on rbi.org.in. The visualizations and commentary
          represent the author&apos;s interpretation and do not constitute financial
          advice.
        </p>
      </div>
    </div>
  );
}
