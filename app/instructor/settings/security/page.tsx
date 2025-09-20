'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SecuritySettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('password')
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginHistory, setLoginHistory] = useState([
    {
      id: 1,
      location: 'San Francisco, CA',
      device: 'Chrome on Windows',
      ip: '192.168.1.100',
      timestamp: '2025-09-13 08:30:00',
      status: 'success'
    },
    {
      id: 2,
      location: 'San Francisco, CA',
      device: 'Chrome on Windows',
      ip: '192.168.1.100',
      timestamp: '2025-09-12 14:20:00',
      status: 'success'
    },
    {
      id: 3,
      location: 'Unknown',
      device: 'Safari on iPhone',
      ip: '203.0.113.1',
      timestamp: '2025-09-11 09:15:00',
      status: 'failed'
    }
  ])

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!')
      return
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!')
      return
    }

    setIsLoading(true)
    
    try {
      // In a real app, you'd send this to an API
      console.log('Updating password...')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
    } catch (error) {
      console.error('Failed to update password:', error)
      alert('Failed to update password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorToggle = async () => {
    setIsLoading(true)
    
    try {
      // In a real app, you'd send this to an API
      console.log('Toggling 2FA...')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTwoFactorEnabled(!twoFactorEnabled)
      alert(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`)
      
    } catch (error) {
      console.error('Failed to toggle 2FA:', error)
      alert('Failed to update two-factor authentication. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoutAllDevices = async () => {
    if (!confirm('This will log you out of all devices. Are you sure?')) {
      return
    }

    setIsLoading(true)
    
    try {
      // In a real app, you'd send this to an API
      console.log('Logging out all devices...')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('All devices have been logged out successfully!')
      
    } catch (error) {
      console.error('Failed to logout all devices:', error)
      alert('Failed to logout all devices. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'password', label: 'Password', icon: '🔒' },
    { id: 'twofactor', label: 'Two-Factor Auth', icon: '📱' },
    { id: 'sessions', label: 'Active Sessions', icon: '💻' }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <span className="mr-2">←</span>
          Back to Settings
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account security and privacy</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                onClick={handlePasswordUpdate}
                disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Password Requirements</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                At least 8 characters long
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Contains uppercase and lowercase letters
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Contains at least one number
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Contains at least one special character
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication Tab */}
      {activeTab === 'twofactor' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Two-Factor Authentication</h2>
                <p className="text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={handleTwoFactorToggle}
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  twoFactorEnabled
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Updating...' : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${twoFactorEnabled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center">
                <span className="text-2xl mr-3">{twoFactorEnabled ? '✅' : '⚠️'}</span>
                <div>
                  <h3 className="font-medium">
                    {twoFactorEnabled ? 'Two-Factor Authentication is Enabled' : 'Two-Factor Authentication is Disabled'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {twoFactorEnabled 
                      ? 'Your account is protected with an additional security layer.'
                      : 'Enable 2FA to add an extra layer of security to your account.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">How Two-Factor Authentication Works</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">1️⃣</span>
                <div>
                  <h3 className="font-medium">Download an Authenticator App</h3>
                  <p className="text-sm text-gray-600">Use apps like Google Authenticator, Authy, or Microsoft Authenticator</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">2️⃣</span>
                <div>
                  <h3 className="font-medium">Scan QR Code</h3>
                  <p className="text-sm text-gray-600">Scan the QR code displayed on your screen with your authenticator app</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">3️⃣</span>
                <div>
                  <h3 className="font-medium">Enter Verification Code</h3>
                  <p className="text-sm text-gray-600">Enter the 6-digit code from your authenticator app to complete setup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Active Sessions</h2>
              <button
                onClick={handleLogoutAllDevices}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Logging out...' : 'Logout All Devices'}
              </button>
            </div>

            <div className="space-y-4">
              {loginHistory.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${session.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="font-medium">{session.device}</div>
                      <div className="text-sm text-gray-600">{session.location} • {session.ip}</div>
                      <div className="text-xs text-gray-500">{session.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {session.status === 'success' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Current Session
                      </span>
                    )}
                    {session.status === 'failed' && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Failed Login
                      </span>
                    )}
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-3">⚠️</span>
              <div>
                <h3 className="font-medium text-yellow-800">Security Notice</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  If you notice any suspicious activity or unrecognized devices, 
                  immediately change your password and logout all devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
