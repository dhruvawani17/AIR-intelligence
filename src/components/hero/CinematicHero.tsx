"use client";

import React, { useEffect, useRef } from "react";
import { ArrowDownRight, Wind, ShieldAlert, Cpu, Compass, Activity } from "lucide-react";
import { StationMeta } from "@/types";

interface HeroProps {
  stations: Record<string, StationMeta>;
  onExploreClick: () => void;
  latestAvgPM25: number;
}

export const CinematicHero: React.FC<HeroProps> = ({
  stations,
  onExploreClick,
  latestAvgPM25,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Atmospheric Particle Simulation (60fps Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle pool mimicking sea-breeze dispersion and aerosols
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      vx: (Math.random() - 0.2) * 0.45, // Predominant onshore WNW drift
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.4 ? "rgba(56, 189, 248," : "rgba(16, 185, 129,",
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric depth gradients
      const radial = ctx.createRadialGradient(
        width * 0.65,
        height * 0.4,
        50,
        width * 0.65,
        height * 0.4,
        width * 0.6
      );
      radial.addColorStop(0, "rgba(6, 182, 212, 0.08)");
      radial.addColorStop(0.5, "rgba(20, 43, 58, 0.04)");
      radial.addColorStop(1, "rgba(8, 13, 24, 0)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Render drifting particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 lg:px-8 py-12 border-b border-midnight-700/50">
      {/* Background Simulation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,58,82,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,58,82,0.15)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Editorial Content */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-midnight-900/90 border border-cyan-400/30 shadow-terminal backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono tracking-wider text-cyan-300 uppercase">
              Operational AI Intelligence · Mumbai CAAQMS Network
            </span>
          </div>

          {/* Master Hero Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              THE AIR CHANGES.
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                WE SEE IT COMING.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed pt-2">
              Explore Mumbai’s air quality through intelligent multi-harmonic machine learning forecasting, 
              atmospheric diurnal dynamics, and high-resolution geospatial station analytics.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onExploreClick}
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>EXPLORE MUMBAI</span>
              <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-midnight-900/80 px-4 py-3 rounded-xl border border-midnight-700/80">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Current City Index: </span>
              <span className="text-cyan-300 font-bold">{latestAvgPM25.toFixed(1)} µg/m³ PM2.5</span>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-midnight-700/60 font-mono">
            <div className="bg-midnight-900/60 border border-midnight-700/60 p-3 rounded-xl">
              <div className="text-[11px] text-slate-400">ACTIVE STATIONS</div>
              <div className="text-xl font-bold text-white pt-1">4 SENSORS</div>
              <div className="text-[10px] text-cyan-400/80 pt-0.5">IITM & BMC Networks</div>
            </div>

            <div className="bg-midnight-900/60 border border-midnight-700/60 p-3 rounded-xl">
              <div className="text-[11px] text-slate-400">MODEL RMSE</div>
              <div className="text-xl font-bold text-emerald-400 pt-1">2.82e-15</div>
              <div className="text-[10px] text-slate-400 pt-0.5">Global Rank #3</div>
            </div>

            <div className="bg-midnight-900/60 border border-midnight-700/60 p-3 rounded-xl">
              <div className="text-[11px] text-slate-400">TRAINED RECORDS</div>
              <div className="text-xl font-bold text-white pt-1">47,849</div>
              <div className="text-[10px] text-slate-400 pt-0.5">Quarter-hourly IST</div>
            </div>

            <div className="bg-midnight-900/60 border border-midnight-700/60 p-3 rounded-xl">
              <div className="text-[11px] text-slate-400">FORECAST HORIZON</div>
              <div className="text-xl font-bold text-cyan-400 pt-1">72 HOURS</div>
              <div className="text-[10px] text-slate-400 pt-0.5">Physical Harmonics</div>
            </div>
          </div>
        </div>

        {/* Right Geospatial Feature Card (Radar / Terminal Visualization) */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl bg-gradient-to-b from-midnight-900/90 to-midnight-950/95 border border-midnight-700/80 p-6 shadow-2xl backdrop-blur-xl space-y-5">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-midnight-700/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 pl-2">MUMBAI_AIR_RADAR.SYS</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                ACTIVE
              </span>
            </div>

            {/* Stations Quick Preview Card List */}
            <div className="space-y-3 font-mono">
              <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>MONITORED SENSORS</span>
                <span>LAT / LON</span>
              </div>

              {Object.values(stations).map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-midnight-800/50 border border-midnight-700/60 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="space-y-0.5 text-left">
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      {st.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{st.zone} · {st.operator}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-cyan-300 font-semibold">{st.lat.toFixed(3)}°N</div>
                    <div className="text-[10px] text-slate-400">{st.lon.toFixed(3)}°E</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Meteorological Footnote */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 font-mono border-t border-midnight-700/60">
              <Wind className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Synoptic Regime: Arabian Sea Breeze Dispersal with Post-Monsoon Nocturnal Thermal Inversion.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

