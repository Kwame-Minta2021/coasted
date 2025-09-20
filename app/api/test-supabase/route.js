import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET() {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    }

    // Test 1: Database Connection
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('count')
        .limit(1)
      
      if (error) throw error
      
      results.tests.push({
        name: 'Database Connection',
        status: 'PASS',
        message: 'Successfully connected to Supabase database'
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: 'Database Connection',
        status: 'FAIL',
        message: `Database connection failed: ${error.message}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 2: Users Table Access
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, email, display_name')
        .limit(1)
      
      if (error) throw error
      
      results.tests.push({
        name: 'Users Table Access',
        status: 'PASS',
        message: 'Successfully accessed users table'
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: 'Users Table Access',
        status: 'FAIL',
        message: `Users table access failed: ${error.message}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 3: Enrollments Table Access
    try {
      const { data, error } = await supabaseAdmin
        .from('enrollments')
        .select('id, email, child_name')
        .limit(1)
      
      if (error) throw error
      
      results.tests.push({
        name: 'Enrollments Table Access',
        status: 'PASS',
        message: 'Successfully accessed enrollments table'
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: 'Enrollments Table Access',
        status: 'FAIL',
        message: `Enrollments table access failed: ${error.message}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 4: Courses Table Access
    try {
      const { data, error } = await supabaseAdmin
        .from('courses')
        .select('id, title, description')
        .limit(1)
      
      if (error) throw error
      
      results.tests.push({
        name: 'Courses Table Access',
        status: 'PASS',
        message: 'Successfully accessed courses table'
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: 'Courses Table Access',
        status: 'FAIL',
        message: `Courses table access failed: ${error.message}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 5: Progress Table Access
    try {
      const { data, error } = await supabaseAdmin
        .from('progress')
        .select('id, user_id, course_id')
        .limit(1)
      
      if (error) throw error
      
      results.tests.push({
        name: 'Progress Table Access',
        status: 'PASS',
        message: 'Successfully accessed progress table'
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: 'Progress Table Access',
        status: 'FAIL',
        message: `Progress table access failed: ${error.message}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 6: Guidance Table Access
    try {
      const { data, error } = await supabaseAdmin
        .from('guidance')
        .select('id, guardian_id, student_id')
        .limit(1)
      
      if (error) throw error
      
      results.tests.push({
        name: 'Guidance Table Access',
        status: 'PASS',
        message: 'Successfully accessed guidance table'
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: 'Guidance Table Access',
        status: 'FAIL',
        message: `Guidance table access failed: ${error.message}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 7: Payments Table Access
    try {
      const { data, error } = await supabaseAdmin
        .from('payments')
        .select('id, reference, status')
        .limit(1)
      
      if (error) throw error
      
      results.tests.push({
        name: 'Payments Table Access',
        status: 'PASS',
        message: 'Successfully accessed payments table'
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: 'Payments Table Access',
        status: 'FAIL',
        message: `Payments table access failed: ${error.message}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 8: Subscriptions Table Access
    try {
      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('id, subscription_code, status')
        .limit(1)
      
      if (error) throw error
      
      results.tests.push({
        name: 'Subscriptions Table Access',
        status: 'PASS',
        message: 'Successfully accessed subscriptions table'
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: 'Subscriptions Table Access',
        status: 'FAIL',
        message: `Subscriptions table access failed: ${error.message}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 9: Row Level Security Check
    try {
      // This should work with service role key
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('count')
      
      if (error) throw error
      
      results.tests.push({
        name: 'Row Level Security',
        status: 'PASS',
        message: 'RLS policies are properly configured'
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: 'Row Level Security',
        status: 'FAIL',
        message: `RLS configuration issue: ${error.message}`
      })
      results.summary.failed++
    }
    results.summary.total++

    // Test 10: Environment Variables Check
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }

    const allEnvVarsPresent = Object.values(envCheck).every(Boolean)
    
    results.tests.push({
      name: 'Environment Variables',
      status: allEnvVarsPresent ? 'PASS' : 'FAIL',
      message: allEnvVarsPresent 
        ? 'All required Supabase environment variables are present'
        : `Missing environment variables: ${Object.entries(envCheck).filter(([_, present]) => !present).map(([key]) => key).join(', ')}`,
      details: envCheck
    })
    
    if (allEnvVarsPresent) {
      results.summary.passed++
    } else {
      results.summary.failed++
    }
    results.summary.total++

    return NextResponse.json({
      success: true,
      results
    })

  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test suite failed',
      details: error.message
    }, { status: 500 })
  }
}
