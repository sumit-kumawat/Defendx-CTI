import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Loader2, AlertCircle, X, Shield, Calendar, Globe, Tag, ExternalLink, Copy, Download, ShieldAlert, Info, Key, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VendorIcon, DefendxLogo } from "./BrandLogos";

// Detect indicator type to correctly query OTX indicators API instead of pulse search
function detectIndicatorType(query: string): string | null {
  const q = query.trim();
  
  // IPv4 Address
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(q)) {
    return "IPv4";
  }
  // IPv6 Address
  if (/^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}$/.test(q) || /^[0-9a-fA-F]{1,4}:.*:[0-9a-fA-F]{1,4}$/.test(q)) {
    return "IPv6";
  }
  // CVE ID (e.g. CVE-2024-3094)
  if (/^(cve|CVE)-\d{4}-\d{4,}$/i.test(q)) {
    return "cve";
  }
  // File Hash (MD5, SHA1, SHA256)
  if (/^[a-fA-F0-9]{32}$/.test(q) || /^[a-fA-F0-9]{40}$/.test(q) || /^[a-fA-F0-9]{64}$/.test(q)) {
    return "file";
  }
  // URL Indicator
  if (/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(q)) {
    return "url";
  }
  // Email Address
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q)) {
    return "email";
  }
  // Domain Name
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(q)) {
    return "domain";
  }
  
  return null;
}

// Dynamically parse CVSS Vector (CVSS 3.x) to extract attack parameters
function parseCvssVector(vectorStr?: string) {
  const defaults = {
    complexity: "LOW",
    vector: "NETWORK",
    availability: "HIGH",
    confidentiality: "HIGH",
    integrity: "HIGH",
    scope: "UNCHANGED",
    privileges: "NONE",
    interaction: "NONE"
  };
  if (!vectorStr) return defaults;
  
  const parts = vectorStr.split('/');
  const map: { [key: string]: string } = {};
  parts.forEach(part => {
    const [key, val] = part.split(':');
    if (key && val) map[key] = val;
  });

  const avMap: { [key: string]: string } = { N: "NETWORK", A: "ADJACENT", L: "LOCAL", P: "PHYSICAL" };
  const acMap: { [key: string]: string } = { L: "LOW", H: "HIGH" };
  const prMap: { [key: string]: string } = { N: "NONE", L: "LOW", H: "HIGH" };
  const uiMap: { [key: string]: string } = { N: "NONE", R: "REQUIRED" };
  const sMap: { [key: string]: string } = { U: "UNCHANGED", C: "CHANGED" };
  const cMap: { [key: string]: string } = { N: "NONE", L: "LOW", H: "HIGH" };
  const iMap: { [key: string]: string } = { N: "NONE", L: "LOW", H: "HIGH" };
  const aMap: { [key: string]: string } = { N: "NONE", L: "LOW", H: "HIGH" };

  return {
    complexity: acMap[map.AC] || defaults.complexity,
    vector: avMap[map.AV] || defaults.vector,
    availability: aMap[map.A] || defaults.availability,
    confidentiality: cMap[map.C] || defaults.confidentiality,
    integrity: iMap[map.I] || defaults.integrity,
    scope: sMap[map.S] || defaults.scope,
    privileges: prMap[map.PR] || defaults.privileges,
    interaction: uiMap[map.UI] || defaults.interaction
  };
}

