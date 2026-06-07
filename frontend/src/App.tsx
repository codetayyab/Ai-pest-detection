import { useState, useEffect } from 'react';
import axios from 'axios';
import { Language } from './translations';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Detect } from './pages/Detect';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

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

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [lang, setLang] = useState<Language>('en');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Get API URL from environment variables, check multiple fallbacks
  const getApiUrl = () => {
    const envUrl = (import.meta.env.VITE_API_URL) || 
                   (import.meta.env.NEXT_PUBLIC_API_URL) ||
                   "http://localhost:8000";
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  };

  // Fetch History from FastAPI Backend
  const fetchHistory = async () => {
    setIsRefreshing(true);
    try {
      const apiUrl = getApiUrl();
      const response = await axios.get(`${apiUrl}/history`);
      setHistory(response.data);
    } catch (error) {
      console.warn("Failed to fetch history. Backend might be offline.", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Clear History in FastAPI Backend
  const clearHistory = async () => {
    try {
      const apiUrl = getApiUrl();
      await axios.delete(`${apiUrl}/history`);
      setHistory([]);
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Simple Router based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home lang={lang} setCurrentPage={setCurrentPage} />;
      case 'detect':
        return <Detect lang={lang} onNewScan={fetchHistory} />;
      case 'dashboard':
        return (
          <Dashboard
            lang={lang}
            history={history}
            onClearHistory={clearHistory}
            onRefresh={fetchHistory}
            isRefreshing={isRefreshing}
          />
        );
      case 'about':
        return <About lang={lang} />;
      case 'contact':
        return <Contact lang={lang} />;
      default:
        return <Home lang={lang} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070e06] text-emerald-100 relative overflow-x-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-green-500/5 blur-[150px] pointer-events-none -z-10"></div>

      {/* Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Page Area */}
      <main className="flex-grow flex flex-col justify-start">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}

export default App;
