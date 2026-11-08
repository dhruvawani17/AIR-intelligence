"use client";

import React, { useEffect, useState, useRef } from "react";
import { StationMeta, TimelineFrame } from "@/types";
import { Satellite, Map as MapIcon, Mountain, Layers, Eye } from "lucide-react";

interface MapProps {
  stations: Record<string, StationMeta>;
  selectedStationId: string;
  onSelectStation: (id: string) => void;
  currentFrame: TimelineFrame;
}

export const MumbaiMap: React.FC<MapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  currentFrame,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentTileLayerRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Map mode: Google Hybrid Satellite, Google Roadmap, Google Terrain
  const [mapMode, setMapMode] = useState<"hybrid" | "roadmap" | "terrain">("roadmap");

  const stationTheme: Record<string, { bg: string; border: string; text: string; hex: string }> = {
    "11606": { bg: "bg-emerald-600", border: "border-emerald-500", text: "text-white", hex: "#059669" }, // Borivali
    "11611": { bg: "bg-blue-600", border: "border-blue-500", text: "text-white", hex: "#2563EB" },       // Malad
    "3409510": { bg: "bg-amber-500", border: "border-amber-500", text: "text-white", hex: "#D97706" },   // Byculla
    "3409511": { bg: "bg-rose-600", border: "border-rose-500", text: "text-white", hex: "#E11D48" },     // Shivaji Nagar
  };

  // Google Tile URLs (Official direct Google Maps tile servers - 100% watermark-free)
  const getGoogleTileUrl = (mode: "hybrid" | "roadmap" | "terrain") => {
    switch (mode) {
      case "hybrid":
        // Google Satellite with roads and landmark labels
        return "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
      case "terrain":
        // Google Terrain with topography and contours
        return "https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}";
      case "roadmap":
      default:
        // Google Roadmap with clean vector streets and labels
        return "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
    }
  };

  // Build marker HTML
  const buildMarkerHTML = (st: StationMeta, frameData: any, isSelected: boolean) => {
    const color = frameData.color || "#06B6D4";
    return `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
        ${
          isSelected
            ? `<div style="
                position: absolute;
                top: -6px;
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background-color: ${color};
                opacity: 0.35;
                animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>`
            : ""
        }
        <div style="
          position: relative;
          width: ${isSelected ? "44px" : "36px"};
          height: ${isSelected ? "44px" : "36px"};
          border-radius: 50%;
          background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
          border: ${isSelected ? `3px solid ${color}` : `2.5px solid ${color}`};
          box-shadow: 0 4px 14px ${color}70;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        ">
          <span style="
            color: #0F172A;
            font-size: ${isSelected ? "12px" : "11px"};
            font-weight: 800;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            line-height: 1;
          ">${Math.round(frameData.value)}</span>
        </div>
        <div style="
          margin-top: 5px;
          white-space: nowrap;
          background-color: ${isSelected ? color : "rgba(255, 255, 255, 0.95)"};
          border: 1px solid ${color};
          color: ${isSelected ? "#FFFFFF" : "#1E293B"};
          font-size: 10px;
          font-family: inherit;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        ">${st.name.split(",")[0]}</div>
      </div>
    `;
  };

  // Initialize Map with Google Maps Tiles (Zero Watermark)
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [19.115, 72.865],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      // Add Google Maps Tile Layer
      const tileLayer = L.tileLayer(getGoogleTileUrl(mapMode), {
        maxZoom: 20,
        subdomains: ["0", "1", "2", "3"],
        attribution: "Google Maps",
      }).addTo(map);

      currentTileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;
      setIsLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer on Mode Change
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (currentTileLayerRef.current) {
        map.removeLayer(currentTileLayerRef.current);
      }

      const newTileLayer = L.tileLayer(getGoogleTileUrl(mapMode), {
        maxZoom: 20,
        subdomains: ["0", "1", "2", "3"],
        attribution: "Google Maps",
      }).addTo(map);

      currentTileLayerRef.current = newTileLayer;
    });
  }, [mapMode, isLoaded]);

  // Update Markers
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      Object.values(stations).forEach((st) => {
        const frameData = currentFrame.stations[st.id] || {
          value: 35,
          color: "#06B6D4",
          category: "Satisfactory",
        };
        const isSelected = selectedStationId === st.id;

        const customIcon = L.divIcon({
          className: "clean-station-marker",
          html: buildMarkerHTML(st, frameData, isSelected),
          iconSize: [46, 56],
          iconAnchor: [23, 56],
        });

        if (markersRef.current[st.id]) {
          markersRef.current[st.id].setIcon(customIcon);
        } else {
          const marker = L.marker([st.lat, st.lon], { icon: customIcon })
            .addTo(map)
            .on("click", () => onSelectStation(st.id));
          markersRef.current[st.id] = marker;
        }
      });
    });
  }, [isLoaded, currentFrame, selectedStationId, stations, onSelectStation]);

  const selectedStation = stations[selectedStationId] || Object.values(stations)[0];
  const selectedStationData = currentFrame.stations[selectedStationId] || {
    value: 0,
    category: "Unknown",
    color: "#71717a",
  };
  const selectedColor = selectedStationData.color || "#2563EB";

  return (
    <div className="w-full bg-white border border-[#e5e5e3] rounded-xl overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-[#e5e5e3] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Geospatial Observation Grid
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Google Maps Platform · High-Res
            </span>
          </div>
          <h3 className="text-base font-bold text-[#1d1d1d] flex items-center gap-2 pt-0.5">
            Mumbai Ambient Air Monitoring Network
          </h3>
        </div>

        {/* Controls: Google Map Layer Toggles & Station Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center gap-0.5 bg-[#f4f4f2] p-0.5 rounded-lg border border-[#e5e5e3]">
            <button
              onClick={() => setMapMode("roadmap")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                mapMode === "roadmap"
                  ? "bg-white text-[#1d1d1d] shadow-xs"
                  : "text-[#71717a] hover:text-[#1d1d1d]"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-blue-600" />
              Google Roadmap
            </button>
            <button
              onClick={() => setMapMode("hybrid")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                mapMode === "hybrid"
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-xs"
                  : "text-[#71717a] hover:text-[#1d1d1d]"
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              Google Satellite
            </button>
            <button
              onClick={() => setMapMode("terrain")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                mapMode === "terrain"
                  ? "bg-white text-[#1d1d1d] shadow-xs"
                  : "text-[#71717a] hover:text-[#1d1d1d]"
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-emerald-600" />
              Terrain
            </button>
          </div>

          {/* Station Quick Selector */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {Object.values(stations).map((st) => {
              const isSelected = selectedStationId === st.id;
              const theme = stationTheme[st.id] || { bg: "bg-blue-600", text: "text-white" };
              return (
                <button
                  key={st.id}
                  onClick={() => onSelectStation(st.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isSelected
                      ? `${theme.bg} text-white shadow-xs`
                      : "bg-white text-[#52525b] border border-[#e5e5e3] hover:text-[#1d1d1d] hover:bg-[#f4f4f2]"
                  }`}
                >
                  {st.name.split(",")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Canvas and Floating Overlays */}
      <div className="relative w-full h-[480px] bg-[#f8f8f7]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Station Inspector Card */}
        <div className="absolute bottom-4 left-4 z-10 max-w-sm w-full bg-white/95 backdrop-blur-md border border-[#e5e5e3] rounded-xl overflow-hidden shadow-lg text-[#1d1d1d]">
          {/* Top colored accent bar */}
          <div className="h-1.5 w-full" style={{ backgroundColor: selectedColor }} />

          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-[#f0f0ee] pb-2.5">
              <div>
                <div className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider">
                  Station ID · {selectedStation.id}
                </div>
                <h4 className="text-sm font-bold text-[#1d1d1d]">{selectedStation.name}</h4>
                <div className="text-[11px] text-[#52525b]">
                  {selectedStation.zone} · {selectedStation.stationType}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold font-mono tracking-tight" style={{ color: selectedColor }}>
                  {selectedStationData.value.toFixed(1)}
                </div>
                <div className="text-[10px] font-mono text-[#71717a]">µg/m³ PM2.5</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#71717a] block uppercase font-mono">Air Quality</span>
                <span
                  className="font-bold text-xs inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mt-1"
                  style={{
                    backgroundColor: `${selectedColor}18`,
                    color: selectedColor,
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor }} />
                  {selectedStationData.category}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#71717a] block uppercase font-mono">24h Historical Mean</span>
                <span className="font-mono font-bold text-[#1d1d1d] pt-1 block">
                  {selectedStation.metrics.allTimeMean} µg/m³
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend Bar with vibrant colors */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md border border-[#e5e5e3] rounded-lg px-3.5 py-2 shadow-sm hidden sm:flex items-center gap-3 text-[11px] font-mono text-[#52525b]">
          <span className="text-[#1d1d1d] font-bold text-[10px] uppercase">NAQI Scale:</span>
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Good (&lt;30)
          </div>
          <div className="flex items-center gap-1.5 text-cyan-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" /> Satisfactory (30–60)
          </div>
          <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Moderate (60–90)
          </div>
          <div className="flex items-center gap-1.5 text-rose-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Poor (&gt;90)
          </div>
        </div>
      </div>
    </div>
  );
};
