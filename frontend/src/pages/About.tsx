import React from 'react';
import { Leaf, Info, Zap, ShieldAlert } from 'lucide-react';
import { Language, translations } from '../translations';

interface AboutProps {
  lang: Language;
}

export const About: React.FC<AboutProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{t.aboutTitle}</h1>
        <p className="text-emerald-100/50 text-sm sm:text-base">{t.aboutSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Core Description Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/5 flex flex-col justify-start">
          <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/15 mb-5 flex items-center justify-center w-max text-emerald-400">
            <Leaf className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Project Description</h2>
          <p className="text-emerald-100/60 text-sm leading-relaxed mb-4">
            {t.aboutBody1}
          </p>
        </div>

        {/* Technical Details Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/5 flex flex-col justify-start">
          <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/15 mb-5 flex items-center justify-center w-max text-emerald-400">
            <Zap className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{t.modelExplanationTitle}</h2>
          <p className="text-emerald-100/60 text-sm leading-relaxed">
            {t.modelExplanationBody}
          </p>
        </div>
      </div>

      {/* Agriculture Use Case Card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/5 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{t.useCaseTitle}</h2>
            <p className="text-emerald-100/60 text-sm leading-relaxed mb-4">
              {t.useCaseBody}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 text-center">
                <span className="block text-2xl font-bold text-emerald-400 mb-1">98%</span>
                <span className="text-[11px] text-emerald-100/40 uppercase font-semibold">Detection Accuracy</span>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 text-center">
                <span className="block text-2xl font-bold text-emerald-400 mb-1">&lt; 100ms</span>
                <span className="text-[11px] text-emerald-100/40 uppercase font-semibold">Inference Latency</span>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 text-center">
                <span className="block text-2xl font-bold text-emerald-400 mb-1">100%</span>
                <span className="text-[11px] text-emerald-100/40 uppercase font-semibold">Eco-Friendly Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
