import { supabaseAdmin } from './client'

export interface UserData {
  id?: string
  email: string
  display_name?: string
  age_band?: string
  role?: 'student' | 'parent' | 'admin'
  enrollment_date?: Date
  course_enrolled?: string
  payment_reference?: string
  status?: 'active' | 'inactive'
  address?: any
  emergency_contact?: any
  preferences?: any
  created_at?: Date
  updated_at?: Date
}

export interface EnrollmentData {
  id?: string
  email: string
  child_name?: string
  parent_name?: string
  parent_email?: string
  age_band?: string
  course_enrolled?: string
  payment_reference?: string
  amount?: number
  currency?: string
  status?: 'pending' | 'completed' | 'failed'
  enrollment_date?: Date
  created_at?: Date
  updated_at?: Date
}

// Save user data to Supabase after successful payment
export async function saveUserToSupabase(userData: UserData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: userData.email,
        display_name: userData.display_name,
        age_band: userData.age_band,
        role: userData.role || 'student',
        enrollment_date: userData.enrollment_date,
        course_enrolled: userData.course_enrolled,
        payment_reference: userData.payment_reference,
        status: userData.status || 'active',
        address: userData.address || {},
        emergency_contact: userData.emergency_contact || {},
        preferences: userData.preferences || {}
      })
      .select()
      .single()
    
    if (error) throw error
    
    console.log('✅ User data saved to Supabase:', userData.email)
    return data
  } catch (error) {
    console.error('❌ Error saving user to Supabase:', error)
    throw error
  }
}

// Save enrollment data to Supabase
export async function saveEnrollmentToSupabase(enrollmentData: EnrollmentData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .insert({
        email: enrollmentData.email,
        child_name: enrollmentData.child_name,
        parent_name: enrollmentData.parent_name,
        parent_email: enrollmentData.parent_email,
        age_band: enrollmentData.age_band,
        course_enrolled: enrollmentData.course_enrolled,
        payment_reference: enrollmentData.payment_reference,
        amount: enrollmentData.amount,
        currency: enrollmentData.currency || 'GHS',
        status: enrollmentData.status || 'pending',
        enrollment_date: enrollmentData.enrollment_date
      })
      .select()
      .single()
    
    if (error) throw error
    
    console.log('✅ Enrollment data saved to Supabase:', data.id)
    return data
  } catch (error) {
    console.error('❌ Error saving enrollment to Supabase:', error)
    throw error
  }
}

// Get user data from Supabase by email
export async function getUserFromSupabase(email: string): Promise<UserData | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      throw error
    }
    
    return data
  } catch (error) {
    console.error('❌ Error getting user from Supabase:', error)
    throw error
  }
}

// Get user data from Supabase by ID
export async function getUserByIdFromSupabase(id: string): Promise<UserData | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      throw error
    }
    
    return data
  } catch (error) {
    console.error('❌ Error getting user by ID from Supabase:', error)
    throw error
  }
}

// Get enrollment data from Supabase by email
export async function getEnrollmentFromSupabase(email: string): Promise<EnrollmentData | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      throw error
    }
    
    return data
  } catch (error) {
    console.error('❌ Error getting enrollment from Supabase:', error)
    throw error
  }
}

// Update user status
export async function updateUserStatus(email: string, status: 'active' | 'inactive') {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ status })
      .eq('email', email)
      .select()
      .single()
    
    if (error) throw error
    
    console.log('✅ User status updated:', email, status)
    return data
  } catch (error) {
    console.error('❌ Error updating user status:', error)
    throw error
  }
}

// Update user profile
export async function updateUserProfile(id: string, updates: Partial<UserData>) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    console.log('✅ User profile updated:', id)
    return data
  } catch (error) {
    console.error('❌ Error updating user profile:', error)
    throw error
  }
}

// Create user with Supabase Auth
export async function createUserWithAuth(email: string, password: string, userData: Partial<UserData>) {
  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData
    })
    
    if (authError) throw authError
    
    // Create user profile in database
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        display_name: userData.display_name,
        age_band: userData.age_band,
        role: userData.role || 'student',
        status: 'active',
        address: userData.address || {},
        emergency_contact: userData.emergency_contact || {},
        preferences: userData.preferences || {}
      })
      .select()
      .single()
    
    if (profileError) throw profileError
    
    console.log('✅ User created with auth:', email)
    return { auth: authData, profile: profileData }
  } catch (error) {
    console.error('❌ Error creating user with auth:', error)
    throw error
  }
}
