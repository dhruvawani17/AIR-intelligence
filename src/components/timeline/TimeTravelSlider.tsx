"use client";

import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, Clock, Sparkles, Flame, Wind, Calendar, Zap } from "lucide-react";
import { TimelineFrame } from "@/types";

interface TimelineProps {
  timeline: TimelineFrame[];
  currentIndex: number;
  onIndexChange: (index: number | ((prev: number) => number)) => void;
}

export const TimeTravelSlider: React.FC<TimelineProps> = ({
  timeline,
  currentIndex,
  onIndexChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(80, Math.round(500 / playbackSpeed));
      timerRef.current = setInterval(() => {
        onIndexChange((prev: any) => {
          const currentVal = typeof prev === "number" ? prev : currentIndex;
          if (currentVal >= timeline.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return currentVal + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, timeline.length, onIndexChange, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        const step = e.shiftKey ? 6 : 1;
        onIndexChange((prev: any) => Math.min(timeline.length - 1, (typeof prev === "number" ? prev : currentIndex) + step));
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        const step = e.shiftKey ? 6 : 1;
        onIndexChange((prev: any) => Math.max(0, (typeof prev === "number" ? prev : currentIndex) - step));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [timeline.length, onIndexChange, currentIndex]);

  const currentFrame = timeline[currentIndex] || timeline[0];
  const progressPercent = (currentIndex / Math.max(1, timeline.length - 1)) * 100;

  // Preset event bookmarks
  const eventBookmarks = [
    { label: "Baseline (Nov 01)", index: 36, icon: "🌿", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { label: "Diwali Eve (Nov 07)", index: 188, icon: "🪔", color: "text-amber-800 bg-amber-50 border-amber-200" },
    { label: "Midnight Peak (Nov 08)", index: 215, icon: "💥", color: "text-purple-800 bg-purple-50 border-purple-200" },
    { label: "Sea Breeze Flush (Nov 10)", index: 252, icon: "🌊", color: "text-cyan-800 bg-cyan-50 border-cyan-200" },
    { label: "Private Window (Nov 11+)", index: 264, icon: "🔮", color: "text-indigo-800 bg-indigo-50 border-indigo-200" },
  ];

  return (
    <div className="w-full bg-white border border-[#e5e5e3] rounded-2xl p-5 shadow-xs space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0ee] pb-3">
        <div className="space-y-0.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 font-semibold">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Continuous Timeline Controller · 432-Hour Full Competition Horizon
          </div>
          <h3 className="text-base font-bold text-[#1d1d1d] flex items-center gap-2">
            Observation, Diwali Festival Shockwave &amp; ML Horizon
          </h3>
        </div>

        {/* Current Timestamp Display */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-mono font-extrabold text-[#1d1d1d]">
              {currentFrame.displayTime} IST
            </div>
            <div className="text-[11px] font-mono flex items-center justify-end gap-1.5 pt-0.5 font-semibold">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentFrame.isForecast ? "bg-indigo-600 animate-pulse" : "bg-emerald-500"
                }`}
              />
              <span className={currentFrame.isForecast ? "text-indigo-600" : "text-emerald-700"}>
                {currentFrame.isForecast ? "Champion ML Forecast Window" : "Verified CAAQMS Telemetry"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Phase & Wind Regime Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-[#e5e5e3] text-xs">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[#71717a]">Aerosol Regime:</span>
          <span className="font-bold text-indigo-900">{currentFrame.atmosphericPhase}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[#52525b]">
          <Wind className="w-3.5 h-3.5 text-cyan-600" />
          <span>Wind:</span>
          <span className="font-semibold text-slate-800">{currentFrame.windRegime}</span>
        </div>
      </div>

      {/* Main Slider Track with multi-stop dynamic gradient */}
      <div className="space-y-2 pt-1">
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min={0}
            max={timeline.length - 1}
            value={currentIndex}
            onChange={(e) => onIndexChange(Number(e.target.value))}
            className="w-full h-3.5 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            style={{
              background: `linear-gradient(to right, #10B981 0%, #06B6D4 40%, #8B5CF6 55%, #6366F1 ${progressPercent}%, #E2E8F0 ${progressPercent}%, #E2E8F0 100%)`,
            }}
          />
        </div>

        {/* Date Milestones under track */}
        <div className="flex justify-between items-center text-[10px] font-mono text-[#71717a] px-0.5 pt-0.5">
          <span className="text-emerald-700 font-semibold">31 Oct (Start)</span>
          <span className="hidden sm:inline">04 Nov</span>
          <span className="text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
            08 Nov · Diwali Peak
          </span>
          <span className="text-cyan-700 font-semibold hidden sm:inline">10 Nov · Maritime Flush</span>
          <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
            11 Nov · Private Window
          </span>
          <span className="text-slate-600 font-semibold">17 Nov (End)</span>
        </div>
      </div>

      {/* Quick Jump Event Bookmarks */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] font-mono uppercase text-[#71717a] font-bold flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3 text-amber-500" /> Key Events:
        </span>
        {eventBookmarks.map((b) => (
          <button
            key={b.index}
            onClick={() => onIndexChange(b.index)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 shadow-2xs hover:scale-105 ${
              Math.abs(currentIndex - b.index) <= 2
                ? "ring-2 ring-indigo-500 ring-offset-1 font-bold " + b.color
                : b.color + " opacity-85 hover:opacity-100"
            }`}
          >
            <span>{b.icon}</span>
            <span>{b.label}</span>
          </button>
        ))}
      </div>

      {/* Playback Controls & Frame Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f0f0ee]">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Play Timeline
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              setIsPlaying(false);
              onIndexChange(0);
            }}
            className="p-1.5 rounded-lg border border-[#e5e5e3] hover:bg-[#f4f4f2] text-[#52525b] hover:text-[#1d1d1d] transition-colors"
            title="Reset to start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggles */}
          <div className="flex items-center gap-0.5 bg-[#f4f4f2] p-0.5 rounded-lg border border-[#e5e5e3]">
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all ${
                  playbackSpeed === s
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-xs"
                    : "text-[#71717a] hover:text-[#1d1d1d]"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="hidden md:inline-flex text-[10px] text-[#71717a] font-mono pl-2">
            Tip: Press Space to Play/Pause, Arrow keys to step 1hr
          </span>
        </div>

        {/* Frame Info */}
        <div className="text-[11px] font-mono text-[#71717a] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Hour <span className="font-bold text-indigo-700">{currentIndex + 1}</span> of{" "}
          <span>{timeline.length}</span>
        </div>
      </div>
    </div>
  );
};
