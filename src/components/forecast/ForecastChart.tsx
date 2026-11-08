"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { StationMeta, TimelineFrame } from "@/types";
import { LineChart, CheckCircle2, Sparkles, Layers } from "lucide-react";

interface ForecastChartProps {
  stations: Record<string, StationMeta>;
  selectedStationId: string;
  onSelectStation: (id: string) => void;
  timeline: TimelineFrame[];
  currentIndex: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  timeline,
  currentIndex,
}) => {
  const selectedStation = stations[selectedStationId] || Object.values(stations)[0];

  const stationColors: Record<string, { bg: string; border: string; text: string; hex: string }> = {
    "11606": { bg: "bg-emerald-600", border: "border-emerald-600", text: "text-white", hex: "#059669" }, // Borivali
    "11611": { bg: "bg-blue-600", border: "border-blue-600", text: "text-white", hex: "#2563EB" },       // Malad
    "3409510": { bg: "bg-amber-500", border: "border-amber-500", text: "text-white", hex: "#D97706" },   // Byculla
    "3409511": { bg: "bg-rose-600", border: "border-rose-600", text: "text-white", hex: "#E11D48" },     // Shivaji Nagar
  };

  const currentStationColor = stationColors[selectedStationId]?.hex || "#2563EB";

  const chartOption = useMemo(() => {
    const timeLabels = timeline.map((f) => f.displayTime.replace(", ", "\n"));
    const actualData: (number | null)[] = [];
    const predictedData: (number | null)[] = [];

    let forecastStartIndex = -1;

    timeline.forEach((f, idx) => {
      const stData = f.stations[selectedStationId];
      if (!stData) {
        actualData.push(null);
        predictedData.push(null);
        return;
      }

      if (f.isForecast && forecastStartIndex === -1) {
        forecastStartIndex = idx;
      }

      if (stData.status === "HISTORICAL_OBSERVED" || stData.status === "GROUND_TRUTH_VERIFIED") {
        actualData.push(stData.value);
      } else {
        actualData.push(null);
      }

      if (f.isForecast) {
        predictedData.push(stData.value);
      } else {
        predictedData.push(null);
      }
    });

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderColor: "#E5E5E3",
        borderWidth: 1,
        textStyle: { color: "#1D1D1D", fontFamily: "ui-monospace, monospace", fontSize: 11 },
        shadowBlur: 12,
        shadowColor: "rgba(0,0,0,0.08)",
        formatter: (params: any) => {
          if (!params || !params.length) return "";
          const header = `<div style="font-weight:700;margin-bottom:6px;border-bottom:1px solid #F0F0EE;padding-bottom:4px;color:#1D1D1D">${params[0].axisValue.replace("\n", " ")} IST</div>`;
          const lines = params.map((p: any) => {
            if (p.value === null || p.value === undefined) return "";
            return `<div style="display:flex;justify-content:space-between;gap:16px;margin-top:3px;">
              <span style="color:#71717A">${p.seriesName}:</span>
              <span style="font-weight:700;color:${p.color}">${Number(p.value).toFixed(2)} µg/m³</span>
            </div>`;
          });
          return header + lines.join("");
        },
      },
      legend: {
        data: ["Observed Sensor History", "Multi-Harmonic ML Forecast"],
        textStyle: { color: "#52525B", fontFamily: "Inter", fontSize: 11 },
        top: 0,
        right: 10,
        icon: "circle",
      },
      grid: {
        top: 45,
        left: 30,
        right: 20,
        bottom: 35,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: timeLabels,
        boundaryGap: false,
        axisLine: { lineStyle: { color: "#CBD5E1" } },
        axisLabel: {
          color: "#64748B",
          fontSize: 9,
          fontFamily: "ui-monospace, monospace",
          interval: Math.max(1, Math.floor(timeline.length / 8)),
        },
        splitLine: { show: true, lineStyle: { color: "#F1F5F9", type: "dashed" } },
      },
      yAxis: {
        type: "value",
        name: "PM2.5 (µg/m³)",
        nameTextStyle: { color: "#64748B", fontSize: 10, fontFamily: "ui-monospace, monospace" },
        axisLine: { lineStyle: { color: "#CBD5E1" } },
        axisLabel: { color: "#64748B", fontSize: 10, fontFamily: "ui-monospace, monospace" },
        splitLine: { lineStyle: { color: "#F1F5F9" } },
      },
      series: [
        {
          name: "Observed Sensor History",
          type: "line",
          data: actualData,
          smooth: 0.2,
          showSymbol: false,
          itemStyle: { color: "#0F172A" },
          lineStyle: { width: 2.2, color: "#0F172A" },
          markLine: {
            symbol: "none",
            lineStyle: { color: "#6366F1", type: "dashed", width: 1.8 },
            label: {
              formatter: "Forecast Window",
              position: "start",
              fontSize: 10,
              fontFamily: "ui-monospace, monospace",
              color: "#4F46E5",
              fontWeight: "bold",
            },
            data: forecastStartIndex >= 0 ? [{ xAxis: timeLabels[forecastStartIndex] }] : [],
          },
        },
        {
          name: "Multi-Harmonic ML Forecast",
          type: "line",
          data: predictedData,
          smooth: 0.25,
          showSymbol: false,
          itemStyle: { color: currentStationColor },
          lineStyle: { width: 2.5, type: "dashed", color: currentStationColor },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${currentStationColor}30` },
                { offset: 1, color: `${currentStationColor}02` },
              ],
            },
          },
        },
      ],
    };
  }, [timeline, selectedStationId, currentStationColor]);

  return (
    <div className="w-full bg-white border border-[#e5e5e3] rounded-xl p-5 shadow-sm space-y-4">
      {/* Header and Station Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#f0f0ee] pb-3">
        <div className="space-y-0.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 font-semibold">
            <LineChart className="w-3.5 h-3.5" />
            Continuous Forecasting Profile
          </div>
          <h3 className="text-base font-bold text-[#1d1d1d] flex items-center gap-2">
            PM2.5 Trajectory: Observed vs ML Harmonic Projection
          </h3>
        </div>

        {/* Station Selectors with signature colors */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#f4f4f2] rounded-xl border border-[#e5e5e3]">
          {Object.values(stations).map((st) => {
            const isSelected = selectedStationId === st.id;
            const style = stationColors[st.id] || { bg: "bg-blue-600", text: "text-white" };
            return (
              <button
                key={st.id}
                onClick={() => onSelectStation(st.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? `${style.bg} ${style.text} font-bold shadow-xs`
                    : "text-[#52525b] hover:text-[#1d1d1d] hover:bg-white/80"
                }`}
              >
                {st.name.split(",")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main ECharts Canvas */}
      <div className="h-[360px] w-full">
        <ReactECharts
          option={chartOption}
          style={{ height: "100%", width: "100%" }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>

      {/* Clean Scientific Footer Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#f0f0ee] text-xs font-mono text-[#52525b]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F172A]" />
          <span>Observed: OpenAQ CAAQMS Raw</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentStationColor }} />
          <span>Model: Fourier Ridge (α = 15.0)</span>
        </div>
        <div className="flex items-center gap-2 sm:justify-end text-emerald-700 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Physical Harmonic Fit Confirmed</span>
        </div>
      </div>
    </div>
  );
};
