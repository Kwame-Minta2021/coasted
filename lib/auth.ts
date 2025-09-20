'use client';

import { supabase } from './supabase';

export const registerWithEmail = async (email: string, password: string, userData?: Record<string, any>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: userData }
  });
  if (error) throw error;
  return data;
};

export const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getIdToken = async (): Promise<string | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // Handle AuthSessionMissingError gracefully - this is expected when no user is logged in
    if (error && error.message.includes('Auth session missing')) {
      console.log('No active session found (user not authenticated)')
      return null
    } else if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    return session?.access_token ?? null;
  } catch (error) {
    console.error('Error in getIdToken:', error)
    return null
  }
};
