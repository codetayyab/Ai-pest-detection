import React, { useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../api';
import { Language, translations } from '../translations';
import { WebcamComponent } from '../components/WebcamComponent';
import { UploadComponent } from '../components/UploadComponent';
import { ResultCard } from '../components/ResultCard';

interface Box {
  box: [number, number, number, number];
  label: string;
  confidence: number;
}

interface PredictionResult {
  pest: string;
  confidence: number;
  solution: string;
  boxes: Box[];
  width: number;
  height: number;
  model: string;
}

interface DetectProps {
  lang: Language;
  onNewScan: () => void;
}

export const Detect: React.FC<DetectProps> = ({ lang, onNewScan }) => {
  const t = translations[lang];
  const [activeMode, setActiveMode] = useState<'webcam' | 'upload'>('webcam');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Detection Results
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Urdu Pests lookup for TTS
  const urduPests: Record<string, string> = {
    "Aphids": "ایفڈز (سست تیلا)",
    "Spider Mites": "مکڑیاں (سرخ جواں)",
    "Whiteflies": "سفید مکھی",
    "Caterpillars": "کیٹرپلر (سولیاں)",
    "Healthy Plant": "صحت مند پودا"
  };

  // Trigger speech synthesis
  const triggerVoiceAlert = (pestName: string, confidenceScore: number, solutionText: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel current audio
      
      let text = "";
      let voiceLang = "en-US";
      const confPercent = Math.round(confidenceScore * 100);
      const isHealthy = pestName.toLowerCase() === 'healthy plant';
      
      if (lang === 'ur') {
        text = isHealthy 
          ? `بہترین! آپ کا پودا بالکل صحت مند ہے۔` 
          : `انتباہ: پودے میں ${urduPests[pestName] || pestName} کی تشخیص ہوئی ہے۔ تجویز کردہ حل یہ ہے: ${solutionText}`;
        voiceLang = "ur-PK";
      } else {
        text = isHealthy
          ? `Excellent! Your plant is perfectly healthy.`
          : `Warning: ${pestName} detected with ${confPercent}% confidence. Recommended action: ${solutionText}`;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLang;
      
      // Match voice list for localized voices
      const voices = window.speechSynthesis.getVoices();
      if (lang === 'ur') {
        const urduVoice = voices.find(v => v.lang.startsWith('ur') || v.lang.startsWith('pa') || v.lang.startsWith('hi'));
        if (urduVoice) utterance.voice = urduVoice;
      } else {
        const engVoice = voices.find(v => v.lang.startsWith('en'));
        if (engVoice) utterance.voice = engVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Trigger healthy confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#4ade80', '#15803d', '#fbbf24']
    });
  };

  // Handle frame capture from webcam (sends base64 to FastAPI)
  const handleCaptureFrame = async (base64Image: string) => {
    try {
      setError(null);
      const apiUrl = getApiUrl();
      
      const response = await axios.post(`${apiUrl}/predict-frame`, {
        image: base64Image
      });
      
      const data: PredictionResult = response.data;
      setResult(data);

      // Trigger effects on state changes
      if (data.pest.toLowerCase() === 'healthy plant') {
        triggerConfetti();
      }
      triggerVoiceAlert(data.pest, data.confidence, data.solution);
      onNewScan(); // Notify parent to refresh logs
      
      return data;
    } catch (err: any) {
      console.error("Frame analysis error:", err);
      // Suppress logs overlay errors in live mode to avoid constant alerts
      if (activeMode !== 'webcam') {
        setError(err.response?.data?.detail || "Network error. Make sure FastAPI server is running.");
      }
      return null;
    }
  };

  // Handle file upload analysis (sends File blob to FastAPI)
  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const apiUrl = getApiUrl();
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${apiUrl}/predict-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data: PredictionResult = response.data;
      setResult(data);

      if (data.pest.toLowerCase() === 'healthy plant') {
        triggerConfetti();
      }
      triggerVoiceAlert(data.pest, data.confidence, data.solution);
      onNewScan(); // Notify parent to refresh logs
    } catch (err: any) {
      console.error("Image upload error:", err);
      setError(err.response?.data?.detail || "Failed to contact prediction server. Verify server is online.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear states
  const handleClear = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{t.detectTitle}</h1>
        <p className="text-emerald-100/50 text-sm sm:text-base">{t.detectSubtitle}</p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-emerald-950/40 p-1.5 rounded-2xl border border-emerald-500/10 flex gap-2">
          <button
            onClick={() => {
              setActiveMode('webcam');
              handleClear();
              setIsScanning(false);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeMode === 'webcam'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Camera className="h-4.5 w-4.5" />
            <span>{t.webcamMode}</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('upload');
              handleClear();
              setIsScanning(false);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Upload className="h-4.5 w-4.5" />
            <span>{t.uploadMode}</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Camera/Upload Left, Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Detector */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-emerald-500/5">
          {activeMode === 'webcam' ? (
            <WebcamComponent
              lang={lang}
              onCaptureFrame={handleCaptureFrame}
              latestBoxes={result?.boxes || []}
              originalWidth={result?.width || 640}
              originalHeight={result?.height || 480}
              isScanning={isScanning}
              setIsScanning={setIsScanning}
            />
          ) : (
            <UploadComponent
              lang={lang}
              onUpload={handleImageUpload}
              isLoading={isLoading}
              latestBoxes={result?.boxes || []}
              originalWidth={result?.width || 640}
              originalHeight={result?.height || 480}
              onClear={handleClear}
            />
          )}

          {error && (
            <div className="mt-5 flex items-center gap-2.5 bg-red-950/20 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs sm:text-sm font-semibold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: AI Results */}
        <div className="lg:col-span-5 h-full">
          {result ? (
            <ResultCard
              pest={result.pest}
              confidence={result.confidence}
              solution={result.solution}
              lang={lang}
              modelName={result.model}
              onSpeak={() => triggerVoiceAlert(result.pest, result.confidence, result.solution)}
            />
          ) : (
            <div className="glass-card rounded-3xl p-10 border border-emerald-500/5 text-center text-emerald-100/30 flex flex-col items-center justify-center min-h-[250px] lg:min-h-[380px]">
              <AlertCircle className="h-10 w-10 mb-3 text-emerald-500/20 animate-pulse" />
              <p className="text-sm font-medium">
                {activeMode === 'webcam'
                  ? (isScanning ? "Waiting for first live prediction scan..." : "Start camera and click 'Start Live AI' to begin scan.")
                  : "Upload a crop leaf photo to analyze plant health."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
