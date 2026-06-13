import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import { Hero, Explainer } from "./components/Hero";
import { StatsSection } from "./components/Stats";
import { ChartsSection } from "./components/Charts";
import { SearchPortal } from "./components/SearchPortal";
import { TopSearches } from "./components/TopSearches";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setActiveTab("explorer");
    // Scroll smoothly to top of results on search trigger
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow">
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-300">
            <Hero onSearch={handleSearch} />
            <Explainer onChipClick={handleSearch} />
            
            <div className="bg-gray-50/30">
              <StatsSection />
              <ChartsSection />
            </div>
          </div>
        )}

        {activeTab === "explorer" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-in fade-in duration-300">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Threat Intelligence Explorer</h2>
              <div className="flex h-1 w-24 gap-0.5 mt-2 mb-2 justify-center md:justify-start">
                <div className="bg-primary w-full rounded-full"></div>
                <div className="bg-blue-300 w-full rounded-full"></div>
              </div>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mt-1">
                Query global threat intelligence feeds and lookup indicators of compromise (IOCs)
              </p>
            </div>
            
            <SearchPortal externalQuery={searchQuery} />
          </div>
        )}

        {activeTab === "hotspots" && (
          <div className="animate-in fade-in duration-300">
            <TopSearches onBrandClick={handleSearch} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
