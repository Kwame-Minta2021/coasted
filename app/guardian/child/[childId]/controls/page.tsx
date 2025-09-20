'use client';

import { useState, useEffect } from "react";
import PremiumGate from '@/components/PremiumGate';
import ScheduleEditor from '@/components/ScheduleEditor';
import { ScreenTimeConfig, FocusTimeConfig } from '@/lib/time';
import Link from 'next/link';

// Mock data for demo purposes
const mockGuardianData = {
  premiumActive: true
};

const mockChildData = {
  id: 'child1',
  displayName: "Alex",
  screenTime: {
    dailyLimitMinutes: 120,
    schedule: [],
    blockedRoutes: ["/games", "/social"]
  },
  focusTime: {
    enabled: true,
    defaultSessionMinutes: 25,
    allowedRoutes: ["/child", "/dashboard/lessons"]
  }
};

export default function ChildControlsPage({ params }: { params: { childId: string } }) {
  const [saving, setSaving] = useState(false);
  const [childId, setChildId] = useState<string>('');

  useEffect(() => {
    const loadParams = () => {
      const { childId: id } = params;
      setChildId(id);
    };
    loadParams();
  }, [params]);

  // Form state
  const [screenTimeConfig, setScreenTimeConfig] = useState<ScreenTimeConfig>({
    dailyLimitMinutes: 120,
    schedule: [],
    blockedRoutes: []
  });
  const [focusTimeConfig, setFocusTimeConfig] = useState<FocusTimeConfig>({
    enabled: false,
    defaultSessionMinutes: 25,
    allowedRoutes: ['/child', '/dashboard/lessons']
  });

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setSaving(false);
      alert('Demo: Settings would be saved here. In a real app, this would update Firestore.');
    }, 1000);
  };

  if (!childId) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Controls for {mockChildData.displayName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage screen time and focus mode settings
            </p>
          </div>
          <Link
            href="/guardian"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-8">
          {/* Screen Time Controls */}
          <PremiumGate isPremium={mockGuardianData.premiumActive}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Screen Time Controls
              </h2>
              
              <div className="space-y-6">
                {/* Daily Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Daily Screen Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1440"
                    value={screenTimeConfig.dailyLimitMinutes}
                    onChange={(e) => setScreenTimeConfig({
                      ...screenTimeConfig,
                      dailyLimitMinutes: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Schedule Windows */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Allowed Time Windows (Optional)
                  </label>
                  <ScheduleEditor
                    schedule={screenTimeConfig.schedule || []}
                    onChange={(schedule) => setScreenTimeConfig({
                      ...screenTimeConfig,
                      schedule
                    })}
                  />
                </div>

                {/* Blocked Routes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blocked Routes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={screenTimeConfig.blockedRoutes?.join(', ') || ''}
                    onChange={(e) => setScreenTimeConfig({
                      ...screenTimeConfig,
                      blockedRoutes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="/games, /social, /youtube"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </PremiumGate>

          {/* Focus Time Controls */}
          <PremiumGate isPremium={mockGuardianData.premiumActive}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Focus Mode Controls
              </h2>
              
              <div className="space-y-6">
                {/* Enable Focus Mode */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="focusEnabled"
                    checked={focusTimeConfig.enabled}
                    onChange={(e) => setFocusTimeConfig({
                      ...focusTimeConfig,
                      enabled: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="focusEnabled" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Focus Mode
                  </label>
                </div>

                {/* Default Session Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Focus Session Length (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={focusTimeConfig.defaultSessionMinutes}
                    onChange={(e) => setFocusTimeConfig({
                      ...focusTimeConfig,
                      defaultSessionMinutes: parseInt(e.target.value) || 25
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Allowed Routes During Focus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Allowed Routes During Focus (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={focusTimeConfig.allowedRoutes?.join(', ') || ''}
                    onChange={(e) => setFocusTimeConfig({
                      ...focusTimeConfig,
                      allowedRoutes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="/child, /dashboard/lessons"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </PremiumGate>

          {/* Save Button */}
          <div className="text-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