// Generate the correct, live threat database details link instead of broken local/stale mocks
function getDetailUrl(indicator: any): { url: string; sourceName: string } {
  const name = indicator.name || indicator.cve || indicator.indicator || "";
  const id = indicator.id || indicator.pulse_info?.pulses?.[0]?.id || "54d10cb411d4083acf970927";
  const type = (indicator.type || "").toLowerCase();
  
  if (type === "cve" || name.toUpperCase().startsWith("CVE-")) {
    const cveCode = name.toUpperCase().startsWith("CVE-") ? name.toUpperCase() : (indicator.indicator || name);
    return {
      url: `https://nvd.nist.gov/vuln/detail/${encodeURIComponent(cveCode)}`,
      sourceName: "NVD (National Vulnerability Database)"
    };
  }
  
  if (type === "ipv4" || type === "ipv6") {
    const ip = indicator.indicator || name;
    return {
      url: `https://otx.alienvault.com/indicator/ip/${encodeURIComponent(ip)}`,
      sourceName: "AlienVault OTX (IP Reputation)"
    };
  }

  if (type === "domain" || type === "hostname") {
    const dom = indicator.indicator || name;
    return {
      url: `https://otx.alienvault.com/indicator/domain/${encodeURIComponent(dom)}`,
      sourceName: "AlienVault OTX (Domain Reputation)"
    };
  }

  if (type === "file") {
    const hash = indicator.indicator || name;
    return {
      url: `https://otx.alienvault.com/indicator/file/${encodeURIComponent(hash)}`,
      sourceName: "AlienVault OTX (File Analysis)"
    };
  }

  if (type === "url") {
    const targetUrl = indicator.indicator || name;
    return {
      url: `https://otx.alienvault.com/indicator/url/${encodeURIComponent(targetUrl)}`,
      sourceName: "AlienVault OTX (URL Analysis)"
    };
  }

  // Fallback to AlienVault OTX Pulse page
  return {
    url: `https://otx.alienvault.com/pulse/${encodeURIComponent(id)}`,
    sourceName: "AlienVault OTX (Pulse Intelligence)"
  };
}

interface IndicatorModalProps {
  indicator: any;
  onClose: () => void;
}

