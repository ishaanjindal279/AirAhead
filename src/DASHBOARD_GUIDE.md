# AQI Prediction Platform - Dashboard Guide

## 🚀 Quick Navigation

A comprehensive, hackathon-ready dashboard for air quality monitoring and prediction.

---

## 📱 Dashboard Pages

### 1. **Overview Dashboard** (`/` - Default)
**Purpose:** Main dashboard with real-time AQI monitoring

**Features:**
- 6 metric cards (AQI, PM2.5, PM10, Ozone, Temperature, Visibility)
- 7-day forecast chart with daily breakdown
- Real-time alerts feed with priority badges
- Interactive regional map
- Recent activity tracker
- Quick action buttons (Refresh, Export, Share, Configure)

**Components:**
- `AQIMetricsGrid` - Gradient-styled metric cards with trend indicators
- `SevenDayForecast` - Chart.js line chart with daily AQI breakdown
- `AlertsFeed` - Scrollable alerts with priority filtering
- `QuickActions` - Action toolbar
- `RecentActivity` - Location-based change tracker

---

### 2. **AQI Forecasts** 
**Purpose:** Detailed prediction analytics and model performance

**Features:**
- Multi-metric 7-day forecast (AQI, PM2.5, PM10, Ozone)
- Prediction vs Actual comparison chart
- Model accuracy metrics (94.8% overall)
- Location and timeframe filters
- ML model version tracking

**Components:**
- `ForecastFilters` - Location, date range, and metric selectors
- `MultiMetricForecast` - Multi-line Chart.js visualization
- `ComparisonChart` - Predicted vs actual performance
- `AccuracyMetrics` - Model performance cards with trend data

---

### 3. **Heatmap & Danger Zones**
**Purpose:** Spatial pollution visualization with time controls

**Features:**
- Interactive pollution heatmap with time toggles (Current, +6h, +12h, +24h)
- Pollutant type selector (AQI, PM2.5, PM10, Ozone)
- Animated hotspot markers with severity levels
- Danger zone alerts
- Color-coded severity scale
- Hotspot clustering

**Components:**
- `HeatmapControls` - Time and pollutant filters
- `PollutionHeatmap` - Interactive map with pulsing markers
- `HeatmapLegend` - AQI scale reference
- `DangerZones` - Critical area listings

---

### 4. **Peak Hours Analysis**
**Purpose:** Hourly pollution patterns with interactive timeline

**Features:**
- 24-hour slider with visual time indicators
- Peak hour identification (Rush hours 7-9 AM, 5-7 PM)
- Hourly pollutant breakdown
- Context-aware insights based on selected hour
- Bar chart visualization with peak highlighting

**Components:**
- `HourlySlider` - Interactive time selector (0-23 hours)
- `PeakHourChart` - Chart.js bar chart with peak detection
- `HourlyBreakdown` - Detailed metrics for selected hour
- `PeakInsights` - Smart recommendations based on time

---

### 5. **Traffic & Clean Routes**
**Purpose:** Route optimization for cleaner air exposure

**Features:**
- Traffic congestion overlay map
- 3 route comparison (Clean, Moderate, Congested)
- Route AQI scoring
- Travel time vs air quality tradeoffs
- Turn-by-turn clean route suggestions
- Savings calculator (AQI points saved)

**Components:**
- `TrafficStats` - Route metrics dashboard
- `TrafficMap` - Multi-route visualization with SVG paths
- `CleanRoutes` - Recommended route cards with navigation
- `RouteComparison` - Bar chart comparing routes

---

### 6. **Health & Activity Alerts**
**Purpose:** Personalized recommendations by user persona

**Features:**
- 4 persona types (Runner, Children, Asthma, Elderly)
- Persona-specific health metrics
- Custom activity recommendations
- Activity safety index
- Safe outdoor time calculator
- Risk level assessment

**Components:**
- `PersonaSelector` - Interactive persona cards
- `HealthMetrics` - Persona-specific safety metrics
- `HealthRecommendations` - Tailored health advice
- `ActivitySafety` - Activity-specific risk levels

**Personas:**
1. **Runner/Athlete** - High outdoor activity focus
2. **Children** - Developing respiratory system protection
3. **Asthma/Respiratory** - High sensitivity alerts
4. **Elderly** - Reduced lung capacity considerations

---

### 7. **Smart Home Control**
**Purpose:** Air purifier automation and monitoring

**Features:**
- Device control dashboard (4 devices)
- Real-time indoor vs outdoor AQI comparison
- Automation rules (trigger-action pairs)
- Energy usage tracking
- Device mode management (Auto, Sleep, Manual, Eco)
- 24-hour air quality history chart
- Cost analysis

**Components:**
- `DeviceGrid` - Individual device cards with controls
- `AutomationRules` - Smart automation management
- `EnergyUsage` - Weekly consumption chart
- `AirQualityHistory` - Indoor/outdoor comparison chart

**Automation Examples:**
- High AQI Auto-On (triggers at AQI > 75)
- Night Mode (10 PM sleep mode)
- Energy Saver (reduces speed when AQI < 50)
- Morning Boost (max purification at 6 AM)

