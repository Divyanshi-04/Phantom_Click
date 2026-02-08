import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { buildReplay, nodeApi } from "../lib/apiClient";

// Import new components
import TimelineBar from "../components/Stage4_ScamReplay/TimelineBar";
import StageCard from "../components/Stage4_ScamReplay/StageCard";
import AutoAdvanceTimer from "../components/Stage4_ScamReplay/AutoAdvanceTimer";
import AttackSummaryCard from "../components/Stage4_ScamReplay/AttackSummaryCard";
import { Shield, Lock, Eye, Activity, AlertTriangle, FileCheck, Play } from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ScamReplay() {
  const { state } = useLocation();
const report = state?.stage3;
const stage1 = state?.stage1;
const stage2 = state?.stage2;
const showForensicBtn =
  ["CRITICAL", "HIGH"].includes(report?.verdict?.riskLevel)


  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replay state
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);

  // Fetch replay data
  useEffect(() => {
    if (!report) return;

    const run = async () => {
      try {
        setLoading(true);
        const result = await buildReplay(report);
        // Add base URL to screenshots
        if (result.stages) {
          result.stages = result.stages.map((stage) => ({
            ...stage,
            screenshot: stage.screenshot ? `${nodeApi.defaults.baseURL}${stage.screenshot}` : null,
          }));
        }
        setData(result);
        console.log("STAGES DEBUG:", result.stages.map(s => s.id));

      } catch (err) {
        console.error(err);
        setError("Replay failed");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [report]);

  // Auto-advance timer - UPDATED with 60 second timer and proper stopping
  useEffect(() => {
  if (!isPlaying || !data) return;

  const timer = setTimeout(() => {
    setCurrentStage(prev => {
      if (prev < data.stages.length - 1) {
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });

    setTimeLeft(15);
  }, timeLeft * 1000); // 15 seconds per stage

  return () => clearTimeout(timer);

}, [currentStage, isPlaying, data]);

// Use effect for timer display
useEffect(() => {
  if (!isPlaying) return;

  const countdown = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) return 15;
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(countdown);
}, [isPlaying, currentStage]);



  const handleStageClick = (idx) => {
    if (idx <= currentStage) {
      setCurrentStage(idx);
      setTimeLeft(15);
    }
  };

  const handleTogglePlay = () => {
  setIsPlaying(p => !p);
  // setTimeLeft(15);
};


  const handleSkip = () => {
  if (data && currentStage < data.stages.length - 1) {
    setIsPlaying(false);        // 🔴 force stop timer
    setCurrentStage(c => c + 1);
    setTimeLeft(15);

    setTimeout(() => {
      setIsPlaying(true);     // 🟢 restart clean
    }, 50);
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/sandbox"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#006b7d] transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Analysis
          </Link>


          {showForensicBtn && (
          <Link
            to="/forensic-report"
            state={{
              stage1,
              stage2,
              stage3: report
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-black text-white text-sm font-medium hover:opacity-90 transition"
          ><FileCheck className="w-4 h-4" />
            Generate Forensic Report
          </Link>
        )}

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center gap-6 py-20">
            <div className="w-16 h-16 border-4 border-[#006b7d]/20 border-t-[#006b7d] rounded-full animate-spin" />
            <p className="text-[#006b7d] font-medium text-lg">Analyzing attack sequence...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-300">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* No Data State */}
        {!report && !loading && (
          <div className="text-center py-20">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No replay data available.</p>
            <Link to="/sandbox" className="text-[#006b7d] hover:underline mt-2 inline-block">
              Return to Sandbox
            </Link>
          </div>
        )}

        {/* Replay Content */}
        {data && (
          <div className="space-y-8">
            
            {/* Title Section */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 shadow-sm">
                  <Play className="w-6 h-6 text-red-600" />
                </div>
                <h1 className="text-4xl font-semibold text-[#0f2f35] px-2 ml-5 mr-5 relative">
        Scam Replay
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#4db5c4] to-transparent rounded-full" />
      </h1>
                
                <div className="p-3 rounded-lg bg-[#e8f6f9] border border-[#4db5c4] shadow-sm">
                  <Shield className="w-6 h-6 text-[#006b7d]" />
                </div>
              </div>
              <p className="text-lg text-gray-600">
                Watch how victims fall into this trap, step by step
              </p>
            </div>

            {/* Timeline */}
            <TimelineBar 
              stages={data.stages}
              currentStage={currentStage}
              onStageClick={handleStageClick}
            />

            {/* If final stage, show only AttackSummaryCard (no StageCard) */}
            {currentStage === data.stages.length - 1 && data.attackSummary ? (
              <div className="mt-8">
                <AttackSummaryCard attackSummary={data.attackSummary} />
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={() => {
                      setCurrentStage(0);
                      setTimeLeft(15);
                      setIsPlaying(true);
                    }}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
                  >
                    ↺ Replay from Start
                  </button>
                  <Link
                    to="/sandbox"
                    className="px-6 py-3 bg-[#006b7d] hover:opacity-90 text-white rounded-xl font-medium transition"
                  >
                    Back to Analysis
                  </Link>
                </div>
              </div>
            ) : (
              // Non-final stages: render the normal StageCard + timer
              data.stages[currentStage] && (
                <>
                  <StageCard stage={data.stages[currentStage]} />

                  {/* Auto-Advance Timer */}
                  <AutoAdvanceTimer 
                    timeLeft={timeLeft}
                    isPlaying={isPlaying}
                    onTogglePlay={handleTogglePlay}
                    onSkip={handleSkip}
                    totalStages={data.stages.length}
                    currentStage={currentStage}
                  />
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}