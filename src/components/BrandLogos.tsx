import React from "react";
import { Shield, ShieldAlert, Cpu, Terminal, Laptop, Globe, Server, Box, Chrome, Cloud, Database, Layout } from "lucide-react";

// Crisp inline SVG for Apple/macOS
export const AppleLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.57 2.94-1.39z"/>
  </svg>
);

// Crisp inline SVG for Windows/Microsoft
export const WindowsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.95 1.95L24 0v11.55H10.95V1.95zM10.95 12.45H24v11.55l-13.05-1.95v-9.6z"/>
  </svg>
);

// Crisp inline SVG for Linux Tux
export const LinuxLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C11.38 2 10.22 2.5 9.4 3.7c-.8 1.1-.9 2.4-.9 3.2 0 .5.1 1 .2 1.4C7.8 8.8 6.7 9.8 6 11.2c-.7 1.4-.7 3.1-.2 4.6l.3.8-1 .4c-.5.2-1 .6-1.3 1.1-.3.5-.4 1.1-.3 1.7.1.6.4 1.1.9 1.4.5.3 1.1.4 1.7.3h.2c1 .4 2.2.6 3.4.6.4 0 .9 0 1.3-.1 1-.4 2-.8 2.7-1.4.7-.6 1.3-1.4 1.7-2.3h.2c1.2 0 2.4-.2 3.4-.6h.2c.6.1 1.2 0 1.7-.3.5-.3.8-.8.9-1.4.1-.6 0-1.2-.3-1.7-.3-.5-.8-.9-1.3-1.1l-1-.4.3-.8c.5-1.5.5-3.2-.2-4.6-.7-1.4-1.8-2.4-2.7-2.9.1-.4.2-.9.2-1.4 0-.8-.1-2.1-.9-3.2C13.78 2.5 12.62 2 12 2z"/>
  </svg>
);

// Crisp inline SVG for Red Hat
export const RedHatLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm4.5 14.5c-.83.83-2.17.83-3 0l-2-2c-.83-.83-.83-2.17 0-3l2-2c.83-.83 2.17-.83 3 0s.83 2.17 0 3l-2 2c-.83.83-.83 2.17 0 3z"/>
  </svg>
);

// Crisp inline SVG for Debian
export const DebianLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.003 2.002c-5.46 0-9.878 4.385-9.878 9.802 0 3.737 2.115 6.99 5.215 8.657v-2.295c-1.88-1.298-3.118-3.415-3.118-5.836.002-3.923 3.195-7.106 7.126-7.106 3.931 0 7.125 3.183 7.125 7.106 0 1.838-.707 3.518-1.868 4.793-1.077 1.185-2.613 1.957-4.331 1.957-2.316 0-4.2-1.748-4.2-3.896 0-.829.274-1.602.738-2.227 1.341-1.808 3.841-2.186 5.568-.842.348.271.631.62.83.992l1.642-.942c-.394-.748-.962-1.391-1.656-1.867-2.695-1.854-6.388-1.127-8.22 1.637-.678.918-1.066 2.052-1.066 3.247 0 3.514 2.977 6.376 6.622 6.376 3.645 0 6.623-2.862 6.623-6.376.002-5.417-4.416-9.802-9.802-9.802z"/>
  </svg>
);

// Crisp inline SVG for Docker
export const DockerLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.962 10.638h-1.503a.263.263 0 0 1-.263-.263v-1.503c0-.145.118-.263.263-.263h1.503c.145 0 .263.118.263.263v1.503a.263.263 0 0 1-.263.263zm-2.038 0H10.42a.263.263 0 0 1-.263-.263v-1.503c0-.145.118-.263.263-.263h1.503c.145 0 .263.118.263.263v1.503a.263.263 0 0 1-.263.263zm-2.037 0H8.384a.263.263 0 0 1-.263-.263v-1.503c0-.145.118-.263.263-.263h1.503c.145 0 .263.118.263.263v1.503a.263.263 0 0 1-.263.263zm-2.038 0H6.347a.263.263 0 0 1-.263-.263v-1.503c0-.145.118-.263.263-.263h1.503c.145 0 .263.118.263.263v1.503a.263.263 0 0 1-.263.263zm6.113-2.038h-1.503a.263.263 0 0 1-.263-.263V6.834c0-.145.118-.263.263-.263h1.503c.145 0 .263.118.263.263V8.34a.263.263 0 0 1-.263.263zm-2.038 0H10.42a.263.263 0 0 1-.263-.263V6.834c0-.145.118-.263.263-.263h1.503c.145 0 .263.118.263.263V8.34a.263.263 0 0 1-.263.263zm-2.037 0H8.384a.263.263 0 0 1-.263-.263V6.834c0-.145.118-.263.263-.263h1.503c.145 0 .263.118.263.263V8.34a.263.263 0 0 1-.263.263zm4.075-2.037h-1.503a.263.263 0 0 1-.263-.263V4.797c0-.145.118-.263.263-.263h1.503c.145 0 .263.118.263.263v1.503a.263.263 0 0 1-.263.263zm2.038 4.075h-1.503a.263.263 0 0 1-.263-.263v-1.503c0-.145.118-.263.263-.263h1.503c.145 0 .263.118.263.263v1.503a.263.263 0 0 1-.263.263zm8.016.915a13.36 13.36 0 0 1-4.708 3.518c-.732.338-1.545.515-2.362.515h-.265c-.18.001-.36.006-.54.014-1.282.064-2.52.417-3.642 1.025a1.867 1.867 0 0 1-1.077.202 1.48 1.48 0 0 1-.82-.361 2.222 2.222 0 0 1-.587-1.127 15.342 15.342 0 0 1-.418-2.617c-.035-.55-.078-1.155-.262-1.7-.102-.3-.266-.583-.482-.82a1.97 1.97 0 0 0-.806-.523c-1.408-.508-2.909-.232-4.148.74-.086.067-.217-.008-.184-.11a7.712 7.712 0 0 1 2.193-3.646c.866-.826 2.016-1.31 3.23-1.36h11.23c.31 0 .614.075.892.217a1.69 1.69 0 0 1 .746.852 11.283 11.283 0 0 1 .494 3.017 9.878 9.878 0 0 0 .502 2.68z"/>
  </svg>
);

