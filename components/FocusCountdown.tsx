'use client';

import { useState, useEffect, useRef } from 'react';
import { formatTimeRemaining } from '@/lib/time';

interface FocusCountdownProps {
  endTime: Date;
  onComplete?: () => void;
  className?: string;
  showLabel?: boolean;
}

export default function FocusCountdown({ 
  endTime, 
  onComplete, 
  className = "",
  showLabel = true 
}: FocusCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const remaining = endTime.getTime() - now.getTime();
      
      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        setTimeRemaining(remaining);
      }
    };

    // Initial calculation
    updateTimeRemaining();

    // Set up interval
    intervalRef.current = setInterval(updateTimeRemaining, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [endTime, onComplete]);

  if (isComplete) {
    return (
      <div className={`text-center ${className}`}>
        {showLabel && <div className="text-sm text-gray-500 mb-1">Focus Session</div>}
        <div className="text-2xl font-bold text-green-600">Complete!</div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      {showLabel && <div className="text-sm text-gray-500 mb-1">Focus Session</div>}
      <div className="text-3xl font-mono font-bold text-blue-600">
        {formatTimeRemaining(timeRemaining)}
      </div>
      <div className="text-xs text-gray-400 mt-1">remaining</div>
    </div>
  );
}
