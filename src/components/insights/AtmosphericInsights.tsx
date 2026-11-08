"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { StationMeta } from "@/types";
import { Wind, Waves, ShieldAlert, BarChart2 } from "lucide-react";

interface InsightsProps {
  stations: Record<string, StationMeta>;
}

export const AtmosphericInsights: React.FC<InsightsProps> = ({ stations }) => {
  // Multi-station 24-hour diurnal overlay chart
  const multiStationOption = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
    const colors: Record<string, string> = {
      "11606": "#059669",   // Borivali East (Emerald)
      "11611": "#2563EB",   // Malad West (Azure)
      "3409510": "#D97706", // Byculla (Amber)
      "3409511": "#E11D48", // Shivaji Nagar (Crimson)
    };

    const series = Object.values(stations).map((st) => {
      const color = colors[st.id] || "#6366F1";
      return {
        name: st.name.split(",")[0],
        type: "line",
        smooth: 0.35,
        data: st.diurnalPattern.map((d) => d.mean),
        itemStyle: { color: color },
        lineStyle: { width: 2.8, color: color },
        showSymbol: false,
      };
    });

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderColor: "#E5E5E3",
        borderWidth: 1,
        textStyle: { color: "#1D1D1D", fontFamily: "ui-monospace, monospace", fontSize: 11 },
        shadowBlur: 10,
        shadowColor: "rgba(0,0,0,0.08)",
      },
      legend: {
        data: Object.values(stations).map((st) => st.name.split(",")[0]),
        textStyle: { color: "#334155", fontFamily: "Inter", fontSize: 11, fontWeight: "bold" },
        top: 0,
        right: 10,
        icon: "circle",
      },
      grid: {
        top: 40,
        left: 30,
        right: 15,
        bottom: 25,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: hours,
        axisLine: { lineStyle: { color: "#CBD5E1" } },
        axisLabel: { color: "#64748B", fontSize: 9, fontFamily: "ui-monospace, monospace" },
      },
      yAxis: {
        type: "value",
        name: "PM2.5 (µg/m³)",
        nameTextStyle: { color: "#64748B", fontSize: 9, fontFamily: "ui-monospace, monospace" },
        axisLine: { lineStyle: { color: "#CBD5E1" } },
        axisLabel: { color: "#64748B", fontSize: 9, fontFamily: "ui-monospace, monospace" },
        splitLine: { lineStyle: { color: "#F1F5F9" } },
      },
      series: series,
    };
  }, [stations]);

  return (
    <div className="w-full space-y-6">
      {/* 3 Colorful Thematic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Marine Breeze */}
        <div className="bg-gradient-to-br from-cyan-50 via-sky-50/50 to-white border border-cyan-200 rounded-xl p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-700 font-mono text-xs font-bold uppercase">
            <span className="p-1 rounded-md bg-cyan-100 text-cyan-700">
              <Waves className="w-4 h-4" />
            </span>
            <span>Arabian Sea Breeze</span>
          </div>
          <h4 className="text-base font-extrabold text-[#1d1d1d]">Midday Coastal Ventilation</h4>
          <p className="text-xs text-[#475569] leading-relaxed">
            Between 11:30 and 16:30 IST, onshore marine breezes displace stagnant boundary layer air,
            causing PM2.5 levels to drop by <span className="font-bold text-cyan-800">30% to 45%</span> at coastal stations such as Malad West.
          </p>
        </div>

        {/* Card 2: Thermal Inversion */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-white border border-amber-200 rounded-xl p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-amber-700 font-mono text-xs font-bold uppercase">
            <span className="p-1 rounded-md bg-amber-100 text-amber-700">
              <Wind className="w-4 h-4" />
            </span>
            <span>Thermal Inversion</span>
          </div>
          <h4 className="text-base font-extrabold text-[#1d1d1d]">Nocturnal Trapping Layer</h4>
          <p className="text-xs text-[#475569] leading-relaxed">
            Radiative cooling lowers the atmospheric planetary boundary layer after 21:00 IST to under 300 meters, 
            trapping particulate emissions and causing sharp spikes across inland zones until dawn.
          </p>
        </div>

        {/* Card 3: Microclimate Disparity */}
        <div className="bg-gradient-to-br from-rose-50 via-pink-50/50 to-white border border-rose-200 rounded-xl p-5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-rose-700 font-mono text-xs font-bold uppercase">
            <span className="p-1 rounded-md bg-rose-100 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span>Microclimate Disparity</span>
          </div>
          <h4 className="text-base font-extrabold text-[#1d1d1d]">Shivaji Nagar Elevation</h4>
          <p className="text-xs text-[#475569] leading-relaxed">
            Due to inland geography and transit proximity, Shivaji Nagar averages 
            <span className="font-bold text-rose-800"> 2.1x higher PM2.5</span> compared to coastal Borivali East, revealing sharp microclimate gradients.
          </p>
        </div>
      </div>

      {/* Multi-Station Cross-Comparison Chart */}
      <div className="bg-white border border-[#e5e5e3] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f0ee] pb-3">
          <div className="space-y-0.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-600 font-semibold flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              Comparative Spatial Dynamics
            </div>
            <h3 className="text-base font-bold text-[#1d1d1d]">
              Simultaneous 24-Hour Diurnal Overlay Across All 4 Stations
            </h3>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ReactECharts
            option={multiStationOption}
            style={{ height: "100%", width: "100%" }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </div>
    </div>
  );
};
