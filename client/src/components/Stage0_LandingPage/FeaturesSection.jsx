// Custom Illustration Components
const ScamBrainIllustration = () => (
  <svg width="280" height="180" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Phone Frame */}
    <rect x="60" y="15" width="160" height="150" rx="12" fill="white" stroke="#1e6fa1" strokeWidth="4"/>
    
    {/* Status Bar */}
    <rect x="60" y="15" width="160" height="25" rx="12" fill="#1e6fa1"/>
    <text x="80" y="32" fill="white" fontSize="10">9:41</text>
    <text x="190" y="32" fill="white" fontSize="10">100%</text>
    
    {/* SMS Header */}
    <rect x="65" y="45" width="150" height="20" fill="#e9f4f7"/>
    <circle cx="75" cy="55" r="6" fill="#3a8fc4"/>
    <text x="85" y="59" fill="#1e6fa1" fontSize="10" fontWeight="bold">Unknown Sender</text>
    
    {/* SMS Messages */}
    {/* Message 1 - Normal */}
    <rect x="70" y="72" width="120" height="16" rx="8" fill="#e9f4f7"/>
    <text x="78" y="83" fill="#333" fontSize="8">Hello! Your account needs</text>
    
    {/* Message 2 - Urgency Flag */}
    <g>
      <rect x="70" y="93" width="135" height="16" rx="8" fill="#ffe6e6" stroke="#ff6b57" strokeWidth="2"/>
      <text x="78" y="104" fill="#333" fontSize="8">URGENT verification required!</text>
      {/* Warning marker */}
      <circle cx="200" cy="101" r="8" fill="#ff6b57"/>
      <text x="200" y="105" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">!</text>
    </g>
    
    {/* Message 3 - Suspicious Link */}
    <g>
      <rect x="70" y="114" width="140" height="20" rx="8" fill="#fff3e0" stroke="#ff8c42" strokeWidth="2"/>
      <text x="78" y="123" fill="#333" fontSize="7">Click here immediately:</text>
      <text x="78" y="131" fill="#1e6fa1" fontSize="7" textDecoration="underline">http://bank-verify-urgent.xyz</text>
      {/* Suspicious link marker */}
      <circle cx="205" cy="124" r="8" fill="#ff8c42"/>
      <text x="205" y="128" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">?</text>
    </g>
    
    {/* Message 4 - Phone number */}
    <g>
      <rect x="70" y="139" width="125" height="16" rx="8" fill="#f0e6ff" stroke="#9b7cff" strokeWidth="2"/>
      <text x="78" y="150" fill="#333" fontSize="8">Or call: +1-800-FAKE-NUM</text>
      {/* Suspicious number marker */}
      <circle cx="190" cy="147" r="8" fill="#9b7cff"/>
      <text x="190" y="151" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">⚠</text>
    </g>
    
    {/* AI Analysis Badge */}
    <g transform="translate(15, 60)">
      <circle cx="20" cy="20" r="18" fill="#4ade80" opacity="0.2" stroke="#16a34a" strokeWidth="2"/>
      <text x="20" y="18" textAnchor="middle" fill="#16a34a" fontSize="14" fontWeight="bold">AI</text>
      <text x="20" y="27" textAnchor="middle" fill="#16a34a" fontSize="7">Scan</text>
    </g>
    
    {/* Threat Detection Count */}
    <rect x="235" y="100" width="35" height="45" rx="6" fill="#d62828" opacity="0.9"/>
    <text x="252" y="118" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">3</text>
    <text x="252" y="128" textAnchor="middle" fill="white" fontSize="7">Threats</text>
    <text x="252" y="136" textAnchor="middle" fill="white" fontSize="7">Found</text>
  </svg>
);

