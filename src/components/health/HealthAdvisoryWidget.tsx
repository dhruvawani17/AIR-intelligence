"use client";

import React, { useState } from "react";
import { StationMeta, TimelineFrame } from "@/types";
import { HeartPulse, User, ShieldCheck, AlertTriangle, XCircle, Wind, CheckCircle2, Info } from "lucide-react";

interface HealthAdvisoryProps {
  stations: Record<string, StationMeta>;
  currentFrame: TimelineFrame;
}

type PersonaType = "athletes" | "sensitive" | "vulnerable" | "commuter";

export const HealthAdvisoryWidget: React.FC<HealthAdvisoryProps> = ({ stations, currentFrame }) => {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>("athletes");
  const [selectedStationId, setSelectedStationId] = useState<string>("11606"); // Borivali East

  const currentStationData = currentFrame.stations[selectedStationId] || Object.values(currentFrame.stations)[0];
  const stationMeta = stations[selectedStationId] || Object.values(stations)[0];
  const pm25 = currentStationData.value;

  // Persona profiles
  const personas: Record<
    PersonaType,
    {
      title: string;
      desc: string;
      icon: string;
      thresholdSafe: number;
      thresholdMod: number;
      recommendations: string[];
    }
  > = {
    athletes: {
      title: "Runners & Outdoor Athletes",
      desc: "High ventilation rates (up to 60-80 L/min) during aerobic training amplify pulmonary PM2.5 uptake 4-5x.",
      icon: "🏃",
      thresholdSafe: 35,
      thresholdMod: 70,
      recommendations: [
        "Optimal outdoor cardio window in Mumbai: 13:30 to 16:30 IST during peak sea-breeze ventilation.",
        "Avoid early morning (05:00-08:00 IST) running when nocturnal ground inversion traps aerosols under 150m.",
        "Switch to indoor treadmill or cross-training when local PM2.5 exceeds 75 µg/m³.",
      ],
    },
    sensitive: {
      title: "Asthma & Respiratory Sensitive",
      desc: "Fine particulates penetrate deep into alveolar spaces, triggering bronchospasm and airway inflammation.",
      icon: "🫁",
      thresholdSafe: 30,
      thresholdMod: 55,
      recommendations: [
        "Keep fast-acting bronchodilator inhalers accessible at all times during transit.",
        "Equip an N95 or FFP2 particulate mask when stepping outdoors in industrial zones like Shivaji Nagar / Chembur.",
        "Run indoor HEPA filtration continuously in bedrooms during nighttime inversion periods (21:00-07:00 IST).",
      ],
    },
    vulnerable: {
      title: "Children & Senior Citizens",
      desc: "Developing respiratory systems and reduced cardiovascular reserve elevate susceptibility to micro-particle damage.",
      icon: "👶",
      thresholdSafe: 30,
      thresholdMod: 60,
      recommendations: [
        "Limit outdoor playground activities to afternoon hours (12:00-16:00 IST) when maritime air prevails.",
        "Keep residential windows sealed during early morning rush hour (07:00-09:30 IST).",
        "Maintain indoor hydration and consider antioxidant-rich nutrition to mitigate oxidative aerosol stress.",
      ],
    },
    commuter: {
      title: "Daily Highway & Transit Commuters",
      desc: "Traffic corridor micro-environments subject commuters to severe localized black carbon and brake-dust pulses.",
      icon: "💼",
      thresholdSafe: 40,
      thresholdMod: 85,
      recommendations: [
        "Keep vehicle cabin air vents on 'Recirculation' mode when traversing Western Express Highway or Eastern Freeway.",
        "Two-wheeler riders should wear certified anti-pollution masks during evening congestion peaks (18:30-21:00 IST).",
        "Opt for AC metro corridors where platform aerosol filtration reduces exposure by up to 60%.",
      ],
    },
  };

  const persona = personas[selectedPersona];

  // Evaluate current status
  let healthRiskLevel: "low" | "moderate" | "high" = "low";
  let statusText = "Safe for Outdoor Activity";
  let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let StatusIcon = CheckCircle2;

  if (pm25 > persona.thresholdMod) {
    healthRiskLevel = "high";
    statusText = "High Risk · Avoid Strenuous Outdoor Activity";
    statusColor = "text-rose-700 bg-rose-50 border-rose-200";
    StatusIcon = XCircle;
  } else if (pm25 > persona.thresholdSafe) {
    healthRiskLevel = "moderate";
    statusText = "Moderate Caution · Sensitive Groups Limit Exposure";
    statusColor = "text-amber-800 bg-amber-50 border-amber-200";
    StatusIcon = AlertTriangle;
  }

  // 24-hour diurnal safety profile based on the station's authentic diurnalPattern
  const hourlyStatus = stationMeta.diurnalPattern.map((p) => {
    let level: "safe" | "caution" | "avoid" = "safe";
    if (p.mean > persona.thresholdMod) {
      level = "avoid";
    } else if (p.mean > persona.thresholdSafe) {
      level = "caution";
    }
    return { hour: p.hour, mean: p.mean, level };
  });

  return (
    <div className="bg-white border border-[#e5e5e3] rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f0f0ee] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-800 uppercase tracking-wider font-semibold">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
            Personalized Environmental Protection
          </div>
          <h3 className="text-xl font-bold text-[#1d1d1d] pt-1">
            Interactive Health Advisory &amp; Outdoor Safety Planner
          </h3>
          <p className="text-xs text-[#71717a] pt-0.5">
            Evidence-based health guidelines tailored to your physiological risk profile and real-time Mumbai CAAQMS telemetry.
          </p>
        </div>

        {/* Station Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#71717a] font-mono font-medium">Zone:</span>
          <select
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#f4f4f2] border border-[#dedede] text-[#1d1d1d] focus:outline-none"
          >
            {Object.entries(stations).map(([id, st]) => (
              <option key={id} value={id}>
                {st.name.split(",")[0]} ({st.zone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Persona Pill Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {(Object.entries(personas) as [PersonaType, typeof personas.athletes][]).map(([key, item]) => {
          const isSelected = selectedPersona === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedPersona(key)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 flex items-start gap-2.5 ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-[#fafaf9] hover:bg-slate-100 text-[#3f3f46] border-[#e5e5e3]"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-xs font-bold leading-tight">{item.title}</div>
                <div
                  className={`text-[10px] line-clamp-1 pt-0.5 ${
                    isSelected ? "text-slate-300" : "text-[#71717a]"
                  }`}
                >
                  {key === "athletes"
                    ? "Running & Training"
                    : key === "sensitive"
                    ? "Asthma / Allergy"
                    : key === "vulnerable"
                    ? "Kids & Seniors"
                    : "Office & Commute"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Real-time Health Recommendation Banner */}
      <div className="p-4 rounded-xl border border-[#e5e5e3] bg-gradient-to-br from-slate-50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#71717a]">
              Active Telemetry ({currentFrame.displayTime} IST):
            </span>
            <span className="text-sm font-extrabold font-mono text-[#1d1d1d]">{pm25} µg/m³</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${statusColor}`}>
            <StatusIcon className="w-4 h-4 shrink-0" />
            <span>{statusText}</span>
          </div>
        </div>

        <div className="text-xs text-[#52525b] max-w-md">
          {persona.desc}
        </div>
      </div>

      {/* 24-Hour Diurnal Activity Planner Track */}
      <div className="space-y-2 bg-[#fafaf9] p-4 rounded-xl border border-[#ebebe9]">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#3f3f46]">
          <span>Typical 24-Hour Outdoor Activity Windows ({stationMeta.name.split(",")[0]})</span>
          <div className="flex items-center gap-3 text-[10px] font-normal">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Caution
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Avoid
            </span>
          </div>
        </div>

        {/* 24-Hour Bar Strip */}
        <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 pt-2">
          {hourlyStatus.map((h) => {
            const bg =
              h.level === "safe"
                ? "bg-emerald-500 hover:bg-emerald-600"
                : h.level === "caution"
                ? "bg-amber-400 hover:bg-amber-500"
                : "bg-rose-500 hover:bg-rose-600";
            return (
              <div key={h.hour} className="group relative flex flex-col items-center">
                <div className={`w-full h-8 rounded ${bg} transition-colors cursor-pointer`} />
                <span className="text-[9px] font-mono text-[#71717a] pt-1">{h.hour}h</span>

                {/* Tooltip on hover */}
                <div className="hidden group-hover:block absolute bottom-full mb-1 z-20 px-2 py-1 bg-slate-900 text-white text-[10px] rounded whitespace-nowrap shadow-md font-mono pointer-events-none">
                  {h.hour}:00 IST: {h.mean} µg/m³ ({h.level.toUpperCase()})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Targeted Recommendations List */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#3f3f46]">
          Key Medical &amp; Practical Protective Measures
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {persona.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white border border-[#e5e5e3] shadow-2xs text-xs text-[#3f3f46] flex items-start gap-2.5"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold shrink-0">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