// Crisp inline SVG for Google Chrome
export const ChromeLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C8.21 0 4.89 1.77 2.76 4.53L7.75 13.2C8.03 10.97 9.86 9.22 12.1 9.22H21.5C20.35 3.91 16.66 0 12 0zm-7.79 6.27A11.875 11.875 0 0 0 .1 12.1C.1 17.5 3.86 22 9 23.5L14 14.8c-.89.89-2.22 1.43-3.69 1.43-3.05 0-5.63-2.07-6.26-4.9H.2c.5 4.3 3.6 7.8 7.8 9.1L4.21 6.27zm16.03 1.83H12.2l5 8.7c2.1-1 3.5-3.1 3.5-5.6 0-1.1-.2-2.1-.5-3.1zm-8.24 6.78c1.59 0 2.88-1.29 2.88-2.88s-1.29-2.88-2.88-2.88-2.88 1.29-2.88 2.88 1.29 2.88 2.88 2.88z"/>
  </svg>
);

// Crisp inline SVG for Cisco
export const CiscoLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M1.5 14v-2c0-.28.22-.5.5-.5s.5.22.5.5v2c0 .28-.22.5-.5.5s-.5-.22-.5-.5zm3.5-4v6c0 .28.22.5.5.5s.5-.22.5-.5V10c0-.28-.22-.5-.5-.5s-.5.22-.5.5zm3.5-4v14c0 .28.22.5.5.5s.5-.22.5-.5V6c0-.28-.22-.5-.5-.5s-.5.22-.5.5zm3.5 4v6c0 .28.22.5.5.5s.5-.22.5-.5V10c0-.28-.22-.5-.5-.5s-.5.22-.5.5zm3.5-4v14c0 .28.22.5.5.5s.5-.22.5-.5V6c0-.28-.22-.5-.5-.5s-.5.22-.5.5zm3.5 4v6c0 .28.22.5.5.5s.5-.22.5-.5V10c0-.28-.22-.5-.5-.5s-.5.22-.5.5zm3.5-4v14c0 .28.22.5.5.5s.5-.22.5-.5V6c0-.28-.22-.5-.5-.5s-.5.22-.5.5zm3.5 4v6c0 .28.22.5.5.5s.5-.22.5-.5V10c0-.28-.22-.5-.5-.5s-.5.22-.5.5z"/>
  </svg>
);

// Crisp inline SVG for Apache
export const ApacheLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.892 11.233c.092.368.184.736.276 1.104l-2.025-1.196 1.749.092zm-.828-3.312l-1.012.828c.184-.368.368-.736.552-1.104.184.092.368.184.46.276zm1.196-1.564c-.184.276-.368.552-.552.828l.276-.92c.092.092.184.092.276.092zm-5.06 6.348l1.472.92-2.116-.368.644-.552zm.46-3.864c.276-.092.552-.184.828-.276l-.46.736-.368-.46zM24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-3.22-4.14c.092.276.184.552.276.828l-1.748-.92c.46-.276.92-.368 1.472.092zm-15.64 8.28l1.748-1.288-1.288 2.024-.46-.736z"/>
  </svg>
);

// Crisp inline SVG for Fortinet
export const FortinetLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm0 18c-3.75-1-6.5-4.89-6.5-9V6.3l6.5-2.17 6.5 2.17V11c0 4.11-2.75 8-6.5 9z"/>
  </svg>
);

