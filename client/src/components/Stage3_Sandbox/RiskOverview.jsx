import React from 'react';
import { Shield, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function RiskOverview({ verdict }) {
  const { score, riskLevel, type, confidence } = verdict;

  // Risk level configurations
  const riskConfig = {
    CRITICAL: {
      color: '#ef4444',
      bgGradient: 'from-red-50 to-red-100',
      icon: ShieldAlert,
      label: 'Critical'
    },
    MEDIUM: {
      color: '#eab308',
      bgGradient: 'from-yellow-50 to-yellow-100',
      icon: Shield,
      label: 'Medium'
    },
    LOW: {
      color: '#22c55e',
      bgGradient: 'from-green-50 to-green-100',
      icon: ShieldCheck,
      label: 'Low'
    }
  };

  const config = riskConfig[riskLevel] || riskConfig.MEDIUM;
  const IconComponent = config.icon;

  // Calculate radial meter segments
  const totalSegments = 60;
  const filledSegments = Math.round((score / 100) * totalSegments);
  const radius = 90;
  const centerX = 120;
  const centerY = 120;
  const segmentGap = 2; // degrees

  // Generate meter segments
  const segments = Array.from({ length: totalSegments }, (_, i) => {
    const angle = (i * 360) / totalSegments - 90; // Start from top
    const isFilled = i < filledSegments;
    
    // Calculate color based on position for gradient effect
    const colorIntensity = i / totalSegments;
    let segmentColor;
    
    if (colorIntensity < 0.33) {
      segmentColor = isFilled ? '#22c55e' : '#e5e7eb';
    } else if (colorIntensity < 0.66) {
      segmentColor = isFilled ? '#eab308' : '#e5e7eb';
    } else {
      segmentColor = isFilled ? '#ef4444' : '#e5e7eb';
    }

    const startAngle = (angle * Math.PI) / 180;
    const endAngle = ((angle + 360 / totalSegments - segmentGap) * Math.PI) / 180;
    
    const x1 = centerX + (radius - 15) * Math.cos(startAngle);
    const y1 = centerY + (radius - 15) * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(startAngle);
    const y2 = centerY + radius * Math.sin(startAngle);
    
    const x3 = centerX + radius * Math.cos(endAngle);
    const y3 = centerY + radius * Math.sin(endAngle);
    const x4 = centerX + (radius - 15) * Math.cos(endAngle);
    const y4 = centerY + (radius - 15) * Math.sin(endAngle);

    return (
      <path
        key={i}
        d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`}
        fill={segmentColor}
        opacity={isFilled ? 1 : 0.3}
      />
    );
  });

  // Format type text
  const formatType = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between">
      <div className={`bg-gradient-to-br ${config.bgGradient} rounded-3xl p-8 shadow-xl border border-gray-200 h-full flex flex-col`}>

        {/* Header with Type and Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="p-3 rounded-xl shadow-md"
            style={{ backgroundColor: config.color }}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {formatType(type)}
            </h3>
            <p className="text-sm text-gray-600">Threat Analysis</p>
          </div>
        </div>

        {/* Radial Meter */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg width="240" height="240" viewBox="0 0 240 240">
              {/* Background circles */}
              <circle
                cx="120"
                cy="120"
                r="75"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                cx="120"
                cy="120"
                r="55"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              
              {/* Meter segments */}
              {segments}
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-gray-900">
                {score.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Current Risk Score
              </div>
            </div>
          </div>
        </div>

        {/* Risk Level Pills */}
    <div className="flex justify-center gap-2 mb-4">
    {Object.entries(riskConfig).map(([key, cfg]) => {
        const isActive = key === riskLevel;

        return (
        <span
            key={key}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            isActive
                ? "text-white shadow-lg"
                : "bg-white/60 text-gray-600"
            }`}
            style={isActive ? { backgroundColor: cfg.color } : {}}
        >
            {cfg.label}
        </span>
        );
    })}
    </div>


        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Updated automatically from live risk metrics
          </p>
          {confidence && (
            <p className="text-xs text-gray-500 mt-1">
              Confidence: {(confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Example usage component
export function RiskOverviewDemo() {
  const verdict = {
    score: 23220,
    riskLevel: "CRITICAL",
    type: "credential_harvesting",
    confidence: 0.99
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <RiskOverview verdict={verdict} />
      
      {/* Additional sections can be added below */}
      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">Further scam website analysis sections below</p>
      </div>
    </div>
  );
}