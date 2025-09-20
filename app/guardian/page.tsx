'use client';

import { useState, useEffect } from "react";
import { formatMinutes, formatTimeRemaining } from '@/lib/time';
import UsageBar from '@/components/UsageBar';
import Link from 'next/link';
import { 
  Users, 
  Clock, 
  Target, 
  Shield, 
  Plus, 
  Settings, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Eye,
  Calendar,
  BarChart3,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
  Heart,
  Star
} from 'lucide-react';

// Mock data for demo purposes
const mockGuardianData = {
  premiumActive: true,
  linkedChildIds: ['child1', 'child2'],
  totalScreenTime: 120,
  focusSessions: 8,
  weeklyProgress: 85
};

const mockChildren = [
  {
    id: 'child1',
    displayName: "Alex",
    age: 12,
    avatar: "👦",
    screenTime: {
      dailyLimitMinutes: 120,
      schedule: [],
      blockedRoutes: ["/games", "/social"]
    },
    focusTime: {
      enabled: true,
      defaultSessionMinutes: 25,
      allowedRoutes: ["/lessons", "/progress"]
    },
    activeFocusSession: null,
    usageToday: {
      minutesConsumed: 45,
      updatedAt: new Date()
    },
    weeklyStats: {
      totalFocusTime: 180,
      completedSessions: 6,
      averageSessionLength: 30
    },
    devices: ['smartphone', 'tablet']
  },
  {
    id: 'child2',
    displayName: "Sam",
    age: 9,
    avatar: "👧",
    screenTime: {
      dailyLimitMinutes: 90,
      schedule: [],
      blockedRoutes: ["/games", "/social"]
    },
    focusTime: {
      enabled: true,
      defaultSessionMinutes: 30,
      allowedRoutes: ["/lessons", "/progress"]
    },
    activeFocusSession: {
      startedAt: new Date(Date.now() - 10 * 60 * 1000),
      endsAt: new Date(Date.now() + 20 * 60 * 1000)
    },
    usageToday: {
      minutesConsumed: 75,
      updatedAt: new Date()
    },
    weeklyStats: {
      totalFocusTime: 240,
      completedSessions: 8,
      averageSessionLength: 30
    },
    devices: ['tablet', 'laptop']
  }
];

export default function GuardianDashboardPage() {
  const [children] = useState(mockChildren);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const remainingDailyMinutes = (child: any) => {
    return Math.max(0, child.screenTime.dailyLimitMinutes - child.usageToday.minutesConsumed);
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'smartphone': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'laptop': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-10"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
            Guardian Dashboard
          </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                Monitor and manage your children's digital wellbeing with intelligent screen time controls and focus sessions
          </p>
        </div>

            {/* Premium Badge */}
            {mockGuardianData.premiumActive && (
              <div className="flex items-center space-x-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                <Star className="w-5 h-5" />
                <span className="font-semibold">Premium Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-6 -mt-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Screen Time</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{mockGuardianData.totalScreenTime}m</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Focus Sessions</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{mockGuardianData.focusSessions}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Weekly Progress</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{mockGuardianData.weeklyProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Children</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{children.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
              </div>
            </div>
          </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-white/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Children Cards */}
          {children.length === 0 ? (
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20 shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-white" />
              </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Welcome to Your Dashboard
              </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  Start by adding your children to monitor their screen time and focus sessions
                </p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Plus className="w-5 h-5 inline mr-2" />
                  Add Your First Child
              </button>
            </div>
          ) : (
              <div className="grid gap-8">
                {children.map((child) => {
              const remaining = remainingDailyMinutes(child);
              const isFocusActive = child.activeFocusSession && 
                new Date() < child.activeFocusSession.endsAt;
                  const usagePercentage = (child.usageToday.minutesConsumed / child.screenTime.dailyLimitMinutes) * 100;

              return (
                    <div key={child.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                      {/* Child Header */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl">
                            {child.avatar}
                          </div>
                    <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {child.displayName}
                      </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Age {child.age} • {child.devices.length} devices
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                      {isFocusActive && (
                            <div className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium">
                              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                          Focus Active
                        </div>
                      )}
                    <Link
                      href={`/guardian/child/${child.id}`}
                            className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-2xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Manage
                    </Link>
                        </div>
                  </div>

                      {/* Stats Grid */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Screen Time */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-slate-900 dark:text-white">Screen Time</h4>
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-slate-600 dark:text-slate-400">Used</span>
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {formatMinutes(child.usageToday.minutesConsumed)}
                              </span>
                            </div>
                      <UsageBar 
                        used={child.usageToday.minutesConsumed}
                        limit={child.screenTime.dailyLimitMinutes}
                              size="sm"
                      />
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        {formatMinutes(remaining)} remaining
                            </div>
                          </div>
                        </div>

                        {/* Focus Sessions */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-slate-900 dark:text-white">Focus Sessions</h4>
                            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {child.weeklyStats.completedSessions}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            This week
                      </div>
                    </div>

                        {/* Weekly Progress */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-slate-900 dark:text-white">Progress</h4>
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {Math.round((child.weeklyStats.totalFocusTime / 300) * 100)}%
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Weekly goal
                          </div>
                        </div>

                        {/* Devices */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-slate-900 dark:text-white">Devices</h4>
                            <Monitor className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="space-y-2">
                            {child.devices.map((device, index) => (
                              <div key={index} className="flex items-center text-sm">
                                {getDeviceIcon(device)}
                                <span className="ml-2 text-slate-700 dark:text-slate-300 capitalize">
                                  {device}
                                </span>
                          </div>
                            ))}
                        </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                      <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/guardian/child/${child.id}`}
                          className="flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200"
                    >
                          <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                        
                    {mockGuardianData.premiumActive && (
                      <Link
                        href={`/guardian/child/${child.id}/controls`}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                            <Settings className="w-4 h-4 mr-2" />
                        Edit Controls
                      </Link>
                    )}
                        
                        {isFocusActive ? (
                          <button className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <Pause className="w-4 h-4 mr-2" />
                            End Focus
                          </button>
                        ) : (
                          <button className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <Play className="w-4 h-4 mr-2" />
                            Start Focus
                          </button>
                        )}
                  </div>
                </div>
              );
                })}
              </div>
          )}

        {/* Add Child Button */}
        {children.length > 0 && (
              <div className="text-center">
                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Plus className="w-5 h-5 mr-2" />
              Add Another Child
            </button>
          </div>
        )}
      </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Analytics Dashboard</h2>
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Analytics features coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Settings</h2>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
