import React, { useState, useRef } from "react";
import { UploadCloud, Trash2, Download, RefreshCcw } from "lucide-react";
import { uploadStage1Image } from "../../lib/apiClient";
import { useStage1 } from "../../lib/useStage1";

const SMSUploader = ({ onAnalysisComplete }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const { setFirstUrl } = useStage1();

  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
  const MAX_SIZE_MB = 5;

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload PNG or JPG images only");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_SIZE_MB}MB`);
      return;
    }

    setError(null);
    setImage(file);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!image) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("session_id", generateSessionId());

      const data = await uploadStage1Image(formData);
      const output = data.stage1_output;

      if (output) {
        const first = output.extracted_urls?.[0] || null;
        setFirstUrl(first);
        onAnalysisComplete?.(output, preview);
      }
    } catch {
      setError("Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSessionId = () =>
    `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const resetUpload = () => {
    setImage(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Upload SMS Screenshot
        </h2>
        <p className="text-sm text-gray-500">
          Upload PNG or JPG image under {MAX_SIZE_MB}MB
        </p>
      </div>

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-purple-400 rounded-xl p-10 text-center bg-purple-50 cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />

          <div className="flex justify-center mb-4">
            <UploadCloud className="w-10 h-10 text-purple-600" />
          </div>

          <p className="font-medium text-gray-700">Drop file or browse</p>
          <p className="text-sm text-gray-500 mt-1">
            Format: .png, .jpg & Max file size: {MAX_SIZE_MB}MB
          </p>

          <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium">
            Browse Files
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="SMS Preview"
            className="w-full max-h-80 object-contain rounded-xl border"
          />

          <div className="absolute top-4 right-4 flex flex-col gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white shadow-md p-2 rounded-lg hover:bg-gray-100"
            >
              <RefreshCcw className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={resetUpload}
              className="bg-white shadow-md p-2 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>

          <button
            onClick={handleUpload}
            disabled={isProcessing}
            className="w-full mt-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium disabled:opacity-50"
          >
            {isProcessing ? "Processing…" : "Analyze SMS"}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default SMSUploader;
