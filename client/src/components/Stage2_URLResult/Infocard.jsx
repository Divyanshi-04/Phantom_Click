export default function InfoCard({ label, value, icon, description, riskLevel }) {
  // Dynamic styling based on risk level
  const getRiskStyle = () => {
    if (riskLevel === "Critical" || riskLevel === "High") {
      return {
        bg: "from-red-50 via-pink-50 to-red-50",
        border: "border-red-200/60",
        iconBg: "from-red-400 to-red-600",
        iconGlow: "shadow-red-500/30",
        pattern: "from-red-100/40 to-transparent",
        badge: "bg-red-100 text-red-700 border-red-200"
      }
    } else if (riskLevel === "Medium" || riskLevel === "Moderate") {
      return {
        bg: "from-amber-50 via-yellow-50 to-amber-50",
        border: "border-amber-200/60",
        iconBg: "from-amber-400 to-amber-600",
        iconGlow: "shadow-amber-500/30",
        pattern: "from-amber-100/40 to-transparent",
        badge: "bg-amber-100 text-amber-700 border-amber-200"
      }
    } else if (riskLevel === "Low") {
      return {
        bg: "emerald-50 via-green-50 to-emerald-50",
        border: "border-emerald-200/60",
        iconBg: "from-emerald-400 to-emerald-600",
        iconGlow: "shadow-emerald-500/30",
        pattern: "from-emerald-100/40 to-transparent",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200"
      }
    } else {
      // Default blue for neutral info
      return {
        bg: "from-blue-50 via-indigo-50 to-blue-50",
        border: "border-blue-200/60",
        iconBg: "from-blue-400 to-blue-600",
        iconGlow: "shadow-blue-500/30",
        pattern: "from-blue-100/40 to-transparent",
        badge: "bg-blue-100 text-blue-700 border-blue-200"
      }
    }
  }

  const style = getRiskStyle()

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${style.bg} rounded-2xl border ${style.border} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-40">
        {/* Top right decorative circle */}
        <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${style.pattern} rounded-full blur-2xl`}></div>
        {/* Mesh pattern */}
        <svg className="absolute inset-0 w-full h-full" opacity="0.1">
          <defs>
            <pattern id={`grid-${label}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${label})`} />
        </svg>
        {/* Gradient waves */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/20 to-transparent"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.iconBg} shadow-lg ${style.iconGlow} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <div className="text-white">
                  {icon}
                </div>
              </div>
            )}
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {label}
            </div>
          </div>
          
          {/* Risk badge */}
          {riskLevel && (
            <span className={`px-2 py-1 ${style.badge} text-xs font-bold rounded-lg border`}>
              {riskLevel}
            </span>
          )}
        </div>
        
        {/* Value display */}
        <div className="mb-3">
          <div className="text-2xl font-black text-gray-900 break-words leading-tight">
            {value ?? "-"}
          </div>
        </div>
        
        {/* Description */}
        {description && (
          <div className="text-xs text-gray-600 leading-relaxed font-medium">
            {description}
          </div>
        )}

        {/* Decorative bottom accent */}
        <div className="mt-4 pt-3 border-t border-gray-200/50">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="w-2 h-1 rounded-full bg-gray-300"></div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}