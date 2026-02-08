"use client"

import { useState, useEffect } from "react"
import { analyzeUrlStage2 } from "../lib/apiClient"
import { useStage1 } from "../lib/useStage1"
import { Link, useLocation } from "react-router-dom"

// Import components
import CircularScoreCard from "../components/Stage2_URLResult/CircularScoreCard"
import InfoCard from "../components/Stage2_URLResult/InfoCard"
import LoadingState from "../components/Stage2_URLResult/LoadingState"
import { ChevronLeft, Search, Lock } from "lucide-react"

export default function URLResult() {
  const { firstUrl, setStage1Data, setStage2Data } = useStage1()
  const location = useLocation()
  const stage1DataFromState = location.state

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (stage1DataFromState) {
      setStage1Data(stage1DataFromState)
    }
  }, [stage1DataFromState, setStage1Data])

  const handleAnalyze = async () => {
    if (!firstUrl) return

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const data = await analyzeUrlStage2(firstUrl)
      setResult(data)
      setStage2Data(data)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.detail || "Stage 2 failed")
    } finally {
      setLoading(false)
    }
  }

  // Auto-run analysis
  useEffect(() => {
    if (firstUrl) {
      handleAnalyze()
    }
  }, [firstUrl])

  // Calculate trust stability score
  const getTrustStabilityScore = () => {
    if (!result) return 0
    const domainAge = result.domain_age_days || 1
    const entropy = result.entropy_score || 1
    const rawScore = Math.log(domainAge + 1) / entropy
    return Math.min(100, Math.round(rawScore * 20))
  }

  const trustStabilityScore = getTrustStabilityScore()

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Left — Back */}
        <Link
          to="/extract"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#006b7d] transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
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

         {result && (
        <Link
          to="/sandbox"
          state={result}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-[#006b7d] text-white text-sm font-medium shadow hover:opacity-95 transition"
        >
          <Lock className="w-4 h-4" />
          Continue to Sandbox
        </Link>
      )}

        </div>
      </div>
    </div>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Page Header with decorative elements */}
        {/* Page Header */}
        <div className="w-full flex flex-col items-center justify-center py-10">

          <div className="flex items-center gap-6">

            {/* Left icon */}
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center border border-red-100">
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-semibold text-gray-900 relative" >
              URL Risk Score
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#4db5c4] to-transparent rounded-full" />
            </h1>

            {/* Right icon */}
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center border border-green-100">
              <svg
                className="w-4 h-4 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

          </div>

         
          {/* Subtitle */}
          <p className="text-sm text-gray-500 text-center mt-10">
            Automated security evaluation · Zero user exposure
          </p>

        </div>


        {/* URL Display Card with enhanced design */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/60 p-6">
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 animate-pulse"></div>

          <div className="relative flex items-center gap-5">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-500  flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:shadow-xl transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-500 mb-2 ">
                Analyzing Target URL
              </div>
              <div className="text-md font-semibold text-gray-900 truncate">
                {firstUrl || "No URL provided"}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-green-700">Live Scan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error State with beautiful design */}
        {error && (
          <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-pink-50 to-red-50 rounded-3xl border border-red-200 shadow-xl p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-full blur-3xl"></div>
            <div className="relative flex items-start gap-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-2">Analysis Failed</h3>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <>
            {/* Domain Information Cards */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-gray-900">Domain Intelligence</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard
                  label="Domain"
                  value={result.final_domain || "Unknown"}
                  description="Resolved destination after all redirects"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  }
                />
                <InfoCard
                  label="Domain Age"
                  value={`${result.domain_age_days || 0} days`}
                  description="Time elapsed since domain registration"
                  riskLevel={result.domain_age_days < 30 ? "High" : result.domain_age_days < 180 ? "Medium" : "Low"}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <InfoCard
                  label="Risk Level"
                  value={result.risk_level || "Unknown"}
                  description="AI-powered threat severity classification"
                  riskLevel={result.risk_level}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Security Metrics Cards */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-gray-900">Security Analysis</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CircularScoreCard
                  title="Threat Score"
                  subtitle="Composite risk indicator from all detected security signals"
                  score={result.overall_threat_score || 0}
                  type="threat"
                />
                <CircularScoreCard
                  title="Entropy Score"
                  subtitle="URL randomness level indicating obfuscation attempts"
                  score={Math.min(100, Math.round((result.entropy_score || 0) * 20))}
                  type="entropy"
                />
                <CircularScoreCard
                  title="Trust Stability"
                  subtitle="Domain maturity correlation for reliability measure"
                  score={trustStabilityScore}
                  type="stability"
                />
              </div>
            </div>

            {/* Action Buttons with premium styling */}
          
          </>
        )}

      </div>
    </div>
  )
}