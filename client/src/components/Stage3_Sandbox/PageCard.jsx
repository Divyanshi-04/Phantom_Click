import { 
  AlertTriangle, 
  CreditCard, 
  Lock, 
  Clock, 
  Tag, 
  Shield,
  AlertOctagon,
  FileText,
  Info,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { useState } from 'react'

export default function PageCard({ page, index }) {
  const [screenshotExpanded, setScreenshotExpanded] = useState(false)
  const [expandedTypes, setExpandedTypes] = useState({})
  
  const uniqueTypes = [
    ...new Set(page.boxes?.map(b => b.type))
  ]

  const toggleType = (type) => {
    setExpandedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const getBoxesByType = (type) => {
    return page.boxes?.filter(b => b.type === type) || []
  }

  const typeConfig = {
    credential: { 
      bg: "bg-orange-50", 
      text: "text-orange-800", 
      border: "border-orange-300",
      badge: "bg-gradient-to-br from-orange-100 to-white text-orange-800 border border-orange-300",
      icon: Lock,
      severity: "HIGH"
    },
    financial: { 
      bg: "bg-red-50", 
      text: "text-red-800", 
      border: "border-red-300",
      badge: "bg-gradient-to-br from-red-100 to-white text-red-800 border border-red-300",
      icon: CreditCard,
      severity: "CRITICAL"
    },
    malware: { 
      bg: "bg-gray-100", 
      text: "text-white", 
      border: "border-gray-700",
      badge: "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border border-gray-300",
      icon: AlertOctagon,
      severity: "CRITICAL"
    },
    urgency: { 
      bg: "bg-yellow-50", 
      text: "text-yellow-900", 
      border: "border-yellow-400",
      badge: "bg-gradient-to-br from-yellow-200 to-white text-yellow-900 border border-yellow-300",
      icon: Clock,
      severity: "MEDIUM"
    },
    branding: { 
      bg: "bg-blue-50", 
      text: "text-blue-800", 
      border: "border-blue-300",
      badge: "bg-gradient-to-br from-blue-100 to-white text-blue-800 border border-blue-300",
      icon: Tag,
      severity: "LOW"
    },
    general: { 
      bg: "bg-green-50", 
      text: "text-green-800", 
      border: "border-green-300",
      badge: "bg-gradient-to-br from-green-100 to-white text-teal-800 border border-teal-300",
      icon: FileText,
      severity: "INFO"
    }
  }

  const getTypeConfig = (type) => 
    typeConfig[type] || typeConfig.general

  const getConfidence = (index) => {
    const confidences = [
      { level: 98, bars: 5, label: "Very High" },
      { level: 95, bars: 5, label: "Very High" },
      { level: 87, bars: 4, label: "High" },
      { level: 92, bars: 5, label: "Very High" },
      { level: 79, bars: 4, label: "High" },
    ]
    return confidences[index % confidences.length]
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
      
      {/* Header */}
      <div className="bg-[#006b7d] p-5 border-b-2 border-gray-200 ">
       
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  Threat Analysis — Page {index + 1}
                </h3>
                <p className="text-xs text-white font-mono mt-0.5 truncate">
                  {page.url}
                </p>
              </div>
            </div>
          </div>
          
          {/* Threat count */}
          <div className="flex-shrink-0 bg-gradient-to-br from-red-500 to-red-600 rounded-lg px-4 py-2 shadow-lg">
            <div className="text-xs text-red-100 font-medium">Threats Detected</div>
            <div className="text-2xl font-bold text-white">
              {page.boxes?.length || 0}
            </div>
          </div>
        </div>

        {/* Type badges */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {uniqueTypes.map((type, i) => {
            const config = getTypeConfig(type)
            const Icon = config.icon
            return (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-semibold ${config.badge} shadow-sm`}
              >
                <Icon className="w-3.5 h-3.5" />
                {type}
              </span>
            )
          })}
        </div>
      </div>

      {/* Expandable Screenshot Section */}
      <div className="bg-slate-50 border-b-2 border-slate-200 pt-8">
        {/* Screenshot Header */}
        <button
          onClick={() => setScreenshotExpanded(!screenshotExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Visual Evidence
            </span>
            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
              AI Analyzed
            </span>
          </div>
          <div className="flex items-center gap-2">
            {screenshotExpanded ? (
              <>
                <Minimize2 className="w-4 h-4 text-slate-600" />
                <ChevronUp className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-slate-600" />
                <ChevronDown className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
              </>
            )}
          </div>
        </button>

        {/* Screenshot Content */}
        <div 
          className={`overflow-hidden transition-all duration-300 ${
            screenshotExpanded ? 'max-h-[1200px]' : 'max-h-[400px]'
          }`}
        >
          <div className="px-6 pb-6">
            <div className="relative group">
              <img
                src={page.annotated || page.screenshot}
                alt="page evidence"
                className="w-full rounded-lg shadow-2xl border-2 border-slate-300 hover:border-teal-500 transition-all cursor-pointer"
                onClick={() => setScreenshotExpanded(!screenshotExpanded)}
              />
              <div className="absolute top-3 right-3 bg-teal-600 text-white text-xs px-3 py-1.5 rounded-md shadow-lg font-semibold">
                Click to {screenshotExpanded ? 'collapse' : 'expand'}
              </div>
            </div>
            
            <div className="mt-4 bg-slate-100 border-l-4 border-teal-600 p-3 rounded">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed">
                  This screenshot has been automatically annotated by AI to highlight suspicious elements and potential threats. 
                  {screenshotExpanded && " Scroll to examine the detailed breakdown of each identified threat below."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Findings Section */}
      <div className="bg-white py-10">
        <div className="sticky top-0 bg-white p-5 pt-0 pb-8 border-b-2 border-slate-200 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Security Findings</h4>
              <p className="text-sm text-slate-600">
                {page.boxes?.length} potential threat{page.boxes?.length !== 1 ? 's' : ''} identified across {uniqueTypes.length} categor{uniqueTypes.length !== 1 ? 'ies' : 'y'}
              </p>
            </div>
          </div>
        </div>

        {/* Expandable Threat Type Sections */}
        <div className="px-5 space-y-3 mt-5">
          {uniqueTypes.map((type) => {
            const config = getTypeConfig(type)
            const Icon = config.icon
            const boxes = getBoxesByType(type)
            const isExpanded = expandedTypes[type]

            return (
              <div key={type} className={`border-2 ${config.border} rounded-lg overflow-hidden`}>
                {/* Type Header */}
                <button
                  onClick={() => toggleType(type)}
                  className={`w-full ${config.bg} px-5 py-4 flex items-center justify-between hover:opacity-80 transition-opacity`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.badge} shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h5 className={`font-bold text-base ${config.text} capitalize`}>
                        {type} Threats
                      </h5>
                      <p className={`text-xs ${config.text} opacity-75`}>
                        {boxes.length} finding{boxes.length !== 1 ? 's' : ''} • {config.severity} severity
                      </p>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 ${config.text} transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expandable Threat List */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-[600px]' : 'max-h-0'
                  }`}
                >
                  <div className="overflow-y-auto max-h-[600px] p-4 bg-white space-y-3">
                    {boxes.map((b, i) => {
                      const confidence = getConfidence(i)
                      
                      return (
                        <div
                          key={i}
                          className={`rounded-lg border-2 ${config.border} ${config.bg} p-4 hover:shadow-md transition-all relative`}
                        >
                          {/* Severity ribbon */}
                          <div className={`absolute top-0 right-0 ${config.badge} px-3 py-1 text-xs font-bold rounded-bl-lg`}>
                            {config.severity}
                          </div>

                          {/* Header */}
                          <div className="flex items-start gap-3 mb-3 pr-20">
                            <div className="flex-1 min-w-0">
                              <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${config.text} opacity-75`}>
                                Finding #{i + 1}
                              </div>
                              <h5 className="font-bold text-base text-slate-900 leading-tight">
                                {b.label}
                              </h5>
                            </div>
                          </div>

                          {/* Warning box */}
                          <div className="bg-white/80 border-l-4 border-slate-400 p-3 rounded-r mb-3">
                            <div className="flex items-start gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                              <span className="text-xs font-bold text-slate-700 uppercase">Why this is dangerous:</span>
                            </div>
                            <p className="text-sm text-slate-800 leading-relaxed font-medium">
                              {b.reason}
                            </p>
                          </div>

                          {/* AI confidence */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-600 font-semibold">AI Confidence:</span>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1.5 h-3 rounded-full ${
                                      idx < confidence.bars ? 'bg-teal-600' : 'bg-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-teal-700">
                                {confidence.level}% ({confidence.label})
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Bottom educational note */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
              <div>
                <h6 className="font-bold text-slate-900 text-sm mb-1">Protection Tip</h6>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Always verify URLs match the official website, never enter sensitive information on suspicious pages, and report phishing attempts to your IT security team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}