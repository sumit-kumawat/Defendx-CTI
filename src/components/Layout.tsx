import { Search, Globe, Linkedin, Github, MessageSquare, Twitter, Cpu, Layout, HelpCircle, BookOpen, ExternalLink } from "lucide-react";

import { ShieldCheck } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 group transition-all"
          >
            <div className="relative h-8 w-32">
              <img src="https://cdn.defendx.io/files/logo/light.svg" alt="Defendx" className="h-8 absolute inset-0 object-contain" />
            </div>
          </button>
        </div>
        <div className="flex items-center gap-2">
           <div className="hidden lg:flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               Security Tier: Active
             </div>
           </div>
           <div className="flex flex-col h-1.5 w-8 gap-0.5 ml-4">
             <div className="h-0.5 bg-[#FF9933] w-full rounded-full"></div>
             <div className="h-0.5 bg-gray-200 w-full rounded-full"></div>
             <div className="h-0.5 bg-[#138808] w-full rounded-full"></div>
           </div>
        </div>
      </div>
    </header>
  );
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#0a0a0a] text-white py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-10">
          <img src="https://cdn.defendx.io/files/logo/light.svg" alt="Defendx" className="h-14 brightness-0 invert opacity-90" />
        </div>
        <p className="text-base text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Unified Cyber Threat Intelligence platform providing real-time monitoring, 
          automated analysis, and vulnerability management. Enterprise-grade XDR and SIEM solutions for mission-critical security operations.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-16">
          <a href="https://policies.defendx.io/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="https://policies.defendx.io/terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="https://policies.defendx.io/technologies" className="hover:text-white transition-colors">Compliance</a>
          <a href="https://docs.defendx.io/" className="hover:text-white transition-colors">Documentation</a>
          <a href="https://policies.defendx.io/faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col items-center gap-8">
          <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">
            © {currentYear} Defendx | Unified XDR & SIEM
          </div>
          <a 
            href="https://cti.defendx.io" 
            className="group"
          >
            <div className="flex h-0.5 w-48 mb-2 opacity-50 group-hover:opacity-100 transition-opacity mx-auto gap-0.5">
              <div className="h-full bg-[#FF9933] w-full"></div>
              <div className="h-full bg-white w-full"></div>
              <div className="h-full bg-[#138808] w-full"></div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 group-hover:text-white transition-colors">
              A Conzex Global Product
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};
