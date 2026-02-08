import React from 'react';
import { Shield, Clock, Target, TrendingUp } from 'lucide-react';

export default function AttackSummaryCard({ attackSummary }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl overflow-hidden border-2 border-red-500 p-8">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-500 rounded-xl shadow-lg">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Attack Complete</h3>
          <p className="text-gray-300 text-sm">Full breach analysis</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-red-400" />
            <span className="text-xs text-gray-300 uppercase">Attack Type</span>
          </div>
          <p className="text-lg font-bold">{attackSummary.attackType}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-gray-300 uppercase">Attack Duration</span>
          </div>
          <p className="text-lg font-bold">{attackSummary.estimatedAttackTimeSec}s</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-gray-300 uppercase">Total Stages</span>
          </div>
          <p className="text-lg font-bold">{attackSummary.totalStages} phases</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="text-xs text-gray-300 uppercase">Risk Level</span>
          </div>
          <p className="text-lg font-bold text-red-400">{attackSummary.riskLevel}</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-red-500/20 border-l-4 border-red-500 p-4 rounded-r-lg">
        <p className="text-sm leading-relaxed">{attackSummary.description}</p>
      </div>
    </div>
  );
}