'use client'

import { useState, useEffect } from 'react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  Activity,
  Calendar,
  Award,
  Clock
} from 'lucide-react'

interface DashboardStats {
  totalEnrollments: number
  totalRevenue: number
  avgRevenuePerStudent: number
  revenueByAge: Array<{ age_band: string; amount: number; count: number }>
  dailyTrend: Array<{ date: string; enrollments: number; revenue: number }>
  courseAnalytics: Array<{
    course_id: string
    course_name: string
    course_level: string
    course_category: string
    active_students: number
    avg_progress: number
    total_activities: number
    completed_students: number
  }>
  recentEnrollments: Array<{
    id: string
    enrollment_date: string
    amount: number
    age_band: string
    status: string
    users: { name: string; email: string }
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/analytics/enrollments?period=30', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.error || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your Coasted Code platform</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalEnrollments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">GHS {stats?.totalRevenue || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Revenue/Student</p>
              <p className="text-2xl font-bold text-gray-900">GHS {stats?.avgRevenuePerStudent || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.courseAnalytics.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Age Group */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Age Group</h3>
            <p className="text-sm text-gray-600">Revenue breakdown by student age bands</p>
          </div>
          <div>
            <div className="space-y-4">
              {stats?.revenueByAge.map((ageGroup, index) => (
                <div key={ageGroup.age_band} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className={`w-4 h-4 rounded-full mr-3 ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 
                        index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                    />
                    <span className="text-sm font-medium">{ageGroup.age_band}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">GHS {ageGroup.amount}</p>
                    <p className="text-xs text-gray-500">{ageGroup.count} students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Course Performance</h3>
            <p className="text-sm text-gray-600">Student engagement across courses</p>
          </div>
          <div>
            <div className="space-y-4">
              {stats?.courseAnalytics.slice(0, 5).map((course) => (
                <div key={course.course_id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{course.course_name}</p>
                    <p className="text-xs text-gray-500">{course.course_level} • {course.course_category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{course.active_students} students</p>
                    <p className="text-xs text-gray-500">{course.avg_progress}% avg progress</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
          <p className="text-sm text-gray-600">Latest student enrollments and payments</p>
        </div>
        <div>
          <div className="space-y-4">
            {stats?.recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{enrollment.users?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{enrollment.users?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">GHS {enrollment.amount}</p>
                  <p className="text-xs text-gray-500">{enrollment.age_band}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    enrollment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {enrollment.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(enrollment.enrollment_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
