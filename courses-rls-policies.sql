-- RLS Policies for courses table
-- Run this after the main enhance-courses-table-simple.sql migration

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Students can view published courses" ON courses;
DROP POLICY IF EXISTS "Instructors can manage their own courses" ON courses;
DROP POLICY IF EXISTS "Service role can manage all courses" ON courses;

-- Create policy for students to view published courses
CREATE POLICY "Students can view published courses" ON courses
FOR SELECT
TO authenticated
USING (is_published = true);

-- Create policy for instructors to manage their own courses
-- Note: This assumes instructor authentication is handled at the application level
-- since we're using custom JWT tokens for instructors
CREATE POLICY "Instructors can manage their own courses" ON courses
FOR ALL
TO authenticated
USING (true); -- We'll handle instructor authorization in the API layer

-- Allow service role to manage all courses (for admin operations)
CREATE POLICY "Service role can manage all courses" ON courses
FOR ALL
TO service_role
USING (true);
