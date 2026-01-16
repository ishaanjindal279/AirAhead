import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

interface HealthRecommendationsProps {
  persona: string;
}

export function HealthRecommendations({ persona }: HealthRecommendationsProps) {
  const getRecommendations = () => {
    switch(persona) {
      case 'runner':
        return [
          { text: 'Morning runs (6-8 AM) recommended', type: 'success', icon: CheckCircle },
          { text: 'Avoid outdoor exercise 5-7 PM', type: 'error', icon: X },
          { text: 'Stay hydrated during outdoor activities', type: 'info', icon: Info },
          { text: 'Consider indoor alternatives during high AQI', type: 'warning', icon: AlertCircle },
        ];
      case 'child':
        return [
          { text: 'Outdoor playtime safe before 3 PM', type: 'success', icon: CheckCircle },
          { text: 'Avoid prolonged outdoor exposure', type: 'error', icon: X },
          { text: 'Keep rescue medication accessible', type: 'warning', icon: AlertCircle },
          { text: 'Monitor for breathing difficulties', type: 'info', icon: Info },
        ];
      case 'asthma':
        return [
          { text: 'Keep inhaler readily available', type: 'error', icon: AlertCircle },
          { text: 'Limit outdoor time to 30 minutes', type: 'warning', icon: AlertCircle },
          { text: 'Stay indoors during peak hours', type: 'error', icon: X },
          { text: 'Use air purifier at home', type: 'success', icon: CheckCircle },
        ];
      default:
        return [
          { text: 'Regular outdoor activities safe', type: 'success', icon: CheckCircle },
          { text: 'Monitor air quality before going out', type: 'info', icon: Info },
          { text: 'Reduce exertion during high AQI', type: 'warning', icon: AlertCircle },
          { text: 'Stay hydrated', type: 'info', icon: Info },
        ];
    }
  };

  const recommendations = getRecommendations();

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'success': return 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      case 'error': return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'warning': return 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800';
      default: return 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
        <CardDescription>Health and safety guidelines based on your profile</CardDescription>
      </CardHeader>
      <div className="px-6 pb-6 space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 rounded-lg border ${getTypeColor(rec.type)}`}
          >
            <rec.icon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{rec.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
