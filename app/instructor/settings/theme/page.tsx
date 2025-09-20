'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ThemeSettingsPage() {
  const router = useRouter()
  const [theme, setTheme] = useState('light')
  const [accentColor, setAccentColor] = useState('#3B82F6')
  const [fontSize, setFontSize] = useState('medium')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load saved theme preferences
    const savedTheme = localStorage.getItem('instructor-theme') || 'light'
    const savedAccentColor = localStorage.getItem('instructor-accent-color') || '#3B82F6'
    const savedFontSize = localStorage.getItem('instructor-font-size') || 'medium'
    
    setTheme(savedTheme)
    setAccentColor(savedAccentColor)
    setFontSize(savedFontSize)
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Save to localStorage
      localStorage.setItem('instructor-theme', theme)
      localStorage.setItem('instructor-accent-color', accentColor)
      localStorage.setItem('instructor-font-size', fontSize)
      
      // Apply theme changes
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.style.setProperty('--accent-color', accentColor)
      document.documentElement.style.setProperty('--font-size', fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px')
      
      // Show success message
      alert('Theme settings saved successfully!')
      
    } catch (error) {
      console.error('Failed to save theme settings:', error)
      alert('Failed to save theme settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setTheme('light')
    setAccentColor('#3B82F6')
    setFontSize('medium')
  }

  const accentColors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' }
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
        <h1 className="text-3xl font-bold text-gray-900">Theme Settings</h1>
        <p className="text-gray-600 mt-2">Customize the appearance of your instructor dashboard</p>
      </div>

      <div className="space-y-8">
        {/* Theme Mode */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Theme Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTheme('light')}
            >
              <div className="text-center">
                <div className="w-12 h-8 bg-white border border-gray-300 rounded mx-auto mb-2"></div>
                <h3 className="font-medium">Light</h3>
                <p className="text-sm text-gray-600">Clean and bright interface</p>
              </div>
            </div>
            
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTheme('dark')}
            >
              <div className="text-center">
                <div className="w-12 h-8 bg-gray-800 border border-gray-600 rounded mx-auto mb-2"></div>
                <h3 className="font-medium">Dark</h3>
                <p className="text-sm text-gray-600">Easy on the eyes</p>
              </div>
            </div>
            
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                theme === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTheme('auto')}
            >
              <div className="text-center">
                <div className="w-12 h-8 bg-gradient-to-r from-white to-gray-800 border border-gray-300 rounded mx-auto mb-2"></div>
                <h3 className="font-medium">Auto</h3>
                <p className="text-sm text-gray-600">Follows system preference</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accent Color */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Accent Color</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {accentColors.map((color) => (
              <div
                key={color.value}
                className={`w-12 h-12 rounded-lg cursor-pointer border-2 transition-all ${
                  accentColor === color.value ? 'border-gray-800 scale-110' : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setAccentColor(color.value)}
                title={color.name}
              />
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Color
            </label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Font Size</h2>
          <div className="space-y-3">
            {[
              { value: 'small', label: 'Small', description: 'Compact interface' },
              { value: 'medium', label: 'Medium', description: 'Standard size' },
              { value: 'large', label: 'Large', description: 'Easier to read' }
            ].map((size) => (
              <label key={size.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="fontSize"
                  value={size.value}
                  checked={fontSize === size.value}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">{size.label}</div>
                  <div className="text-sm text-gray-600">{size.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              color: theme === 'dark' ? '#F9FAFB' : '#111827',
              borderColor: accentColor
            }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>
              Sample Heading
            </h3>
            <p className="mb-2">This is how your interface will look with the selected theme settings.</p>
            <button 
              className="px-4 py-2 rounded text-white"
              style={{ backgroundColor: accentColor }}
            >
              Sample Button
            </button>
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
