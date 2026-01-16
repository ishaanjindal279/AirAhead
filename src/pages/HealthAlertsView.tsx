import { PersonaSelector } from '../components/health/PersonaSelector';
import { HealthRecommendations } from '../components/health/HealthRecommendations';
import { ActivitySafety } from '../components/health/ActivitySafety';
import { HealthMetrics } from '../components/health/HealthMetrics';
import { useState } from 'react';

export function HealthAlertsView() {
  const [selectedPersona, setSelectedPersona] = useState('runner');

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Persona Selector */}
        <PersonaSelector selectedPersona={selectedPersona} onPersonaChange={setSelectedPersona} />

        {/* Health Metrics */}
        <HealthMetrics persona={selectedPersona} />

        {/* Recommendations and Activities */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <HealthRecommendations persona={selectedPersona} />
          <ActivitySafety persona={selectedPersona} />
        </div>
      </div>
    </div>
  );
}
