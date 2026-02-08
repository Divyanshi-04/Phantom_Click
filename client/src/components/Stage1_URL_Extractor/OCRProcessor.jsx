import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

const OCRProcessor = ({ imageUrl, onOCRComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  useEffect(() => {
    if (imageUrl && typeof onOCRComplete === "function") {
      processImage(imageUrl);
    }
  }, [imageUrl, onOCRComplete]);

  const processImage = async (imageUrl) => {
    setIsProcessing(true);
    setStatus("Initializing OCR...");
    setProgress(10);

    try {
      setStatus("Processing image...");
      setProgress(30);

      const result = await Tesseract.recognize(imageUrl, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(60 + Math.floor(m.progress * 30));
            setStatus(`OCR ${Math.floor(m.progress * 100)}%`);
          }
        },
      });

      setProgress(95);
      setStatus("Extracting text...");

      const words = result.data.words.map((word) => ({
        text: word.text,
        bbox: word.bbox,
      }));

      const fullText = words.map((w) => w.text).join(" ");

      const ocrData = {
        extracted_text: fullText,
        words,
        confidence: result.data.confidence,
      };

      setOcrResult(ocrData);
      setProgress(100);
      setStatus("OCR Complete");

      setTimeout(() => onOCRComplete?.(ocrData), 500);
    } catch (error) {
      const emptyResult = {
        extracted_text: "",
        words: [],
        confidence: 0,
      };
      onOCRComplete?.(emptyResult);
      setStatus("OCR Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const getProgressColor = () => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-800">OCR Processing</h4>
        <span className="text-sm text-gray-500">{status}</span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-right text-xs text-gray-500">{progress}%</div>

      {isProcessing && (
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          Processing image…
        </div>
      )}

      {ocrResult && (
        <div className="space-y-4 border-t pt-4">
          <h5 className="font-medium text-sm text-gray-700">Extracted Text</h5>

          <div className="bg-gray-50 border rounded-lg p-4 text-sm max-h-40 overflow-y-auto whitespace-pre-wrap">
            {ocrResult.extracted_text || "(No text detected)"}
          </div>

          <div className="flex gap-6 text-xs text-gray-500">
            <span>Confidence: {Math.round(ocrResult.confidence)}%</span>
            <span>Words: {ocrResult.words.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OCRProcessor;