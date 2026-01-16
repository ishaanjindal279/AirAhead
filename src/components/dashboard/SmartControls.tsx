import { useState, useEffect } from 'react';
import { Wind, Navigation, CheckCircle, Power, Zap, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { apiClient } from '../../api/client';
import { PurifierControlRequest, TrafficResponse } from '../../types';

export function SmartControls() {
  // Purifier State
  const [purifierStatus, setPurifierStatus] = useState<'off' | 'auto' | 'max'>('auto');
  const [purifierMessage, setPurifierMessage] = useState("Maintained by AI");
  const [loadingPurifier, setLoadingPurifier] = useState(false);

  // Traffic State
  const [trafficData, setTrafficData] = useState<TrafficResponse | null>(null);
  const [activeRoute, setActiveRoute] = useState("Standard");
  const [loadingTraffic, setLoadingTraffic] = useState(false);

  // Initial Fetch for Traffic
  useEffect(() => {
    const fetchTraffic = async () => {
      setLoadingTraffic(true);
      try {
        const data = await apiClient.getTraffic();
        setTrafficData(data);
      } catch (e) {
        console.error("Traffic fetch failed", e);
      } finally {
        setLoadingTraffic(false);
      }
    };
    fetchTraffic();
  }, []);

  // Handlers
  const handlePurifierControl = async (command: 'set-auto' | 'set-max' | 'turn-off') => {
    setLoadingPurifier(true);
    try {
      const payload: PurifierControlRequest = {
        deviceId: "purifier-01",
        zoneId: "home-zone",
        command: command
      };
      const res = await apiClient.controlPurifier(payload);
      
      if (command === 'turn-off') setPurifierStatus('off');
      else if (command === 'set-max') setPurifierStatus('max');
      else setPurifierStatus('auto');

      setPurifierMessage(res.recommendation?.message || "Command applied");
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPurifier(false);
    }
  };

  const handleReroute = () => {
    setActiveRoute("Cleaner");
    // Ideally call API to confirm, but client-side visual update for now
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Purifier Control Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${purifierStatus === 'off' ? 'bg-gray-200' : 'bg-blue-100 text-blue-600'}`}>
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Smart Purifier</h3>
              <p className="text-xs text-gray-500">{purifierMessage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             {purifierStatus !== 'off' && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
             <span className="text-sm font-medium uppercase text-blue-700 dark:text-blue-300">{purifierStatus}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <Button 
            variant={purifierStatus === 'auto' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => handlePurifierControl('set-auto')}
            disabled={loadingPurifier}
            className="flex-1"
          >
            <Shield className="w-4 h-4 mr-2" /> Auto
          </Button>
          <Button 
            variant={purifierStatus === 'max' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => handlePurifierControl('set-max')}
            disabled={loadingPurifier}
            className="flex-1"
          >
            <Zap className="w-4 h-4 mr-2" /> Max
          </Button>
          <Button 
            variant={purifierStatus === 'off' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => handlePurifierControl('turn-off')}
            disabled={loadingPurifier}
          >
            <Power className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Traffic/Commute Card */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Commute Status</h3>
              <p className="text-xs text-gray-500">Route: {activeRoute} Path</p>
            </div>
          </div>
          {activeRoute === "Cleaner" && (
             <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full">
               <CheckCircle className="w-3 h-3" /> Optimized
             </span>
          )}
        </div>

        {loadingTraffic ? (
          <div className="text-sm text-gray-500">Evaluating routes...</div>
        ) : (
          <div>
            {trafficData && trafficData.rerouteSuggestions?.length > 0 && activeRoute !== "Cleaner" ? (
               <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 mb-3 border border-green-200 dark:border-green-800">
                 <div className="flex items-start gap-2">
                   <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                   <div>
                     <p className="text-sm font-medium text-gray-800 dark:text-gray-200">High Pollution on Main Rte</p>
                     <p className="text-xs text-green-700 dark:text-green-300">
                       Suggestion: {trafficData.rerouteSuggestions[0].description} (-{trafficData.rerouteSuggestions[0].etaChangeMin} min)
                     </p>
                   </div>
                 </div>
               </div>
            ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Current route is optimal based on AQI exposure.
                </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400"
              onClick={handleReroute}
              disabled={activeRoute === "Cleaner" || !trafficData?.rerouteSuggestions?.length}
            >
              {activeRoute === "Cleaner" ? "Running Optimized Route" : "Apply Cleaner Route"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
