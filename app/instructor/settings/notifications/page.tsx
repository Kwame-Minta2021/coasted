'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotificationSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    // Email Notifications
    emailNewEnrollments: true,
    emailScheduleReminders: true,
    emailStudentMessages: true,
    emailSystemUpdates: false,
    emailMarketing: false,
    
    // Push Notifications
    pushNewEnrollments: true,
    pushScheduleReminders: true,
    pushStudentMessages: true,
    pushSystemUpdates: false,
    
    // SMS Notifications
    smsScheduleReminders: false,
    smsUrgentMessages: true,
    
    // Frequency Settings
    reminderFrequency: '1hour', // 1hour, 30min, 15min
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    
    // Digest Settings
    dailyDigest: true,
    weeklyReport: true,
    monthlyReport: false
  })

  useEffect(() => {
    // Load saved notification preferences
    const savedSettings = localStorage.getItem('instructor-notification-settings')
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleNestedSettingChange = (parent: string, child: string, value: boolean | string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [child]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Save to localStorage
      localStorage.setItem('instructor-notification-settings', JSON.stringify(notificationSettings))
      
      // In a real app, you'd send this to an API
      console.log('Saving notification settings:', notificationSettings)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Notification settings saved successfully!')
      
    } catch (error) {
      console.error('Failed to save notification settings:', error)
      alert('Failed to save notification settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all notification settings to default?')) {
      setNotificationSettings({
        emailNewEnrollments: true,
        emailScheduleReminders: true,
        emailStudentMessages: true,
        emailSystemUpdates: false,
        emailMarketing: false,
        pushNewEnrollments: true,
        pushScheduleReminders: true,
        pushStudentMessages: true,
        pushSystemUpdates: false,
        smsScheduleReminders: false,
        smsUrgentMessages: true,
        reminderFrequency: '1hour',
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '08:00'
        },
        dailyDigest: true,
        weeklyReport: true,
        monthlyReport: false
      })
    }
  }

  const NotificationToggle = ({ 
    label, 
    description, 
    setting, 
    value 
  }: { 
    label: string
    description: string
    setting: string
    value: boolean
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => handleSettingChange(setting, e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  )

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
        <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
        <p className="text-gray-600 mt-2">Manage how and when you receive notifications</p>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-3">📧</span>
            Email Notifications
          </h2>
          
          <div className="space-y-1">
            <NotificationToggle
              label="New Student Enrollments"
              description="Get notified when new students enroll in your courses"
              setting="emailNewEnrollments"
              value={notificationSettings.emailNewEnrollments}
            />
            <hr className="my-2" />
            <NotificationToggle
              label="Schedule Reminders"
              description="Receive reminders about upcoming classes and meetings"
              setting="emailScheduleReminders"
              value={notificationSettings.emailScheduleReminders}
            />
            <hr className="my-2" />
            <NotificationToggle
              label="Student Messages"
              description="Get notified when students send you messages"
              setting="emailStudentMessages"
              value={notificationSettings.emailStudentMessages}
            />
            <hr className="my-2" />
            <NotificationToggle
              label="System Updates"
              description="Receive updates about platform changes and maintenance"
              setting="emailSystemUpdates"
              value={notificationSettings.emailSystemUpdates}
            />
            <hr className="my-2" />
            <NotificationToggle
              label="Marketing & Promotions"
              description="Receive information about new features and educational resources"
              setting="emailMarketing"
              value={notificationSettings.emailMarketing}
            />
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-3">🔔</span>
            Push Notifications
          </h2>
          
          <div className="space-y-1">
            <NotificationToggle
              label="New Student Enrollments"
              description="Get instant notifications for new enrollments"
              setting="pushNewEnrollments"
              value={notificationSettings.pushNewEnrollments}
            />
            <hr className="my-2" />
            <NotificationToggle
              label="Schedule Reminders"
              description="Receive push notifications for upcoming events"
              setting="pushScheduleReminders"
              value={notificationSettings.pushScheduleReminders}
            />
            <hr className="my-2" />
            <NotificationToggle
              label="Student Messages"
              description="Get notified instantly when students message you"
              setting="pushStudentMessages"
              value={notificationSettings.pushStudentMessages}
            />
            <hr className="my-2" />
            <NotificationToggle
              label="System Updates"
              description="Receive important system notifications"
              setting="pushSystemUpdates"
              value={notificationSettings.pushSystemUpdates}
            />
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-3">📱</span>
            SMS Notifications
          </h2>
          
          <div className="space-y-1">
            <NotificationToggle
              label="Schedule Reminders"
              description="Receive SMS reminders for important classes"
              setting="smsScheduleReminders"
              value={notificationSettings.smsScheduleReminders}
            />
            <hr className="my-2" />
            <NotificationToggle
              label="Urgent Messages"
              description="Get SMS alerts for urgent student communications"
              setting="smsUrgentMessages"
              value={notificationSettings.smsUrgentMessages}
            />
          </div>
        </div>

        {/* Frequency Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-3">⏰</span>
            Frequency & Timing
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Reminder Frequency
              </label>
              <div className="space-y-2">
                {[
                  { value: '15min', label: '15 minutes before' },
                  { value: '30min', label: '30 minutes before' },
                  { value: '1hour', label: '1 hour before' },
                  { value: '1day', label: '1 day before' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="reminderFrequency"
                      value={option.value}
                      checked={notificationSettings.reminderFrequency === option.value}
                      onChange={(e) => handleSettingChange('reminderFrequency', e.target.value)}
                      className="mr-3"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Quiet Hours
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.quietHours.enabled}
                    onChange={(e) => handleNestedSettingChange('quietHours', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {notificationSettings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={notificationSettings.quietHours.start}
                      onChange={(e) => handleNestedSettingChange('quietHours', 'start', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Time</label>
                    <input
                      type="time"
                      value={notificationSettings.quietHours.end}
                      onChange={(e) => handleNestedSettingChange('quietHours', 'end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Digest Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Reports & Digests
          </h2>
          
          <div className="space-y-1">
            <NotificationToggle
              label="Daily Digest"
              description="Receive a daily summary of your teaching activities"
              setting="dailyDigest"
              value={notificationSettings.dailyDigest}
            />
            <hr className="my-2" />
            <NotificationToggle
              label="Weekly Report"
              description="Get a weekly summary of student progress and engagement"
              setting="weeklyReport"
              value={notificationSettings.weeklyReport}
            />
            <hr className="my-2" />
            <NotificationToggle
              label="Monthly Report"
              description="Receive comprehensive monthly analytics and insights"
              setting="monthlyReport"
              value={notificationSettings.monthlyReport}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
