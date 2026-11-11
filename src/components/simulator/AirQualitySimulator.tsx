"use client";

import React, { useState, useMemo } from "react";
import { StationMeta } from "@/types";
import { Sliders, Wind, Flame, CloudSun, Sparkles, RefreshCw, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import ReactECharts from "echarts-for-react";

interface SimulatorProps {
  stations: Record<string, StationMeta>;
}

export const AirQualitySimulator: React.FC<SimulatorProps> = ({ stations }) => {
  // Simulator Parameters
  const [seaBreezeSpeed, setSeaBreezeSpeed] = useState<number>(14); // 0 to 35 km/h
  const [inversionStrength, setInversionStrength] = useState<number>(45); // 0% (free mixing) to 100% (shallow trapping)
  const [emissionMultiplier, setEmissionMultiplier] = useState<number>(100); // 30% to 300%
  const [humidity, setHumidity] = useState<number>(65); // 30% to 95%
  const [selectedStationId, setSelectedStationId] = useState<string>("3409511"); // default Shivaji Nagar

  // Presets
  const setScenario = (preset: "standard" | "diwali" | "maritime" | "traffic") => {
    switch (preset) {
      case "standard":
        setSeaBreezeSpeed(14);
        setInversionStrength(45);
        setEmissionMultiplier(100);
        setHumidity(65);
        break;
      case "diwali":
        setSeaBreezeSpeed(2); // calm stagnant air
        setInversionStrength(95); // severe ground trapping below 120m
        setEmissionMultiplier(280); // massive fireworks + festive traffic
        setHumidity(80);
        break;
      case "maritime":
        setSeaBreezeSpeed(28); // brisk Arabian Sea onshore gale
        setInversionStrength(15); // high convective boundary layer
        setEmissionMultiplier(75); // post-rain clean baseline
        setHumidity(55);
        break;
      case "traffic":
        setSeaBreezeSpeed(8);
        setInversionStrength(70);
        setEmissionMultiplier(190); // morning peak vehicular rush
        setHumidity(70);
        break;
    }
  };

  // Physical simulation calculation based on atmospheric physics transfer functions
  const simulationResults = useMemo(() => {
    const results: Record<string, { pm25: number; aqiCat: string; aqiColor: string; deltaPercent: number }> = {};

    Object.entries(stations).forEach(([id, st]) => {
      const baseline = st.metrics.recentPostMonsoonMean || 42.0;

      // Transfer factors:
      const coastalSensitivity = id === "11611" ? 1.6 : id === "11606" ? 1.1 : id === "3409510" ? 1.2 : 0.8;
      const windFactor = Math.max(0.35, 1.0 - ((seaBreezeSpeed - 12) / 30) * coastalSensitivity);

      const inversionSensitivity = id === "3409511" ? 1.7 : id === "3409510" ? 1.3 : id === "11611" ? 1.1 : 0.8;
      const invFactor = 1.0 + ((inversionStrength - 40) / 100) * inversionSensitivity;

      const emissionSensitivity = id === "3409511" ? 1.5 : id === "3409510" ? 1.25 : 1.0;
      const emFactor = 1.0 + ((emissionMultiplier - 100) / 100) * emissionSensitivity;

      const humFactor = 1.0 + (humidity > 70 ? ((humidity - 70) / 100) * 0.45 : 0);

      let simulatedPM25 = baseline * windFactor * invFactor * emFactor * humFactor;
      simulatedPM25 = Math.max(8.0, Math.min(850.0, simulatedPM25));

      const deltaPercent = ((simulatedPM25 - baseline) / baseline) * 100;

      let aqiCat = "Good";
      let aqiColor = "#10B981";
      if (simulatedPM25 > 250) {
        aqiCat = "Severe";
        aqiColor = "#7C3AED";
      } else if (simulatedPM25 > 120) {
        aqiCat = "Very Poor";
        aqiColor = "#EF4444";
      } else if (simulatedPM25 > 90) {
        aqiCat = "Poor";
        aqiColor = "#F97316";
      } else if (simulatedPM25 > 60) {
        aqiCat = "Moderate";
        aqiColor = "#F59E0B";
      } else if (simulatedPM25 > 30) {
        aqiCat = "Satisfactory";
        aqiColor = "#06B6D4";
      }

      results[id] = {
        pm25: Math.round(simulatedPM25 * 10) / 10,
        aqiCat,
        aqiColor,
        deltaPercent: Math.round(deltaPercent * 10) / 10,
      };
    });

    return results;
  }, [stations, seaBreezeSpeed, inversionStrength, emissionMultiplier, humidity]);

  const activeResult = simulationResults[selectedStationId] || Object.values(simulationResults)[0];
  const activeStation = stations[selectedStationId] || Object.values(stations)[0];

  // ECharts Bar comparison
  const comparisonChartOption = useMemo(() => {
    const stationNames = Object.values(stations).map((s) => s.name.split(",")[0]);
    const simulatedValues = Object.keys(stations).map((id) => simulationResults[id]?.pm25 || 0);
    const baselineValues = Object.values(stations).map((s) => s.metrics.recentPostMonsoonMean || 40);

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderColor: "#E4E4E7",
        borderWidth: 1,
        textStyle: { color: "#18181B", fontSize: 11 },
        shadowBlur: 10,
        shadowColor: "rgba(0,0,0,0.06)",
        formatter: (params: any[]) => {
          let str = `<div class="font-bold text-xs mb-1 text-slate-800">${params[0].axisValue}</div>`;
          params.forEach((p) => {
            str += `<div class="flex items-center justify-between gap-4 text-xs">
              <span class="flex items-center gap-1.5 font-medium" style="color:${p.color}">
                <span class="w-2 h-2 rounded-full" style="background:${p.color}"></span>
                ${p.seriesName}:
              </span>
              <span class="font-mono font-bold">${p.value} µg/m³</span>
            </div>`;
          });
          return str;
        },
      },
      legend: {
        data: ["Simulated Atmosphere", "Post-Monsoon Baseline"],
        top: 0,
        textStyle: { fontSize: 11, color: "#71717A" },
      },
      grid: {
        top: 36,
        right: 15,
        bottom: 25,
        left: 45,
      },
      xAxis: {
        type: "category",
        data: stationNames,
        axisLabel: { fontSize: 11, color: "#71717A" },
        axisLine: { lineStyle: { color: "#E4E4E7" } },
      },
      yAxis: {
        type: "value",
        name: "PM2.5 (µg/m³)",
        nameTextStyle: { fontSize: 10, color: "#71717A" },
        axisLabel: { fontSize: 10, color: "#71717A" },
        splitLine: { lineStyle: { color: "#F4F4F5" } },
      },
      series: [
        {
          name: "Simulated Atmosphere",
          type: "bar",
          data: simulatedValues.map((val) => ({
            value: val,
            itemStyle: {
              color: val > 250 ? "#7C3AED" : val > 120 ? "#EF4444" : val > 90 ? "#F97316" : val > 60 ? "#F59E0B" : "#10B981",
              borderRadius: [4, 4, 0, 0],
            },
          })),
        },
        {
          name: "Post-Monsoon Baseline",
          type: "bar",
          data: baselineValues,
          itemStyle: {
            color: "#CBD5E1",
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    };
  }, [stations, simulationResults]);

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f4f4f5] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-600 uppercase tracking-wider font-semibold">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            Atmospheric &amp; Anthropogenic Physics Engine
          </div>
          <h3 className="text-xl font-bold text-[#18181b] pt-1">
            Mumbai Interactive &quot;What-If&quot; Air Quality Simulator
          </h3>
          <p className="text-xs text-[#71717a] pt-0.5">
            Real-time sensitivity analysis testing marine breeze flushing, nocturnal boundary layer trapping, and emission shocks.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#f4f4f5] p-1.5 rounded-xl border border-[#e4e4e7]">
          <span className="text-[10px] font-mono uppercase text-[#71717a] px-2 font-bold">Presets:</span>
          <button
            onClick={() => setScenario("standard")}
            className="px-2.5 py-1 text-xs rounded-lg font-medium bg-white text-[#18181b] hover:bg-slate-50 border border-[#e4e4e7] shadow-2xs transition-all"
          >
            Baseline
          </button>
          <button
            onClick={() => setScenario("diwali")}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            Diwali Shockwave
          </button>
          <button
            onClick={() => setScenario("maritime")}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200 transition-all flex items-center gap-1"
          >
            <Wind className="w-3 h-3 text-cyan-600" />
            Sea Breeze Flush
          </button>
          <button
            onClick={() => setScenario("traffic")}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-all"
          >
            Rush Hour Peak
          </button>
        </div>
      </div>

      {/* Main Grid: Controls + Live Visual Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-[#fafaf9] p-5 rounded-xl border border-[#e4e4e7]">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#3f3f46]">
            <span>Atmospheric Variables</span>
            <button
              onClick={() => setScenario("standard")}
              className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-2.5 h-2.5" /> Reset
            </button>
          </div>

          {/* Slider 1: Arabian Sea Breeze Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#18181b] flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-600" />
                Arabian Sea Breeze Speed
              </span>
              <span className="font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                {seaBreezeSpeed} km/h
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={35}
              value={seaBreezeSpeed}
              onChange={(e) => setSeaBreezeSpeed(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#71717a] font-mono">
              <span>0 (Stagnant Calm)</span>
              <span>15 (Normal Sea Breeze)</span>
              <span>35 (Strong Maritime Flush)</span>
            </div>
          </div>

          {/* Slider 2: Nocturnal Boundary Layer Inversion */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#18181b] flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-indigo-600" />
                Nocturnal Inversion Trapping
              </span>
              <span className="font-mono font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {inversionStrength}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={inversionStrength}
              onChange={(e) => setInversionStrength(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#71717a] font-mono">
              <span>0% (Free Convective Mixing)</span>
              <span>50% (Standard)</span>
              <span>100% (Sub-150m Lock)</span>
            </div>
          </div>

          {/* Slider 3: Urban Emission Surge / Firecrackers */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#18181b] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                Urban Emissions / Firecrackers
              </span>
              <span className="font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {emissionMultiplier}%
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={5}
              value={emissionMultiplier}
              onChange={(e) => setEmissionMultiplier(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#71717a] font-mono">
              <span>30% (Low Traffic Curfew)</span>
              <span>100% (Baseline)</span>
              <span>300% (Diwali Peak Fireworks)</span>
            </div>
          </div>

          {/* Slider 4: Relative Humidity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#18181b] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Relative Humidity (Smog Trigger)
              </span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {humidity}%
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={95}
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#71717a] font-mono">
              <span>30% (Dry Air)</span>
              <span>65% (Typical Coastal)</span>
              <span>95% (Dense Winter Smog)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Gauges & Comparative Station Analytics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Station Selector Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono text-[#71717a] whitespace-nowrap font-semibold">Inspect Station:</span>
            {Object.entries(stations).map(([id, st]) => (
              <button
                key={id}
                onClick={() => setSelectedStationId(id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedStationId === id
                    ? "bg-[#18181b] text-white shadow-xs font-semibold"
                    : "bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7]"
                }`}
              >
                {st.name.split(",")[0]}
              </button>
            ))}
          </div>

          {/* Simulated PM2.5 Gauge Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Projected PM2.5 */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-[#e4e4e7] shadow-xs space-y-1">
              <div className="text-[11px] font-mono uppercase text-[#71717a] font-medium">Projected PM2.5</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-mono tracking-tight" style={{ color: activeResult.aqiColor }}>
                  {activeResult.pm25}
                </span>
                <span className="text-xs text-[#71717a] font-mono">µg/m³</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold pt-1">
                {activeResult.deltaPercent >= 0 ? (
                  <span className="text-rose-600 flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +{activeResult.deltaPercent}%
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center">
                    <ArrowDownRight className="w-3.5 h-3.5" /> {activeResult.deltaPercent}%
                  </span>
                )}
                <span className="text-[#a1a1aa] font-normal">vs Oct baseline</span>
              </div>
            </div>

            {/* National AQI Category */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-[#e4e4e7] shadow-xs space-y-1">
              <div className="text-[11px] font-mono uppercase text-[#71717a] font-medium">Indian NAQI Band</div>
              <div className="text-xl font-bold tracking-tight" style={{ color: activeResult.aqiColor }}>
                {activeResult.aqiCat}
              </div>
              <div className="text-[11px] text-[#71717a] pt-1 leading-tight">
                {activeResult.aqiCat === "Good" || activeResult.aqiCat === "Satisfactory"
                  ? "Minimal respiratory impact"
                  : activeResult.aqiCat === "Moderate"
                  ? "Breathing discomfort to sensitive"
                  : activeResult.aqiCat === "Poor"
                  ? "Breathing discomfort to most"
                  : activeResult.aqiCat === "Very Poor"
                  ? "Respiratory illness on prolonged exposure"
                  : "Severe respiratory emergency; stay indoors"}
              </div>
            </div>

            {/* Microclimate Defense */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-[#e4e4e7] shadow-xs space-y-1">
              <div className="text-[11px] font-mono uppercase text-[#71717a] font-medium">Microclimate Feature</div>
              <div className="text-sm font-bold text-[#18181b]">{activeStation.stationType}</div>
              <div className="text-[11px] text-[#52525b] leading-tight pt-1">
                {activeStation.id === "11611"
                  ? "Direct coastal corridor: high sea breeze ventilation response."
                  : activeStation.id === "11606"
                  ? "Sanjay Gandhi National Park forest canopy buffer moderates spikes."
                  : activeStation.id === "3409510"
                  ? "South Mumbai traffic corridor: sensitive to evening rush hour buildup."
                  : "Deonar eastern industrial pocket: severe nocturnal trapping vulnerability."}
              </div>
            </div>
          </div>

          {/* Real-Time Comparative Bar Chart across all 4 stations */}
          <div className="bg-[#fafaf9] p-4 rounded-xl border border-[#e4e4e7]">
            <div className="text-xs font-mono font-bold text-[#3f3f46] mb-1">
              Cross-City PM2.5 Impact: Simulated vs Baseline
            </div>
            <div className="h-48 w-full">
              <ReactECharts option={comparisonChartOption} style={{ height: "100%", width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
