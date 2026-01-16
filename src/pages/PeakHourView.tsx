import { useState } from 'react';
import { HourlySlider } from '../components/peakhour/HourlySlider';
import { PeakHourChart } from '../components/peakhour/PeakHourChart';
import { HourlyBreakdown } from '../components/peakhour/HourlyBreakdown';
import { PeakInsights } from '../components/peakhour/PeakInsights';

export function PeakHourView() {
  const [selectedHour, setSelectedHour] = useState(12);

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Hourly Slider */}
        <HourlySlider selectedHour={selectedHour} onHourChange={setSelectedHour} />

        {/* Peak Hour Chart */}
        <PeakHourChart selectedHour={selectedHour} />

        {/* Breakdown and Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <HourlyBreakdown selectedHour={selectedHour} />
          </div>
          <PeakInsights selectedHour={selectedHour} />
        </div>
      </div>
    </div>
  );
}
