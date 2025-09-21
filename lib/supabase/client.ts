// Re-export from the main supabase client
export { supabase, supabaseAdmin } from '../supabase'
import { supabase } from '../supabase'

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Handle AuthSessionMissingError gracefully - this is expected when no user is logged in
    if (error && error.message.includes('Auth session missing')) {
      console.log('No active session found (user not authenticated)')
      return null
    } else if (error) {
      console.error('Error getting user:', error)
      throw error
    }
    
    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    throw error
  }
}

// Helper function to get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    // Handle AuthSessionMissingError gracefully - this is expected when no user is logged in
    if (error && error.message.includes('Auth session missing')) {
      console.log('No active session found (user not authenticated)')
      return null
    } else if (error) {
      console.error('Error getting session:', error)
      throw error
    }
    
    return session
  } catch (error) {
    console.error('Error in getCurrentSession:', error)
    throw error
  }
}
