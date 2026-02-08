import React from 'react';
import { Eye, AlertTriangle, Database, Activity } from 'lucide-react';

export default function StageCard({ stage }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      
      {/* Decorative gradient orbs (matching your friend's style) */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-[#006b7d] to-[#1a8a9a] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{stage.label}</h2>
            <p className="text-sm text-white/80 mt-1">{stage.subtitle}</p>
          </div>
          <div className="bg-red-500 px-4 py-2 rounded-lg shadow-lg">
            <div className="text-xs font-medium">Risk Score</div>
            <div className="text-2xl font-bold">{stage.riskScore}/10</div>
          </div>
        </div>
      </div>

      {/* Split Screen Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        
        {/* LEFT: What Victim Sees */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500 rounded-lg shadow-md">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-900 text-lg">What You See</h3>
              <p className="text-xs text-green-700">The victim's perspective</p>
            </div>
          </div>

          {/* Screenshot */}
          {stage.screenshot ? (
  <div className="mb-4 group">
    <img 
      src={stage.screenshot}
      alt="Phishing page as victim sees it"
      className="w-full rounded-lg shadow-xl border-2 border-green-200 hover:border-green-400 transition-all cursor-pointer"
    />
    {/* <p className="text-xs text-green-600 mt-2 text-center font-medium">
      ↑ Click to enlarge
    </p> */}
  </div>
) : (
  <div className="mb-4 bg-gray-200 rounded-lg p-8 flex items-center justify-center border-2 border-dashed border-gray-400">
    <div className="text-center">
      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600 font-medium">No visual evidence</p>
      <p className="text-xs text-gray-500 mt-1">This stage happens in the background</p>
    </div>
  </div>
)}

          {/* What User Sees Text */}
          <div className="bg-white/80 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-green-600 text-lg">💭</span>
              <span className="text-xs font-bold text-green-800 uppercase">What they're thinking:</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              {stage.whatUserSees}
            </p>
          </div>
        </div>

        {/* RIGHT: What Attacker Does */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500 rounded-lg shadow-md">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 text-lg">What's Really Happening</h3>
              <p className="text-xs text-red-700">The dark reality</p>
            </div>
          </div>

          {/* Attacker Actions */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-800 uppercase">Malicious Actions:</span>
            </div>
            {stage.attackerActions?.map((action, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/80 p-3 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-sm mt-0.5">⚠️</span>
                <p className="text-sm text-gray-800 leading-relaxed flex-1">{action}</p>
              </div>
            ))}
          </div>

          {/* Stolen Data */}
          {stage.stolenData && stage.stolenData.length > 0 && (
            <div className="bg-white/80 border-2 border-red-400 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-red-800 uppercase">Data Being Stolen:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {stage.stolenData.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-red-100 border border-red-300 rounded-lg text-xs font-medium text-red-900 shadow-sm"
                  >
                    🔓 {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* What Attacker Does Explanation */}
          {stage.whatAttackerDoes && (
            <div className="bg-gray-900 text-white p-4 rounded-lg mt-4 border-2 border-red-500">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-red-400 text-lg">💀</span>
                <span className="text-xs font-bold text-red-400 uppercase">Technical Reality:</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-200">
                {stage.whatAttackerDoes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Educational Caption (Bottom) */}
      {stage.caption && (
        <div className="relative z-10 bg-gradient-to-r from-teal-50 to-blue-50 border-t-2 border-[#4db5c4] p-5">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <div className="p-2 bg-[#006b7d] rounded-lg shadow-md flex-shrink-0">
              <span className="text-white text-lg">💡</span>
            </div>
            <div>
              <h4 className="font-bold text-[#006b7d] text-sm mb-1">Pro Security Tip:</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {stage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}