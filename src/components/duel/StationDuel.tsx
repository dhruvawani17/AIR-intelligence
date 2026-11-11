"use client";

import React, { useState, useMemo } from "react";
import { StationMeta } from "@/types";
import { Swords, ArrowRightLeft, TrendingUp, Compass, Mountain, ShieldCheck, AlertCircle } from "lucide-react";
import ReactECharts from "echarts-for-react";

interface StationDuelProps {
  stations: Record<string, StationMeta>;
}

export const StationDuel: React.FC<StationDuelProps> = ({ stations }) => {
  const stationIds = Object.keys(stations);
  const [stationAId, setStationAId] = useState<string>("11606"); // Borivali East
  const [stationBId, setStationBId] = useState<string>("3409511"); // Shivaji Nagar

  const stationA = stations[stationAId] || stations[stationIds[0]];
  const stationB = stations[stationBId] || stations[stationIds[1]];

  const handleSwap = () => {
    setStationAId(stationBId);
    setStationBId(stationAId);
  };

  // Comparative Chart Option (Dual 24h diurnal curve with delta)
  const duelChartOption = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const curveA = stationA.diurnalPattern.map((p) => p.mean);
    const curveB = stationB.diurnalPattern.map((p) => p.mean);
    const delta = curveA.map((v, i) => Math.round((v - curveB[i]) * 10) / 10);

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
        formatter: (params: any[]) => {
          let str = `<div class="font-bold text-xs mb-1 text-slate-800">${params[0].axisValue} IST</div>`;
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
        data: [stationA.name.split(",")[0], stationB.name.split(",")[0], "Delta (A - B)"],
        top: 0,
        textStyle: { fontSize: 11, color: "#52525b" },
      },
      grid: {
        top: 36,
        right: 20,
        bottom: 25,
        left: 45,
      },
      xAxis: {
        type: "category",
        data: hours,
        axisLabel: { fontSize: 10, color: "#71717a" },
      },
      yAxis: [
        {
          type: "value",
          name: "PM2.5 (µg/m³)",
          nameTextStyle: { fontSize: 10, color: "#71717a" },
          axisLabel: { fontSize: 10, color: "#71717a" },
          splitLine: { lineStyle: { color: "#f1f1f0" } },
        },
        {
          type: "value",
          name: "Delta",
          nameTextStyle: { fontSize: 10, color: "#a1a1aa" },
          axisLabel: { fontSize: 10, color: "#a1a1aa" },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: stationA.name.split(",")[0],
          type: "line",
          smooth: true,
          data: curveA,
          itemStyle: { color: "#059669" },
          lineStyle: { width: 3 },
          showSymbol: false,
        },
        {
          name: stationB.name.split(",")[0],
          type: "line",
          smooth: true,
          data: curveB,
          itemStyle: { color: "#E11D48" },
          lineStyle: { width: 3 },
          showSymbol: false,
        },
        {
          name: "Delta (A - B)",
          type: "bar",
          yAxisIndex: 1,
          data: delta,
          itemStyle: {
            color: (params: any) => (params.value >= 0 ? "rgba(5, 150, 105, 0.25)" : "rgba(225, 29, 72, 0.25)"),
            borderRadius: [2, 2, 0, 0],
          },
        },
      ],
    };
  }, [stationA, stationB]);

  // Metric Deltas
  const meanDiff = Math.round((stationA.metrics.allTimeMean - stationB.metrics.allTimeMean) * 10) / 10;
  const recentDiff = Math.round((stationA.metrics.recentPostMonsoonMean - stationB.metrics.recentPostMonsoonMean) * 10) / 10;
  const diwaliPeakA = stationA.metrics.diwaliRecordedPeak || 0;
  const diwaliPeakB = stationB.metrics.diwaliRecordedPeak || 0;
  const diwaliDiff = Math.round((diwaliPeakA - diwaliPeakB) * 10) / 10;

  return (
    <div className="bg-white border border-[#e5e5e3] rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f0f0ee] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-800 uppercase tracking-wider font-semibold">
            <Swords className="w-3.5 h-3.5 text-cyan-700" />
            Microclimate Comparative Analytics
          </div>
          <h3 className="text-xl font-bold text-[#1d1d1d] pt-1">
            Station Duel: Side-by-Side Environmental Diagnostics
          </h3>
          <p className="text-xs text-[#71717a] pt-0.5">
            Compare diurnal curves, boundary layer trapping vulnerability, and coastal ventilation divergence between any two Mumbai monitoring stations.
          </p>
        </div>

        {/* Station Selectors & Swap Button */}
        <div className="flex items-center gap-2">
          {/* Station A Selector */}
          <select
            value={stationAId}
            onChange={(e) => setStationAId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 focus:outline-none"
          >
            {Object.entries(stations).map(([id, st]) => (
              <option key={id} value={id}>
                Station A: {st.name.split(",")[0]}
              </option>
            ))}
          </select>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="p-2 rounded-xl border border-[#dedede] bg-[#f4f4f2] hover:bg-[#eaeaec] text-[#52525b] hover:text-[#1d1d1d] transition-colors"
            title="Swap stations"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* Station B Selector */}
          <select
            value={stationBId}
            onChange={(e) => setStationBId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 focus:outline-none"
          >
            {Object.entries(stations).map(([id, st]) => (
              <option key={id} value={id}>
                Station B: {st.name.split(",")[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Head-to-Head Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Station A Card */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 to-white space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                Station A · {stationA.code}
              </span>
              <h4 className="text-base font-bold text-[#1d1d1d] pt-1">{stationA.name}</h4>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-[#71717a]">Post-Monsoon Mean</div>
              <div className="text-xl font-extrabold text-emerald-700">
                {stationA.metrics.recentPostMonsoonMean} <span className="text-xs font-normal">µg/m³</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#52525b] leading-relaxed">{stationA.description}</p>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-emerald-100/60 text-xs">
            <div>
              <span className="text-[10px] text-[#71717a] block">Zone</span>
              <span className="font-semibold text-[#1d1d1d]">{stationA.zone}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#71717a] block">Elevation</span>
              <span className="font-semibold text-[#1d1d1d]">{stationA.elevationMeters}m</span>
            </div>
            <div>
              <span className="text-[10px] text-[#71717a] block">Diwali Peak</span>
              <span className="font-bold text-rose-600">{diwaliPeakA} µg/m³</span>
            </div>
          </div>
        </div>

        {/* Station B Card */}
        <div className="p-4 rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50/40 to-white space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded">
                Station B · {stationB.code}
              </span>
              <h4 className="text-base font-bold text-[#1d1d1d] pt-1">{stationB.name}</h4>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-[#71717a]">Post-Monsoon Mean</div>
              <div className="text-xl font-extrabold text-rose-700">
                {stationB.metrics.recentPostMonsoonMean} <span className="text-xs font-normal">µg/m³</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#52525b] leading-relaxed">{stationB.description}</p>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-rose-100/60 text-xs">
            <div>
              <span className="text-[10px] text-[#71717a] block">Zone</span>
              <span className="font-semibold text-[#1d1d1d]">{stationB.zone}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#71717a] block">Elevation</span>
              <span className="font-semibold text-[#1d1d1d]">{stationB.elevationMeters}m</span>
            </div>
            <div>
              <span className="text-[10px] text-[#71717a] block">Diwali Peak</span>
              <span className="font-bold text-rose-600">{diwaliPeakB} µg/m³</span>
            </div>
          </div>
        </div>
      </div>

      {/* Duel EChart: Diurnal Curve Overlay & Hourly Delta */}
      <div className="bg-[#fafaf9] p-4 rounded-xl border border-[#ebebe9] space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-bold text-[#3f3f46]">
            24-Hour Diurnal Profile Comparison &amp; Delta (A vs B)
          </div>
          <div className="text-[11px] font-mono text-[#71717a]">
            Net Post-Monsoon Bias:{" "}
            <span className={`font-bold ${recentDiff >= 0 ? "text-rose-600" : "text-emerald-700"}`}>
              {recentDiff >= 0 ? `+${recentDiff}` : recentDiff} µg/m³
            </span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ReactECharts option={duelChartOption} style={{ height: "100%", width: "100%" }} />
        </div>
      </div>
    </div>
  );
};

