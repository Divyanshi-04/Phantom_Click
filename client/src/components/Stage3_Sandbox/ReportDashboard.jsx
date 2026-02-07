"use client"

import RiskOverview from "./RiskOverview"
import EvidenceSummary from "./EvidenceSummary"
import PageGallery from "./PageGallery"

export default function ReportDashboard({
  report,
  stage1Data,
  stage2Data
}) {

  if (!report) return null


  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8">


     {/* 30 / 70 layout */}
<div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-stretch">

  {/* Risk */}
  <div className="lg:col-span-3 flex">
    <RiskOverview verdict={report.verdict} />
  </div>

  {/* Evidence */}
  <div className="lg:col-span-7 flex">
    <EvidenceSummary
      summary={report.summary}
      evidence={report.evidence}
    />
  </div>

</div>


      <PageGallery pages={report.pages} />

    </div>
  )
}
