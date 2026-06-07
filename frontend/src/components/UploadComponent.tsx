import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileImage, Trash2, Search } from 'lucide-react';
import { Language, translations } from '../translations';

interface Box {
  box: [number, number, number, number];
  label: string;
  confidence: number;
}

interface UploadComponentProps {
  lang: Language;
  onUpload: (file: File) => Promise<void>;
  isLoading: boolean;
  latestBoxes: Box[];
  originalWidth: number;
  originalHeight: number;
  onClear: () => void;
}

export const UploadComponent: React.FC<UploadComponentProps> = ({
  lang,
  onUpload,
  isLoading,
  latestBoxes,
  originalWidth,
  originalHeight,
  onClear,
}) => {
  const t = translations[lang];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle file selection
  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      onClear(); // Clear previous boxes when new file loaded
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClear();
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  // Draw bounding boxes on preview image
  const drawBoxes = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !latestBoxes || latestBoxes.length === 0) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match the rendered image size
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / (originalWidth || img.naturalWidth || 640);
    const scaleY = canvas.height / (originalHeight || img.naturalHeight || 480);

    latestBoxes.forEach((item) => {
      const [x1, y1, x2, y2] = item.box;
      const rx = x1 * scaleX;
      const ry = y1 * scaleY;
      const rw = (x2 - x1) * scaleX;
      const rh = (y2 - y1) * scaleY;

      const isHealthy = item.label.toLowerCase() === 'healthy plant';
      const color = isHealthy ? '#22c55e' : '#f59e0b';

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(rx, ry, rw, rh);

      ctx.fillStyle = color;
      ctx.font = 'bold 11px sans-serif';
      const labelText = `${item.label} (${Math.round(item.confidence * 100)}%)`;
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillRect(rx - 1.5, ry - 18, textWidth + 10, 18);

      ctx.fillStyle = '#000000';
      ctx.fillText(labelText, rx + 4, ry - 5);
    });
  };

  // Redraw when latestBoxes, previewUrl, or resizing happens
  useEffect(() => {
    drawBoxes();
  }, [latestBoxes, previewUrl]);

  useEffect(() => {
    const handleResize = () => {
      drawBoxes();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [latestBoxes]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Box / Image Preview Container */}
      <div className="w-full">
        {!previewUrl ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerBrowse}
            className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all ${
              isDragActive
                ? 'border-emerald-400 bg-emerald-500/10'
                : 'border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/40 hover:bg-emerald-950/20'
            }`}
          >
            <UploadCloud className={`h-12 w-12 mb-3 transition-transform ${isDragActive ? '-translate-y-1 text-emerald-400' : 'text-emerald-100/40'}`} />
            <p className="text-sm font-semibold text-emerald-100/80 mb-1">
              {t.dragDropText}
            </p>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {t.browseFiles}
            </span>
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center">
            {/* The Image Preview */}
            <img
              ref={imageRef}
              src={previewUrl}
              alt="Leaf Preview"
              onLoad={drawBoxes}
              className="w-full h-full object-contain max-h-[350px]"
            />
            {/* Canvas overlay for boxes */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      {previewUrl && (
        <div className="flex gap-4 mt-5">
          <button
            onClick={clearSelection}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="h-4.5 w-4.5" />
            <span>{t.clear}</span>
          </button>
          
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>{t.analyzing}</span>
              </span>
            ) : (
              <>
                <Search className="h-4.5 w-4.5" />
                <span>{t.analyze}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
