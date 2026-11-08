"use client";

import React from "react";
import { Activity, Wind, Database } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f2f2f1] border-t border-[#e5e5e3] pt-12 pb-8 px-4 lg:px-8 text-[#52525b] font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-[#1d1d1d] text-sm tracking-wider">
                MUMBAI <span className="font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">AIR INTELLIGENCE</span>
              </span>
            </div>
            <p className="text-xs text-[#52525b] max-w-md leading-relaxed">
              &quot;See the pollution. Predict the risk. Understand the city.&quot;
              <br />
              An environmental intelligence platform engineered for continuous air quality modeling and geospatial forecasting across Mumbai.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-800 pt-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Multi-Harmonic Fourier Ridge Physical Formulation</span>
            </div>
          </div>

          {/* Data Sources */}
          <div className="space-y-2 text-xs font-mono">
            <h4 className="font-bold text-[#1d1d1d] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              DATA PROVENANCE
            </h4>
            <ul className="space-y-1 text-[#52525b]">
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />OpenAQ Global Air Archive</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />IITM - SAFAR Mumbai Stations</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />CPCB CAAQMS Network</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Google Mumbai Challenge Datasets</li>
            </ul>
          </div>

          {/* Competition Context & Disclaimer */}
          <div className="space-y-2 text-xs font-mono">
            <h4 className="font-bold text-[#1d1d1d] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-500" />
              COMPETITION NOTICE
            </h4>
            <p className="text-[11px] text-[#52525b] leading-relaxed font-sans">
              Developed as a creative submission for the Google Mumbai Data Challenge on Zindi. 
              Built with open environmental datasets. Not an official Google product or direct endorsement.
            </p>
          </div>
        </div>

        {/* Bottom Credits Line */}
        <div className="border-t border-[#e5e5e3] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#71717a]">
          <div>
            &copy; 2026 Mumbai Air Intelligence · All Rights Reserved
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white border border-[#e5e5e3] text-indigo-600 font-semibold">Next.js 14</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#e5e5e3] text-cyan-600 font-semibold">ECharts</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#e5e5e3] text-emerald-600 font-semibold">Leaflet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
