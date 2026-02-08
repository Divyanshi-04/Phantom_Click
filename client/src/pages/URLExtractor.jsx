import { useState } from "react";
import { Link } from "react-router-dom";
import SMSUploader from "../components/Stage1_URL_Extractor/SMSUploader";
import PsychographicAnalyzer from "../components/Stage1_URL_Extractor/PsychographicAnalyzer";
import HeatmapOverlay from "../components/Stage1_URL_Extractor/HeatmapOverlay";

export default function URLExtractor() {
  const [stage1Data, setStage1Data] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const handleAnalysisComplete = (data, imageUrl) => {
    setStage1Data(data);
    setOriginalImage(imageUrl);
  };

  return (
    <div className="min-h-screen bg-neutral-100 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Kavach-SMS · Stage 1
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            OCR, psychographic analysis & visual threat detection
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left */}
          <div className="space-y-8">
            <SMSUploader onAnalysisComplete={handleAnalysisComplete} />

            {stage1Data && (
              <PsychographicAnalyzer
                extractedText={stage1Data.extracted_text}
                urgencyScore={stage1Data.urgency_score}
                flaggedPhrases={stage1Data.flagged_phrases}
                extractedUrls={stage1Data.extracted_urls}
                extractedPhones={stage1Data.extracted_phones}
                category={stage1Data.category}
              />
            )}
          </div>

          {/* Right */}
          <div className="space-y-8">
            {originalImage && stage1Data && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Visual Heatmap
                </h3>
                <HeatmapOverlay
                  originalImage={originalImage}
                  heatmapData={stage1Data.heatmap_data || []}
                />
              </div>
            )}

            {stage1Data && (
              <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
                <h3 className="font-semibold text-gray-800">
                  Extracted Intelligence
                </h3>

                <div className="flex gap-2 text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="px-2 py-1 rounded bg-gray-100 font-medium">
                    {stage1Data.category}
                  </span>
                </div>

                <div>
                  <p className="font-medium text-sm mb-2">
                    URLs ({stage1Data.extracted_urls.length})
                  </p>
                  <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                    {stage1Data.extracted_urls.map((url, i) => (
                      <li key={i}>{url}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-sm mb-2">
                    Phone Numbers ({stage1Data.extracted_phones.length})
                  </p>
                  <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                    {stage1Data.extracted_phones.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        {stage1Data && (
          <div className="flex justify-end pt-4">
            <Link
              to="/result"
              state={stage1Data}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md transition"
            >
              Proceed to Stage 2 →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
