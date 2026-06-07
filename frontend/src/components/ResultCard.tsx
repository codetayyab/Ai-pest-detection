import React from 'react';
import { AlertTriangle, CheckCircle, Volume2, Shield, Settings, Info } from 'lucide-react';
import { Language, translations } from '../translations';

interface ResultCardProps {
  pest: string;
  confidence: number;
  solution: string;
  lang: Language;
  modelName?: string;
  onSpeak?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  pest,
  confidence,
  solution,
  lang,
  modelName = "YOLOv8",
  onSpeak,
}) => {
  const t = translations[lang];
  const isHealthy = pest.toLowerCase() === 'healthy plant';
  const confidencePercent = Math.round(confidence * 100);

  // Urdu Translations for model predictions if language is Urdu
  const urduPests: Record<string, string> = {
    "Aphids": "ایفڈز (سست تیلا)",
    "Spider Mites": "مکڑیاں (سرخ جواں)",
    "Whiteflies": "سفید مکھی",
    "Caterpillars": "کیٹرپلر (سولیاں)",
    "Healthy Plant": "صحت مند پودا"
  };

  const getPestName = () => {
    if (lang === 'ur') {
      return urduPests[pest] || pest;
    }
    return pest;
  };

  return (
    <div className={`w-full glass-card rounded-2xl p-6 border-l-4 overflow-hidden relative animate-fade-in ${
      isHealthy 
        ? 'border-l-emerald-500 shadow-emerald-950/10' 
        : 'border-l-amber-500 shadow-amber-950/10'
    }`}>
      {/* Background radial accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none -mr-8 -mt-8 ${
        isHealthy ? 'bg-emerald-400' : 'bg-amber-400'
      }`}></div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-emerald-100/60 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            {t.resultTitle}
          </h3>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            {getPestName()}
            {isHealthy ? (
              <CheckCircle className="h-6 w-6 text-emerald-400 fill-emerald-500/10" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-400 fill-amber-500/10" />
            )}
          </h2>
        </div>

        {onSpeak && (
          <button
            onClick={onSpeak}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isHealthy
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
            }`}
            title="Read results aloud"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Model Name and Stats */}
      <div className="flex items-center gap-2 mb-5 text-[11px] text-emerald-100/50 bg-emerald-950/25 px-2.5 py-1 rounded-md w-max border border-emerald-900/30">
        <Settings className="h-3 w-3" />
        <span>Model: {modelName}</span>
      </div>

      {/* Confidence Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm font-medium mb-1.5">
          <span className="text-emerald-100/70">{t.confidence}</span>
          <span className={isHealthy ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
            {confidencePercent}%
          </span>
        </div>
        <div className="w-full bg-emerald-950/50 rounded-full h-3 border border-emerald-900/20 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isHealthy ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
            }`}
            style={{ width: `${confidencePercent}%` }}
          ></div>
        </div>
      </div>

      {/* Treatment Solution */}
      <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4.5">
        <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-emerald-400" />
          {t.recommendation}
        </h4>
        <p className="text-emerald-100/80 text-sm leading-relaxed">
          {lang === 'ur' && isHealthy 
            ? "آپ کا پودا بالکل صحت مند ہے! باقاعدگی سے پانی دیں، مناسب دھوپ فراہم کریں اور غذائیت کا خیال رکھیں۔" 
            : solution}
        </p>
      </div>
    </div>
  );
};
