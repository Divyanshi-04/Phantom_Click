import React, { useRef, useEffect, useState } from "react";

const HeatmapOverlay = ({ originalImage, heatmapData }) => {
  const canvasRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (originalImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const MAX_WIDTH = 800;
        const scale = Math.min(1, MAX_WIDTH / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Draw base image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw heatmap boxes (UNCHANGED LOGIC)
        if (heatmapData && heatmapData.length > 0) {
          heatmapData.forEach((item) => {
            const [origX0, origY0, origX1, origY1] = item.position;

            const x = origX0 * scale;
            const y = origY0 * scale;
            const w = (origX1 - origX0) * scale;
            const h = (origY1 - origY0) * scale;

            const color = getHeatmapColor(item.intensity);

            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.35)`;
            ctx.fillRect(x, y, w, h);

            ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);
          });
        }

        setIsRendered(true);
      };

      img.src = originalImage;
    }
  }, [originalImage, heatmapData]);

  const getHeatmapColor = (intensity) => {
    if (intensity > 0.8) return { r: 255, g: 0, b: 0 };
    if (intensity > 0.5) return { r: 255, g: 165, b: 0 };
    return { r: 0, g: 255, b: 0 };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="relative flex justify-center">
        <canvas ref={canvasRef} className="rounded-xl border max-w-full" />

        {!isRendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
            <p className="text-sm text-gray-600 animate-pulse">
              Analyzing security layers…
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatmapOverlay;
