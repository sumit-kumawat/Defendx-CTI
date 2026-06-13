import { useState, useEffect } from "react";
import axios from "axios";
import { ShieldAlert, Database, Users, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export const StatsSection = () => {
  const data = {
    cveCount: "6,049",
    productCount: "2,722",
    affectedCount: "202,641",
  };

  const statsList = [
    { label: "CVEs", value: data.cveCount, icon: ShieldAlert, color: "bg-blue-500" },
    { label: "Products", value: data.productCount, icon: Database, color: "bg-blue-600" },
    { label: "Affected", value: data.affectedCount, icon: Users, color: "bg-blue-700" },
  ];

  return (
    <section className="bg-white py-16 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight uppercase">Global <span className="text-primary italic">Intelligence Node</span></h2>
          <div className="flex h-1 w-32 gap-1 mt-3 mb-3">
            <div className="bg-primary w-2/3 rounded-full"></div>
            <div className="bg-blue-300 w-1/3 rounded-full"></div>
          </div>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.3em]">Advanced Cyber Threat Intelligence</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statsList.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="premium-3d-card p-8 flex items-center gap-6 relative overflow-hidden group/stat"
          >
            {/* Interactive glowing left border under hover conditions */}
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-primary opacity-0 group-hover/stat:opacity-100 transition-opacity" />

            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 group-hover/stat:[transform:translateZ(15px)] transition-transform duration-300`}>
               <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1 group-hover/stat:text-primary transition-colors">{stat.value}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">{stat.label} Monitoring</div>
              <div className="flex h-0.5 w-12 gap-0.5 mt-2.5 opacity-60">
                <div className="bg-primary w-2/3 rounded-full"></div>
                <div className="bg-blue-300 w-1/3 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
};
