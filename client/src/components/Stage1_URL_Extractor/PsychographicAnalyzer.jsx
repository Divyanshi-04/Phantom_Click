import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";

const PsychographicAnalyzer = ({
  extractedText = "",
  urgencyScore = 0,
  flaggedPhrases = [],
  extractedUrls = [],
  extractedPhones = [],
  category = "Other",
}) => {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (
      extractedText ||
      urgencyScore > 0 ||
      extractedUrls.length > 0 ||
      extractedPhones.length > 0
    ) {
      setAnalysis({
        extracted_text: extractedText,
        urgency_score: urgencyScore,
        flagged_phrases: flaggedPhrases,
        extracted_urls: extractedUrls,
        extracted_phones: extractedPhones,
        category,
        timestamp: new Date().toISOString(),
      });
    }
  }, [
    extractedText,
    urgencyScore,
    flaggedPhrases,
    extractedUrls,
    extractedPhones,
    category,
  ]);

  const downloadJSON = () => {
    if (!analysis) return;

    const blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `stage1_psychographic_${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-5">
      <h4 className="text-lg font-semibold text-gray-800">
        Psychographic Analysis
      </h4>

      <div className="grid grid-cols-2 gap-4 w-full text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Urgency Score</p>
          <p className="font-semibold text-gray-800">{urgencyScore}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Category</p>
          <p className="font-semibold text-gray-800">{category}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 col-span-2">
          <p className="text-gray-500">Flagged Phrases</p>
          <p className="font-medium text-gray-700">
            {flaggedPhrases.length > 0 ? flaggedPhrases.join(", ") : "None"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">URLs</p>
          <p className="font-medium text-gray-700">{extractedUrls.length}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Phone Numbers</p>
          <p className="font-medium text-gray-700">{extractedPhones.length}</p>
        </div>
      </div>

      <button
        onClick={downloadJSON}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition"
      >
        <Download className="w-5 h-5" />
        Download Psychographic JSON
      </button>
    </div>
  );
};

export default PsychographicAnalyzer;