const URLScorecardIllustration = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  {/* Scorecard Dashboard */}
  <rect x="35" y="35" width="110" height="110" rx="10" fill="white" stroke="#ff8c42" strokeWidth="3"/>

  {/* Header */}
  <rect x="35" y="35" width="110" height="25" rx="10" fill="#fff5ed"/>
  <text x="90" y="52" textAnchor="middle" fill="#ff8c42" fontSize="12" fontWeight="bold">
    RISK ANALYSIS
  </text>

  {/* Circular Gauge */}
  <circle cx="90" cy="90" r="22" fill="white" stroke="#ffe0b2" strokeWidth="6"/>

  <path
    d="M 90 68 A 22 22 0 1 1 89.9 68"
    stroke="#ff8c42"
    strokeWidth="6"
    strokeLinecap="round"
    fill="none"
    transform="rotate(-90 90 90)"
  />

  {/* Score (centered nicely, no dot) */}
  <text
    x="90"
    y="90"
    textAnchor="middle"
    dominantBaseline="middle"
    fill="#d62828"
    fontSize="18"
    fontWeight="bold"
  >
    87
  </text>

  {/* Risk factors */}
  <g transform="translate(50, 125)">
    <circle cx="0" cy="0" r="3" fill="#ff6b57"/>
    <text x="8" y="3" fill="#666" fontSize="8">Domain Age</text>
  </g>

  <g transform="translate(50, 135)">
    <circle cx="0" cy="0" r="3" fill="#ffb347"/>
    <text x="8" y="3" fill="#666" fontSize="8">SSL Check</text>
  </g>
</svg>

);

const GhostViewIllustration = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Browser Window in Sandbox */}
    <rect x="30" y="35" width="120" height="95" rx="8" fill="white" stroke="#16a34a" strokeWidth="3"/>
    
    {/* Browser chrome */}
    <rect x="30" y="35" width="120" height="20" rx="8" fill="#e8f5e9"/>
    <circle cx="40" cy="45" r="3" fill="#ff6b57"/>
    <circle cx="50" cy="45" r="3" fill="#ffb347"/>
    <circle cx="60" cy="45" r="3" fill="#4ade80"/>
    <rect x="70" y="42" width="60" height="6" rx="3" fill="white"/>
    
    {/* Page content with danger highlights */}
    <rect x="40" y="65" width="45" height="8" rx="2" fill="#e8f5e9"/>
    <rect x="90" y="65" width="50" height="8" rx="2" fill="#ffe6e6" stroke="#ff6b57" strokeWidth="2"/>
    
    <rect x="40" y="78" width="100" height="6" rx="2" fill="#e8f5e9"/>
    <rect x="40" y="88" width="80" height="6" rx="2" fill="#e8f5e9"/>
    
    {/* Fake input field - highlighted */}
    <rect x="40" y="100" width="100" height="15" rx="4" fill="#ffe6e6" stroke="#ff6b57" strokeWidth="2.5" strokeDasharray="4 2"/>
    <text x="50" y="110" fill="#999" fontSize="8">Enter Card Number...</text>
    
    {/* Shield/Eye watching */}
    <circle cx="145" cy="120" r="20" fill="#16a34a" opacity="0.9"/>
   
    <path d="M138 126 Q145 129 152 126" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

