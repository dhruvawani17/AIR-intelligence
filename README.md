# Mumbai Air Intelligence — Environmental Geospatial AI Platform
> *"See the pollution. Predict the risk. Understand the city."*

Developed as the creative submission for the **Google Mumbai Data Challenge**.

---

## 🌟 Executive Summary

**Mumbai Air Intelligence** is a production-grade geospatial and environmental intelligence terminal combining:
1. **Interactive Geospatial Station Intelligence**: High-resolution mapping of all 4 CAAQMS stations (*Borivali East, Malad West, Byculla, Shivaji Nagar*) with verified coordinates and microclimate classifications.
2. **Google Maps Platform Integration**: Interactive multi-layer mapping with Google Roadmap, Photorealistic Satellite Aerial, and Terrain views.
3. **"Time Travel Through Mumbai's Air"**: A continuous 145-hour interactive time-scrubbing engine bridging historical observations and physical multi-harmonic predictions.
4. **Physical Harmonic Forecasting (ECharts)**: Multi-frequency Fourier Ridge regression ($\alpha = 15.0$) capturing 24h diurnal radiative cycles, 12h bimodal traffic rush-hour spikes, and 8h sea-breeze thermal dispersal.
5. **Atmospheric Diagnostics**: Deep-dive analysis covering Arabian sea breeze ventilation, nocturnal temperature inversion trapping, and microclimate disparities.
6. **Scientific Rigor & Data Integrity**: 100% of observations and predictions are grounded in actual CAAQMS open datasets. No fabricated measurements.

---

## 🎨 Visual Design System

- **Design Philosophy**: High-end Swiss/editorial typography meets high-precision environmental analytics.
- **Background Palette**: Museum-grade warm paper (`#f2f2f1`, `#ffffff`) with crisp ink typography (`#1d1d1d`).
- **Station Color Identities**:
  - **Borivali East**: Vibrant Emerald (`#059669`)
  - **Malad West**: Coastal Azure (`#2563EB`)
  - **Byculla**: Warm Amber Gold (`#D97706`)
  - **Shivaji Nagar**: Sunset Crimson / Coral (`#E11D48`)
- **Mapping**: Google Maps Platform with Roadmap, Satellite Hybrid, and Terrain layers.

---

## 🗺️ Monitored Station Network

| Station ID | Station Name | Zone | Coordinates | Elevation | Operator | Microclimate Dynamic |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **`11606`** | Borivali East | North Mumbai | `19.2324° N, 72.8690° E` | 28m | IITM - SAFAR | Sanjay Gandhi National Park vegetative canopy buffer |
| **`11611`** | Malad West | Western Suburbs | `19.1971° N, 72.8220° E` | 14m | IITM - SAFAR | Strong midday Arabian Sea breeze onshore ventilation |
| **`3409510`** | Byculla | South Mumbai Core | `18.9767° N, 72.8380° E` | 19m | BMC / MPCB | Dense urban commercial corridor vehicular emissions |
| **`3409511`** | Shivaji Nagar | Eastern Suburbs | `19.0605° N, 72.9234° E` | 22m | BMC / MPCB | Industrial belt & nocturnal boundary-layer inversion trapping |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/dhruvawani17/AIR-intelligence.git
cd AIR-intelligence

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open your browser at:
```
http://localhost:3000
```

### Production Build & Serve
```bash
npm run build
npm start
```

---

## 🚢 Deployment Guide

### Vercel (One-Click)
1. Push to your GitHub repository.
2. Import the repository in [Vercel](https://vercel.com).
3. Framework Preset: **Next.js**.
4. Click **Deploy**.

---

## 📜 Compliance & Attribution

Developed as a creative submission for the **Google Mumbai Data Challenge** on Zindi. Built using open environmental datasets (OpenAQ, IITM-SAFAR, CPCB).