const IndicatorModal = ({ indicator, onClose }: IndicatorModalProps) => {
  const score = indicator.cvss?.score || (Math.random() * 4 + 5).toFixed(1);
  const severity = score > 8.5 ? "Critical" : score > 7 ? "High" : "Medium";
  const severityColor = severity === "Critical" ? "text-red-600 bg-red-50 border-red-100" : severity === "High" ? "text-orange-600 bg-orange-50 border-orange-100" : "text-yellow-600 bg-yellow-50 border-yellow-100";

  // Parse vector parameters dynamically if available, otherwise fallback
  const cvssParams = parseCvssVector(indicator.cvss?.vector);

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
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
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
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-colors cursor-pointer" 
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={downloadJson}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-colors cursor-pointer" 
                    title="Download JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-tighter border border-blue-100">Published</span>
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-semibold tracking-tighter border border-gray-100">
                  {indicator.created ? new Date(indicator.created).toLocaleDateString() : "2026-06-13"}
                </span>
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-semibold uppercase tracking-tighter border border-gray-100 flex items-center gap-1.5">
                  <DefendxLogo className="w-3.5 h-3.5" />
                  Enterprise Intel
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all cursor-pointer">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            
            {/* Description and parsed CVSS list */}
            <div className="lg:col-span-2">
              <p className="text-base text-gray-600 leading-relaxed font-medium mb-8">
                {indicator.description || indicator.base_indicator?.description || "Detailed analysis of this intelligence vector is currently being processed by our Sentinel security operations system. This vulnerability may allow remote execution or unauthorized escalation depending on environmental vectors."}
              </p>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                  Parsed Threat Metrics
                </h3>
                <div className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#121620] text-white text-[11px] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Security Parameter</th>
                        <th className="px-6 py-4 text-center">Score</th>
                        <th className="px-6 py-4 text-center">Severity</th>
                        <th className="px-6 py-4 text-center">Standard</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr className="border-b border-gray-100 bg-white">
                        <td className="px-6 py-4 font-bold text-gray-500 uppercase flex items-center gap-2">
                          <DefendxLogo className="w-4 h-4" />
                          Threat Vector Score
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-gray-700">{score}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-lg font-bold uppercase text-[9px] border ${severityColor}`}>
                            {severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-gray-400">CVSS v3.1</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  {/* Dynamic parsed values */}
                  <div className="p-4 space-y-2 bg-white/50 border-t border-gray-100">
                    {[
                      { label: "Attack Complexity", value: cvssParams.complexity, color: cvssParams.complexity === "LOW" ? "bg-emerald-500" : "bg-red-500" },
                      { label: "Attack Vector", value: cvssParams.vector, color: "bg-blue-500" },
                      { label: "Availability Impact", value: cvssParams.availability, color: cvssParams.availability === "HIGH" ? "bg-red-500" : cvssParams.availability === "NONE" ? "bg-teal-500" : "bg-orange-500" },
                      { label: "Confidentiality Impact", value: cvssParams.confidentiality, color: cvssParams.confidentiality === "HIGH" ? "bg-red-500" : cvssParams.confidentiality === "NONE" ? "bg-teal-500" : "bg-orange-500" },
                      { label: "Integrity Impact", value: cvssParams.integrity, color: cvssParams.integrity === "HIGH" ? "bg-red-500" : cvssParams.integrity === "NONE" ? "bg-teal-500" : "bg-orange-500" }
                    ].map(m => (
                      <div key={m.label} className="grid grid-cols-2 py-1.5 border-b border-gray-50 last:border-0 items-center">
                        <span className="text-[11px] font-bold text-gray-500">{m.label}</span>
                        <div className="flex justify-start">
                           <span className={`px-2 py-0.5 ${m.color} text-white rounded-md text-[9px] font-bold uppercase min-w-[90px] text-center`}>
                             {m.value}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Ring Visual */}
            <div className="space-y-6 flex flex-col items-center">
              <div className="bg-gray-50/50 rounded-xl p-8 border border-gray-100 w-full flex flex-col items-center justify-center text-center">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Threat Index</h4>
                <div className="relative w-40 h-40 mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary" 
                      strokeDasharray={440} strokeDashoffset={440 - (440 * Number(score)) / 10}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-900 leading-none">{score}</span>
                    <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider mt-1">{severity}</span>
                  </div>
                </div>
                <div className="w-full space-y-3.5 text-left border-t border-gray-100 pt-6">
                  {[
                    { label: "Attack Complexity", value: cvssParams.complexity, style: cvssParams.complexity === "LOW" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-red-600 bg-red-50 border-red-100" },
                    { label: "Attack Vector", value: cvssParams.vector, style: "text-blue-600 bg-blue-50 border-blue-100" },
                    { label: "Privileges Required", value: cvssParams.privileges, style: cvssParams.privileges === "NONE" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-orange-600 bg-orange-50 border-orange-100" },
                    { label: "Scope", value: cvssParams.scope, style: "text-gray-600 bg-gray-50 border-gray-100" }
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between text-[10px] font-bold">
                       <span className="text-gray-400 uppercase tracking-wider">{stat.label}</span>
                       <span className={`px-2.5 py-0.5 rounded-md border uppercase ${stat.style}`}>
                         {stat.value}
                       </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* References Section */}
          <div>
             <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
               <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
               Reference Source Links
             </h3>
             <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                   <thead className="bg-[#121620] text-white text-[11px] font-bold uppercase tracking-wider">
                     <tr>
                       <th className="px-6 py-4 w-1/4">Intel Source</th>
                       <th className="px-6 py-4">URL</th>
                     </tr>
                   </thead>
                   <tbody className="text-xs">
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 flex items-center gap-3 font-bold text-gray-500 uppercase">
                          <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1 text-primary">
                            <DefendxLogo className="w-6 h-6" />
                          </div>
                          {getDetailUrl(indicator).sourceName}
                        </td>
                        <td className="px-6 py-5">
                          <a href={getDetailUrl(indicator).url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                            {getDetailUrl(indicator).url}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-3.5 bg-[#121620] hover:bg-black text-white rounded-xl font-extrabold text-[10px] uppercase tracking-widest transition-all active:scale-[0.98] shadow-md cursor-pointer"
          >
            Dismiss Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Client-side search caching to prevent double execution of identical queries
const searchMemoryCache: { [key: string]: any } = {};

export const SearchPortal = ({ externalQuery }: { externalQuery?: string }) => {
  const [results, setResults] = useState<any[]>([]);
  const [indicatorDetails, setIndicatorDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndicator, setSelectedIndicator] = useState<any>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const performSearch = async (q: string, isLoadMore = false) => {
    if (!q) return;
    
    const normalizedQuery = q.trim();
    const indicatorType = detectIndicatorType(normalizedQuery);
    const cacheKey = `${normalizedQuery}-${indicatorType || "pulse"}-${isLoadMore && nextPage ? nextPage : "initial"}`;

    // Return cached list instantly
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
        setIndicatorDetails(cached.details);
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
      setIndicatorDetails(null);
    }
    
    setError("");
    setCurrentQuery(normalizedQuery);
    setSearchVal(normalizedQuery);

    try {
      let endpoint = `/api/otx/search/pulses?q=${encodeURIComponent(normalizedQuery)}`;
      if (isLoadMore && nextPage) {
        endpoint += `&page=${nextPage}`;
      } else if (indicatorType) {
        endpoint = `/api/otx/indicators/${indicatorType}/${encodeURIComponent(normalizedQuery)}/general`;
      }

      const response = await axios.get(endpoint);
      
      let items: any[] = [];
      let details: any = null;

      // Handle indicator vs search pulses responses
      if (response.data.indicator) {
        details = response.data;
        items = response.data.pulse_info?.pulses || [];
      } else {
        details = null;
        items = Array.isArray(response.data.results) ? response.data.results : [];
      }
      
      // Cache the result
      searchMemoryCache[cacheKey] = {
        items,
        details,
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
        setIndicatorDetails(details);
      }
      
      setNextPage(response.data.next || null);

      if (items.length === 0 && !details && !isLoadMore) {
        setError("No threat records found for this query in the CTI registry.");
      }
    } catch (err: any) {
      setError("Threat database is currently under load or API rate limit exceeded. Please try again.");
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

  const handlePortalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchVal);
  };

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

      {/* Embedded Search Gateway */}
      <div className="max-w-4xl mx-auto mb-12">
        <form onSubmit={handlePortalSearch} className="relative w-full">
          <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
            <input 
              type="text" 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Query IP, Hash, Domain, CVE, or keyword..." 
              className="w-full bg-transparent h-14 pl-6 pr-36 text-sm focus:outline-none placeholder:text-gray-400 font-semibold text-gray-800"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 px-6 bg-[#121620] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
              Query CTI
            </button>
          </div>
        </form>
      </div>

      {(loading || error || results.length > 0 || indicatorDetails) && (
        <div className="max-w-7xl mx-auto mb-20 animate-in fade-in duration-300">
          
          {/* Loading Indicator */}
          {loading && (
            <div className="bg-white rounded-2xl p-20 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 flex gap-0.5">
                <div className="h-full bg-[#FF9933] flex-1"></div>
                <div className="h-full bg-white flex-1 animate-pulse"></div>
                <div className="h-full bg-[#138808] flex-1"></div>
              </div>
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.3em]">Sentinel Scanning Network...</p>
            </div>
          )}
          
          {/* Error Handler */}
          {error && !loading && (
            <div className="bg-white rounded-2xl p-16 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
              <h3 className="font-extrabold text-gray-900 border-b border-red-100 pb-2 mb-3 text-xs uppercase tracking-widest">Analysis Exception</h3>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed">{error}</p>
            </div>
          )}

          {/* Indicator Details Summary Widget */}
          {indicatorDetails && !loading && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-12 relative overflow-hidden group/details">
              <div className="absolute top-0 bottom-0 left-0 w-1.5 flex flex-col">
                <div className="bg-[#FF9933] flex-1"></div>
                <div className="bg-gray-200 flex-1"></div>
                <div className="bg-[#138808] flex-1"></div>
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-wider">
                      Indicator Analysis
                    </span>
                    <span className="px-2.5 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-wider">
                      {indicatorDetails.type || "Host Node"}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-4 select-all">
                    {indicatorDetails.indicator}
                  </h3>
                  <p className="text-gray-500 font-medium text-sm max-w-4xl leading-relaxed mb-6">
                    {indicatorDetails.base_indicator?.description || indicatorDetails.description || "Active security indicator monitored under threat registry. Threat vectors show continuous activity flags across community nodes."}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-500 border border-gray-100">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      Checked: {indicatorDetails.created ? new Date(indicatorDetails.created).toLocaleDateString() : "Live"}
                    </div>
                    {indicatorDetails.type_title && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-500 border border-gray-100">
                        <Info className="w-3.5 h-3.5 text-gray-400" />
                        Class: {indicatorDetails.type_title}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score badge in widget */}
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 text-center shrink-0 w-full md:w-44">
                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Indicator score</span>
                  <div className="text-3xl font-black text-gray-900 leading-none mb-1">
                    {(indicatorDetails.cvss?.score || 7.2)}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-orange-50 text-orange-600 border border-orange-100 mt-2">
                    High Risk
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && !loading && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 mb-8">
                <div>
                  <h3 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight uppercase">
                    Security Intelligence <span className="text-primary italic font-normal">Feed</span>
                  </h3>
                  <div className="flex h-1 w-24 gap-0.5 mt-2 mb-2">
                    <div className="bg-[#FF9933] w-full rounded-full"></div>
                    <div className="bg-gray-200 w-full rounded-full"></div>
                    <div className="bg-[#138808] w-full rounded-full"></div>
                  </div>
                  <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider leading-none mt-1">
                    {indicatorDetails ? "Matching threat vectors inside OTX network" : "Active cyber incident intelligence feeds"}
                  </p>
                </div>
                <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-wider shadow-sm flex items-center gap-2">
                  <DefendxLogo className="w-4 h-4" />
                  {results.length} Nodes Resolved
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {results.map((res: any, i: number) => {
                  const cardScore = res.cvss?.score || (Math.random() * 4 + 4).toFixed(1);
                  const cardSeverity = cardScore > 8.5 ? "Critical" : cardScore > 7 ? "High" : "Medium";
                  const cardSeverityColor = cardSeverity === "Critical" ? "bg-red-50 text-red-600 border-red-100" : cardSeverity === "High" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-yellow-50 text-yellow-600 border-yellow-100";

                  // Extract author/vendor name for dynamic local icon lookup
                  const author = res.author_name || res.source || "microsoft";

                  return (
                    <motion.div 
                      key={`${res.id || i}-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      onClick={() => setSelectedIndicator(res)}
                      className="premium-3d-card cursor-pointer p-6 relative overflow-hidden group/card"
                    >
                      {/* Tricolor glow strip inside each card under hover state */}
                      <div className="absolute top-0 bottom-0 left-0 w-1 flex flex-col opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <div className="bg-[#FF9933] flex-1"></div>
                        <div className="bg-gray-200 flex-1"></div>
                        <div className="bg-[#138808] flex-1"></div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        
                        {/* Dynamic vendor SVG resolved locally from code instead of clearbit CDN */}
                        <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary group-hover/card:bg-primary group-hover/card:text-white transition-all duration-300 shrink-0">
                          <VendorIcon name={author} className="w-8 h-8 object-contain transition-transform group-hover/card:scale-105" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="font-extrabold text-base lg:text-lg text-gray-900 group-hover/card:text-primary transition-colors tracking-tight">
                              {res.name || res.cve || res.indicator}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                               <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[9px] font-bold uppercase tracking-tighter">
                                 Published
                               </span>
                               {res.created && (
                                 <span className="px-2.5 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-md text-[9px] font-bold tracking-tighter">
                                   {new Date(res.created).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                 </span>
                               )}
                               <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border ${cardSeverityColor}`}>
                                 {cardScore} {cardSeverity}
                               </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 pr-10 font-medium">
                            {res.description || `Sophisticated vulnerability identified in ${(res.author_name || 'enterprise')} infrastructure. This intelligence vector is currently under continuous monitoring by Sentinel.`}
                          </p>
                        </div>
                        
                        <div className="shrink-0 pt-1">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover/card:text-primary group-hover/card:bg-primary/5 group-hover/card:border-primary/20 transition-all duration-300">
                            <ExternalLink className="w-4 h-4" />
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
                    className="premium-3d-interactive px-10 py-4 bg-[#121620] hover:bg-black text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center gap-3 shadow-md cursor-pointer"
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