// Crisp inline SVG for Zoom
export const ZoomLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 13.5l-3-2v2c0 .28-.22.5-.5.5h-4c-.28 0-.5-.22-.5-.5v-4c0-.28.22-.5.5-.5h4c.28 0 .5.22.5.5v2l3-2c.16-.11.37-.09.5.05.08.08.12.19.12.3v5.2c0 .28-.22.5-.5.5-.11 0-.22-.04-.3-.12z"/>
  </svg>
);

// Crisp inline SVG for PostgreSQL
export const PostgreSqlLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.25 14h-2.5v-1h2.5c.55 0 1-.45 1-1s-.45-1-1-1h-2.5V8.5h2.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5c-.34 0-.66-.07-.95-.19.06.26.1.53.1.81 0 1.03-.78 1.88-1.8 1.98v.4z"/>
  </svg>
);

// Crisp inline SVG for Citrix
export const CitrixLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 12h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H9c-.55 0-1-.45-1-1s.45-1 1-1h3V9c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"/>
  </svg>
);

// Crisp inline SVG for Mobile Android (Bugdroid head)
export const AndroidLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.52 2.5a.499.499 0 0 0-.915-.397L15.34 4.58C14.28 4.19 13.15 4 12 4c-1.15 0-2.28.19-3.34.58L7.395 2.103a.499.499 0 1 0-.915.396l1.378 3.19C5.46 7.23 4.1 9.49 4 12h16c-.1-2.51-1.46-4.77-3.86-6.31l1.38-3.19zM9 8.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm6 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
  </svg>
);

// High-fidelity vector Defendx corporate shield logo
export const DefendxLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 2L3 5.5V11c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5.5L12 2z"
      fill="url(#defendx-shield-grad)"
    />
    <path
      d="M12 4.1L5.1 6.8v4.2c0 4.2 2.9 8.1 6.9 9.1 4-1 6.9-4.9 6.9-9.1V6.8L12 4.1z"
      fill="#0c0e14"
    />
    <path
      d="M12 6L7 8v3.5c0 2.9 2.1 5.7 5 6.5 2.9-.8 5-3.6 5-6.5V8l-5-2z"
      fill="url(#defendx-accent-grad)"
      className="animate-pulse"
      style={{ animationDuration: "3s" }}
    />
    <defs>
      <linearGradient id="defendx-shield-grad" x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2045B4" />
        <stop offset="0.5" stopColor="#1e3a8a" />
        <stop offset="1" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="defendx-accent-grad" x1="12" y1="6" x2="12" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3b82f6" />
        <stop offset="0.5" stopColor="#60a5fa" />
        <stop offset="1" stopColor="#2045B4" />
      </linearGradient>
    </defs>
  </svg>
);

// Main icon resolver mapping keywords or authors to dynamic inline SVGs
interface VendorIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export const VendorIcon = ({ name, ...props }: VendorIconProps) => {
  const lower = name.toLowerCase();

  if (lower.includes("apple") || lower.includes("macos") || lower.includes("macbook") || lower.includes("ios")) {
    return <AppleLogo {...props} />;
  }
  if (lower.includes("microsoft") || lower.includes("windows")) {
    return <WindowsLogo {...props} />;
  }
  if (lower.includes("android")) {
    return <AndroidLogo {...props} />;
  }
  if (lower.includes("debian")) {
    return <DebianLogo {...props} />;
  }
  if (lower.includes("red hat") || lower.includes("redhat")) {
    return <RedHatLogo {...props} />;
  }
  if (lower.includes("docker")) {
    return <DockerLogo {...props} />;
  }
  if (lower.includes("chrome") || lower.includes("google")) {
    return <ChromeLogo {...props} />;
  }
  if (lower.includes("cisco")) {
    return <CiscoLogo {...props} />;
  }
  if (lower.includes("apache")) {
    return <ApacheLogo {...props} />;
  }
  if (lower.includes("fortinet")) {
    return <FortinetLogo {...props} />;
  }
  if (lower.includes("zoom")) {
    return <ZoomLogo {...props} />;
  }
  if (lower.includes("postgresql") || lower.includes("pgsql")) {
    return <PostgreSqlLogo {...props} />;
  }
  if (lower.includes("citrix")) {
    return <CitrixLogo {...props} />;
  }
  if (lower.includes("linux") || lower.includes("ubuntu")) {
    return <LinuxLogo {...props} />;
  }

  // Fallback category items
  if (lower.includes("server")) {
    return <Server {...props} />;
  }
  if (lower.includes("network") || lower.includes("globe")) {
    return <Globe {...props} />;
  }
  if (lower.includes("database")) {
    return <Database {...props} />;
  }
  if (lower.includes("cloud")) {
    return <Cloud {...props} />;
  }
  if (lower.includes("container") || lower.includes("box")) {
    return <Box {...props} />;
  }

  // General threat fallbacks
  return <Shield {...props} />;
};
