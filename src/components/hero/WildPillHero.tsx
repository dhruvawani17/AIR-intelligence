"use client";

import React, { useEffect, useRef, useState } from "react";
import { StationMeta } from "@/types";

interface WildPillHeroProps {
  stations: Record<string, StationMeta>;
  onExploreClick: () => void;
  latestAvgPM25: number;
}

export const WildPillHero: React.FC<WildPillHeroProps> = ({
  stations,
  onExploreClick,
  latestAvgPM25,
}) => {
  const [soundWavesActive, setSoundWavesActive] = useState(true);
  const [isReplaying, setIsReplaying] = useState(false);
  const [animProgress, setAnimProgress] = useState(0); // 0 to 1
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Animation controller (2.1s duration, supports reverse on replay)
  useEffect(() => {
    let startTime: number | null = null;
    const DURATION = 2100; // 2.1s
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / DURATION);
      setAnimProgress(progress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReplaying]);

  // Handle replay interaction ("Let's Get Wild" / "Let's Explore Mumbai")
  const handleReplay = () => {
    if (isReplaying) return;
    setIsReplaying(true);

    // Smooth reverse collapse then expand
    let startRevTime: number | null = null;
    const REV_DURATION = 900;

    const revAnimate = (timestamp: number) => {
      if (!startRevTime) startRevTime = timestamp;
      const elapsed = timestamp - startRevTime;
      const progress = 1 - Math.min(1, elapsed / REV_DURATION);
      setAnimProgress(progress);

      if (progress > 0) {
        requestAnimationFrame(revAnimate);
      } else {
        setTimeout(() => {
          setIsReplaying(false);
        }, 150);
      }
    };

    requestAnimationFrame(revAnimate);
  };

  // Easing helper
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const smoothStep = (t: number) => t * t * (3 - 2 * t);

  // Calculate dynamic animation values based on exact spec:
  // 1. Pill width (0 to 14% hairline 0.012fs, 14-30% slit 0.16fs, 30-58% circle 1.81fs, 58-100% final 3.62fs)
  let pillWidthEm = 0.012;
  if (animProgress <= 0.14) {
    pillWidthEm = 0.012;
  } else if (animProgress <= 0.3) {
    const t = smoothStep((animProgress - 0.14) / 0.16);
    pillWidthEm = 0.012 + t * (0.16 - 0.012);
  } else if (animProgress <= 0.58) {
    const t = smoothStep((animProgress - 0.3) / 0.28);
    pillWidthEm = 0.16 + t * (1.81 - 0.16);
  } else {
    const t = smoothStep((animProgress - 0.58) / 0.42);
    pillWidthEm = 1.81 + t * (3.62 - 1.81);
  }

  // 2. Pill clip: 0-14% grows vertically from inset(50% 0) to inset(0)
  const clipPercent = animProgress <= 0.14 ? (1 - animProgress / 0.14) * 50 : 0;

  // 3. Hairline grey overlay: fades out between 14% and 30%
  let overlayOpacity = 1;
  if (animProgress > 0.14 && animProgress <= 0.3) {
    overlayOpacity = 1 - (animProgress - 0.14) / 0.16;
  } else if (animProgress > 0.3) {
    overlayOpacity = 0;
  }

  // 4. Word gap: 0.026em until 14%, 0.05em at 58%, then 0.085em
  let wordGapEm = 0.026;
  if (animProgress <= 0.14) {
    wordGapEm = 0.026;
  } else if (animProgress <= 0.58) {
    const t = (animProgress - 0.14) / 0.44;
    wordGapEm = 0.026 + t * (0.05 - 0.026);
  } else {
    const t = (animProgress - 0.58) / 0.42;
    wordGapEm = 0.05 + t * (0.085 - 0.05);
  }

  // 5. Paper background fade in: 45% to 78%
  const paperOpacity = clamp01((animProgress - 0.45) / 0.33);

  // 6. Nav slide in: -140% to 0% between 50% and 86%
  const navProgress = clamp01((animProgress - 0.5) / 0.36);
  const navTranslateY = (1 - smoothStep(navProgress)) * -140;

  // 7. Footer rise: +160% to 0% between 52% and 90%
  const footerProgress = clamp01((animProgress - 0.52) / 0.38);
  const footerTranslateY = (1 - smoothStep(footerProgress)) * 160;

  // 8. Rule draw: scaleX 0 to 1 between 40% and 95%
  const ruleScaleX = smoothStep(clamp01((animProgress - 0.4) / 0.55));

  // 9. Icons opacity: fade in after 80%
  const iconsOpacity = clamp01((animProgress - 0.8) / 0.2) * 0.85;

  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none transition-colors duration-700"
      style={{
        backgroundColor: `rgba(242, 242, 241, ${paperOpacity})`,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Soft Paper Background SVG with ~15 flowing S-curves */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 z-0"
        style={{ opacity: paperOpacity }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <g stroke="#ffffff" fill="none">
          <path d="M-100,900 C300,750 600,600 1100,200 S1600,-50 1700,-100" strokeWidth="2.2" opacity="0.75" />
          <path d="M-50,850 C350,700 700,550 1150,150 S1550,-10 1650,-60" strokeWidth="1.8" opacity="0.65" />
          <path d="M0,800 C400,660 750,510 1200,110 S1500,20 1600,-20" strokeWidth="3.2" opacity="0.80" />
          <path d="M50,750 C450,620 800,470 1250,70 S1450,50 1550,10" strokeWidth="1.5" opacity="0.58" />
          <path d="M-150,950 C250,800 550,650 1050,250 S1650,-90 1750,-140" strokeWidth="2.8" opacity="0.70" />
          <path d="M100,700 C500,580 850,430 1300,30 S1400,80 1500,40" strokeWidth="1.3" opacity="0.55" />
          <path d="M-80,880 C320,730 630,580 1120,180 S1580,-30 1680,-80" strokeWidth="3.8" opacity="0.85" />
          <path d="M150,650 C550,540 900,390 1350,-10 S1380,110 1450,70" strokeWidth="2.0" opacity="0.62" />
          <path d="M-30,820 C370,680 720,530 1170,130 S1520,0 1620,-40" strokeWidth="1.6" opacity="0.68" />
          <path d="M200,600 C600,500 950,350 1400,-50 S1350,140 1400,100" strokeWidth="2.6" opacity="0.72" />
          <path d="M-120,920 C280,770 580,620 1080,220 S1620,-70 1720,-120" strokeWidth="3.5" opacity="0.78" />
          <path d="M70,730 C470,600 820,450 1270,50 S1430,60 1530,20" strokeWidth="1.4" opacity="0.60" />
          <path d="M250,550 C650,460 1000,310 1450,-90 S1300,170 1350,130" strokeWidth="1.9" opacity="0.66" />
          <path d="M-60,860 C340,710 680,560 1140,160 S1560,-20 1660,-70" strokeWidth="2.4" opacity="0.74" />
          <path d="M120,680 C520,560 870,410 1320,10 S1390,90 1480,50" strokeWidth="3.0" opacity="0.82" />
        </g>
      </svg>

      {/* TOP NAV: Drops in from -140% */}
      <header
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between text-[#1d1d1d] font-medium"
        style={{
          transform: `translateY(${navTranslateY}%)`,
          padding: "calc(0.14 * var(--fs)) calc(0.27 * var(--fs))",
          fontSize: "max(12px, calc(0.072 * var(--fs)))",
          fontWeight: 450,
        }}
      >
        <div className="flex items-center gap-3 sm:gap-6 tracking-tight">
          <a href="#dashboard" onClick={onExploreClick} className="hover:text-black transition-colors cursor-pointer">
            Home
          </a>
          <span className="text-[#a9a9a6]">·</span>
          <a href="#dashboard" onClick={onExploreClick} className="hover:text-black transition-colors cursor-pointer">
            Live Map
          </a>
          <span className="text-[#a9a9a6]">·</span>
          <a href="#dashboard" onClick={onExploreClick} className="hover:text-black transition-colors cursor-pointer">
            Forecast
          </a>
          <span className="text-[#a9a9a6]">·</span>
          <a href="#dashboard" onClick={onExploreClick} className="hover:text-black transition-colors cursor-pointer">
            Station Analysis
          </a>
          <span className="text-[#a9a9a6]">·</span>
          <a href="#dashboard" onClick={onExploreClick} className="hover:text-black transition-colors cursor-pointer">
            Contact Us
          </a>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[#3a3a3a]">
          <span className="text-[11px] font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-[#e5e5e3] text-[#1d1d1d]">
            ZINDI RANK #3
          </span>
          <span className="text-[#a9a9a6]">·</span>
          <span className="text-xs font-mono">OpenAQ Network</span>
        </div>
      </header>

      {/* CENTER HERO: MUM · pill · BAI */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20"
        style={{
          top: "43%",
          transform: "translate(-50%, -50%)",
          gap: `${wordGapEm}em`,
        }}
      >
        {/* Left half: MUM */}
        <span
          className="text-[#1d1d1d] font-extrabold select-none tracking-[-0.045em] leading-[0.8] whitespace-nowrap"
          style={{ fontSize: "var(--fs)" }}
        >
          MUM
        </span>

        {/* The Animated Video Pill */}
        <div
          className="relative rounded-full overflow-hidden bg-[#d8d3cf] shadow-xl flex items-center justify-center shrink-0"
          style={{
            height: "1.81em",
            width: `${pillWidthEm}em`,
            fontSize: "var(--fs)",
            clipPath: `inset(${clipPercent}% 0)`,
            transition: "none",
          }}
        >
          {/* Loop Video */}
          <video
            ref={videoRef}
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/175fbbcd-e50a-480c-bab2-ca16d4678322.mp4"
            poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/726b168c-da47-4682-a255-cc3e02f89bae.jpg"
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-1/2 -translate-x-1/2 h-full min-w-[4.2em] object-cover pointer-events-none"
            style={{ objectPosition: "center top" }}
          />

          {/* Hairline Grey Overlay (Fades out 14% to 30%) */}
          <div
            className="absolute inset-0 bg-[#b9b9b9] pointer-events-none transition-opacity duration-150"
            style={{ opacity: overlayOpacity }}
          />

          {/* Left Line Icon: Breeze / Wind */}
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300"
            style={{ opacity: iconsOpacity }}
          >
            <svg
              className="w-4 h-4 text-white drop-shadow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
            </svg>
          </div>

          {/* Right Line Icon: Speaker with toggling waves */}
          <button
            onClick={() => setSoundWavesActive(!soundWavesActive)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer z-10 transition-opacity duration-300 focus:outline-none"
            style={{ opacity: iconsOpacity }}
            title="Toggle speaker waves"
          >
            <svg
              className="w-4 h-4 text-white drop-shadow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {soundWavesActive && (
                <>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Right half: BAI */}
        <span
          className="text-[#1d1d1d] font-extrabold select-none tracking-[-0.045em] leading-[0.8] whitespace-nowrap"
          style={{ fontSize: "var(--fs)" }}
        >
          BAI
        </span>
      </div>

      {/* FOOTER: Rises from +160% */}
      <footer
        className="absolute bottom-0 left-0 right-0 z-30 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 text-[#1d1d1d]"
        style={{
          transform: `translateY(${footerTranslateY}%)`,
          padding: "calc(0.20 * var(--fs)) calc(0.27 * var(--fs))",
        }}
      >
        {/* Left Editorial Paragraph with Drop-Cap 'E' */}
        <div
          className="text-[#3a3a3a] leading-[1.45] text-left shrink-0"
          style={{
            width: "calc(1.42 * var(--fs))",
            fontSize: "calc(0.066 * var(--fs))",
          }}
        >
          <span
            className="float-left text-[#1d1d1d] font-semibold leading-[0.8] pr-2 pt-0.5"
            style={{ fontSize: "2.35em", fontWeight: 650 }}
          >
            E
          </span>
          mbark on an atmospheric journey across Mumbai with our air quality intelligence platform. 
          Discover real-time pollution dynamics, forecast trajectories and hidden microclimates on your journey.
        </div>

        {/* Middle: 1px Rule drawn from center (scaleX 0 -> 1) */}
        <div className="hidden md:block flex-1 mx-6 mb-4 overflow-hidden">
          <div
            className="h-[1px] bg-[#a9a9a6] w-full origin-center transition-transform"
            style={{ transform: `scaleX(${ruleScaleX})` }}
          />
        </div>

        {/* Right Action Button: Replays reveal + smooth scroll option */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleReplay}
            className="group inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#1b1b1b] text-white font-medium text-xs tracking-wide shadow-md hover:bg-black transition-all duration-200 active:scale-95"
            style={{ fontSize: "max(12px, calc(0.068 * var(--fs)))" }}
          >
            Let&apos;s Get Wild
          </button>

          <button
            onClick={onExploreClick}
            className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white text-[#1d1d1d] font-semibold text-xs tracking-wide border border-[#d4d4d2] hover:bg-[#f2f2f1] transition-all shadow-sm"
            style={{ fontSize: "max(12px, calc(0.068 * var(--fs)))" }}
          >
            Command Center ↓
          </button>
        </div>
      </footer>

      {/* Global CSS for Type Scale */}
      <style jsx>{`
        :root {
          --fs: min(19.6vh, 13.2vw);
        }

        @media (max-width: 720px) {
          :root {
            --fs: min(34vw, 16.5vh);
          }
        }
      `}</style>
    </div>
  );
};

