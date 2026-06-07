import React from 'react';
import { BarChart3, Heart, Bug, Percent, RefreshCw } from 'lucide-react';
import { Language, translations } from '../translations';
import { HistoryTable } from '../components/HistoryTable';

interface Box {
  box: [number, number, number, number];
  label: string;
  confidence: number;
}

interface HistoryItem {
  id: number;
  pest: string;
  confidence: number;
  solution: string;
  timestamp: string;
  image: string;
  boxes?: Box[];
}

interface DashboardProps {
  lang: Language;
  history: HistoryItem[];
  onClearHistory: () => Promise<void>;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  lang,
  history,
  onClearHistory,
  onRefresh,
  isRefreshing,
}) => {
  const t = translations[lang];

  // Calculate statistics
  const totalScans = history.length;
  const healthyCount = history.filter(item => item.pest.toLowerCase() === 'healthy plant').length;
  const pestCount = totalScans - healthyCount;
  
  const averageConfidence = totalScans > 0 
    ? Math.round((history.reduce((sum, item) => sum + item.confidence, 0) / totalScans) * 100)
    : 0;

  const stats = [
    {
      icon: <BarChart3 className="h-6 w-6 text-emerald-400" />,
      label: t.totalDetections,
      value: totalScans,
      color: "border-emerald-500/20 bg-emerald-950/10",
    },
    {
      icon: <Heart className="h-6 w-6 text-green-400" />,
      label: t.healthyCount,
      value: healthyCount,
      color: "border-green-500/20 bg-green-950/10",
    },
    {
      icon: <Bug className="h-6 w-6 text-amber-400" />,
      label: t.pestCount,
      value: pestCount,
      color: "border-amber-500/20 bg-amber-950/10",
    },
    {
      icon: <Percent className="h-6 w-6 text-sky-400" />,
      label: t.avgConfidence,
      value: `${averageConfidence}%`,
      color: "border-sky-500/20 bg-sky-950/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{t.dashboardTitle}</h1>
          <p className="text-emerald-100/50 text-sm sm:text-base">{t.dashboardSubtitle}</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-500/10 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          title="Refresh History"
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`glass-card rounded-2xl p-5 border flex flex-col justify-between cursor-default ${stat.color}`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-emerald-100/50 text-xs sm:text-sm font-semibold truncate pr-2">
                {stat.label}
              </span>
              <div className="shrink-0">{stat.icon}</div>
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* History Log Section */}
      <div className="bg-emerald-950/5 rounded-3xl p-6 border border-emerald-500/5">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{t.historyTable}</h2>
          <p className="text-emerald-100/40 text-xs sm:text-sm">{t.historyDesc}</p>
        </div>

        <HistoryTable
          lang={lang}
          history={history}
          onClearHistory={onClearHistory}
        />
      </div>
    </div>
  );
};
