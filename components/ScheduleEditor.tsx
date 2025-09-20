'use client';

import { useState } from 'react';
import { ScheduleWindow, getDayName, validateSchedule } from '@/lib/time';

interface ScheduleEditorProps {
  schedule: ScheduleWindow[];
  onChange: (schedule: ScheduleWindow[]) => void;
  className?: string;
}

export default function ScheduleEditor({ 
  schedule, 
  onChange, 
  className = "" 
}: ScheduleEditorProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const addWindow = () => {
    const newSchedule = [...schedule, { day: 0, start: '09:00', end: '10:00' }];
    onChange(newSchedule);
    validateAndSetErrors(newSchedule);
  };

  const removeWindow = (index: number) => {
    const newSchedule = schedule.filter((_, i) => i !== index);
    onChange(newSchedule);
    validateAndSetErrors(newSchedule);
  };

  const updateWindow = (index: number, field: keyof ScheduleWindow, value: string | number) => {
    const newSchedule = schedule.map((window, i) => 
      i === index ? { ...window, [field]: value } : window
    );
    onChange(newSchedule);
    validateAndSetErrors(newSchedule);
  };

  const validateAndSetErrors = (newSchedule: ScheduleWindow[]) => {
    const validationErrors = validateSchedule(newSchedule);
    setErrors(validationErrors);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Schedule Windows
        </h3>
        <button
          onClick={addWindow}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Window
        </button>
      </div>

      {schedule.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No schedule windows set</p>
          <p className="text-sm">Add windows to restrict screen time to specific hours</p>
        </div>
      )}

      {schedule.map((window, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Window {index + 1}
            </h4>
            <button
              onClick={() => removeWindow(index)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Day
              </label>
              <select
                value={window.day}
                onChange={(e) => updateWindow(index, 'day', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <option key={day} value={day}>
                    {getDayName(day)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={window.start}
                onChange={(e) => updateWindow(index, 'start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={window.end}
                onChange={(e) => updateWindow(index, 'end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {getDayName(window.day)}s from {window.start} to {window.end}
          </div>
        </div>
      ))}

      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Schedule Errors:
          </h4>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
