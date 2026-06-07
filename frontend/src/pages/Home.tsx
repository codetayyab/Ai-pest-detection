import React from 'react';
import { Camera, Upload, Brain, HelpCircle, Sprout, ArrowRight, Activity } from 'lucide-react';
import { Language, translations } from '../translations';

interface HomeProps {
  lang: Language;
  setCurrentPage: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ lang, setCurrentPage }) => {
  const t = translations[lang];

  const features = [
    {
      icon: <Camera className="h-7 w-7 text-emerald-400" />,
      title: t.liveCamera,
      desc: t.liveCameraDesc,
    },
    {
      icon: <Upload className="h-7 w-7 text-emerald-400" />,
      title: t.imageUpload,
      desc: t.imageUploadDesc,
    },
    {
      icon: <Brain className="h-7 w-7 text-emerald-400" />,
      title: t.aiId,
      desc: t.aiIdDesc,
    },
    {
      icon: <Sprout className="h-7 w-7 text-emerald-400" />,
      title: t.treatment,
      desc: t.treatmentDesc,
    },
  ];

  return (
    <div className="w-full py-10 md:py-16 relative">
      {/* Background ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 md:w-96 h-72 md:h-96 rounded-full bg-emerald-500/10 blur-3xl -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/40 text-emerald-300 text-xs font-semibold mb-6 animate-pulse">
          <Activity className="h-3.5 w-3.5" />
          <span>Real-time Crop Scanning Active</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
          {lang === 'en' ? (
            <>
              AI Pest & Disease <br />
              <span className="text-gradient">Detection System</span>
            </>
          ) : (
            <span className="text-gradient leading-relaxed">{t.heroTitle}</span>
          )}
        </h1>

        <p className="text-emerald-100/60 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          {t.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setCurrentPage('detect')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 scale-100 hover:scale-102 cursor-pointer"
          >
            <span>{t.startDetection}</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            onClick={() => setCurrentPage('dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-bold hover:bg-emerald-500/10 transition-all cursor-pointer"
          >
            <span>{t.viewDashboard}</span>
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-10 flex items-center justify-center gap-2">
          <Sprout className="h-6 w-6 text-emerald-400" />
          <span>{t.featuresTitle}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 flex flex-col items-start text-left border border-emerald-500/5 cursor-default"
            >
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/10 mb-4 flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-emerald-100/50 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
