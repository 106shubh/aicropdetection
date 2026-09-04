# KrishiRakshak AI 🌾
**Premium Precision Agriculture Intelligence Platform**

KrishiRakshak AI is a production-grade AgriTech platform designed to secure tomorrow's harvest today. Through advanced computer vision and predictive modeling, it identifies crop threats instantly and maps outbreak topologies across Maharashtra. 

The application is structured into a dual-persona interface serving both **Farmers** (hyper-actionable intelligence) and **Government Agencies** (macro-level predictive heatmaps).

---

## 🚀 Quick Start Guide

If you are new to this project, follow these steps to install, run, and access the server locally.

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (Node Package Manager)

### 1. Installation
Clone the repository and install the required dependencies. Due to some legacy React dependencies for specific charts, use the `--legacy-peer-deps` flag.

```bash
git clone https://github.com/106shubh/aicropdetection.git
cd aicropdetection
npm install --legacy-peer-deps
```

### 2. Running the Server
Start the Next.js development server:

```bash
npm run dev
```

### 3. Accessing the Platform
Once the server is running, open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Walkthrough & Features

The platform was built systematically across 10 phases. Here is what is included:

### Phase 1 & 2: Design System & Landing Page
- Custom CSS modules featuring a high-end "Editorial SaaS" aesthetic.
- Color palette: Deep Forest, Charcoal, Muted Green, Off-White, Amber, and Restrained Red.
- Landing page includes animated Bento grids, a mockup of the command center, and smooth `framer-motion` entrance animations.

### Phase 3: Command Center (Dashboard)
- **Farmer Mode**: Hyper-focused UX with an "Immediate Action Center" (e.g., Scan Leaves Now based on weather triggers).
- **Government Mode**: Macro-analytics with KPIs (12.4M Hectares Monitored), statewide pathogen spread Area Charts, and Threat Radar visualizations using `recharts`.

### Phase 4: Crop Scan
- A "Vision Engine" dark-mode interface for uploading crop images.
- Features an animated laser sweep and bounding boxes to "localize" pathogens over a mock leaf image, alongside a live AI reasoning terminal console.

### Phase 5: Disease Result (Diagnostic Report)
- **Explainable AI (XAI)**: Explicitly tells the user *why* a diagnosis was made (e.g., "Detected distinct yellow-orange pustules").
- Maps the disease against current environmental factors (Temp, Humidity, Wind).
- Provides an **AI Doctor Prescription** with actionable chemical/organic interventions.

### Phase 6: Risk Intelligence
- 10-Day Predictive Risk Model `ComposedChart` overlaying Rainfall with Disease Probability.
- Highlights the exact "Intervention Window" for preventative spraying.

### Phase 7: Geospatial Map (Maharashtra)
- Interactive node-based map of Maharashtra districts.
- Clicking a district (e.g., Nashik, Pune) opens a side panel with localized threat intelligence, active pests, weather conditions, and outbreak trend lines.

### Phase 8: AI Agronomist Doctor
- A premium, context-aware chat interface.
- Includes a context sidebar (Farm Location, Crop Stage, Weather).
- Smart suggestions, typing indicators, and inline Prescription Cards for dosages (e.g., Tebuconazole).

### Phase 9 & 10: Mobile Optimization & Polish
- iOS-style bottom navigation bar on mobile devices.
- Responsive breakpoints for 1024px and 768px across all grids.
- `PageTransition` wrapper for smooth routing.
- `AnimatedCounter` for landing page statistics.

---

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules (No Tailwind)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
