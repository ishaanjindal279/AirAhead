import { Card } from '../ui/Card';
import { Users, Baby, Activity, Heart } from 'lucide-react';

interface PersonaSelectorProps {
  selectedPersona: string;
  onPersonaChange: (persona: string) => void;
}

export function PersonaSelector({ selectedPersona, onPersonaChange }: PersonaSelectorProps) {
  const personas = [
    {
      id: 'runner',
      icon: Activity,
      name: 'Runner / Athlete',
      description: 'High outdoor activity',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'child',
      icon: Baby,
      name: 'Children',
      description: 'Developing respiratory system',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'asthma',
      icon: Heart,
      name: 'Asthma / Respiratory',
      description: 'Sensitive to air quality',
      color: 'from-red-500 to-orange-500',
    },
    {
      id: 'elderly',
      icon: Users,
      name: 'Elderly',
      description: 'Reduced lung capacity',
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {personas.map((persona) => (
        <Card
          key={persona.id}
          onClick={() => onPersonaChange(persona.id)}
          className={`cursor-pointer transition-all ${
            selectedPersona === persona.id
              ? 'ring-2 ring-blue-500 shadow-lg scale-105'
              : 'hover:shadow-md'
          }`}
          padding="md"
        >
          <div className="flex flex-col items-center text-center">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${persona.color} mb-4`}>
              <persona.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {persona.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {persona.description}
            </p>
            {selectedPersona === persona.id && (
              <div className="mt-3 px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                Selected
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
