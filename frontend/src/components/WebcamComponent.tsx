import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff, Play, Square, AlertCircle } from 'lucide-react';
import { Language, translations } from '../translations';

interface Box {
  box: [number, number, number, number];
  label: string;
  confidence: number;
}

interface WebcamComponentProps {
  lang: Language;
  onCaptureFrame: (base64Image: string) => Promise<{
    pest: string;
    confidence: number;
    solution: string;
    boxes: Box[];
    width: number;
    height: number;
  } | null>;
  latestBoxes: Box[];
  originalWidth: number;
  originalHeight: number;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

export const WebcamComponent: React.FC<WebcamComponentProps> = ({
  lang,
  onCaptureFrame,
  latestBoxes,
  originalWidth,
  originalHeight,
  isScanning,
  setIsScanning,
}) => {
  const t = translations[lang];
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle camera active state
  const handleStartStopCamera = () => {
    if (cameraActive) {
      setCameraActive(false);
      setIsScanning(false);
    } else {
      setCameraActive(true);
      setError(null);
    }
  };

  // Toggle scanning interval
  const handleToggleScanning = () => {
    if (!cameraActive) return;
    setIsScanning(!isScanning);
  };

  // Interval for capturing frame every 2 seconds
  useEffect(() => {
    let interval: any = null;

    if (isScanning && cameraActive) {
      interval = setInterval(async () => {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            await onCaptureFrame(imageSrc);
          }
        }
      }, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isScanning, cameraActive, onCaptureFrame]);

  // Draw bounding boxes on canvas overlay when results change or canvas updates
  useEffect(() => {
    const drawBoxes = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!cameraActive || !latestBoxes || latestBoxes.length === 0) return;

      const scaleX = canvas.width / (originalWidth || 640);
      const scaleY = canvas.height / (originalHeight || 480);

      latestBoxes.forEach((item) => {
        const [x1, y1, x2, y2] = item.box;
        const rx = x1 * scaleX;
        const ry = y1 * scaleY;
        const rw = (x2 - x1) * scaleX;
        const rh = (y2 - y1) * scaleY;

        const isHealthy = item.label.toLowerCase() === 'healthy plant';
        const color = isHealthy ? '#22c55e' : '#f59e0b'; // Green or Amber

        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(rx, ry, rw, rh);

        // Label tag
        ctx.fillStyle = color;
        ctx.font = 'bold 12px sans-serif';
        const labelText = `${item.label} (${Math.round(item.confidence * 100)}%)`;
        const textWidth = ctx.measureText(labelText).width;
        
        // Label background
        ctx.fillRect(rx - 1.5, ry - 20, textWidth + 10, 20);

        // Label text
        ctx.fillStyle = '#000000';
        ctx.fillText(labelText, rx + 4, ry - 6);
      });
    };

    // Delay slightly to ensure canvas is sized
    const timer = setTimeout(drawBoxes, 100);
    return () => clearTimeout(timer);
  }, [latestBoxes, cameraActive, originalWidth, originalHeight]);

  // Resize canvas to match webcam element size
  const handleVideoLoad = () => {
    const canvas = canvasRef.current;
    const webcamVideo = webcamRef.current?.video;
    
    if (canvas && webcamVideo) {
      canvas.width = webcamVideo.clientWidth;
      canvas.height = webcamVideo.clientHeight;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      handleVideoLoad();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "environment" // Use back camera on mobile devices if available
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Webcam Frame Container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center">
        {cameraActive ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={() => {
                setError("Could not access webcam. Please check permissions.");
                setCameraActive(false);
              }}
              onLoadedMetadata={handleVideoLoad}
              className="w-full h-full object-cover"
            />
            {/* Canvas Overlay for bounding boxes */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
            
            {/* Scanning indicator */}
            {isScanning && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-extrabold animate-pulse shadow-lg">
                <span className="w-2.5 h-2.5 bg-slate-950 rounded-full animate-ping"></span>
                <span>{t.scanningActive}</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-center p-6 text-emerald-100/40">
            <CameraOff className="h-14 w-14 mb-3" />
            <p className="text-sm font-medium">{t.cameraInactive}</p>
          </div>
        )}

        {error && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 bg-red-500/90 text-white p-3 rounded-xl text-xs font-semibold shadow-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Camera Actions */}
      <div className="flex gap-4 mt-5">
        <button
          onClick={handleStartStopCamera}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer ${
            cameraActive
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
          }`}
        >
          {cameraActive ? (
            <>
              <CameraOff className="h-4.5 w-4.5" />
              <span>{t.stopCamera}</span>
            </>
          ) : (
            <>
              <Camera className="h-4.5 w-4.5" />
              <span>{t.startCamera}</span>
            </>
          )}
        </button>

        {cameraActive && (
          <button
            onClick={handleToggleScanning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer ${
              isScanning
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isScanning ? (
              <>
                <Square className="h-4.5 w-4.5 fill-current" />
                <span>Stop Live AI</span>
              </>
            ) : (
              <>
                <Play className="h-4.5 w-4.5 fill-current" />
                <span>Start Live AI</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
