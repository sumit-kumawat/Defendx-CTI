import { useState } from "react";
import { Search, ChevronDown, Monitor, Apple, Laptop, Calendar, AlertTriangle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export const Hero = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [val, setVal] = useState("");
  
  return (
    <section className="bg-[#0a0a0a] py-16 relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,92,187,0.12),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-white text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-40">Secure Search Gateway</h2>
          <div className="flex justify-center gap-1.5 mb-2">
             <div className="w-12 h-1 bg-[#FF9933] rounded-full opacity-80"></div>
             <div className="w-12 h-1 bg-white rounded-full opacity-80"></div>
             <div className="w-12 h-1 bg-[#138808] rounded-full opacity-80"></div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSearch(val); }} className="relative max-w-5xl mx-auto">
          <div className="relative group p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/[0.07] mb-6">
            <input 
              type="text" 
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Search..." 
              className="w-full bg-white h-16 pl-8 pr-40 rounded-xl text-lg shadow-inner focus:outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 px-10 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center gap-2 group shadow-lg">
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-black uppercase tracking-[0.2em] text-[10px]">Search</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
            {[
              { label: "Min CVSS Score", options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
              { label: "Min CVSS Severity", options: ["Low", "Medium", "High", "Critical"] },
              { label: "Date", options: ["Within last 2k CVEs", "Within last month", "Within last year"] },
              { label: "Order by", options: ["CVE ID (Descending)", "CVE ID (Ascending)", "Score (Descending)", "Score (Ascending)", "Published Date (Descending)"] }
            ].map((filter) => (
              <div key={filter.label} className="relative group">
                <select 
                  onChange={(e) => onSearch(e.target.value)}
                  defaultValue={filter.label}
                  className="w-full appearance-none bg-white/5 border border-white/10 h-12 pl-4 pr-10 rounded-xl text-white/50 text-[11px] font-bold uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all cursor-pointer outline-none"
                >
                  <option className="text-black" value="">{filter.label}</option>
                  {filter.options.map(opt => <option key={opt} value={opt} className="text-black">{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
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
    { label: "Linux", img: "https://cdn.defendx.io/files/icon/linux.svg", query: "linux vulnerability" },
    { label: "MacOS", img: "https://cdn.defendx.io/files/icon/macbook.png", query: "macos threat" },
    { label: "Windows", img: "https://cdn.defendx.io/files/icon/windows.png", query: "windows cve" },
    { label: "Published last week", icon: Calendar, color: "bg-blue-50 text-blue-600 border-blue-100", query: "last_week" },
    { label: "Latest critical severity", icon: AlertTriangle, color: "bg-red-50 text-red-600 border-red-100", query: "critical" },
    { label: "Latest high severity", icon: AlertCircle, color: "bg-orange-50 text-orange-600 border-orange-100", query: "high" },
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
          <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
            Cyber Threat <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-lg">
            Defendx provides enterprise-grade CTI infrastructure. Monitor global threat indicators, 
            CVE distributions, and real-time vulnerability scoring within a secure cloud-native ecosystem.
          </p>
        </motion.div>
      </div>
      <div className="w-full lg:w-96 shrink-0">
        <div className="grid grid-cols-3 gap-2 mb-2">
          {chips.slice(0, 3).map((chip) => (
            <button 
              key={chip.label} 
              onClick={() => onChipClick(chip.query)}
              className="bg-white h-20 rounded-xl flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold uppercase transition-all group border border-gray-100 shadow-sm hover:border-primary active:scale-95 px-2"
            >
              {chip.img ? (
                <img src={chip.img} alt={chip.label} className="w-6 h-6 object-contain filter group-hover:brightness-110 transition-all" />
              ) : chip.icon && (
                <chip.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              )}
              {chip.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {chips.slice(3).map((chip) => (
            <button 
              key={chip.label} 
              onClick={() => onChipClick(chip.query)}
              className={`${chip.color || 'bg-white text-gray-600'} h-12 rounded-xl px-5 flex items-center justify-between text-xs font-bold border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group`}
            >
              <div className="flex items-center gap-3">
                <chip.icon className="w-4 h-4 opacity-70" />
                {chip.label}
              </div>
              <ChevronDown className="-rotate-90 w-3 h-3 opacity-30 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