const DigitalWitnessIllustration = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* PDF Document */}
    <path d="M55 30 L125 30 L145 50 L145 150 L55 150 Z" fill="white" stroke="#d62828" strokeWidth="3"/>
    <path d="M125 30 L125 50 L145 50" fill="#ffe6e6" stroke="#d62828" strokeWidth="3"/>
    
    {/* PDF badge */}
    <rect x="65" y="42" width="30" height="12" rx="4" fill="#d62828"/>
    <text x="80" y="51" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">PDF</text>
    
    {/* Forensic Report header */}
    <text x="100" y="65" textAnchor="middle" fill="#333" fontSize="8" fontWeight="bold">FORENSIC REPORT</text>
    
    {/* Screenshot preview */}
    <rect x="65" y="72" width="70" height="35" rx="4" fill="#ffe6e6" stroke="#ff6b57" strokeWidth="2"/>
    <rect x="70" y="77" width="25" height="15" rx="2" fill="#fff"/>
    <circle cx="82" cy="84" r="3" fill="#ff6b57"/>
    <rect x="100" y="77" width="30" height="4" rx="1" fill="#ffcccb"/>
    <rect x="100" y="84" width="25" height="4" rx="1" fill="#ffcccb"/>
    <rect x="70" y="96" width="60" height="6" rx="2" fill="#d62828" opacity="0.3"/>
    
    {/* Risk metrics */}
    <g transform="translate(65, 115)">
      <circle cx="5" cy="5" r="8" fill="#ff6b57"/>
      <text x="5" y="8" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">!</text>
      <text x="18" y="8" fill="#666" fontSize="8">Risk Score: 87</text>
    </g>
    
    <rect x="65" y="128" width="50" height="3" rx="1.5" fill="#ffcccb"/>
    <rect x="65" y="134" width="55" height="3" rx="1.5" fill="#ffcccb"/>
    <rect x="65" y="140" width="45" height="3" rx="1.5" fill="#ffcccb"/>
    
    {/* Verified stamp */}
    <circle cx="120" cy="135" r="12" fill="#4ade80" opacity="0.2" stroke="#4ade80" strokeWidth="2"/>
    <path d="M115 135 L119 139 L125 131" stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);

// Feature Card Component
const FeatureCard = ({ title, description, gradientClass, IllustrationComponent }) => {
  return (
    <div className="bg-white rounded-[24px] shadow-[0_10px_35px_rgba(0,69,84,0.12)] transition-all duration-300 border border-gray-100 hover:-translate-y-2 hover:shadow-[0_16px_50px_rgba(0,69,84,0.2)] hover:border-[#44a6b5] relative overflow-hidden group flex flex-col">
      {/* Illustration Area */}
      <div className={`relative h-[200px] ${gradientClass} bg-opacity-5 flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
        <div className="z-10 group-hover:scale-105 transition-transform duration-300">
          <IllustrationComponent />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-[1.6rem] md:text-[1.75rem] mb-4 text-[#004554] font-bold leading-tight">
          {title}
        </h3>
        <p className="text-[#4a6b73] leading-relaxed text-[1rem] md:text-[1.05rem] flex-1">
          {description}
        </p>
      </div>
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      gradient: 'bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb]',
      title: 'Scam-Brain',
      description: 'AI analyzes SMS screenshots to detect malicious URLs, phone numbers, and psychological manipulation tactics.',
      illustration: ScamBrainIllustration
    },
    {
      gradient: 'bg-gradient-to-br from-[#fff3e0] to-[#ffe0b2]',
      title: 'URL Scorecard',
      description: 'Links are safely analyzed for domain age, SSL validity, and phishing patterns with a 0-100 risk score.',
      illustration: URLScorecardIllustration
    },
    {
      gradient: 'bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9]',
      title: 'Ghost-View',
      description: 'Dangerous sites open in a secure sandbox, revealing scam mechanics without exposing you to risk.',
      illustration: GhostViewIllustration
    },
    {
      gradient: 'bg-gradient-to-br from-[#ffebee] to-[#ffcdd2]',
      title: 'Digital Witness',
      description: 'Generate evidence-ready forensic PDFs with screenshots and analysis for cybercrime.gov.in reporting.',
      illustration: DigitalWitnessIllustration
    }
  ];

  return (
    <section className="bg-white px-[5%] py-20 md:py-28 " id="solutions">
      {/* Header */}
      <div className="max-w-[900px] mx-auto text-center mb-16">
        <h2 className=" text-3xl md:text-[2.8rem] mb-4 text-[#004554] font-bold">
          How PhantomClick Works
        </h2>
        <p className="text-[#4a6b73] text-lg md:text-xl max-w-[700px] mx-auto">
          Four intelligent stages powered by AI to detect, analyze, and document digital scams
        </p>
      </div>

      {/* Symmetric 4-Box Grid Layout */}
      <div className="max-w-[1300px] mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              title={feature.title}
              description={feature.description}
              gradientClass={feature.gradient}
              IllustrationComponent={feature.illustration}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;