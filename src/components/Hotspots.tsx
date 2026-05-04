import { motion } from "motion/react";
import { Activity, Target } from "lucide-react";

const hotspots = [
  { name: "Microsoft", icon: "https://cdn.defendx.io/files/icon/windows.png", query: "Microsoft" },
  { name: "Apache", icon: "https://cdn.defendx.io/files/icon/apache.png", query: "Apache" },
  { name: "Fortinet", icon: "https://cdn.defendx.io/files/icon/fortinet.png", query: "Fortinet" },
  { name: "Cisco", icon: "https://cdn.defendx.io/files/icon/cisco.png", query: "Cisco" },
  { name: "PostgreSQL", icon: "https://cdn.defendx.io/files/icon/pgsql.png", query: "PostgreSQL" },
  { name: "Citrix", icon: "https://cdn.defendx.io/files/icon/citrix.png", query: "Citrix" },
  { name: "Red Hat", icon: "https://cdn.defendx.io/files/icon/redhat.png", query: "Red Hat" },
  { name: "MacOS", icon: "https://cdn.defendx.io/files/icon/macos.png", query: "MacOS" },
  { name: "Mobile Android", icon: "https://cdn.defendx.io/files/icon/android.png", query: "Android" },
  { name: "Zoom", icon: "https://cdn.defendx.io/files/icon/zoom.png", query: "Zoom" },
  { name: "Docker Desktop", icon: "https://cdn.defendx.io/files/icon/docker.png", query: "Docker" },
  { name: "Google Chrome", icon: "https://cdn.defendx.io/files/icon/chrome.png", query: "Chrome" },
];

export const Hotspots = ({ onSelect }: { onSelect: (query: string) => void }) => {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Threat Hotspots</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Threat <span className="italic text-primary">Hotspots</span></h2>
            <div className="flex gap-1.5 mt-2 mb-4">
               <div className="h-1 w-8 bg-[#FF9933] rounded-full"></div>
               <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
               <div className="h-1 w-8 bg-[#138808] rounded-full"></div>
            </div>
            <p className="text-gray-500 mt-4 max-w-xl font-medium">
              Hotspots Intel Vectors providing high-priority monitoring for distributed systems and core infrastructure.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-gray-50 rounded-xl border border-gray-100">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-emerald-600">Active Intel Distribution</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {hotspots.map((h, i) => (
            <motion.button
              key={h.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(h.query)}
              className="group relative flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-xl transition-all hover:border-primary/20 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 mb-6 relative">
                 <img 
                    src={h.icon} 
                    alt={h.name} 
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
                 />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors text-center">
                {h.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
