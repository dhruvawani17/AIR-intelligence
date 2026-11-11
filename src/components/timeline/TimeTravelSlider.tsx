"use client";

import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, Clock, Wind, Zap } from "lucide-react";
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

  // Refined event bookmarks with elegant typographic styling (no emoji clutter)
  const eventBookmarks = [
    { label: "Baseline (Nov 01)", index: 36, color: "text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200" },
    { label: "Diwali Eve (Nov 07)", index: 188, color: "text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200" },
    { label: "Midnight Stagnation (Nov 08 · 795 µg/m³)", index: 215, color: "text-purple-800 bg-purple-50 hover:bg-purple-100 border-purple-200" },
    { label: "Maritime Cleanse (Nov 10)", index: 252, color: "text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border-cyan-200" },
    { label: "Private Horizon (Nov 11+)", index: 264, color: "text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border-indigo-200" },
  ];

  return (
    <div className="w-full bg-white border border-[#e4e4e7] rounded-2xl p-6 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f4f4f5] pb-3">
        <div className="space-y-0.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 font-semibold">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Continuous Timeline Scrubber · 432-Hour Full Horizon
          </div>
          <h3 className="text-base font-bold text-[#18181b] flex items-center gap-2">
            Observation, Diwali Stagnation &amp; ML Horizon
          </h3>
        </div>

        {/* Current Timestamp Display */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-mono font-extrabold text-[#18181b]">
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
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#e4e4e7] text-xs">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[#71717a]">Aerosol Regime:</span>
          <span className="font-bold text-[#18181b]">{currentFrame.atmosphericPhase}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[#52525b]">
          <Wind className="w-3.5 h-3.5 text-cyan-600" />
          <span>Wind:</span>
          <span className="font-semibold text-[#18181b]">{currentFrame.windRegime}</span>
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
            className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-[#18181b] focus:outline-none"
            style={{
              background: `linear-gradient(to right, #10B981 0%, #06B6D4 40%, #8B5CF6 55%, #6366F1 ${progressPercent}%, #E4E4E7 ${progressPercent}%, #E4E4E7 100%)`,
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
          <span className="text-[#71717a] font-semibold">17 Nov (End)</span>
        </div>
      </div>

      {/* Quick Jump Event Bookmarks */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] font-mono uppercase text-[#71717a] font-bold flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3 text-amber-500" /> Event Milestones:
        </span>
        {eventBookmarks.map((b) => (
          <button
            key={b.index}
            onClick={() => onIndexChange(b.index)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 shadow-2xs hover:scale-105 ${
              Math.abs(currentIndex - b.index) <= 2
                ? "ring-2 ring-indigo-500 ring-offset-1 font-bold " + b.color
                : b.color
            }`}
          >
            <span>{b.label}</span>
          </button>
        ))}
      </div>

      {/* Playback Controls & Frame Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f4f4f5]">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#18181b] hover:bg-black text-white text-xs font-semibold shadow-xs transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Play Scrubber
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              setIsPlaying(false);
              onIndexChange(0);
            }}
            className="p-1.5 rounded-lg border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[#52525b] hover:text-[#18181b] transition-colors"
            title="Reset to start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggles */}
          <div className="flex items-center gap-0.5 bg-[#f4f4f5] p-0.5 rounded-lg border border-[#e4e4e7]">
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all ${
                  playbackSpeed === s
                    ? "bg-[#18181b] text-white shadow-xs"
                    : "text-[#71717a] hover:text-[#18181b]"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="hidden md:inline-flex text-[10px] text-[#71717a] font-mono pl-2">
            Space: Play/Pause · Arrow keys: Step 1h · Shift+Arrow: Step 6h
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
