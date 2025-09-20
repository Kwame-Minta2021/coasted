'use client';

import { formatMinutes } from '@/lib/time';

interface UsageBarProps {
  used: number;
  limit: number;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function UsageBar({ 
  used, 
  limit, 
  className = "",
  showText = true,
  size = 'md'
}: UsageBarProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const remaining = Math.max(0, limit - used);
  
  const sizeClasses = {
    sm: 'h-2 text-xs',
    md: 'h-3 text-sm',
    lg: 'h-4 text-base'
  };

  const getColorClass = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 75) return 'bg-yellow-500';
    if (percent >= 50) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-600 dark:text-gray-300">
            {formatMinutes(used)} used
          </span>
          <span className="text-gray-600 dark:text-gray-300">
            {formatMinutes(remaining)} remaining
          </span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColorClass(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showText && (
        <div className="text-xs text-gray-500 mt-1 text-center">
          {percentage.toFixed(0)}% of daily limit
        </div>
      )}
    </div>
  );
}
