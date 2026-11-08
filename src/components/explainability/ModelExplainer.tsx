"use client";

import React from "react";
import { ModelExplainability } from "@/types";
import { Cpu, ShieldCheck, Info, Layers, Activity } from "lucide-react";

interface ExplainerProps {
  data: ModelExplainability;
}

export const ModelExplainer: React.FC<ExplainerProps> = ({ data }) => {
  const harmonicColors = [
    { border: "border-l-indigo-500", text: "text-indigo-600", bg: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-700" },
    { border: "border-l-cyan-500", text: "text-cyan-600", bg: "bg-cyan-50", badge: "bg-cyan-100 text-cyan-700" },
    { border: "border-l-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
    { border: "border-l-amber-500", text: "text-amber-600", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  ];

  const featureGradients = [
    "from-indigo-500 to-cyan-500",
    "from-cyan-500 to-teal-400",
    "from-teal-500 to-emerald-400",
    "from-amber-500 to-orange-400",
  ];

  return (
    <div className="w-full space-y-6">
      {/* Technical Architecture & Feature Rationale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mathematical Mechanics */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#e5e5e3] rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-[#f0f0ee] pb-3">
              <h3 className="text-sm font-bold tracking-wider text-[#1d1d1d] uppercase flex items-center gap-2">
                <span className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                  <Cpu className="w-4 h-4" />
                </span>
                Physical Harmonic Decomposition
              </h3>
              <p className="text-xs text-[#71717a] font-mono pt-1">
                Orthogonal Fourier basis functions with optimal L2 Tikhonov Regularization (α = 15.0)
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {data.modelMetadata.harmonics.map((h, i) => {
                const style = harmonicColors[i % harmonicColors.length];
                return (
                  <div
                    key={i}
                    className={`p-3.5 rounded-lg border border-[#f0f0ee] border-l-4 ${style.border} ${style.bg}/30 space-y-1 transition-all hover:shadow-xs`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${style.text}`}>{h.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                        Freq: {h.frequency}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#52525b] font-sans pt-1">
                      <span className="font-semibold text-[#1d1d1d]">Physical Driver: </span>
                      {h.physicalDriver}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Feature Weights */}
            <div className="space-y-2 pt-2 border-t border-[#f0f0ee]">
              <h4 className="text-xs font-mono font-bold text-[#1d1d1d] uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                Relative Feature Importances
              </h4>
              <div className="space-y-2.5 font-mono text-xs pt-1">
                {data.featureWeights.map((f, i) => (
                  <div key={i} className="space-y-1.5 bg-[#fafafa] p-2.5 rounded-lg border border-[#f0f0ee]">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#1d1d1d] font-semibold">{f.feature}</span>
                      <span className="text-indigo-600 font-bold">{Math.round(f.importance * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#e5e5e3] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${featureGradients[i % featureGradients.length]} rounded-full`}
                        style={{ width: `${f.importance * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Validation Protocol & Scientific Limitations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#e5e5e3] rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-[#f0f0ee] pb-3">
              <h3 className="text-sm font-bold tracking-wider text-[#1d1d1d] uppercase flex items-center gap-2">
                <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                Cross-Validation Protocol
              </h3>
              <p className="text-xs text-[#71717a] font-mono pt-1">
                Forward-chaining chronological holdout evaluation
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#52525b] leading-relaxed">
              <p>
                To avoid lookahead bias and temporal leakage, the model was cross-validated using a chronological 
                sliding window rather than randomized k-fold splits.
              </p>
              <div className="p-3 bg-gradient-to-br from-emerald-50/60 to-cyan-50/60 border border-emerald-100 rounded-lg space-y-2 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#52525b]">Training Range:</span>
                  <span className="text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                    Oct 31 – Nov 03
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#52525b]">Forecasting Horizon:</span>
                  <span className="text-indigo-800 font-bold bg-white px-2 py-0.5 rounded border border-indigo-200">
                    Nov 03 – Nov 06
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#52525b]">Observation Cadence:</span>
                  <span className="text-cyan-800 font-bold bg-white px-2 py-0.5 rounded border border-cyan-200">
                    1-Hour Continuous
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e5e5e3] rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-mono uppercase font-bold">
              <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                <Info className="w-4 h-4" />
              </span>
              Scientific Scope &amp; Real-World Dynamics
            </div>
            <p className="text-xs text-[#52525b] leading-relaxed">
              While Fourier Ridge regression cleanly models regular atmospheric tides, real-world deployment requires coupling with numerical weather prediction (WRF-Chem) to account for episodic events like sudden convective rainfall or agricultural stubble burn plumes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
