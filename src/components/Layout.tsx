import React from "react";
import { BarChart3, Search, Target, Shield, ShieldCheck, ExternalLink } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Sleek inline logo */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center group transition-all select-none cursor-pointer"
          >
            <img 
              src="https://xdrive.conzex.com/api/files/public/b8dad769-8a2a-4aa6-a1c6-96ec70a81158/light.svg" 
              alt="Defendx Logo" 
              className="h-10 w-auto object-contain transition-transform group-hover:scale-102" 
            />
          </button>
        </div>

        {/* Console navigation tabs */}
        <nav className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 p-1.5 rounded-xl shadow-inner shrink-0">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "explorer", label: "Threat Explorer", icon: Search },
            { id: "hotspots", label: "Target Hotspots", icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-[#121620] text-white shadow-lg scale-[1.02]" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Security Tier status badge */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            Security: Active
          </div>
          <div className="flex flex-col h-1 w-6 gap-0.5 opacity-60">
            <div className="h-0.5 bg-primary w-full rounded-full"></div>
            <div className="h-0.5 bg-blue-300 w-full rounded-full"></div>
          </div>
        </div>

      </div>
    </header>
  );
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#0a0a0a] text-white py-20 border-t border-white/5 relative overflow-hidden">
      {/* Dynamic background accent gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(32,69,180,0.1),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        
        {/* Shield Icon in footer */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src="https://xdrive.conzex.com/api/files/public/8823c722-4280-464a-ac2e-76cb0963cf43/full-dark.svg" 
            alt="Defendx Logo" 
            className="h-14 w-auto object-contain opacity-90 transition-opacity hover:opacity-100" 
          />
        </div>
        
        <p className="text-sm text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Unified Cyber Threat Intelligence platform providing real-time monitoring, 
          automated analysis, and vulnerability management. Enterprise-grade XDR and SIEM solutions for mission-critical security operations.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-16">
          <a href="https://policies.defendx.io/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="https://policies.defendx.io/terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="https://policies.defendx.io/technologies" className="hover:text-white transition-colors">Compliance</a>
          <a href="https://docs.defendx.io/" className="hover:text-white transition-colors">Documentation</a>
          <a href="https://policies.defendx.io/faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col items-center gap-8">
          <div className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">
            © {currentYear} Defendx | Unified XDR & SIEM
          </div>
          <a 
            href="https://cti.defendx.io" 
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="flex h-0.5 w-48 mb-2.5 opacity-30 group-hover:opacity-100 transition-opacity mx-auto gap-0.5">
              <div className="h-full bg-[#FF9933] w-full rounded-full"></div>
              <div className="h-full bg-white w-full rounded-full"></div>
              <div className="h-full bg-[#138808] w-full rounded-full"></div>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-500 group-hover:text-white transition-colors">
              A Conzex Global Product
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};
