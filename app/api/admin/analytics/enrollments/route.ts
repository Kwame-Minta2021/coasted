import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get('period') || '30') // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - period)

    // Get total enrollment statistics
    const { data: enrollmentStats, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('amount, enrollment_date, age_band, status')
      .eq('status', 'completed')
      .gte('enrollment_date', startDate.toISOString())

    if (enrollmentError) {
      console.error('Enrollment stats error:', enrollmentError)
    }

    // Calculate totals
    const totalEnrollments = enrollmentStats?.length || 0
    const totalRevenue = enrollmentStats?.reduce((sum, enrollment) => sum + (enrollment.amount || 0), 0) || 0

    // Get revenue by age band
    const revenueByAge = enrollmentStats?.reduce((acc, enrollment) => {
      const ageBand = enrollment.age_band || 'Unknown'
      if (!acc[ageBand]) {
        acc[ageBand] = { age_band: ageBand, amount: 0, count: 0 }
      }
      acc[ageBand].amount += enrollment.amount || 0
      acc[ageBand].count += 1
      return acc
    }, {} as Record<string, { age_band: string; amount: number; count: number }>)

    const revenueByAgeArray = Object.values(revenueByAge || {})

    // Get daily enrollment trend
    const { data: dailyTrend, error: trendError } = await supabaseAdmin
      .from('enrollments')
      .select('enrollment_date, age_band, amount')
      .eq('status', 'completed')
      .gte('enrollment_date', startDate.toISOString())
      .order('enrollment_date')

    if (trendError) {
      console.error('Daily trend error:', trendError)
    }

    // Process daily trend data
    const dailyTrendMap = new Map()
    dailyTrend?.forEach(enrollment => {
      const date = new Date(enrollment.enrollment_date).toISOString().split('T')[0]
      if (!dailyTrendMap.has(date)) {
        dailyTrendMap.set(date, { date, enrollments: 0, revenue: 0 })
      }
      const dayData = dailyTrendMap.get(date)
      dayData.enrollments += 1
      dayData.revenue += enrollment.amount || 0
    })

    const dailyTrendArray = Array.from(dailyTrendMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Get course progress analytics
    const { data: courseProgress, error: progressError } = await supabaseAdmin
      .from('courses')
      .select(`
        id,
        title,
        level,
        category,
        student_progress(
          user_id,
          completion_percentage,
          completed_at
        )
      `)

    if (progressError) {
      console.error('Course progress error:', progressError)
    }

    // Process course progress data
    const courseAnalytics = courseProgress?.map(course => {
      const progress = course.student_progress || []
      const activeStudents = new Set(progress.map(p => p.user_id)).size
      const avgProgress = progress.length > 0 
        ? progress.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / progress.length 
        : 0
      const completedStudents = progress.filter(p => p.completion_percentage === 100).length

      return {
        course_id: course.id,
        course_name: course.title,
        course_level: course.level,
        course_category: course.category,
        active_students: activeStudents,
        avg_progress: Math.round(avgProgress),
        total_activities: progress.length,
        completed_students: completedStudents
      }
    }) || []

    // Get recent enrollments
    const { data: recentEnrollments, error: recentError } = await supabaseAdmin
      .from('enrollments')
      .select(`
        id,
        enrollment_date,
        amount,
        age_band,
        status,
        student_name,
        student_email
      `)
      .eq('status', 'completed')
      .order('enrollment_date', { ascending: false })
      .limit(10)

    if (recentError) {
      console.error('Recent enrollments error:', recentError)
    }

    return NextResponse.json({
      success: true,
      data: {
        totalEnrollments,
        totalRevenue,
        avgRevenuePerStudent: totalEnrollments > 0 ? Math.round(totalRevenue / totalEnrollments) : 0,
        revenueByAge: revenueByAgeArray,
        dailyTrend: dailyTrendArray,
        courseAnalytics,
        recentEnrollments: recentEnrollments || []
      }
    })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
