import React from 'react';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

export default function TimelineBar({ stages, currentStage, onStageClick }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between relative">
        
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div 
            className="h-full bg-gradient-to-r from-[#006b7d] to-[#4db5c4] transition-all duration-500"
            style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
          />
        </div>

        {stages.map((stage, idx) => {
          const isCompleted = idx < currentStage;
          const isCurrent = idx === currentStage;
          const isUpcoming = idx > currentStage;

          return (
            <button
              key={stage.id}
              onClick={() => onStageClick(idx)}
              className="relative flex flex-col items-center gap-2 group"
              disabled={isUpcoming}
            >
              {/* Circle/Icon */}
              <div 
                className={`
                  relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isCompleted ? 'bg-green-500 text-white shadow-lg' : ''}
                  ${isCurrent ? 'bg-[#006b7d] text-white shadow-xl scale-110 ring-4 ring-[#4db5c4]/30' : ''}
                  ${isUpcoming ? 'bg-gray-200 text-gray-400' : ''}
                  ${!isUpcoming ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                {isCompleted && <CheckCircle2 className="w-6 h-6" />}
                {isCurrent && <div className="w-3 h-3 bg-white rounded-full animate-pulse" />}
                {isUpcoming && <Lock className="w-5 h-5" />}
              </div>

              {/* Label */}
              <div className="text-center max-w-[120px]">
                <p className={`
                  text-xs font-bold
                  ${isCurrent ? 'text-[#006b7d]' : ''}
                  ${isCompleted ? 'text-green-600' : ''}
                  ${isUpcoming ? 'text-gray-400' : ''}
                `}>
                  Stage {stage.id}
                </p>
                <p className={`
                  text-[10px] mt-0.5
                  ${isCurrent ? 'text-gray-700 font-medium' : 'text-gray-500'}
                `}>
                  {stage.label}
                </p>
              </div>

              {/* Current indicator glow */}
              {isCurrent && (
                <div className="absolute -bottom-2 w-16 h-1 bg-[#006b7d] rounded-full shadow-lg" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}