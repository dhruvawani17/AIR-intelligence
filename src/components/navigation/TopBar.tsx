"use client";

import React from "react";
import { Activity, Wind, Sparkles, Sliders, Swords, HeartPulse, Database } from "lucide-react";

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentFrameStatus: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  currentFrameStatus,
}) => {
  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "map", label: "Geospatial Map" },
    { id: "forecast", label: "Forecast" },
    { id: "simulator", label: "What-If Simulator", icon: Sliders },
    { id: "duel", label: "Station Duel", icon: Swords },
    { id: "health", label: "Health Advisory", icon: HeartPulse },
    { id: "stations", label: "Station Analysis" },
    { id: "explainability", label: "Model & Science" },
    { id: "inspector", label: "Zindi Telemetry", icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#f2f2f1]/95 border-b border-[#e5e5e3] px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-xs">
              <Activity className="w-4 h-4 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs tracking-wider text-[#1d1d1d]">
                  MUMBAI <span className="font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">AIR INTELLIGENCE</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  RANK 1 · SCORE 0.0
                </span>
              </div>
            </div>
          </div>

          {/* Mobile status indicator */}
          <div className="flex lg:hidden items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-[#e5e5e3] text-[10px] font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${currentFrameStatus.includes("ML") ? "bg-indigo-600 animate-pulse" : "bg-emerald-500"}`} />
            <span className="font-bold text-slate-700">{currentFrameStatus.includes("ML") ? "ML FORECAST" : "CAAQMS"}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#eaeaea] p-0.5 rounded-xl border border-[#dedede] overflow-x-auto max-w-full shadow-inner scrollbar-none py-1 px-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#1d1d1d] text-white shadow-xs font-semibold"
                    : "text-[#52525b] hover:text-[#1d1d1d] hover:bg-white/80"
                }`}
              >
                {Icon && <Icon className="w-3 h-3 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Status Indicators */}
        <div className="hidden xl:flex items-center gap-2.5 font-mono text-[11px]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#e5e5e3] shadow-xs text-[#3f3f46]">
            <span
              className={`w-2 h-2 rounded-full ${
                currentFrameStatus.includes("ML") ? "bg-indigo-600 animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span className="text-[#71717a]">MODE:</span>
            <span className={`font-bold ${currentFrameStatus.includes("ML") ? "text-indigo-600" : "text-emerald-700"}`}>
              {currentFrameStatus}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 text-emerald-900 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-emerald-800">Score: 0.00000</span>
          </div>
        </div>
      </div>
    </header>
  );
};
