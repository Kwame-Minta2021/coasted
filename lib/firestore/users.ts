import { supabaseAdmin } from '@/lib/supabase';

export interface UserData {
  uid?: string;
  email: string;
  displayName: string;
  phone?: string;
  ageBand?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  enrollmentDate: Date;
  courseEnrolled?: string;
  paymentReference?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface EnrollmentData {
  id?: string;
  email: string;
  childName: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  ageBand: string;
  courseEnrolled: string;
  paymentReference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  enrollmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Save user data to Firestore after successful payment
export async function saveUserToFirestore(userData: UserData) {
  try {
    const { error } = await supabaseAdmin.from('users').insert({
      id: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      phone: userData.phone,
      ageBand: userData.ageBand,
      parentName: userData.parentName,
      parentEmail: userData.parentEmail,
      parentPhone: userData.parentPhone,
      enrollmentDate: userData.enrollmentDate,
      courseEnrolled: userData.courseEnrolled,
      paymentReference: userData.paymentReference,
      status: userData.status,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    if (error) throw error;
    
    console.log('✅ User data saved to Firestore:', userData.email);
    return true;
  } catch (error) {
    console.error('❌ Error saving user to Firestore:', error);
    throw error;
  }
}

// Save enrollment data to Firestore
export async function saveEnrollmentToFirestore(enrollmentData: EnrollmentData) {
  try {
    const { data, error } = await supabaseAdmin.from('enrollments').insert({
      email: enrollmentData.email,
      child_name: enrollmentData.childName,
      parent_name: enrollmentData.parentName,
      parent_email: enrollmentData.parentEmail,
      parent_phone: enrollmentData.parentPhone,
      age_band: enrollmentData.ageBand,
      course_enrolled: enrollmentData.courseEnrolled,
      payment_reference: enrollmentData.paymentReference,
      amount: enrollmentData.amount,
      currency: enrollmentData.currency,
      status: enrollmentData.status,
      enrollment_date: enrollmentData.enrollmentDate,
      created_at: new Date(),
      updated_at: new Date()
    }).select('id').single();
    if (error) throw error;
    console.log('✅ Enrollment data saved to Supabase:', data?.id);
    return data?.id;
  } catch (error) {
    console.error('❌ Error saving enrollment to Firestore:', error);
    throw error;
  }
}

// Get user data from Firestore by email
export async function getUserFromFirestore(email: string): Promise<UserData | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (error) throw error;
    return (data as any) as UserData | null;
  } catch (error) {
    console.error('❌ Error getting user from Firestore:', error);
    throw error;
  }
}

// Get enrollment data from Firestore by email
export async function getEnrollmentFromFirestore(email: string): Promise<EnrollmentData | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('email', email)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data as any) as EnrollmentData | null;
  } catch (error) {
    console.error('❌ Error getting enrollment from Firestore:', error);
    throw error;
  }
}

// Update user status
export async function updateUserStatus(email: string, status: 'active' | 'inactive') {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ status, updatedAt: new Date() })
      .eq('email', email);
    if (error) throw error;
    
    console.log('✅ User status updated:', email, status);
    return true;
  } catch (error) {
    console.error('❌ Error updating user status:', error);
    throw error;
  }
}
