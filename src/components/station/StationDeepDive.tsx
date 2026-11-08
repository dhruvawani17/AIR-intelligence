"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { StationMeta } from "@/types";
import { Compass, Sun, Moon, Calendar, Activity } from "lucide-react";

interface StationDeepDiveProps {
  stations: Record<string, StationMeta>;
  selectedStationId: string;
  onSelectStation: (id: string) => void;
}

export const StationDeepDive: React.FC<StationDeepDiveProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
}) => {
  const station = stations[selectedStationId] || Object.values(stations)[0];

  const stationTheme: Record<string, { bg: string; text: string; hex: string }> = {
    "11606": { bg: "bg-emerald-600", text: "text-white", hex: "#059669" }, // Borivali
    "11611": { bg: "bg-blue-600", text: "text-white", hex: "#2563EB" },       // Malad
    "3409510": { bg: "bg-amber-500", text: "text-white", hex: "#D97706" },   // Byculla
    "3409511": { bg: "bg-rose-600", text: "text-white", hex: "#E11D48" },     // Shivaji Nagar
  };

  const currentHex = stationTheme[station.id]?.hex || "#2563EB";

  // 24-Hour Diurnal Pattern EChart with vibrant gradient
  const diurnalOption = useMemo(() => {
    const hours = station.diurnalPattern.map((d) => `${String(d.hour).padStart(2, "0")}:00`);
    const means = station.diurnalPattern.map((d) => d.mean);

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
        formatter: (params: any) => {
          const hour = params[0].axisValue;
          const mean = params[0].value;
          return `<div style="font-weight:700;color:${currentHex};margin-bottom:4px;">Hour ${hour} IST</div>
            <div style="color:#52525B">Mean PM2.5: <b style="color:#1D1D1D">${mean} µg/m³</b></div>`;
        },
      },
      grid: {
        top: 25,
        left: 25,
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
        name: "µg/m³",
        nameTextStyle: { color: "#64748B", fontSize: 9, fontFamily: "ui-monospace, monospace" },
        axisLine: { lineStyle: { color: "#CBD5E1" } },
        axisLabel: { color: "#64748B", fontSize: 9, fontFamily: "ui-monospace, monospace" },
        splitLine: { lineStyle: { color: "#F1F5F9" } },
      },
      series: [
        {
          name: "Diurnal Mean",
          type: "line",
          data: means,
          smooth: 0.35,
          itemStyle: { color: currentHex },
          lineStyle: { width: 3, color: currentHex },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${currentHex}35` },
                { offset: 1, color: `${currentHex}02` },
              ],
            },
          },
        },
      ],
    };
  }, [station, currentHex]);

  // Find diurnal peak and trough
  const sortedDiurnal = [...station.diurnalPattern].sort((a, b) => b.mean - a.mean);
  const peakHour = sortedDiurnal[0];
  const troughHour = sortedDiurnal[sortedDiurnal.length - 1];

  return (
    <div className="w-full bg-white border border-[#e5e5e3] rounded-xl p-5 shadow-sm space-y-6">
      {/* Station Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f0f0ee] pb-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 font-semibold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-600" />
            Station Environmental Diagnostic
          </div>
          <h3 className="text-xl font-extrabold text-[#1d1d1d] tracking-tight pt-0.5">
            {station.name}
          </h3>
          <p className="text-xs text-[#52525b] pt-0.5">
            Zone: <span className="font-semibold text-indigo-700">{station.zone}</span> · Microclimate:{" "}
            <span className="font-semibold text-cyan-700">{station.stationType}</span> · Sensor ID:{" "}
            <span className="font-mono text-[#71717a]">{station.id}</span>
          </p>
        </div>

        {/* Station switcher with vibrant colors */}
        <div className="flex items-center gap-1.5 bg-[#f4f4f2] p-1 rounded-xl border border-[#e5e5e3]">
          {Object.values(stations).map((st) => {
            const isSelected = selectedStationId === st.id;
            const theme = stationTheme[st.id] || { bg: "bg-blue-600", text: "text-white" };
            return (
              <button
                key={st.id}
                onClick={() => onSelectStation(st.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? `${theme.bg} ${theme.text} shadow-xs`
                    : "text-[#52525b] hover:text-[#1d1d1d] hover:bg-white/80"
                }`}
              >
                {st.name.split(",")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colorful Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200/80 space-y-1 shadow-xs">
          <div className="text-[10px] font-mono uppercase text-emerald-800 font-semibold flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-600" /> All-Time Mean
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-950">{station.metrics.allTimeMean}</div>
          <div className="text-[10px] text-emerald-700 font-medium">µg/m³ PM2.5</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/80 space-y-1 shadow-xs">
          <div className="text-[10px] font-mono uppercase text-amber-800 font-semibold flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-600" /> Peak Hour
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-950">
            {String(peakHour.hour).padStart(2, "0")}:00
          </div>
          <div className="text-[10px] text-amber-700 font-medium">Mean: {peakHour.mean} µg/m³</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50/40 border border-cyan-200/80 space-y-1 shadow-xs">
          <div className="text-[10px] font-mono uppercase text-cyan-800 font-semibold flex items-center gap-1">
            <Moon className="w-3 h-3 text-cyan-600" /> Cleanest Window
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-950">
            {String(troughHour.hour).padStart(2, "0")}:00
          </div>
          <div className="text-[10px] text-cyan-700 font-medium">Mean: {troughHour.mean} µg/m³</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50/40 border border-indigo-200/80 space-y-1 shadow-xs">
          <div className="text-[10px] font-mono uppercase text-indigo-800 font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-600" /> Weekday vs Weekend
          </div>
          <div className="text-2xl font-extrabold font-mono text-indigo-950">
            {station.metrics.weekdayMean} <span className="text-sm font-normal text-indigo-600">/ {station.metrics.weekendMean}</span>
          </div>
          <div className="text-[10px] text-indigo-700 font-medium">Weekday / Weekend µg/m³</div>
        </div>
      </div>

      {/* 24-Hour Diurnal Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1d1d1d] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentHex }} />
            24-Hour Diurnal Profile (Mean Hourly Cycle)
          </h4>
          <span className="text-[10px] font-mono text-cyan-700 font-semibold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
            Computed from continuous CAAQMS observations
          </span>
        </div>
        <div className="h-[220px] w-full">
          <ReactECharts
            option={diurnalOption}
            style={{ height: "100%", width: "100%" }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </div>
    </div>
  );
};
