/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import { Hero, Explainer } from "./components/Hero";
import { StatsSection } from "./components/Stats";
import { ChartsSection } from "./components/Charts";
import { SearchPortal } from "./components/SearchPortal";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    // Smooth scroll to results
    const el = document.getElementById("results");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <Hero onSearch={handleSearch} />
      <Explainer onChipClick={handleSearch} />
      
      <div className="bg-gray-50/30">
        <StatsSection />
        <ChartsSection />
      </div>
      
      <div className="bg-white">
        <div id="results" className="max-w-7xl mx-auto px-4 md:px-8 py-12 scroll-mt-24 min-h-[100px]">
           <SearchPortal externalQuery={searchQuery} />
        </div>
      </div>
    </main>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

