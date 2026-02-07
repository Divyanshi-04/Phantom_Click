import PhoneMockup from "./PhoneMockup"
import { Link } from "react-router-dom"

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-[500px] overflow-hidden">

      <div className="max-w-[1200px] mx-auto text-center relative z-[2] px-4">
     <h1 className="text-6xl md:text-[4rem] font-semibold leading-tight mb-6 animate-[fadeInUp_1s_ease-out] flex items-center justify-center gap-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
  AI-Powered Scam Forensics
</h1>
<p className="text-4xl md:text-[1.5rem] text-[#006b7d] font-semibold mb-4 animate-[fadeInUp_1s_ease-out_0.2s_both]">
  GenAI-Driven Detection & Safe Inspection
</p>
        {/* CTA Button */}
          <div className="mt-15 flex gap-4 justify-center items-center animate-[fadeInUp_1s_ease-out_0.4s_both]">
            <Link
              to="/extract"
              className="inline-block px-8 py-4 rounded-full bg-[#006b7d] text-white font-semibold text-lg shadow-lg hover:bg-[#004554] hover:-translate-y-1 transition-all"
            >
              <i className="fa-solid fa-shield-halved mr-2"></i>
              Analyze Suspicious SMS
            </Link>
            
            <Link
            to="/work"
              className="inline-block px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 text-[#006b7d] font-semibold text-lg shadow-lg hover:bg-white/20 hover:-translate-y-1 transition-all"
            >
              <i className="fa-solid fa-play-circle mr-2"></i>
              Learn How It Works
            </Link>
            
          </div>
      </div>

      {/* Centered Phone Mockup */}
      <PhoneMockup />

      {/* Enhanced Floating Info Cards - Closer to Phone */}
      <div className="floating-card absolute top-[58%] left-[10%] bg-gradient-to-br from-white to-[#e3f2fd] border border-white/40 p-5 rounded-2xl shadow-[0_20px_60px_rgba(0,69,84,0.2)] z-10 animate-[float_3s_ease-in-out_infinite] hidden lg:block backdrop-blur-sm max-w-[220px]">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1e6fa1] to-[#3a8fc4] rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <i className="fa-solid fa-brain text-xl"></i>
          </div>
          <div>
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">AI Detection</div>
            <div className="text-lg font-bold text-[#004554]">Scam-Brain</div>
          </div>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          Instantly identifies phishing patterns and urgency tactics
        </p>
      </div>

      <div className="floating-card absolute top-[58%] right-[10%] bg-gradient-to-br from-white to-[#fff3e0] border border-white/40 p-5 rounded-2xl shadow-[0_20px_60px_rgba(0,69,84,0.2)] z-10 animate-[float_3s_ease-in-out_infinite] [animation-delay:0.5s] hidden lg:block backdrop-blur-sm max-w-[220px]">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff8c42] to-[#ffb347] rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <i className="fa-solid fa-gauge-high text-xl"></i>
          </div>
          <div>
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Risk Analysis</div>
            <div className="text-lg font-bold text-[#004554]">0-100 Score</div>
          </div>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          Real-time threat scoring for every suspicious link
        </p>
      </div>

      <div className="floating-card absolute top-[75%] left-[18%] bg-gradient-to-br from-white to-[#e8f5e9] border border-white/40 p-5 rounded-2xl shadow-[0_20px_60px_rgba(0,69,84,0.2)] z-10 animate-[float_3s_ease-in-out_infinite] [animation-delay:1s] hidden lg:block backdrop-blur-sm max-w-[225px]">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#16a34a] to-[#4ade80] rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <i className="fa-solid fa-eye text-xl"></i>
          </div>
          <div>
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Safe Preview</div>
            <div className="text-lg font-bold text-[#004554]">Sandbox View</div>
          </div>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          See how scams work without any risk to you
        </p>
      </div>

      <div className="floating-card absolute top-[75%] right-[18%] bg-gradient-to-br from-white to-[#ffebee] border border-white/40 p-5 rounded-2xl shadow-[0_20px_60px_rgba(0,69,84,0.2)] z-10 animate-[float_3s_ease-in-out_infinite] [animation-delay:1.5s] hidden lg:block backdrop-blur-sm max-w-[220px]">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#d62828] to-[#ff6b57] rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <i className="fa-solid fa-file-pdf text-xl"></i>
          </div>
          <div>
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">Evidence Ready</div>
            <div className="text-lg font-bold text-[#004554]">PDF Report</div>
          </div>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          Forensic documentation for cybercrime reporting
        </p>
      </div>
    </section>
  );
};

export default HeroSection;