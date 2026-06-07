import React, { useState } from 'react';
import { Calendar, AlertCircle, CheckCircle, Download, FileText, Trash2, ArrowUpDown } from 'lucide-react';
import { Language, translations } from '../translations';

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

interface HistoryTableProps {
  lang: Language;
  history: HistoryItem[];
  onClearHistory: () => Promise<void>;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  lang,
  history,
  onClearHistory,
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Urdu Translations mapping for pests
  const urduPests: Record<string, string> = {
    "Aphids": "ایفڈز (سست تیلا)",
    "Spider Mites": "مکڑیاں (سرخ جواں)",
    "Whiteflies": "سفید مکھی",
    "Caterpillars": "کیٹرپلر (سولیاں)",
    "Healthy Plant": "صحت مند پودا"
  };

  const getPestName = (pest: string) => {
    if (lang === 'ur') {
      return urduPests[pest] || pest;
    }
    return pest;
  };

  // Generate and print PDF report for a specific history item
  const handleDownloadReport = (item: HistoryItem) => {
    const isHealthy = item.pest.toLowerCase() === 'healthy plant';
    
    // Create iframe or separate window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to download/print reports.");
      return;
    }

    const reportHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AgriScan AI Diagnostic Report - #${item.id}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #1e293b;
              margin: 40px;
              line-height: 1.6;
            }
            .header {
              border-bottom: 3px solid #16a34a;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo {
              font-size: 28px;
              font-weight: 800;
              color: #15803d;
            }
            .logo span {
              color: #22c55e;
            }
            .badge {
              background-color: #15803d;
              color: white;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .meta-item strong {
              color: #64748b;
              font-size: 12px;
              display: block;
              text-transform: uppercase;
            }
            .meta-item span {
              font-size: 16px;
              font-weight: bold;
            }
            .content-grid {
              display: grid;
              grid-template-columns: 1.2fr 0.8fr;
              gap: 30px;
            }
            .photo-box {
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              padding: 10px;
              text-align: center;
              background-color: #f1f5f9;
            }
            .photo-box img {
              max-width: 100%;
              max-height: 300px;
              border-radius: 4px;
            }
            .diagnosis-box {
              border-left: 5px solid ${isHealthy ? '#22c55e' : '#f59e0b'};
              padding-left: 20px;
              margin-bottom: 30px;
            }
            .diagnosis-box h2 {
              margin-top: 0;
              font-size: 24px;
              color: ${isHealthy ? '#15803d' : '#b45309'};
            }
            .solution-box {
              background-color: #f0fdf4;
              border: 1px solid #bbf7d0;
              padding: 20px;
              border-radius: 8px;
            }
            .solution-box h3 {
              margin-top: 0;
              color: #15803d;
            }
            .footer {
              margin-top: 60px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              font-size: 12px;
              color: #64748b;
              text-align: center;
            }
            .signatures {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
            }
            .sig-line {
              border-top: 1px solid #94a3b8;
              width: 200px;
              text-align: center;
              padding-top: 8px;
              font-size: 12px;
              margin-top: 40px;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Agri<span>Scan</span> AI</div>
            <div class="badge">Crop Diagnostic Report</div>
          </div>
          
          <div class="diagnosis-box">
            <strong>DIAGNOSTIC REPORT FOR:</strong>
            <h2>${item.pest} ${isHealthy ? '(HEALTHY)' : '(INFECTED)'}</h2>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <strong>Diagnostic Timestamp</strong>
              <span>${item.timestamp}</span>
            </div>
            <div class="meta-item">
              <strong>Confidence Score</strong>
              <span>${Math.round(item.confidence * 100)}%</span>
            </div>
            <div class="meta-item">
              <strong>Inspection ID</strong>
              <span>AGRI-${item.id}-${Math.floor(Math.random() * 9000 + 1000)}</span>
            </div>
            <div class="meta-item">
              <strong>Analysis Engine</strong>
              <span>YOLOv8 Object Detection</span>
            </div>
          </div>

          <div class="content-grid">
            <div>
              <div class="solution-box">
                <h3>Treatment Action Plan</h3>
                <p>${item.solution}</p>
              </div>
              
              <div style="margin-top: 20px; font-size: 13px; color: #475569;">
                <strong>Disclaimer:</strong> This diagnostic is generated automatically by an AI machine learning model. For critical crop management decisions, consult a local agricultural extension officer.
              </div>
            </div>
            
            <div class="photo-box">
              <strong>Captured Plant Image</strong>
              <div style="margin-top: 10px;">
                <img src="${item.image}" alt="Plant Diagnostic photo" />
              </div>
            </div>
          </div>

          <div class="signatures">
            <div class="sig-line">AgriScan AI System Seal</div>
            <div class="sig-line">Agricultural Inspector / Officer</div>
          </div>

          <div class="footer">
            Report generated by AgriScan AI Smart Farming Suite. &copy; ${new Date().getFullYear()} AgriScan.
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
  };

  // Filter and Search logic
  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.pest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.solution.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterClass === 'all' || 
                            (filterClass === 'healthy' && item.pest.toLowerCase() === 'healthy plant') ||
                            (filterClass === 'infected' && item.pest.toLowerCase() !== 'healthy plant');
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by timestamp
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="w-full animate-fade-in">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:max-w-sm">
          <input
            type="text"
            placeholder={lang === 'en' ? 'Search records...' : 'ریکارڈز تلاش کریں...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-emerald-950/20 border border-emerald-500/20 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-emerald-500 text-emerald-100 placeholder-emerald-100/30"
          />
          <FileText className="absolute left-3.5 top-3 h-4 w-4 text-emerald-100/30" />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Class filter */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl px-3 py-2 text-sm text-emerald-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">{lang === 'en' ? 'All Classes' : 'تمام اقسام'}</option>
            <option value="healthy">{lang === 'en' ? 'Healthy Only' : 'صرف صحت مند'}</option>
            <option value="infected">{lang === 'en' ? 'Infected Only' : 'صرف بیمار'}</option>
          </select>

          {/* Sort button */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 bg-emerald-950/30 border border-emerald-500/20 rounded-xl px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/10 cursor-pointer"
            title="Sort by date"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>{sortAsc ? 'Oldest First' : 'Newest First'}</span>
          </button>

          {/* Clear history */}
          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(lang === 'en' ? "Are you sure you want to clear all history?" : "کیا آپ واقعی تمام ہسٹری صاف کرنا چاہتے ہیں؟")) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1.5 border border-red-500/30 bg-red-950/25 text-red-400 hover:bg-red-500/10 rounded-xl px-3.5 py-2 text-sm font-semibold ml-auto md:ml-0 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t.clearHistory}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table / Grid list */}
      {filteredHistory.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-emerald-100/40 flex flex-col items-center">
          <Calendar className="h-12 w-12 mb-3 text-emerald-500/30 animate-pulse" />
          <p className="text-sm font-medium">{t.noData}</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border border-emerald-500/10 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-emerald-950/50 border-b border-emerald-500/10 text-emerald-200/80 font-semibold">
                  <th className="px-6 py-4">{t.colImage}</th>
                  <th className="px-6 py-4">{t.colPest}</th>
                  <th className="px-6 py-4">{t.colConfidence}</th>
                  <th className="px-6 py-4">{t.colSolution}</th>
                  <th className="px-6 py-4">{t.colDate}</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/5">
                {filteredHistory.map((item) => {
                  const isHealthy = item.pest.toLowerCase() === 'healthy plant';
                  return (
                    <tr key={item.id} className="hover:bg-emerald-950/10 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative h-12 w-16 bg-slate-900 rounded-lg overflow-hidden border border-emerald-500/10 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt="Scan Thumbnail"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </td>
                      
                      {/* Pest Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          {isHealthy ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                          )}
                          <span className={`font-bold ${isHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {getPestName(item.pest)}
                          </span>
                        </span>
                      </td>
                      
                      {/* Confidence */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {Math.round(item.confidence * 100)}%
                          </span>
                          <div className="w-16 bg-emerald-950 rounded-full h-1.5 overflow-hidden border border-emerald-900/40">
                            <div
                              className={`h-full rounded-full ${
                                isHealthy ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${item.confidence * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Solution preview */}
                      <td className="px-6 py-4 max-w-xs md:max-w-md">
                        <p className="text-emerald-100/70 truncate text-xs" title={item.solution}>
                          {lang === 'ur' && isHealthy
                            ? "آپ کا پودا بالکل صحت مند ہے! باقاعدگی سے پانی دیں اور مناسب دھوپ فراہم کریں۔"
                            : item.solution}
                        </p>
                      </td>
                      
                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-emerald-100/40">
                        {item.timestamp}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDownloadReport(item)}
                          className="flex items-center gap-1 ml-auto px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-500/10 transition-all text-xs font-bold cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
