"use client"

import { useState, useEffect } from "react"
import { analyzeSite } from "../lib/apiClient"
import { useStage1 } from "../lib/useStage1"
import ReportDashboard from "../components/Stage3_Sandbox/ReportDashboard"
import { Link } from "react-router-dom"
import { Shield, Lock, Eye, Activity, AlertTriangle, FileCheck, Zap, Target, Database, Search } from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Sandbox() {
  const { firstUrl, stage1Data, stage2Data, setStage3Data } = useStage1()
  const [report, setReport] = useState(null)
  const showForensicBtn =
  ["CRITICAL", "HIGH"].includes(report?.verdict?.riskLevel)

  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!firstUrl) return

    try {
      setLoading(true)
      setReport(null)
      const res = await analyzeSite(firstUrl)
      setReport(res.data)
      setStage3Data(res.data)
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#0f2f35] pt-2">
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>
      </div>
<div className="sticky top-0 z-40 bg-white  border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

    {/* Left — Back */}
    <Link
      to="/result"
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#006b7d] transition"
    >
       <ChevronLeft className="w-4 h-4" /> Back to URL Results
    </Link>

    {/* Right — Actions */}
    <div className="flex items-center gap-3">

       <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
      >
        <Search className="w-4 h-4" />
        Learn how it works
      </button>

      {report && (
  <Link
    to="/replay"
    state={{
      stage1: stage1Data,
      stage2: stage2Data,
      stage3: report
    }}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-[#006b7d] text-white text-sm font-medium shadow hover:opacity-95 transition"
  >
    <Eye className="w-4 h-4" />
    View Scam Replay
  </Link>
)}

    {showForensicBtn && (
      <Link
        to="/forensic-report"
        state={{
          stage1: stage1Data,
          stage2: stage2Data,
          stage3: report
        }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-black text-white text-sm font-medium hover:opacity-90 transition"
      >
        <FileCheck className="w-4 h-4" />
        Generate Forensic Report
      </Link>
    )}
     

    </div>
  </div>
</div>

      <div className="max-w-7xl mx-auto pt-16 pb-8">


     <div className="text-center mb-16">

    <div className="relative">
    {/* Heading row */}
    <div className="flex items-center justify-center gap-3 mb-4">

      {/* Left icons */}
      <div className="p-3 rounded-lg bg-red-50 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
        <Shield className="w-5 h-5 text-red-600" />
      </div>

      <div className="p-2 rounded-lg bg-green-50 border border-green-200 shadow-sm hover:shadow-md transition-shadow ml-2">
        <Lock className="w-4 h-4 text-green-600" />
      </div>

      {/* Title with subtle glow */}
      <h1 className="text-4xl font-semibold text-[#0f2f35] px-2 ml-5 mr-5 relative">
        Secure Snapshot
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#4db5c4] to-transparent rounded-full" />
      </h1>

      {/* Right icons */}
      <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 shadow-sm hover:shadow-md transition-shadow mr-2">
        <Eye className="w-4 h-4 text-blue-600" />
      </div>

      <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
        <Target className="w-5 h-5 text-yellow-600" />
      </div>

    </div>

    <p className="text-lg text-[#1a8a9a] mt-5 max-w-xl mx-auto flex items-center justify-center gap-2">
      <Database className="w-4 h-4" />
      Isolated sandbox environment
      <span className="text-[#4db5c4]">•</span>
      Zero user exposure
      <Zap className="w-4 h-4" />
    </p>
  </div>
</div>

      {/* URL Display Box */}
      {!report && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-[#006b7d]/20 mb-8">

          <div className="flex items-center justify-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-[#006b7d]" />
            <span className="text-base font-semibold text-[#0f2f35]">
              Target Website
            </span>
          </div>

          <div className="bg-[#e8f6f9] p-4 rounded-lg border border-[#4db5c4]/30 mb-5">
            <p className="font-mono text-[#006b7d] text-sm break-all text-center">
              {firstUrl || "No URL loaded yet"}
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!firstUrl || loading}
            className="w-full bg-[#006b7d] text-white py-4 rounded-lg font-semibold text-lg shadow hover:opacity-95 disabled:bg-gray-300 transition"
          >
            {loading ? "Analyzing Threat Surface..." : "Start Security Analysis"}
          </button>

        </div>
      )}


            {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">

          <div className="flex flex-col items-center gap-6">

            {/* Spinner */}
            <div className="w-14 h-14 border-4 border-[#006b7d]/20 border-t-[#006b7d] rounded-full animate-spin" />

            {/* Text */}
            <p className="text-[#006b7d] font-medium text-lg">
              Running AI threat analysis…
            </p>

          </div>
        </div>
      )}

        {/* Report */}
        {report && (
          <div className="mt-8">
            <ReportDashboard report={report} stage1Data={stage1Data} stage2Data={stage2Data} />
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-10 text-center text-base text-[#006b7d] font-medium">
          <p>🔒 All analysis conducted in isolated environment with zero risk exposure</p>
        </div>

      </div>
    </div>
  )
}