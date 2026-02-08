import { useEffect, useState } from "react"

export default function CircularScoreCard({ title, subtitle, score, type = "threat" }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 300)
    return () => clearTimeout(timer)
  }, [score])

  // Dynamic colors based on score and type
  const getColorConfig = () => {
    if (type === "threat") {
      // High threat = red, low threat = green
      if (score >= 70) {
        return {
          gradient: ["#ef4444", "#dc2626", "#991b1b"],
          bg: "from-red-50 via-red-100/50 to-red-50",
          text: "text-red-900",
          glow: "shadow-red-500/20",
          trail: "#fecaca"
        }
      } else if (score >= 40) {
        return {
          gradient: ["#f59e0b", "#d97706", "#b45309"],
          bg: "from-amber-50 via-amber-100/50 to-amber-50",
          text: "text-amber-900",
          glow: "shadow-amber-500/20",
          trail: "#fde68a"
        }
      } else {
        return {
          gradient: ["#3b82f6", "#2563eb", "#1d4ed8"],
          bg: "from-blue-50 via-blue-100/50 to-blue-50",
          text: "text-blue-900",
          glow: "shadow-blue-500/20",
          trail: "#bfdbfe"
        }
      }
    } else if (type === "entropy") {
      // Orange theme for entropy
      return {
        gradient: ["#fb923c", "#f97316", "#ea580c"],
        bg: "from-orange-50 via-orange-100/50 to-orange-50",
        text: "text-orange-900",
        glow: "shadow-orange-500/20",
        trail: "#fed7aa"
      }
    } else {
      // Green theme for trust/stability
      return {
        gradient: ["#10b981", "#059669", "#047857"],
        bg: "from-emerald-50 via-emerald-100/50 to-emerald-50",
        text: "text-emerald-900",
        glow: "shadow-emerald-500/20",
        trail: "#a7f3d0"
      }
    }
  }

  const config = getColorConfig()

  const size = 200
  const strokeWidth = 16
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  // Generate decorative dots around the circle
  const dots = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360
    const dotRadius = size / 2 - 4
    const x = size / 2 + dotRadius * Math.cos((angle - 90) * Math.PI / 180)
    const y = size / 2 + dotRadius * Math.sin((angle - 90) * Math.PI / 180)
    const isActive = (i / 24) * 100 <= animatedScore
    return { x, y, isActive, angle }
  })

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${config.bg} rounded-3xl border border-white/60 shadow-xl ${config.glow} p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group`}>
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h3 className={`${config.text} font-bold text-lg mb-2`}>{title}</h3>
          <p className="text-gray-600 text-xs leading-relaxed">{subtitle}</p>
        </div>

        {/* Circular Progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative" style={{ width: size, height: size }}>
            {/* Decorative dots */}
            {dots.map((dot, i) => (
              <div
                key={i}
                className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-1000 ${
                  dot.isActive ? 'bg-gradient-to-r opacity-80 scale-100' : 'bg-gray-200 opacity-30 scale-75'
                }`}
                style={{
                  left: `${dot.x}px`,
                  top: `${dot.y}px`,
                  transform: 'translate(-50%, -50%)',
                  transitionDelay: `${i * 30}ms`,
                  backgroundImage: dot.isActive ? `linear-gradient(135deg, ${config.gradient[0]}, ${config.gradient[1]})` : undefined
                }}
              />
            ))}

            <svg
              className="transform -rotate-90"
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
            >
              <defs>
                <linearGradient id={`gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={config.gradient[0]} />
                  <stop offset="50%" stopColor={config.gradient[1]} />
                  <stop offset="100%" stopColor={config.gradient[2]} />
                </linearGradient>
                <filter id={`glow-${type}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={config.trail}
                strokeWidth={strokeWidth}
                opacity="0.3"
              />
              
              {/* Progress arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={`url(#gradient-${type})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                filter={`url(#glow-${type})`}
                style={{
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-5xl font-black ${config.text} mb-1`}>
                {Math.round(animatedScore)}
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Score
              </div>
            </div>
          </div>
        </div>

        {/* Risk indicator badges */}
        <div className="flex items-center justify-center gap-2">
          {type === "threat" && (
            <>
              {score >= 70 && (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                  Critical
                </span>
              )}
              {score >= 40 && score < 70 && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                  Medium
                </span>
              )}
              {score < 40 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                  Low Risk
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}