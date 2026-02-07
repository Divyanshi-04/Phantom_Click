const StageSlide = ({ stage, delay }) => {
  const stages = {
    1: {
      title: 'Scam-Brain',
      subtitle: 'SMS Analysis',
      gradient: 'from-[#1e6fa1] to-[#3a8fc4]',
      items: [
        { icon: 'fa-solid fa-message', bg: 'bg-blue-50', label: 'SMS Detected', value: 'Bank Fraud Alert', color: 'text-blue-600' },
        { icon: 'fa-solid fa-link', bg: 'bg-orange-50', label: 'URL Found', value: 'hdfc-verify.xyz', color: 'text-orange-600' },
        { icon: 'fa-solid fa-triangle-exclamation', bg: 'bg-red-50', label: 'Urgency Level', value: 'HIGH - Act Now!', color: 'text-red-600' }
      ]
    },
    2: {
      title: 'URL Scorecard',
      subtitle: 'Risk Analysis',
      gradient: 'from-[#ff8c42] to-[#ffb347]',
      items: [
        { icon: 'fa-solid fa-clock', bg: 'bg-green-50', label: 'Domain Age', value: '2 days old', color: 'text-green-600' },
        { icon: 'fa-solid fa-shield-halved', bg: 'bg-yellow-50', label: 'SSL Status', value: 'Self-signed', color: 'text-yellow-600' }
      ],
      riskScore: '85'
    },
    3: {
      title: 'Ghost-View',
      subtitle: 'Safe Replay',
      gradient: 'from-[#16a34a] to-[#4ade80]',
      items: [
        { icon: 'fa-solid fa-credit-card', bg: 'bg-red-50', label: 'Flagged Field', value: 'CVV Input Detected', color: 'text-red-600' },
        { icon: 'fa-solid fa-key', bg: 'bg-red-50', label: 'Dangerous', value: 'OTP Request Found', color: 'text-red-600' },
        { icon: 'fa-solid fa-video', bg: 'bg-blue-50', label: 'Screen Replay', value: 'Recording Scam Flow', color: 'text-blue-600' }
      ],
      safeBadge: true
    },
    4: {
      title: 'Digital Witness',
      subtitle: 'Forensic Report',
      gradient: 'from-[#d62828] to-[#ff6b57]',
      pdfPreview: true,
      items: [
        { icon: 'fa-solid fa-check-circle', bg: 'bg-green-50', label: 'Ready to Submit', value: 'cybercrime.gov.in', color: 'text-green-600' }
      ],
      downloadBadge: true
    }
  };

  const data = stages[stage];

  return (
    <div
      className="absolute w-full h-full opacity-0"
      style={{
        animation: `slideshow 16s infinite`,
        animationDelay: `${delay}s`
      }}
    >
      {/* Stage Header */}
      <div className={`bg-gradient-to-br ${data.gradient} rounded-2xl p-4 text-white mb-3 shadow-lg`}>
        <div className="text-[10px] font-medium opacity-90 mb-0.5">STAGE {stage}</div>
        <div className="text-lg font-bold leading-tight">{data.title}</div>
        <div className="text-xs opacity-90">{data.subtitle}</div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl p-3 shadow-xl">
        {data.safeBadge && (
          <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white px-3 py-2 rounded-xl text-center text-[10px] font-semibold mb-2.5 flex items-center justify-center gap-1.5">
            <i className="fa-solid fa-lock text-xs"></i>
            Sandboxed Environment
          </div>
        )}

        {data.pdfPreview && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 text-center mb-2.5">
            <div className="w-12 h-12 bg-gradient-to-br from-[#d62828] to-[#ff6b57] rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-2 shadow-lg">
              <i className="fa-solid fa-file-pdf"></i>
            </div>
            <div className="text-[10px] text-gray-700 font-medium">
              <strong className="block text-xs mb-0.5">Forensic Report Generated</strong>
              Screenshots • Risk Score • AI Summary
            </div>
          </div>
        )}

        {/* Items List */}
        {data.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl mb-2 hover:bg-gray-100 transition-colors">
            <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center ${item.color} text-sm shadow-sm flex-shrink-0`}>
              <i className={item.icon}></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-gray-500 font-medium uppercase tracking-wide">{item.label}</div>
              <div className="text-[11px] font-semibold text-gray-800 truncate">{item.value}</div>
            </div>
          </div>
        ))}

        {data.riskScore && (
          <div className="mt-2.5">
            <div className="bg-gradient-to-br from-[#ff6b57] to-[#ff8c42] text-white rounded-xl p-4 text-center shadow-xl">
              <div className="text-[10px] font-medium opacity-90 mb-0.5">Risk Score</div>
              <div className="text-3xl font-bold mb-0.5">{data.riskScore}%</div>
              <div className="text-[10px] font-semibold">HIGH RISK</div>
            </div>
          </div>
        )}

        {data.downloadBadge && (
          <div className="bg-gradient-to-r from-[#d62828] to-[#ff6b57] text-white px-3 py-2 rounded-xl text-center text-[10px] font-semibold mt-2.5 flex items-center justify-center gap-1.5 shadow-lg">
            <i className="fa-solid fa-download text-xs"></i>
            Download PDF Evidence
          </div>
        )}
      </div>
    </div>
  );
};

const PhoneMockup = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 w-[300px] h-[610px] z-[5] hidden md:block" style={{ top: '420px' }}>
      {/* iPhone Frame */}
      <div className="w-full h-full bg-[#1a1a1a] rounded-[48px] p-2.5 shadow-[0_40px_100px_rgba(0,0,0,0.4)]" style={{
        animation: 'float-phone-center 4s ease-in-out infinite'
      }}>
        {/* Phone Screen */}
        <div className="w-full h-full bg-gradient-to-b from-[#f8f9fa] to-white rounded-[40px] relative overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#1a1a1a] rounded-b-[18px] z-50"></div>

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-7 pt-2.5 text-[10px] font-medium text-gray-800 z-40">
            <div>9:41</div>
            <div className="flex items-center gap-1">
              <i className="fa-solid fa-signal text-[9px]"></i>
              <i className="fa-solid fa-wifi text-[9px]"></i>
              <i className="fa-solid fa-battery-full text-[9px]"></i>
            </div>
          </div>

          {/* App Content */}
          <div className="pt-14 px-4 pb-6 h-full">
            {/* App Header */}
            <div className="mb-3">
              <h1 className="text-xl font-bold text-[#004554] mb-0.5">PhantomClick</h1>
              <p className="text-[10px] text-gray-600">AI-Powered Scam Detection</p>
            </div>

            {/* Sliding Content */}
            <div className="relative w-full h-[450px]">
              <StageSlide stage={1} delay={0} />
              <StageSlide stage={2} delay={4} />
              <StageSlide stage={3} delay={8} />
              <StageSlide stage={4} delay={12} />
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-900 rounded-full opacity-40"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-phone-center {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default PhoneMockup;