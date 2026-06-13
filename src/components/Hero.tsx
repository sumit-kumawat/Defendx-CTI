import { useState } from "react";
import { Search, ChevronDown, Calendar, AlertTriangle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { LinuxLogo, AppleLogo, WindowsLogo } from "./BrandLogos";

export const Hero = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [val, setVal] = useState("");
  
  return (
    <section className="bg-[#0a0a0a] py-16 relative overflow-hidden border-b border-white/5">
      {/* Dynamic background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(32,69,180,0.12),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-4 opacity-45">Secure Search Gateway</h2>
          <div className="flex justify-center gap-1 mb-2">
             <div className="w-24 h-1 bg-primary rounded-full opacity-80"></div>
             <div className="w-12 h-1 bg-blue-400 rounded-full opacity-80"></div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSearch(val); }} className="relative w-full">
          <div className="p-[3px] rounded-2xl moving-rainbow-border shadow-[0_15px_40px_rgba(0,0,0,0.25)] transition-all hover:scale-[1.002] duration-300 mb-6">
            <div className="relative bg-white rounded-[10px] flex items-center overflow-hidden">
              <input 
                type="text" 
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="Search CVE, IP Address, Domain, URL, or File Hash..." 
                className="w-full bg-transparent h-16 pl-8 pr-44 text-lg focus:outline-none placeholder:text-gray-400 font-semibold text-gray-900"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 px-8 bg-[#121620] hover:bg-black text-white rounded-xl transition-all active:scale-[0.98] flex items-center gap-2 group premium-3d-interactive cursor-pointer">
                <Search className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
                <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Search Intel</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "Min CVSS Severity", options: ["Low", "Medium", "High", "Critical"] },
              { label: "Timeline range", options: ["Past 24 Hours", "Past 7 Days", "Past 30 Days", "Past Year"] },
              { label: "Distribution Sort", options: ["Publication Date", "Score Magnitude", "Threat Relevance"] }
            ].map((filter) => (
              <div key={filter.label} className="relative group">
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      onSearch(e.target.value);
                    }
                  }}
                  defaultValue=""
                  className="w-full appearance-none bg-white/5 border border-white/10 h-13 pl-5 pr-12 rounded-xl text-white/70 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 hover:text-white transition-all cursor-pointer outline-none focus:border-white/30"
                >
                  <option className="text-black bg-white" value="">{filter.label}</option>
                  {filter.options.map(opt => <option key={opt} value={opt} className="text-black bg-white">{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-hover:text-white/60 pointer-events-none transition-colors" />
              </div>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
};

export const Explainer = ({ onChipClick }: { onChipClick: (q: string) => void }) => {
  const chips = [
    { label: "Linux", logoComponent: LinuxLogo, logoColor: "text-gray-900 group-hover:text-primary", query: "linux vulnerability" },
    { label: "MacOS", logoComponent: AppleLogo, logoColor: "text-gray-950 group-hover:text-primary", query: "macos threat" },
    { label: "Windows", logoComponent: WindowsLogo, logoColor: "text-[#00a4ef] group-hover:text-primary", query: "windows cve" },
    { label: "Published last week", icon: Calendar, color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50", query: "last_week" },
    { label: "Latest critical severity", icon: AlertTriangle, color: "bg-red-50 text-red-600 border-red-100 hover:bg-red-100/50", query: "critical" },
    { label: "Latest high severity", icon: AlertCircle, color: "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100/50", query: "high" },
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
      <div className="flex-1">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">
             Global Intelligence Node
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
            Advanced Cyber Threat <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg font-medium">
            Production-ready Cyber Threat Intelligence platform. Real-time monitoring, 
            automated analysis, and vulnerability management. Unified XDR and SIEM solution for enterprise security.
          </p>
        </motion.div>
      </div>
      <div className="w-full lg:w-96 shrink-0">
        {/* OS category chips */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {chips.slice(0, 3).map((chip) => {
            const Logo = chip.logoComponent!;
            return (
              <button 
                key={chip.label} 
                onClick={() => onChipClick(chip.query)}
                className="bg-white h-20 rounded-xl flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold uppercase transition-all group border border-gray-100 shadow-sm hover:border-primary active:scale-95 px-2 cursor-pointer"
              >
                <Logo className={`w-6 h-6 object-contain ${chip.logoColor} transition-colors duration-300`} />
                {chip.label}
              </button>
            );
          })}
        </div>
        {/* Alert category chips */}
        <div className="flex flex-col gap-2">
          {chips.slice(3).map((chip) => {
            const Icon = chip.icon!;
            return (
              <button 
                key={chip.label} 
                onClick={() => onChipClick(chip.query)}
                className={`${chip.color || 'bg-white text-gray-600'} h-12 rounded-xl px-5 flex items-center justify-between text-xs font-bold border border-gray-100 shadow-sm transition-all active:scale-[0.98] group cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 opacity-70 group-hover:scale-110 transition-transform" />
                  {chip.label}
                </div>
                <ChevronDown className="-rotate-90 w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
