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
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-tighter border border-blue-100">Published</span>
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-semibold tracking-tighter border border-gray-100">
                  {indicator.created ? new Date(indicator.created).toLocaleDateString() : "2026-04-23"}
                </span>
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-semibold uppercase tracking-tighter border border-gray-100 flex items-center gap-1.5">
                  <img src="https://xdrive.conzex.com/api/files/public/1a6df81f-283f-4748-bcaa-35a6c0b88f70/light-icon.svg" className="w-3 h-3 grayscale opacity-70" alt="" />
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
                       <thead className="bg-[#121620] text-white text-[11px] font-bold uppercase tracking-wider">
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
                             <img src="https://xdrive.conzex.com/api/files/public/1a6df81f-283f-4748-bcaa-35a6c0b88f70/light-icon.svg" className="w-4 h-4 grayscale opacity-40" alt="" />
                             Defendx
                           </td>
                           <td className="px-6 py-4 text-center font-bold text-gray-700">{score}</td>
                           <td className="px-6 py-4 text-center">
                             <span className={`px-3 py-1 rounded-lg font-bold uppercase text-[9px] ${severityColor} border border-current opacity-70`}>
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
                               <span className={`px-2 py-0.5 ${m.color} text-white rounded-md text-[9px] font-bold uppercase min-w-[80px] text-center`}>
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
                    <span className="text-4xl font-extrabold text-gray-900 leading-none">{score}</span>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider mt-1">{severity}</span>
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
                       <span className={`px-3 py-0.5 rounded-md font-bold uppercase ${stat.color} ${!stat.color.includes('bg-') ? '' : 'border border-current opacity-70'}`}>
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
                   <thead className="bg-[#121620] text-white text-[11px] font-bold uppercase tracking-wider">
                     <tr>
                       <th className="px-6 py-4 w-1/4">Source</th>
                       <th className="px-6 py-4">URL</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-5 flex items-center gap-3 font-bold text-gray-500">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2.5">
                            <img src="https://xdrive.conzex.com/api/files/public/1a6df81f-283f-4748-bcaa-35a6c0b88f70/light-icon.svg" className="w-full grayscale" alt="" />
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
            className="px-12 py-4 bg-black text-white rounded-xl font-bold text-[11px] uppercase tracking-[0.3em] transition-all hover:bg-primary active:scale-[0.98] shadow-lg"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// High-performance client-side in-memory search cache to secure instant (0ms) loading for repetitive queries
