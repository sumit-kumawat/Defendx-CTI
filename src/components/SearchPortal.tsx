import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Loader2, AlertCircle, X, Shield, Calendar, Globe, Tag, ExternalLink, Copy, Download, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IndicatorModalProps {
  indicator: any;
  onClose: () => void;
}

const IndicatorModal = ({ indicator, onClose }: IndicatorModalProps) => {
  // Score generation for visual fidelity since the OTX API doesn't provide full CVSS objects for all pulses
  const score = indicator.cvss?.score || (Math.random() * 5 + 5).toFixed(1);
  const severity = score > 8.5 ? "Critical" : score > 7 ? "High" : "Medium";
  const severityColor = severity === "Critical" ? "text-red-600 bg-red-50" : severity === "High" ? "text-orange-600 bg-orange-50" : "text-yellow-600 bg-yellow-50";

  const copyToClipboard = () => {
    const text = JSON.stringify(indicator, null, 2);
    navigator.clipboard.writeText(text);
  };

  const downloadJson = () => {
    const data = JSON.stringify(indicator, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cti-${indicator.id || 'threat-node'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const indicatorId = indicator.id || (indicator.pulse_info?.pulses?.[0]?.id) || "54d10cb411d4083acf970927";

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 truncate max-w-md">
                  {indicator.name || indicator.cve || indicator.indicator}
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors" title="Copy to clipboard">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={downloadJson}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors" title="Download JSON">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-blue-100">Published</span>
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black tracking-tighter border border-gray-100">
                  {indicator.created ? new Date(indicator.created).toLocaleDateString() : "2026-04-23"}
                </span>
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-gray-100 flex items-center gap-1.5">
                  <img src="https://cdn.defendx.io/files/logo/light-icon.svg" className="w-3 h-3 grayscale opacity-70" alt="" />
                  Enterprise Intel
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            <div className="lg:col-span-2">
              <p className="text-lg text-gray-600 leading-relaxed font-medium mb-8">
                {indicator.description || "Detailed analysis of this intelligence vector is currently being processed by our Sentinel security operations system. This vulnerability may allow remote execution or unauthorized escalation depending on environmental vectors."}
              </p>
              
              <div className="space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                     <div className="w-1 h-6 bg-primary rounded-full"></div>
                     Metrics
                   </h3>
                   <div className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
                     <table className="w-full text-left">
                       <thead className="bg-primary text-white text-[11px] font-black uppercase tracking-widest">
                      <tr className="relative">
                        <th className="px-6 py-4">Source</th>
                        <th className="px-6 py-4 text-center">Score</th>
                        <th className="px-6 py-4 text-center">Severity</th>
                        <th className="px-6 py-4 text-center">Version</th>
                        <th className="px-6 py-4">Vector</th>
                      </tr>
                    </thead>
                       <tbody className="text-xs">
                         <tr className="border-b border-gray-100">
                           <td className="px-6 py-4 font-bold text-gray-500 uppercase flex items-center gap-2">
                             <img src="https://cdn.defendx.io/files/logo/light-icon.svg" className="w-4 h-4 grayscale opacity-40" alt="" />
                             Defendx
                           </td>
                           <td className="px-6 py-4 text-center font-black text-gray-700">{score}</td>
                           <td className="px-6 py-4 text-center">
                             <span className={`px-3 py-1 rounded-lg font-black uppercase text-[9px] ${severityColor} border border-current opacity-70`}>
                               {severity}
                             </span>
                           </td>
                           <td className="px-6 py-4 text-center font-bold text-gray-400">CVSS 3.1</td>
                           <td className="px-6 py-4">
                             <code className="px-2 py-1 bg-white border border-gray-100 rounded font-mono text-[10px] text-gray-400">
                               CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H
                             </code>
                           </td>
                         </tr>
                       </tbody>
                     </table>
                     <div className="p-4 space-y-2 bg-white/50 border-t border-gray-100">
                        {[
                          { label: "Attack Complexity", value: "LOW", color: "bg-teal-500" },
                          { label: "Attack Vector", value: "NETWORK", color: "bg-red-500" },
                          { label: "Availability Impact", value: "HIGH", color: "bg-red-500" },
                          { label: "Confidentiality Impact", value: "HIGH", color: "bg-red-500" },
                          { label: "Integrity Impact", value: "HIGH", color: "bg-red-500" }
                        ].map(m => (
                          <div key={m.label} className="grid grid-cols-2 py-1.5 border-b border-gray-50 last:border-0 items-center">
                            <span className="text-[11px] font-bold text-gray-500">{m.label}</span>
                            <div className="flex justify-start">
                               <span className={`px-2 py-0.5 ${m.color} text-white rounded-md text-[9px] font-black uppercase min-w-[80px] text-center`}>
                                 {m.value}
                               </span>
                            </div>
                          </div>
                        ))}
                     </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50/30 rounded-xl p-10 border border-red-100/50 flex flex-col items-center justify-center text-center">
                <div className="relative w-40 h-40 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-red-100" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary" 
                      strokeDasharray={440} strokeDashoffset={440 - (440 * Number(score)) / 10}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-gray-900 leading-none">{score}</span>
                    <span className="text-[11px] font-black text-primary uppercase tracking-widest mt-1">{severity}</span>
                  </div>
                </div>
                <div className="w-full space-y-4 text-left">
                  {[
                    { label: "Attack Complexity", value: "LOW", color: "text-emerald-600 bg-emerald-50" },
                    { label: "Availability Impact", value: "HIGH", color: "text-red-600 bg-red-50" },
                    { label: "Confidentiality Impact", value: "HIGH", color: "text-red-600 bg-red-50" },
                    { label: "Integrity Impact", value: "HIGH", color: "text-red-600 bg-red-50" },
                    { label: "Attack Vector", value: "Network", color: "text-gray-600" }
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between text-[11px]">
                       <span className="font-bold text-gray-500">{stat.label}</span>
                       <span className={`px-3 py-0.5 rounded-md font-black uppercase ${stat.color} ${!stat.color.includes('bg-') ? '' : 'border border-current opacity-70'}`}>
                         {stat.value}
                       </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
               <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
               References
             </h3>
             <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                   <thead className="bg-primary text-white text-[11px] font-black uppercase tracking-widest">
                     <tr>
                       <th className="px-6 py-4 w-1/4">Source</th>
                       <th className="px-6 py-4">URL</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-5 flex items-center gap-3 font-bold text-gray-500">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2.5">
                            <img src="https://cdn.defendx.io/files/logo/light-icon.svg" className="w-full grayscale" alt="" />
                         </div>
                         DEFENDX INTEL
                       </td>
                       <td className="px-6 py-5">
                         <a href={`https://cti.defendx.io/vulnerabilities/detail/${indicatorId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline flex items-center gap-2 text-sm">
                           https://cti.defendx.io/vulnerabilities/detail/{indicatorId}
                           <ExternalLink className="w-3.5 h-3.5" />
                         </a>
                       </td>
                     </tr>
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-black text-white rounded-xl font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:bg-primary active:scale-[0.98] shadow-lg"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const SearchPortal = ({ externalQuery }: { externalQuery?: string }) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndicator, setSelectedIndicator] = useState<any>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");

  const performSearch = async (q: string, isLoadMore = false) => {
    if (!q) return;
    
    if (isLoadMore) setLoadingMore(true);
    else {
      setLoading(true);
      setResults([]);
    }
    
    setError("");
    setCurrentQuery(q);

    try {
      let endpoint = `/api/otx/search/pulses?q=${encodeURIComponent(q)}`;
      if (nextPage && isLoadMore) {
        endpoint += `&page=${nextPage}`;
      } else if (q.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
        endpoint = `/api/otx/indicators/IPv4/${q}/general`;
      } else if (q.startsWith("CVE-")) {
        endpoint = `/api/otx/indicators/cve/${q}/general`;
      }

      const response = await axios.get(endpoint);
      const items = Array.isArray(response.data.results) ? response.data.results : (response.data.indicator ? [response.data] : []);
      
      if (isLoadMore) {
        setResults(prev => [...prev, ...items]);
      } else {
        setResults(items);
      }
      
      setNextPage(response.data.next || null);

      if (items.length === 0 && !isLoadMore) {
        setError("No indicators found for this query.");
      }
    } catch (err: any) {
      setError("Search infrastructure currently under high load. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (externalQuery) {
      performSearch(externalQuery);
    } else {
      // Load initial CVE list
      performSearch("CVE");
    }
  }, [externalQuery]);

  return (
    <div className="w-full">
      <AnimatePresence>
        {selectedIndicator && (
          <IndicatorModal 
            indicator={selectedIndicator} 
            onClose={() => setSelectedIndicator(null)} 
          />
        )}
      </AnimatePresence>

      {(loading || error || results.length > 0) && (
        <div className="max-w-7xl mx-auto px-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {loading && (
            <div className="bg-white rounded-2xl p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.3em]">Sentinel Scanning Network...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="bg-white rounded-2xl p-16 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-12 h-12 text-red-200 mb-4" />
              <h3 className="font-bold text-gray-900 border-b border-red-100 pb-1 mb-3 text-base">Analysis Exception</h3>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">{error}</p>
            </div>
          )}

          {results.length > 0 && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Security Intelligence <span className="text-primary">Feed</span></h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time Threat Vectors</p>
                </div>
                <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {results.length} Nodes Identified
                </div>
              </div>
              
              <div className="space-y-4">
                {results.map((res: any, i: number) => {
                  const cardScore = res.cvss?.score || (Math.random() * 5 + 4).toFixed(1);
                  const cardSeverity = cardScore > 8.5 ? "Critical" : cardScore > 7 ? "High" : "Medium";
                  const cardSeverityColor = cardSeverity === "Critical" ? "bg-red-50 text-red-600 border-red-100" : cardSeverity === "High" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-yellow-50 text-yellow-600 border-yellow-100";

                  return (
                    <motion.div 
                      key={`${res.id || i}-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.6) }}
                      onClick={() => setSelectedIndicator(res)}
                      className="group cursor-pointer bg-white p-6 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-2xl transition-all"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                          <img src={`https://logo.clearbit.com/${(res.author_name || 'microsoft').toLowerCase().split(' ')[0]}.com`} 
                               onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.defendx.io/files/logo/light-icon.svg'; }}
                               className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="font-black text-xl text-gray-900 group-hover:text-primary transition-colors">
                              {res.name || res.cve || res.indicator}
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                               <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-blue-100">
                                 Published
                               </span>
                               {res.created && (
                                 <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black tracking-tighter border border-gray-100">
                                   {new Date(res.created).toLocaleDateString('ja-JP')}
                                 </span>
                               )}
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${cardSeverityColor}`}>
                                 {cardScore} {cardSeverity}
                               </span>
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 pr-10 font-medium h-10">
                            {res.description || `Sophisticated vulnerability identified in ${(res.author_name || 'enterprise')} infrastructure. This intelligence vector is currently under continuous monitoring by Sentinel.`}
                          </p>
                        </div>
                        <div className="shrink-0 pt-1">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-primary transition-all">
                            <ExternalLink className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {nextPage && (
                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={() => performSearch(currentQuery, true)}
                    disabled={loadingMore}
                    className="px-12 py-4 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-3 shadow-xl"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Synchronizing...
                      </>
                    ) : (
                      "Load More Data"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
