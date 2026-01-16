import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { ForecastChartsView } from './pages/ForecastChartsView';
import { HeatmapView } from './pages/HeatmapView';
import { PeakHourView } from './pages/PeakHourView';
import { TrafficView } from './pages/TrafficView';
import { HealthAlertsView } from './pages/HealthAlertsView';
import { SmartHomeView } from './pages/SmartHomeView';
import { GovernmentView } from './pages/GovernmentView';
import { DesignSystemShowcase } from './components/DesignSystemShowcase';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('overview');

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewDashboard />;
      case 'forecast':
        return <ForecastChartsView />;
      case 'heatmap':
        return <HeatmapView />;
      case 'peak-hours':
        return <PeakHourView />;
      case 'traffic':
        return <TrafficView />;
      case 'health':
        return <HealthAlertsView />;
      case 'smart-home':
        return <SmartHomeView />;
      case 'government':
        return <GovernmentView />;
      case 'design-system':
        return <DesignSystemShowcase />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentPage={currentPage} />
        
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
