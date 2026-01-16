import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { HeatmapControls } from '../components/heatmap/HeatmapControls';
import { PollutionHeatmap } from '../components/heatmap/PollutionHeatmap';
import { DangerZones } from '../components/heatmap/DangerZones';
import { HeatmapLegend } from '../components/heatmap/HeatmapLegend';

export function HeatmapView() {
  const [timeSlot, setTimeSlot] = useState('current');
  const [pollutant, setPollutant] = useState('aqi');

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Controls */}
        <HeatmapControls 
          timeSlot={timeSlot}
          onTimeSlotChange={setTimeSlot}
          pollutant={pollutant}
          onPollutantChange={setPollutant}
        />

        {/* Heatmap */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <PollutionHeatmap timeSlot={timeSlot} pollutant={pollutant} />
          </div>
          <div className="space-y-6">
            <HeatmapLegend />
            <DangerZones />
          </div>
        </div>
      </div>
    </div>
  );
}
