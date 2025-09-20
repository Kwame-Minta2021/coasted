-- Fix Admin RLS Policies
-- Run this in your Supabase SQL Editor to fix the admin authentication

-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Admin users can view own profile" ON admin_users;
DROP POLICY IF EXISTS "Only admins can manage course content" ON course_content;
DROP POLICY IF EXISTS "Admins can view all student progress" ON student_progress;
DROP POLICY IF EXISTS "Students can view own progress" ON student_progress;

-- Disable RLS for admin tables (since we're using custom auth)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log DISABLE ROW LEVEL SECURITY;

-- Verify the admin user exists
SELECT * FROM admin_users WHERE email = 'admin@coastedcode.com';

-- If the admin user doesn't exist, insert it
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES (
  'admin@coastedcode.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
  'Admin User',
  'admin'
) ON CONFLICT (email) DO NOTHING;
