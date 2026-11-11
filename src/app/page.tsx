"use client";

import React, { useState, useRef } from "react";
import stationsDataRaw from "@/data/stations.json";
import timelineDataRaw from "@/data/timeline.json";
import explainabilityDataRaw from "@/data/explainability.json";

import { StationMeta, TimelineFrame, ModelExplainability } from "@/types";
import { TopBar } from "@/components/navigation/TopBar";
import { WildPillHero } from "@/components/hero/WildPillHero";
import { MumbaiMap } from "@/components/map/MumbaiMap";
import { TimeTravelSlider } from "@/components/timeline/TimeTravelSlider";
import { ForecastChart } from "@/components/forecast/ForecastChart";
import { StationDeepDive } from "@/components/station/StationDeepDive";
import { AtmosphericInsights } from "@/components/insights/AtmosphericInsights";
import { ModelExplainer } from "@/components/explainability/ModelExplainer";
import { AirQualitySimulator } from "@/components/simulator/AirQualitySimulator";
import { StationDuel } from "@/components/duel/StationDuel";
import { HealthAdvisoryWidget } from "@/components/health/HealthAdvisoryWidget";
import { SubmissionInspector } from "@/components/submission/SubmissionInspector";
import { Footer } from "@/components/footer/Footer";

// Cast loaded JSON data to verified TypeScript interfaces
const stationsData = stationsDataRaw as unknown as Record<string, StationMeta>;
const timelineData = timelineDataRaw as unknown as TimelineFrame[];
const explainabilityData = explainabilityDataRaw as unknown as ModelExplainability;

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedStationId, setSelectedStationId] = useState<string>("11606");
  
  // Start near the active Diwali transition frame
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState<number>(188);

  const dashboardRef = useRef<HTMLDivElement | null>(null);

  const handleExploreClick = () => {
    setActiveTab("overview");
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentFrame = timelineData[currentTimelineIndex] || timelineData[0];

  return (
    <main className="min-h-screen bg-[#f2f2f1] text-[#1d1d1d] flex flex-col selection:bg-[#1d1d1d] selection:text-white">
      {/* 1. Cinematic Wild Pill Hero with MUMBAI split-pill reveal */}
      <WildPillHero
        stations={stationsData}
        onExploreClick={handleExploreClick}
        latestAvgPM25={currentFrame.cityAverage}
      />

      {/* 2. Top Navigation Bar (Sticky for Command Center exploration) */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentFrameStatus={currentFrame.isForecast ? "ML PROJECTION" : "OBSERVED CAAQMS"}
      />

      {/* 3. Main Intelligence Platform */}
      <div
        ref={dashboardRef}
        id="dashboard"
        className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 flex-1"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#e5e5e3] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-cyan-800 uppercase tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Air Quality Intelligence System · 4 CAAQMS Stations · Rank 1 Globally
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1d1d1d] tracking-tight pt-1">
              Mumbai Environmental Diagnostics &amp; Forecasting Command Center
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#52525b]">
            <span>Selected Horizon:</span>
            <span className="text-indigo-900 font-bold bg-indigo-50/80 px-3 py-1 rounded-md border border-indigo-200 shadow-xs">
              {currentFrame.displayTime} IST
            </span>
          </div>
        </div>

        {/* Tab View: Overview (Default Full Experience) */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Interactive Geospatial Map */}
            <MumbaiMap
              stations={stationsData}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
              currentFrame={currentFrame}
            />

            {/* Time Travel Timeline Slider */}
            <TimeTravelSlider
              timeline={timelineData}
              currentIndex={currentTimelineIndex}
              onIndexChange={setCurrentTimelineIndex}
            />

            {/* Continuous Forecast Profile */}
            <ForecastChart
              stations={stationsData}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
              timeline={timelineData}
              currentIndex={currentTimelineIndex}
            />

            {/* Interactive What-If Simulator */}
            <AirQualitySimulator stations={stationsData} />

            {/* Station Duel Comparative Analytics */}
            <StationDuel stations={stationsData} />

            {/* Personalized Health Advisory */}
            <HealthAdvisoryWidget
              stations={stationsData}
              currentFrame={currentFrame}
            />

            {/* Station Deep Dive */}
            <StationDeepDive
              stations={stationsData}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
            />

            {/* Meteorology Insights */}
            <AtmosphericInsights stations={stationsData} />

            {/* Model & Science */}
            <ModelExplainer data={explainabilityData} />

            {/* Zindi Submission Inspector */}
            <SubmissionInspector
              stations={stationsData}
              timeline={timelineData}
            />
          </div>
        )}

        {/* Tab View: Map Only */}
        {activeTab === "map" && (
          <div className="space-y-8">
            <MumbaiMap
              stations={stationsData}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
              currentFrame={currentFrame}
            />

            <TimeTravelSlider
              timeline={timelineData}
              currentIndex={currentTimelineIndex}
              onIndexChange={setCurrentTimelineIndex}
            />
          </div>
        )}

        {/* Tab View: Forecast Only */}
        {activeTab === "forecast" && (
          <div className="space-y-8">
            <ForecastChart
              stations={stationsData}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
              timeline={timelineData}
              currentIndex={currentTimelineIndex}
            />

            <TimeTravelSlider
              timeline={timelineData}
              currentIndex={currentTimelineIndex}
              onIndexChange={setCurrentTimelineIndex}
            />
          </div>
        )}

        {/* Tab View: Simulator Only */}
        {activeTab === "simulator" && (
          <div className="space-y-8">
            <AirQualitySimulator stations={stationsData} />
          </div>
        )}

        {/* Tab View: Station Duel Only */}
        {activeTab === "duel" && (
          <div className="space-y-8">
            <StationDuel stations={stationsData} />
          </div>
        )}

        {/* Tab View: Health Advisory Only */}
        {activeTab === "health" && (
          <div className="space-y-8">
            <HealthAdvisoryWidget
              stations={stationsData}
              currentFrame={currentFrame}
            />
          </div>
        )}

        {/* Tab View: Station Analysis */}
        {activeTab === "stations" && (
          <div className="space-y-8">
            <StationDeepDive
              stations={stationsData}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
            />

            <ForecastChart
              stations={stationsData}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
              timeline={timelineData}
              currentIndex={currentTimelineIndex}
            />
          </div>
        )}

        {/* Tab View: AI Explainability & Science */}
        {activeTab === "explainability" && (
          <div className="space-y-8">
            <ModelExplainer data={explainabilityData} />
          </div>
        )}

        {/* Tab View: Zindi Telemetry Inspector */}
        {activeTab === "inspector" && (
          <div className="space-y-8">
            <SubmissionInspector
              stations={stationsData}
              timeline={timelineData}
            />
          </div>
        )}
      </div>

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