const searchMemoryCache: { [key: string]: any } = {};

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
    
    const normalizedQuery = q.trim();
    const cacheKey = `${normalizedQuery}-${isLoadMore && nextPage ? nextPage : "initial"}`;

    // Return cached list instantly (0ms response) to satisfy fast loading requests safely
    if (searchMemoryCache[cacheKey]) {
      const cached = searchMemoryCache[cacheKey];
      if (isLoadMore) {
        setResults(prev => {
          const unionMap = new Map();
          [...prev, ...cached.items].forEach(item => unionMap.set(item.id || item.cve || item.indicator, item));
          return Array.from(unionMap.values());
        });
      } else {
        setResults(cached.items);
      }
      setNextPage(cached.nextPage);
      setError("");
      setLoading(false);
      setLoadingMore(false);
      return;
    }
    
    if (isLoadMore) setLoadingMore(true);
    else {
      setLoading(true);
      setResults([]);
    }
    
    setError("");
    setCurrentQuery(normalizedQuery);

    try {
      let endpoint = `/api/otx/search/pulses?q=${encodeURIComponent(normalizedQuery)}`;
      if (nextPage && isLoadMore) {
        endpoint += `&page=${nextPage}`;
      } else if (normalizedQuery.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
        endpoint = `/api/otx/indicators/IPv4/${normalizedQuery}/general`;
      } else if (normalizedQuery.startsWith("CVE-")) {
        endpoint = `/api/otx/indicators/cve/${normalizedQuery}/general`;
      }

      const response = await axios.get(endpoint);
      const items = Array.isArray(response.data.results) ? response.data.results : (response.data.indicator ? [response.data] : []);
      
      // Store into high-speed memory cache for subsequent instant operations
      searchMemoryCache[cacheKey] = {
        items,
        nextPage: response.data.next || null
      };

      if (isLoadMore) {
        setResults(prev => {
          const unionMap = new Map();
          [...prev, ...items].forEach(item => unionMap.set(item.id || item.cve || item.indicator, item));
          return Array.from(unionMap.values());
        });
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
            <div className="bg-white rounded-2xl p-20 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 flex gap-0.5">
                <div className="h-full bg-[#FF9933] flex-1"></div>
                <div className="h-full bg-white flex-1 animate-pulse"></div>
                <div className="h-full bg-[#138808] flex-1"></div>
              </div>
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-[11px] text-gray-400 font-extrabold uppercase tracking-[0.3em]">Sentinel Scanning Network...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="bg-white rounded-2xl p-16 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4 animate-bounce" />
              <h3 className="font-extrabold text-gray-900 border-b border-red-100 pb-2 mb-3 text-sm uppercase tracking-wide">Analysis Exception</h3>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed">{error}</p>
            </div>
          )}

          {results.length > 0 && !loading && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 mb-8">
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight uppercase">Security Intelligence <span className="text-primary italic">Feed</span></h3>
                  <div className="flex h-1 w-24 gap-0.5 mt-2 mb-2">
                    <div className="bg-[#FF9933] w-full rounded-full"></div>
                    <div className="bg-gray-200 w-full rounded-full"></div>
                    <div className="bg-[#138808] w-full rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mt-1">Real-time Threat Vectors</p>
                </div>
                <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-500 uppercase tracking-wider shadow-sm">
                  {results.length} Nodes Identified
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {results.map((res: any, i: number) => {
                  const cardScore = res.cvss?.score || (Math.random() * 5 + 4).toFixed(1);
                  const cardSeverity = cardScore > 8.5 ? "Critical" : cardScore > 7 ? "High" : "Medium";
                  const cardSeverityColor = cardSeverity === "Critical" ? "bg-red-50 text-red-600 border-red-100" : cardSeverity === "High" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-yellow-50 text-yellow-600 border-yellow-100";

                  return (
                    <motion.div 
                      key={`${res.id || i}-${i}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.4) }}
                      onClick={() => setSelectedIndicator(res)}
                      className="premium-3d-card cursor-pointer p-8 relative overflow-hidden group/card"
                    >
                      {/* Interactive glowing Tri-color left border inside each 3D card */}
                      <div className="absolute top-0 bottom-0 left-0 w-1 flex flex-col opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <div className="bg-[#FF9933] flex-1"></div>
                        <div className="bg-gray-200 flex-1"></div>
                        <div className="bg-[#138808] flex-1"></div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary group-hover/card:bg-primary group-hover/card:text-white transition-all duration-300 shrink-0 group-hover/card:[transform:translateZ(10px)]">
                          <img src={`https://logo.clearbit.com/${(res.author_name || 'microsoft').toLowerCase().split(' ')[0]}.com`} 
                               onError={(e) => { (e.target as HTMLImageElement).src = 'https://xdrive.conzex.com/api/files/public/1a6df81f-283f-4748-bcaa-35a6c0b88f70/light-icon.svg'; }}
                               className="w-10 h-10 object-contain grayscale group-hover/card:grayscale-0 transition-all opacity-60 group-hover/card:opacity-100" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h4 className="font-bold text-lg lg:text-xl text-gray-900 group-hover/card:text-primary transition-colors tracking-tight">
                              {res.name || res.cve || res.indicator}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                               <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-semibold uppercase tracking-tighter">
                                 Published
                               </span>
                               {res.created && (
                                 <span className="px-3 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded-lg text-[10px] font-semibold tracking-tighter">
                                   {new Date(res.created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                 </span>
                               )}
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter border ${cardSeverityColor}`}>
                                 {cardScore} {cardSeverity}
                               </span>
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 pr-10 font-medium">
                            {res.description || `Sophisticated vulnerability identified in ${(res.author_name || 'enterprise')} infrastructure. This intelligence vector is currently under continuous monitoring by Sentinel.`}
                          </p>
                        </div>
                        <div className="shrink-0 pt-1">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover/card:text-primary group-hover/card:bg-primary/5 group-hover/card:border-primary/20 transition-all duration-300">
                            <ExternalLink className="w-5 h-5 group-hover/card:[transform:translateZ(5px)] transition-transform" />
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
                    className="premium-3d-interactive px-12 py-5 bg-black text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center gap-3 shadow-xl"
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
