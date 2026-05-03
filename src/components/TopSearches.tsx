import { Laptop, Terminal, Server, Shield, Database, Github, Chrome, Cloud, Monitor, Layout, Box, Globe } from "lucide-react";
import { motion } from "motion/react";

const brands = [
  { name: "Microsoft", icon: Laptop, color: "text-[#00a4ef]" },
  { name: "Apache", icon: Terminal, color: "text-[#d22128]" },
  { name: "Fortinet", icon: Shield, color: "text-[#ee3124]" },
  { name: "Cisco", icon: Globe, color: "text-[#00bceb]" },
  { name: "PostgreSQL", icon: Database, color: "text-[#336791]" },
  { name: "Citrix", icon: Layout, color: "text-[#000000]" },
  { name: "Red Hat", icon: Server, color: "text-[#ee0000]" },
  { name: "MacOS", icon: Laptop, color: "text-[#1a1a1a]" },
  { name: "Mobile Android", icon: Monitor, color: "text-[#3ddc84]" },
  { name: "Zoom", icon: Cloud, color: "text-[#2d8cff]" },
  { name: "Docker Desktop", icon: Box, color: "text-[#2496ed]" },
  { name: "Google Chrome", icon: Chrome, color: "text-[#4285f4]" },
];

export const TopSearches = ({ onBrandClick }: { onBrandClick: (q: string) => void }) => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-50">
      <div className="flex items-center gap-2 mb-10">
         <div className="w-1.5 h-6 bg-[#138808] rounded-full" />
         <h2 className="text-xl font-bold text-gray-900 pr-2 border-r border-gray-100">Hotspots</h2>
         <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Intel Vectors</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {brands.map((brand, i) => (
          <motion.button
            key={brand.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => onBrandClick(brand.name)}
            transition={{ delay: i * 0.02 }}
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] group hover:border-primary/20 hover:shadow-lg transition-all active:scale-95"
          >
            <div className={`p-3 rounded-lg bg-gray-50 group-hover:bg-primary transition-colors`}>
              <brand.icon className={`w-5 h-5 ${brand.color} group-hover:text-white transition-colors`} />
            </div>
            <span className="font-bold text-gray-600 text-[10px] uppercase tracking-widest text-center">{brand.name}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};
