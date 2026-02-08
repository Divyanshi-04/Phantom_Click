import React from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';

export default function AutoAdvanceTimer({ 
  timeLeft, 
  isPlaying, 
  onTogglePlay, 
  onSkip,
  totalStages,
  currentStage 
}) {
  const isLastStage = currentStage >= totalStages - 1;

  if (isLastStage) return null;

  return (
    <div className="flex items-center justify-center gap-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      
      {/* Timer Display */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12">
          {/* Circular progress */}
          <svg className="transform -rotate-90 w-12 h-12">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#e5e7eb"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#006b7d"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - timeLeft / 60)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-[#006b7d]">{timeLeft}s</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Next Stage In</p>
          <p className="text-sm font-semibold text-gray-900">{timeLeft} seconds</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlay}
          className="p-2 rounded-lg bg-[#006b7d] text-white hover:bg-[#1a8a9a] transition shadow-md"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={onSkip}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-medium text-sm flex items-center gap-2"
        >
          Skip <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}