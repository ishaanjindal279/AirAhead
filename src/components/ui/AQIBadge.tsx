interface AQIBadgeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function AQIBadge({ value, size = 'md', showLabel = true, className = '' }: AQIBadgeProps) {
  const getAQIConfig = (aqi: number) => {
    if (aqi <= 50) {
      return {
        label: 'Good',
        color: 'bg-green-500 dark:bg-green-600',
        lightColor: 'bg-green-50 dark:bg-green-950',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-200 dark:border-green-800',
      };
    }
    if (aqi <= 100) {
      return {
        label: 'Moderate',
        color: 'bg-yellow-500 dark:bg-yellow-600',
        lightColor: 'bg-yellow-50 dark:bg-yellow-950',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
      };
    }
    if (aqi <= 150) {
      return {
        label: 'Unhealthy for Sensitive',
        color: 'bg-orange-500 dark:bg-orange-600',
        lightColor: 'bg-orange-50 dark:bg-orange-950',
        textColor: 'text-orange-700 dark:text-orange-300',
        borderColor: 'border-orange-200 dark:border-orange-800',
      };
    }
    if (aqi <= 200) {
      return {
        label: 'Unhealthy',
        color: 'bg-red-500 dark:bg-red-600',
        lightColor: 'bg-red-50 dark:bg-red-950',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-200 dark:border-red-800',
      };
    }
    if (aqi <= 300) {
      return {
        label: 'Very Unhealthy',
        color: 'bg-purple-500 dark:bg-purple-600',
        lightColor: 'bg-purple-50 dark:bg-purple-950',
        textColor: 'text-purple-700 dark:text-purple-300',
        borderColor: 'border-purple-200 dark:border-purple-800',
      };
    }
    return {
      label: 'Hazardous',
      color: 'bg-maroon-700 dark:bg-maroon-800',
      lightColor: 'bg-maroon-50 dark:bg-maroon-950',
      textColor: 'text-maroon-900 dark:text-maroon-200',
      borderColor: 'border-maroon-300 dark:border-maroon-800',
    };
  };

  const sizes = {
    sm: {
      container: 'px-2 py-1 text-xs',
      dot: 'w-1.5 h-1.5',
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      dot: 'w-2 h-2',
    },
    lg: {
      container: 'px-4 py-2 text-base',
      dot: 'w-2.5 h-2.5',
    },
  };

  const config = getAQIConfig(value);
  const sizeConfig = sizes[size];

  return (
    <span
      className={`
        inline-flex items-center gap-2 font-medium rounded-full border
        ${config.lightColor} ${config.textColor} ${config.borderColor}
        ${sizeConfig.container} ${className}
      `}
    >
      <span className={`rounded-full ${config.color} ${sizeConfig.dot}`} />
      <span>{value}</span>
      {showLabel && <span className="opacity-90">· {config.label}</span>}
    </span>
  );
}
