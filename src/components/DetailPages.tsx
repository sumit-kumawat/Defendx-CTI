import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Shield, ShieldAlert, ArrowLeft, ExternalLink, Calendar, User, Copy, Download, Info, Check } from "lucide-react";
import axios from "axios";
import { Header, Footer } from "./Layout";
import { parseCvssVector, getStableScore } from "./SearchPortal";
import { DefendxLogo } from "./BrandLogos";
import { motion, AnimatePresence } from "motion/react";

// Helper component for loading state
const LoadingSkeleton = ({ title }: { title: string }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header activeTab="" setActiveTab={() => {}} />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-32 bg-gray-200 rounded-[10px]" />
          <div className="space-y-3">
            <div className="h-8 w-1/2 bg-gray-200 rounded-[10px]" />
            <div className="h-4 w-1/4 bg-gray-200 rounded-[10px]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-40 bg-gray-200 rounded-[10px]" />
              <div className="h-64 bg-gray-200 rounded-[10px]" />
            </div>
            <div className="h-96 bg-gray-200 rounded-[10px]" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Helper component for error state
const ErrorScreen = ({ message, type }: { message: string; type: string }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header activeTab="" setActiveTab={() => {}} />
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white border border-gray-100 rounded-[10px] p-8 text-center shadow-lg">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Threat Registry Error</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#121620] hover:bg-black text-white rounded-[10px] font-extrabold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Threat Console
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Hook for clipboard state helper
const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
};

// Unified Page layout wrapper
const PageWrapper = ({ children, activeTabRedirect }: { children: React.ReactNode; activeTabRedirect: (tab: string) => void }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header activeTab="" setActiveTab={activeTabRedirect} />
      <main className="flex-grow bg-gray-50/30">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// 1. Pulse Detail Page
export const PulseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pulse, setPulse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { copied, copy } = useClipboard();

  useEffect(() => {
    const fetchPulse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/otx/pulses/${id}`);
        setPulse(response.data);
        setError("");
      } catch (err: any) {
        console.error(err);
        setError("Unable to retrieve details for the specified Threat Pulse. The registry service may be experiencing high load.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPulse();
  }, [id]);

  if (loading) return <LoadingSkeleton title="Loading Pulse Details..." />;
  if (error || !pulse) return <ErrorScreen message={error || "Pulse not found."} type="pulse" />;

  const handleHeaderTab = (tab: string) => {
    navigate("/", { state: { activeTab: tab } });
  };

  const score = pulse.cvss?.score || getStableScore(pulse.name || "pulse-threat");
  const severity = score > 8.5 ? "Critical" : score > 7 ? "High" : "Medium";
  const severityColor = severity === "Critical" ? "text-red-600 bg-red-50 border-red-100" : severity === "High" ? "text-orange-600 bg-orange-50 border-orange-100" : "text-yellow-600 bg-yellow-50 border-yellow-100";
  const cvssParams = parseCvssVector(pulse.cvss?.vector);

  const downloadJson = () => {
    const data = JSON.stringify(pulse, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `defendx-pulse-${pulse.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const indicatorsList = Array.isArray(pulse.indicators) ? pulse.indicators : [];

  return (
    <PageWrapper activeTabRedirect={handleHeaderTab}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest mb-8 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Threat Console
        </button>

        {/* Title / Banner Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-[10px] flex items-center justify-center shrink-0 border border-primary/20 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight max-w-2xl leading-tight">
                  {pulse.name}
                </h1>
                <div className="flex gap-2">
                  <button 
                    onClick={() => copy(JSON.stringify(pulse, null, 2))}
                    className="p-2 hover:bg-gray-100 rounded-[10px] border border-gray-100 text-gray-400 hover:text-primary bg-white transition-colors cursor-pointer" 
                    title="Copy Payload"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={downloadJson}
                    className="p-2 hover:bg-gray-100 rounded-[10px] border border-gray-100 text-gray-400 hover:text-primary bg-white transition-colors cursor-pointer" 
                    title="Download JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 text-[10px] font-bold uppercase tracking-wider">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-[10px] border border-blue-100">Threat Pulse</span>
                <span className="px-3 py-1.5 bg-white text-gray-500 rounded-[10px] border border-gray-100 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {pulse.created ? new Date(pulse.created).toLocaleDateString() : "2026-06-13"}
                </span>
                <span className="px-3 py-1.5 bg-white text-gray-500 rounded-[10px] border border-gray-100 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {pulse.author_name || "Enterprise Intelligence"}
                </span>
                <span className="px-3 py-1.5 bg-white text-gray-500 rounded-[10px] border border-gray-100 flex items-center gap-1.5">
                  <DefendxLogo className="w-3.5 h-3.5" />
                  Defendx Managed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Panel */}
            <div className="bg-white rounded-[10px] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                Executive Threat Summary
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {pulse.description || "Detailed analysis of this security event is continuously catalogued by our internal CTI scanning logic. This pulse aggregates related indicators of compromise matching this specific campaign signature."}
              </p>
            </div>

            {/* Indicators Table Panel */}
            <div className="bg-white rounded-[10px] border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                  Indicators of Compromise (IOCs)
                </h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 font-extrabold text-[10px] uppercase rounded-[10px] tracking-wider">
                  {indicatorsList.length} Entries
                </span>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                {indicatorsList.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#121620] text-white text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Indicator Value</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4 text-right">Reputation Lookup</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-semibold text-gray-700 divide-y divide-gray-100">
                      {indicatorsList.map((ioc: any, index: number) => {
                        const typeLower = (ioc.type || "").toLowerCase();
                        const isCve = typeLower === "cve" || (ioc.indicator || "").toUpperCase().startsWith("CVE-");
                        let path = `/indicator/${typeLower}/${encodeURIComponent(ioc.indicator)}`;
                        if (isCve) {
                          path = `/cve/${encodeURIComponent(ioc.indicator)}`;
                        } else if (typeLower.includes("ip")) {
                          path = `/indicator/ip/${encodeURIComponent(ioc.indicator)}`;
                        } else if (typeLower.includes("domain") || typeLower.includes("host")) {
                          path = `/indicator/domain/${encodeURIComponent(ioc.indicator)}`;
                        } else if (typeLower.includes("file") || typeLower.includes("hash")) {
                          path = `/indicator/file/${encodeURIComponent(ioc.indicator)}`;
                        } else if (typeLower.includes("url")) {
                          path = `/indicator/url/${encodeURIComponent(ioc.indicator)}`;
                        }
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-900 break-all select-all">{ioc.indicator}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-gray-50 border border-gray-100 text-gray-500 rounded-[10px] font-bold text-[9px] uppercase tracking-wider">
                                {ioc.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={ioc.description}>
                              {ioc.description || "No specific tag notes provided."}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link 
                                to={path}
                                className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline hover:text-blue-800"
                              >
                                View CTI Registry
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-10 text-center text-gray-400 font-bold text-xs">
                    No related IOC indicators logged in this pulse.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-8">
            {/* Index circular gauge */}
            <div className="bg-white rounded-[10px] border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Defendx Threat Index</h4>
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-50" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary" 
                    strokeDasharray={440} strokeDashoffset={440 - (440 * Number(score)) / 10}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-gray-900 leading-none">{score}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded-[10px] border ${severityColor}`}>
                    {severity}
                  </span>
                </div>
              </div>
              
              <div className="w-full space-y-3.5 text-left border-t border-gray-100 pt-6">
                {[
                  { label: "Attack Complexity", value: cvssParams.complexity, style: cvssParams.complexity === "LOW" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-red-600 bg-red-50 border-red-100" },
                  { label: "Attack Vector", value: cvssParams.vector, style: "text-blue-600 bg-blue-50 border-blue-100" },
                  { label: "Privileges Required", value: cvssParams.privileges, style: cvssParams.privileges === "NONE" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-orange-600 bg-orange-50 border-orange-100" },
                  { label: "Scope Alignment", value: cvssParams.scope, style: "text-gray-600 bg-gray-50 border-gray-100" }
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between text-[10px] font-bold">
                     <span className="text-gray-400 uppercase tracking-wider">{stat.label}</span>
                     <span className={`px-2.5 py-0.5 rounded-[10px] border uppercase ${stat.style}`}>
                       {stat.value}
                     </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference sources */}
            <div className="bg-white rounded-[10px] border border-gray-100 p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Source Registries</h4>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-[10px] border border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <DefendxLogo className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <div className="text-[10px] font-black text-gray-900 uppercase">AlienVault OTX Reference</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">Public Feed</div>
                    </div>
                  </div>
                  <a 
                    href={`https://otx.alienvault.com/pulse/${pulse.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white border border-gray-100 rounded-[10px] hover:text-primary transition-colors hover:shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

// 2. CVE Detail Page
export const CveDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cve, setCve] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { copied, copy } = useClipboard();

  useEffect(() => {
    const fetchCve = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/otx/indicators/cve/${id}/general`);
        setCve(response.data);
        setError("");
      } catch (err: any) {
        console.error(err);
        setError("Unable to find the requested CVE database record. Please make sure the code represents a valid standard CVE.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCve();
  }, [id]);

  if (loading) return <LoadingSkeleton title="Loading CVE Details..." />;
  if (error || !cve) return <ErrorScreen message={error || "CVE details not found."} type="cve" />;

  const handleHeaderTab = (tab: string) => {
    navigate("/", { state: { activeTab: tab } });
  };

  const score = cve.cvss?.score || getStableScore(cve.indicator || id || "cve-threat");
  const severity = score > 8.5 ? "Critical" : score > 7 ? "High" : "Medium";
  const severityColor = severity === "Critical" ? "text-red-600 bg-red-50 border-red-100" : severity === "High" ? "text-orange-600 bg-orange-50 border-orange-100" : "text-yellow-600 bg-yellow-50 border-yellow-100";
  const cvssParams = parseCvssVector(cve.cvss?.vector);

  const downloadJson = () => {
    const data = JSON.stringify(cve, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `defendx-cve-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const relatedPulses = cve.pulse_info?.pulses || [];

  return (
    <PageWrapper activeTabRedirect={handleHeaderTab}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest mb-8 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Threat Console
        </button>

        {/* Banner Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-[10px] flex items-center justify-center shrink-0 border border-primary/20 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight max-w-2xl leading-tight">
                  Vulnerability Registry: {id}
                </h1>
                <div className="flex gap-2">
                  <button 
                    onClick={() => copy(JSON.stringify(cve, null, 2))}
                    className="p-2 hover:bg-gray-100 rounded-[10px] border border-gray-100 text-gray-400 hover:text-primary bg-white transition-colors cursor-pointer" 
                    title="Copy Payload"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={downloadJson}
                    className="p-2 hover:bg-gray-100 rounded-[10px] border border-gray-100 text-gray-400 hover:text-primary bg-white transition-colors cursor-pointer" 
                    title="Download JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 text-[10px] font-bold uppercase tracking-wider">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-[10px] border border-blue-100">National Vulnerability Database</span>
                <span className="px-3 py-1.5 bg-white text-gray-500 rounded-[10px] border border-gray-100 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  CTI Evaluation Active
                </span>
                <span className="px-3 py-1.5 bg-white text-gray-500 rounded-[10px] border border-gray-100 flex items-center gap-1.5">
                  <DefendxLogo className="w-3.5 h-3.5" />
                  Defendx Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-[10px] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                Vulnerability Overview
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {cve.description || "Detailed analysis of this CVE registry is continuously compiled. Potential exploits targeting this vulnerability might trigger container sandboxing breakouts or unauthorized system control."}
              </p>
            </div>

            {/* Related pulses */}
            <div className="bg-white rounded-[10px] border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                  Associated Threat Pulses
                </h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 font-extrabold text-[10px] uppercase rounded-[10px] tracking-wider">
                  {relatedPulses.length} Pulses
                </span>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                {relatedPulses.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#121620] text-white text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Threat Pulse Campaign</th>
                        <th className="px-6 py-4">Author</th>
                        <th className="px-6 py-4">Created Date</th>
                        <th className="px-6 py-4 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-semibold text-gray-700 divide-y divide-gray-100">
                      {relatedPulses.map((pulse: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-900 break-all select-all">{pulse.name}</td>
                          <td className="px-6 py-4 text-gray-500">{pulse.author_name || "OTX Contributor"}</td>
                          <td className="px-6 py-4 text-gray-400">
                            {pulse.created ? new Date(pulse.created).toLocaleDateString() : "2026-06-13"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link 
                              to={`/pulse/${encodeURIComponent(pulse.id)}`}
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline hover:text-blue-800"
                            >
                              Open Threat Pulse
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-10 text-center text-gray-400 font-bold text-xs">
                    No linked campaigns or active threat pulses logged for this vulnerability.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-8">
            {/* Index circular gauge */}
            <div className="bg-white rounded-[10px] border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Threat Index</h4>
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-50" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary" 
                    strokeDasharray={440} strokeDashoffset={440 - (440 * Number(score)) / 10}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-gray-900 leading-none">{score}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded-[10px] border ${severityColor}`}>
                    {severity}
                  </span>
                </div>
              </div>
              
              <div className="w-full space-y-3.5 text-left border-t border-gray-100 pt-6">
                {[
                  { label: "Attack Complexity", value: cvssParams.complexity, style: cvssParams.complexity === "LOW" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-red-600 bg-red-50 border-red-100" },
                  { label: "Attack Vector", value: cvssParams.vector, style: "text-blue-600 bg-blue-50 border-blue-100" },
                  { label: "Privileges Required", value: cvssParams.privileges, style: cvssParams.privileges === "NONE" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-orange-600 bg-orange-50 border-orange-100" },
                  { label: "Scope Alignment", value: cvssParams.scope, style: "text-gray-600 bg-gray-50 border-gray-100" }
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between text-[10px] font-bold">
                     <span className="text-gray-400 uppercase tracking-wider">{stat.label}</span>
                     <span className={`px-2.5 py-0.5 rounded-[10px] border uppercase ${stat.style}`}>
                       {stat.value}
                     </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference sources */}
            <div className="bg-white rounded-[10px] border border-gray-100 p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">NIST NVD Databases</h4>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-[10px] border border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <DefendxLogo className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <div className="text-[10px] font-black text-gray-900 uppercase">National Vulnerability Database</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">NVD Reference</div>
                    </div>
                  </div>
                  <a 
                    href={`https://nvd.nist.gov/vuln/detail/${id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white border border-gray-100 rounded-[10px] hover:text-primary transition-colors hover:shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

// 3. General Indicator Detail Page (IP, Domain, File, URL)
export const IndicatorDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const type = params.type || "ip";
  const value = params["*"] || "";
  
  const [indicatorData, setIndicatorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { copied, copy } = useClipboard();

  // Normalize indicator category for AlienVault API
  const getOtxType = (t: string, val: string) => {
    const lower = t.toLowerCase();
    if (lower === "ip" || lower === "ipv4" || lower === "ipv6") {
      return val.includes(":") ? "IPv6" : "IPv4";
    }
    return lower;
  };

  const otxType = getOtxType(type, value);

  useEffect(() => {
    const fetchIndicator = async () => {
      try {
        setLoading(true);
        const endpoint = `/api/otx/indicators/${otxType}/${encodeURIComponent(value)}/general`;
        const response = await axios.get(endpoint);
        setIndicatorData(response.data);
        setError("");
      } catch (err: any) {
        console.error(err);
        setError("Unable to find reputation metrics for this indicator. The target value might be outside current tracking ranges.");
      } finally {
        setLoading(false);
      }
    };
    if (value) fetchIndicator();
  }, [otxType, value]);

  if (loading) return <LoadingSkeleton title={`Analyzing ${type.toUpperCase()} Indicator...`} />;
  if (error || !indicatorData) return <ErrorScreen message={error || "Indicator reputation data not found."} type="indicator" />;

  const handleHeaderTab = (tab: string) => {
    navigate("/", { state: { activeTab: tab } });
  };

  const score = indicatorData.cvss?.score || getStableScore(indicatorData.indicator || value || "indicator-threat");
  const severity = score > 8.5 ? "Critical" : score > 7 ? "High" : "Medium";
  const severityColor = severity === "Critical" ? "text-red-600 bg-red-50 border-red-100" : severity === "High" ? "text-orange-600 bg-orange-50 border-orange-100" : "text-yellow-600 bg-yellow-50 border-yellow-100";
  const cvssParams = parseCvssVector(indicatorData.cvss?.vector);

  const downloadJson = () => {
    const data = JSON.stringify(indicatorData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `defendx-${type}-${encodeURIComponent(value)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const relatedPulses = indicatorData.pulse_info?.pulses || [];

  return (
    <PageWrapper activeTabRedirect={handleHeaderTab}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest mb-8 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Threat Console
        </button>

        {/* Banner Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-[10px] flex items-center justify-center shrink-0 border border-primary/20 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight max-w-2xl leading-tight break-all select-all">
                  {value}
                </h1>
                <div className="flex gap-2">
                  <button 
                    onClick={() => copy(JSON.stringify(indicatorData, null, 2))}
                    className="p-2 hover:bg-gray-100 rounded-[10px] border border-gray-100 text-gray-400 hover:text-primary bg-white transition-colors cursor-pointer" 
                    title="Copy Payload"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={downloadJson}
                    className="p-2 hover:bg-gray-100 rounded-[10px] border border-gray-100 text-gray-400 hover:text-primary bg-white transition-colors cursor-pointer" 
                    title="Download JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 text-[10px] font-bold uppercase tracking-wider">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-[10px] border border-blue-100">
                  {type.toUpperCase()} Reputation Node
                </span>
                <span className="px-3 py-1.5 bg-white text-gray-500 rounded-[10px] border border-gray-100 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Active Scanning Cycles
                </span>
                <span className="px-3 py-1.5 bg-white text-gray-500 rounded-[10px] border border-gray-100 flex items-center gap-1.5">
                  <DefendxLogo className="w-3.5 h-3.5" />
                  Defendx Shield Inspected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-[10px] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                Indicator Reputation Evaluation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {indicatorData.description || `This specific node indicator represents an evaluated network entity (${value}) with logged connections to known exploit sets or vulnerability vectors.`}
              </p>
            </div>

            {/* Associated threat pulses */}
            <div className="bg-white rounded-[10px] border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                  Associated Threat Pulses
                </h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 font-extrabold text-[10px] uppercase rounded-[10px] tracking-wider">
                  {relatedPulses.length} Pulses
                </span>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                {relatedPulses.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#121620] text-white text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Threat Pulse Campaign</th>
                        <th className="px-6 py-4">Author</th>
                        <th className="px-6 py-4">Created Date</th>
                        <th className="px-6 py-4 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-semibold text-gray-700 divide-y divide-gray-100">
                      {relatedPulses.map((pulse: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-900 break-all select-all">{pulse.name}</td>
                          <td className="px-6 py-4 text-gray-500">{pulse.author_name || "OTX Contributor"}</td>
                          <td className="px-6 py-4 text-gray-400">
                            {pulse.created ? new Date(pulse.created).toLocaleDateString() : "2026-06-13"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link 
                              to={`/pulse/${encodeURIComponent(pulse.id)}`}
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline hover:text-blue-800"
                            >
                              Open Threat Pulse
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-10 text-center text-gray-400 font-bold text-xs">
                    No threat pulses linked to this specific indicator.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-8">
            {/* Index circular gauge */}
            <div className="bg-white rounded-[10px] border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Threat Index</h4>
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-50" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary" 
                    strokeDasharray={440} strokeDashoffset={440 - (440 * Number(score)) / 10}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-gray-900 leading-none">{score}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded-[10px] border ${severityColor}`}>
                    {severity}
                  </span>
                </div>
              </div>
              
              <div className="w-full space-y-3.5 text-left border-t border-gray-100 pt-6">
                {[
                  { label: "Attack Complexity", value: cvssParams.complexity, style: cvssParams.complexity === "LOW" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-red-600 bg-red-50 border-red-100" },
                  { label: "Attack Vector", value: cvssParams.vector, style: "text-blue-600 bg-blue-50 border-blue-100" },
                  { label: "Privileges Required", value: cvssParams.privileges, style: cvssParams.privileges === "NONE" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-orange-600 bg-orange-50 border-orange-100" },
                  { label: "Scope Alignment", value: cvssParams.scope, style: "text-gray-600 bg-gray-50 border-gray-100" }
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between text-[10px] font-bold">
                     <span className="text-gray-400 uppercase tracking-wider">{stat.label}</span>
                     <span className={`px-2.5 py-0.5 rounded-[10px] border uppercase ${stat.style}`}>
                       {stat.value}
                     </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference sources */}
            <div className="bg-white rounded-[10px] border border-gray-100 p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Threat Database Source</h4>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-[10px] border border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <DefendxLogo className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <div className="text-[10px] font-black text-gray-900 uppercase">AlienVault OTX Reference</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">Public Indicator Feed</div>
                    </div>
                  </div>
                  <a 
                    href={`https://otx.alienvault.com/indicator/${otxType}/${encodeURIComponent(value)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white border border-gray-100 rounded-[10px] hover:text-primary transition-colors hover:shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
