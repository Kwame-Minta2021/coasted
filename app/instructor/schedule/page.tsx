'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, Clock, Users, Video } from 'lucide-react'

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEventModal, setShowEventModal] = useState(false)
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    event_type: 'class',
    age_group: '6-9',
    max_students: 20,
    meeting_link: '',
    is_recurring: false,
    recurrence_pattern: 'weekly'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem('instructorToken')
      console.log('Token from localStorage:', token ? 'Token exists' : 'No token')
      
      if (!token) {
        console.error('No instructor token found')
        setLoading(false)
        return
      }

      const response = await fetch('/api/instructor/schedule', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Schedule API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Fetched schedule data:', data)
        setSchedule(data.schedule || [])
      } else {
        const errorData = await response.json()
        console.error('Failed to fetch schedule:', response.status, errorData)
        
        // If token is expired or invalid, redirect to login
        if (response.status === 401) {
          console.log('Authentication failed, redirecting to login')
          localStorage.removeItem('instructorToken')
          localStorage.removeItem('instructorData')
          window.location.href = '/instructor/login'
        }
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('instructorToken')
      if (!token) return

      const response = await fetch('/api/instructor/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Event created successfully:', result)
        setShowEventModal(false)
        setEventData({
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          event_type: 'class',
          age_group: '6-9',
          max_students: 20,
          meeting_link: '',
          is_recurring: false,
          recurrence_pattern: 'weekly'
        })
        // Add a small delay to ensure the server has processed the event
        setTimeout(() => {
          fetchSchedule() // Refresh the schedule
        }, 500)
      } else {
        const errorData = await response.json()
        console.error('Failed to create event:', errorData)
      }
    } catch (error) {
      console.error('Failed to create event:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEventModal = () => {
    // Set default start time to next hour
    const now = new Date()
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000)
    const endTime = new Date(nextHour.getTime() + 60 * 60 * 1000) // 1 hour duration

    setEventData({
      ...eventData,
      start_time: nextHour.toISOString().slice(0, 16), // Format for datetime-local input
      end_time: endTime.toISOString().slice(0, 16)
    })
    setShowEventModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Schedule</h1>
            <p className="text-purple-100 text-lg">Manage your classes and office hours</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">📅</span>
              </div>
            </div>
            <button 
              onClick={openEventModal}
              className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      {schedule.length > 0 ? (
        <div className="space-y-6">
          {schedule.map((event: any) => (
            <div key={event.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.event_type === 'class' 
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200/50'
                        : event.event_type === 'office_hours'
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/50'
                        : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200/50'
                    }`}>
                      {event.event_type?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                      <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatDate(event.start_time)}</p>
                        <p className="text-xs text-gray-500">Date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                      <Clock className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatTime(event.start_time)} - {formatTime(event.end_time)}</p>
                        <p className="text-xs text-gray-500">Time</p>
                      </div>
                    </div>
                    
                    {event.age_group && (
                      <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200/50">
                        <Users className="w-5 h-5 mr-3 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Ages {event.age_group}</p>
                          <p className="text-xs text-gray-500">Age Group</p>
                        </div>
                      </div>
                    )}
                    
                    {event.meeting_link && (
                      <div className="flex items-center p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/50">
                        <Video className="w-5 h-5 mr-3 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Online</p>
                          <p className="text-xs text-gray-500">Meeting</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No scheduled events</h3>
          <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">Start by scheduling your first class or office hours to begin your teaching schedule.</p>
          <button 
            onClick={openEventModal}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl hover:from-purple-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-medium"
          >
            <Plus className="w-6 h-6 mr-3" />
            Schedule Your First Event
          </button>
        </div>
      )}

      {/* Event Creation Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Schedule New Event</h2>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventData.title}
                    onChange={(e) => setEventData({...eventData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Python Basics - Class 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    value={eventData.event_type}
                    onChange={(e) => setEventData({...eventData, event_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="class">Class</option>
                    <option value="office_hours">Office Hours</option>
                    <option value="workshop">Workshop</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => setEventData({...eventData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what will be covered in this event..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventData.start_time}
                    onChange={(e) => setEventData({...eventData, start_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventData.end_time}
                    onChange={(e) => setEventData({...eventData, end_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Group
                  </label>
                  <select
                    value={eventData.age_group}
                    onChange={(e) => setEventData({...eventData, age_group: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="6-9">Ages 6-9</option>
                    <option value="10-13">Ages 10-13</option>
                    <option value="14-17">Ages 14-17</option>
                    <option value="all">All Ages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={eventData.max_students}
                    onChange={(e) => setEventData({...eventData, max_students: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link (Google Meet, Zoom, etc.)
                </label>
                <input
                  type="url"
                  value={eventData.meeting_link}
                  onChange={(e) => setEventData({...eventData, meeting_link: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={eventData.is_recurring}
                    onChange={(e) => setEventData({...eventData, is_recurring: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Recurring Event</span>
                </label>

                {eventData.is_recurring && (
                  <select
                    value={eventData.recurrence_pattern}
                    onChange={(e) => setEventData({...eventData, recurrence_pattern: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