---

### 8. **Government Monitoring**
**Purpose:** Compliance tracking and regulatory oversight

**Features:**
- 247 monitored sites
- Violation tracking (18 active)
- Construction site compliance
- Industrial emission monitoring
- Hotspot cluster identification
- Sector-wise emissions report
- Export functionality for reports

**Components:**
- `ComplianceStats` - Overview metrics
- `MonitoringMap` - Site tracking with violation markers
- `HotspotClusters` - Critical area grouping
- `ConstructionSites` - Dust control compliance
- `EmissionsReport` - Sector analysis chart

**Marker Types:**
- 🚨 Violations (red with pulse animation)
- 🏗️ Construction sites (yellow)
- 🏭 Industrial facilities (orange)

---

## 🎨 Design System

All components use the centralized design system located in `/components/ui/`:

- **Card** - Container with 4 variants
- **Alert** - 4 contextual message types
- **Badge** - Status indicators with AQI variants
- **Button** - 5 variants with loading states
- **AQIBadge** - Auto-color-coded AQI display

**Dark Mode:** Full support across all components with `dark:` variants

---

## 🎯 Hackathon Demo Tips

### Quick Demo Flow (5 minutes)

1. **Start on Overview** (30s)
   - Show live metrics updating
   - Highlight 7-day forecast
   - Point out alert system

2. **Navigate to Heatmap** (45s)
   - Toggle time periods to show predictions
   - Click hotspot markers for details
   - Show danger zones sidebar

3. **Peak Hours** (30s)
   - Slide through 24 hours
   - Show peak detection
   - Demonstrate smart insights

4. **Traffic Routes** (45s)
   - Compare 3 route options
   - Show AQI savings
   - Navigate clean route

5. **Health Personas** (45s)
   - Switch between personas
   - Show personalized recommendations
   - Demonstrate activity safety

6. **Smart Home** (45s)
   - Toggle devices on/off
   - Show automation rules
   - Display indoor vs outdoor comparison

7. **Government View** (45s)
   - Show compliance map
   - Identify violations
   - Export emissions report

### Key Talking Points

✅ **Real-time Monitoring** - Live AQI data across 6 key metrics
✅ **ML Predictions** - 94.8% accuracy with 7-day forecasts
✅ **Personalization** - 4 user personas with tailored insights
✅ **Smart Routing** - Clean air route optimization
✅ **IoT Integration** - Smart home automation
✅ **Government Compliance** - Regulatory monitoring at scale

---

## 📊 Data Visualization

**Chart.js Components:**
- Line charts (forecasts, trends, comparisons)
- Bar charts (hourly patterns, route comparison, emissions)
- Multi-metric overlays
- Interactive tooltips
- Responsive design

**Map Visualizations:**
- Heatmap with severity zones
- Route comparison overlay
- Site monitoring with markers
- Cluster identification

---

## 🎨 Color Coding

**AQI Scale (EPA Standard):**
- 🟢 Green (0-50) - Good
- 🟡 Yellow (51-100) - Moderate
- 🟠 Orange (101-150) - Unhealthy for Sensitive
- 🔴 Red (151-200) - Unhealthy
- 🟣 Purple (201-300) - Very Unhealthy
- 🟤 Maroon (300+) - Hazardous

---

## 🔧 Component Architecture

```
/pages/              # Main dashboard views
  OverviewDashboard
  ForecastChartsView
  HeatmapView
  PeakHourView
  TrafficView
  HealthAlertsView
  SmartHomeView
  GovernmentView

/components/
  /dashboard/        # Overview components
  /forecast/         # Forecast charts
  /heatmap/          # Map visualizations
  /peakhour/         # Hourly analysis
  /traffic/          # Route optimization
  /health/           # Health personas
  /smarthome/        # IoT controls
  /government/       # Compliance monitoring
  /ui/               # Design system
```

---

## 🚀 Performance Optimizations

- Lazy loading for charts
- Memoized components
- Optimized re-renders
- Responsive images
- CSS-in-Tailwind approach
- Fast page transitions
- No external API calls (demo data)

---

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar
- Grid systems adapt to screen size
- Touch-friendly controls
- Optimized for demo on laptops/projectors

---

## 🎯 Unique Features

1. **Time-based Heatmap** - Toggle through time periods
2. **Hourly Slider** - Granular 24-hour analysis
3. **Persona System** - 4 user types with custom insights
4. **Route Optimization** - AQI-aware navigation
5. **Smart Automation** - IoT device management
6. **Compliance Tracking** - Government oversight tools
7. **Dark Mode** - Full theme support
8. **Export Functionality** - Report generation

---

## 💡 Future Enhancements (Post-Hackathon)

- Real API integration
- User authentication
- Data export in multiple formats
- Mobile app companion
- Push notifications
- Historical data analysis
- Multi-city comparison
- Social sharing features

---

Built for hackathon demos with React + Vite + Tailwind CSS + Chart.js
