'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  Settings, 
  Timer,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Play,
  Pause,
  Square,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface ScreenTimeData {
  dailyLimit: number; // minutes
  usedToday: number; // minutes
  remaining: number; // minutes
  breaksTaken: number;
  lastReset: string; // ISO date string
}

interface FocusSession {
  id: string;
  duration: number; // minutes
  startTime: string;
  endTime?: string;
  completed: boolean;
}

export default function GuidancePage() {
  // Screen Time Management
  const [screenTimeData, setScreenTimeData] = useState<ScreenTimeData>({
    dailyLimit: 120, // 2 hours default
    usedToday: 0,
    remaining: 120,
    breaksTaken: 0,
    lastReset: new Date().toISOString().split('T')[0]
  });

  // Focus Mode Management
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [focusTimer, setFocusTimer] = useState(25); // minutes
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [remainingFocusTime, setRemainingFocusTime] = useState(focusTimer * 60); // seconds
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedScreenTime = localStorage.getItem('screenTimeData');
    const savedFocusSessions = localStorage.getItem('focusSessions');
    
    if (savedScreenTime) {
      const data = JSON.parse(savedScreenTime);
      // Check if it's a new day and reset if needed
      const today = new Date().toISOString().split('T')[0];
      if (data.lastReset !== today) {
        data.usedToday = 0;
        data.remaining = data.dailyLimit;
        data.breaksTaken = 0;
        data.lastReset = today;
      }
      setScreenTimeData(data);
    }
    
    if (savedFocusSessions) {
      setFocusSessions(JSON.parse(savedFocusSessions));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('screenTimeData', JSON.stringify(screenTimeData));
  }, [screenTimeData]);

  useEffect(() => {
    localStorage.setItem('focusSessions', JSON.stringify(focusSessions));
  }, [focusSessions]);

  // Focus timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isFocusActive && remainingFocusTime > 0) {
      interval = setInterval(() => {
        setRemainingFocusTime(prev => {
          if (prev <= 1) {
            handleFocusComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusActive, remainingFocusTime]);

  // Track screen time usage (simplified - in real app, this would track actual usage)
  const updateScreenTime = (minutes: number) => {
    setScreenTimeData(prev => {
      const newUsedToday = Math.min(prev.usedToday + minutes, prev.dailyLimit);
      const newRemaining = Math.max(prev.dailyLimit - newUsedToday, 0);
      
      return {
        ...prev,
        usedToday: newUsedToday,
        remaining: newRemaining
      };
    });
  };

  const handleFocusStart = () => {
    if (screenTimeData.remaining <= 0) {
      alert('Daily screen time limit reached! Please take a break.');
      return;
    }

    const newSession: FocusSession = {
      id: Date.now().toString(),
      duration: focusTimer,
      startTime: new Date().toISOString(),
      completed: false
    };

    setCurrentSession(newSession);
    setIsFocusActive(true);
    setRemainingFocusTime(focusTimer * 60);
    
    // Add to focus sessions
    setFocusSessions(prev => [...prev, newSession]);
  };

  const handleFocusPause = () => {
    setIsFocusActive(false);
  };

  const handleFocusResume = () => {
    setIsFocusActive(true);
  };

  const handleFocusStop = () => {
    setIsFocusActive(false);
    setRemainingFocusTime(focusTimer * 60);
    
    if (currentSession) {
      setFocusSessions(prev => 
        prev.map(session => 
          session.id === currentSession.id 
            ? { ...session, endTime: new Date().toISOString(), completed: false }
            : session
        )
      );
      setCurrentSession(null);
    }
  };

  const handleFocusComplete = () => {
    setIsFocusActive(false);
    
    if (currentSession) {
      setFocusSessions(prev => 
        prev.map(session => 
          session.id === currentSession.id 
            ? { ...session, endTime: new Date().toISOString(), completed: true }
            : session
        )
      );
      setCurrentSession(null);
    }

    // Update screen time
    updateScreenTime(focusTimer);
    
    // Show completion message
    alert('Focus session completed! Great job staying focused!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProgressPercentage = () => {
    return (screenTimeData.usedToday / screenTimeData.dailyLimit) * 100;
  };

  const getFocusStats = () => {
    const completedSessions = focusSessions.filter(s => s.completed);
    const totalFocusTime = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    const averageSessionLength = completedSessions.length > 0 
      ? Math.round(totalFocusTime / completedSessions.length) 
      : 0;
    
    return {
      totalSessions: completedSessions.length,
      totalFocusTime,
      averageSessionLength
    };
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Learning Guidance</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
              Manage your screen time and focus settings for better learning
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Screen Time Management */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Screen Time Management</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your daily device usage</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Daily Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    getProgressPercentage() > 80 ? 'bg-red-500' : 
                    getProgressPercentage() > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatMinutes(screenTimeData.usedToday)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Used Today</div>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatMinutes(screenTimeData.remaining)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Remaining</div>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {screenTimeData.breaksTaken}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Breaks Taken</div>
              </div>
            </div>

            {/* Screen Time Limit Info */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <Info className="w-4 h-4" />
                <span>Daily limit: {formatMinutes(screenTimeData.dailyLimit)}</span>
              </div>
            </div>
          </div>

          {/* Focus Mode */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Focus Mode</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stay focused on your learning</p>
              </div>
            </div>

            {/* Focus Timer Display */}
            <div className="text-center mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {formatTime(remainingFocusTime)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isFocusActive ? 'Focusing...' : 'Ready to focus'}
              </div>
            </div>

            {/* Focus Controls */}
            <div className="space-y-3">
              {/* Timer Duration Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration:</label>
                <select
                  value={focusTimer}
                  onChange={(e) => setFocusTimer(Number(e.target.value))}
                  disabled={isFocusActive}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                >
                  <option value={15}>15 minutes</option>
                  <option value={25}>25 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-2">
                {!isFocusActive ? (
                  <button
                    onClick={handleFocusStart}
                    disabled={screenTimeData.remaining <= 0}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Play className="w-4 h-4" />
                    Start Focus
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleFocusPause}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                                         <button
                       onClick={handleFocusStop}
                       className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                     >
                       <Square className="w-4 h-4" />
                       Stop
                     </button>
                  </>
                )}
              </div>

              {!isFocusActive && remainingFocusTime < focusTimer * 60 && (
                <button
                  onClick={handleFocusResume}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Play className="w-4 h-4" />
                  Resume Session
                </button>
              )}
            </div>

            {/* Focus Mode Info */}
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                <Zap className="w-4 h-4" />
                <span>Focus mode helps you stay on track with your learning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Statistics */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Focus Statistics</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your focus session history</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {getFocusStats().totalSessions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed Sessions</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatMinutes(getFocusStats().totalFocusTime)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Focus Time</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {getFocusStats().averageSessionLength}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Session Length</div>
            </div>
          </div>

          {/* Recent Sessions */}
          {focusSessions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Sessions</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {focusSessions.slice(-5).reverse().map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {session.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {session.duration} minute session
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.startTime).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {session.completed ? 'Completed' : 'Incomplete'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
