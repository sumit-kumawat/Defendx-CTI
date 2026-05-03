import { Search, Globe, Linkedin, Github, MessageSquare, Twitter, Cpu, Layout, HelpCircle, BookOpen, ExternalLink } from "lucide-react";

import { ShieldCheck } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src="https://cdn.defendx.io/files/logo/light.svg" alt="Defendx" className="h-12" />
          </button>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest border-r border-gray-100 pr-6 mr-2">
             <div className="flex flex-col h-3 w-6 gap-0.5">
               <div className="h-1 bg-[#FF9933] w-full rounded-t-sm"></div>
               <div className="h-1 bg-white w-full border-y border-gray-100"></div>
               <div className="h-1 bg-[#138808] w-full rounded-b-sm"></div>
             </div>
             Security Tier: Active
           </div>
           <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-xs font-bold text-gray-600">
             <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
             Verified Defense Node
           </div>
        </div>
      </div>
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="https://cdn.defendx.io/files/logo/light.svg" alt="Defendx" className="h-8 brightness-0 invert" />
        </div>
        <p className="text-sm text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
          Production-ready Cyber Threat Intelligence platform. Real-time monitoring, 
          automated analysis, and vulnerability management.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-12">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Compliance</a>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-6">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            © 2026 Defendx | Unified XDR and SIEM
          </div>
          <a 
            href="https://www.conzex.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <div className="h-0.5 w-48 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mb-2 opacity-50 group-hover:opacity-100 transition-opacity mx-auto"></div>
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 group-hover:text-white transition-colors">
              A Conzex Global Product
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};
