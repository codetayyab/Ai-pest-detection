import React, { useState } from 'react';
import { Sprout, Menu, X, Languages } from 'lucide-react';
import { Language, translations } from '../translations';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  lang,
  setLang,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang];

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'detect', label: t.detect },
    { id: 'dashboard', label: t.dashboard },
    { id: 'about', label: t.about },
    { id: 'contact', label: t.contact },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-emerald-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 mr-2 flex items-center justify-center">
              <Sprout className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Agri<span className="text-emerald-400">Scan</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ml-1 tracking-wider border border-emerald-500/30">AI</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-emerald-100/70 hover:text-white hover:bg-emerald-950/20'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/10 transition-all cursor-pointer"
            >
              <Languages className="h-4 w-4" />
              <span>{t.language}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/10 transition-all cursor-pointer"
            >
              <Languages className="h-3.5 w-3.5" />
              <span>{t.language}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-950/30 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-emerald-950/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-400 pl-4'
                    : 'text-emerald-100/70 hover:text-white hover:bg-emerald-950/20'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
