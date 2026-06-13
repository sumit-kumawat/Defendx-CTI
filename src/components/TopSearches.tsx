import { motion } from "motion/react";
import { VendorIcon } from "./BrandLogos";

const brands = [
  { name: "Microsoft", color: "text-[#00a4ef] group-hover:text-white" },
  { name: "Apache", color: "text-[#d22128] group-hover:text-white" },
  { name: "Fortinet", color: "text-[#ee3124] group-hover:text-white" },
  { name: "Cisco", color: "text-[#00bceb] group-hover:text-white" },
  { name: "PostgreSQL", color: "text-[#336791] group-hover:text-white" },
  { name: "Citrix", color: "text-[#0090da] group-hover:text-white" },
  { name: "Red Hat", color: "text-[#ee0000] group-hover:text-white" },
  { name: "MacOS", color: "text-[#1a1a1a] group-hover:text-white" },
  { name: "Mobile Android", color: "text-[#3ddc84] group-hover:text-white" },
  { name: "Zoom", color: "text-[#2d8cff] group-hover:text-white" },
  { name: "Docker Desktop", color: "text-[#2496ed] group-hover:text-white" },
  { name: "Google Chrome", color: "text-[#4285f4] group-hover:text-white" },
];

export const TopSearches = ({ onBrandClick }: { onBrandClick: (q: string) => void }) => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-10">
         <div className="w-1.5 h-6 bg-[#138808] rounded-[10px]" />
         <h2 className="text-xl font-bold text-gray-900 pr-2 border-r border-gray-100 uppercase tracking-tight">Vulnerability Hotspots</h2>
         <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Target Platforms</span>
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
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-[10px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] group hover:border-primary/20 hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {/* Logo container with explicit 10px round corner */}
            <div className="p-3 rounded-[10px] bg-gray-50 group-hover:bg-[#121620] group-hover:text-white transition-colors flex items-center justify-center w-12 h-12">
              <VendorIcon name={brand.name} className={`w-6 h-6 ${brand.color} transition-colors`} />
            </div>
            <span className="font-extrabold text-gray-700 text-[10px] uppercase tracking-widest text-center group-hover:text-primary transition-colors">
              {brand.name === "Mobile Android" ? "Android" : brand.name === "Docker Desktop" ? "Docker" : brand.name}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};
