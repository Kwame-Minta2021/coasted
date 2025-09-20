'use client'

import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your instructor account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">👤</span>
            <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
          </div>
          <p className="text-gray-600 mb-4">Update your personal information and bio</p>
          <button 
            onClick={() => router.push('/instructor/settings/profile')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🔔</span>
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>
          <p className="text-gray-600 mb-4">Configure your notification preferences</p>
          <button 
            onClick={() => router.push('/instructor/settings/notifications')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Manage Notifications
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🔒</span>
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
          </div>
          <p className="text-gray-600 mb-4">Change password and security settings</p>
          <button 
            onClick={() => router.push('/instructor/settings/security')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Security Settings
          </button>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🎨</span>
            <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
          </div>
          <p className="text-gray-600 mb-4">Customize your dashboard appearance</p>
          <button 
            onClick={() => router.push('/instructor/settings/theme')}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Theme Settings
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <span className="text-6xl mb-4 block">⚙️</span>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Actions</h2>
        <p className="text-gray-600 mb-6">
          All your settings are now organized and easily accessible. 
          Use the sections above to customize your instructor experience.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-green-800 text-sm">
            <strong>✅ All Settings Available:</strong> Profile, Notifications, 
            Security, and Theme settings are all ready to use!
          </p>
        </div>
      </div>
    </div>
  )
}
