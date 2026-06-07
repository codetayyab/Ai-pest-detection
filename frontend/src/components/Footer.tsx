import React from 'react';
import { Sprout, ShieldAlert, Heart } from 'lucide-react';
import { Language, translations } from '../translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-emerald-950/30 glass-panel py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Sprout className="h-5 w-5 text-emerald-400 mr-2" />
            <span className="text-sm font-semibold tracking-tight text-white">
              Agri<span className="text-emerald-400">Scan</span> AI
            </span>
          </div>
          
          {/* Copyright Info */}
          <div className="text-xs text-emerald-100/40 flex items-center gap-1.5">
            <span>&copy; {currentYear} AgriScan AI. All rights reserved.</span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-0.5">
              Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for Smart Agriculture
            </span>
          </div>

          {/* FYP Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/30 text-emerald-300 text-xs">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Final Year Project (FYP)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
