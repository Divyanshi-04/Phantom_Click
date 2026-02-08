export default function LoadingState() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-16">
      <div className="flex flex-col items-center justify-center">
        {/* Animated spinner */}
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analyzing URL Security
          </h3>
          <p className="text-sm text-gray-500">
            Performing comprehensive risk assessment...
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-2 mt-6">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  )
}