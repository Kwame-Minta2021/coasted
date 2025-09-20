-- Instructor Dashboard Database Schema for Coasted Code (Fixed Version)
-- Run these commands in your Supabase SQL editor

-- First, let's check what columns exist in the courses table
-- This will help us understand the current structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY ordinal_position;

-- Create age groups enum type (if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE age_group AS ENUM ('6-9', '10-13', '14-17');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  bio TEXT,
  specialization TEXT[],
  password_hash VARCHAR NOT NULL,
  profile_image VARCHAR,
  timezone VARCHAR DEFAULT 'UTC',
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns to courses table (only if they don't exist)
DO $$ 
BEGIN
    -- Add instructor_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'instructor_id') THEN
        ALTER TABLE courses ADD COLUMN instructor_id UUID REFERENCES instructors(id);
    END IF;
    
    -- Add age_group column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'age_group') THEN
        ALTER TABLE courses ADD COLUMN age_group age_group;
    END IF;
    
    -- Add difficulty_level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'difficulty_level') THEN
        ALTER TABLE courses ADD COLUMN difficulty_level INTEGER DEFAULT 1;
    END IF;
END $$;

-- Create course modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  age_group age_group NOT NULL,
  order_index INTEGER,
  estimated_duration INTEGER, -- minutes
  learning_objectives TEXT[],
  prerequisites TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES instructors(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  content_type VARCHAR, -- 'video', 'interactive', 'reading', 'quiz', 'assignment'
  video_url VARCHAR,
  video_platform VARCHAR, -- 'youtube', 'vimeo', 'loom', 'custom'
  materials JSONB DEFAULT '[]', -- downloadable materials
  interactive_content JSONB DEFAULT '{}', -- coding exercises, games
  duration_minutes INTEGER,
  order_index INTEGER,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create instructor schedule table
CREATE TABLE IF NOT EXISTS instructor_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID REFERENCES instructors(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  event_type VARCHAR, -- 'class', 'office_hours', 'break', 'unavailable'
  age_group age_group,
  max_students INTEGER,
  meeting_link VARCHAR,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB, -- daily, weekly, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES course_lessons(id),
  title VARCHAR NOT NULL,
  description TEXT,
  instructions TEXT,
  age_group age_group NOT NULL,
  difficulty_level INTEGER DEFAULT 1,
  estimated_time INTEGER, -- minutes
  submission_type VARCHAR, -- 'code', 'video', 'document', 'screenshot'
  due_date TIMESTAMPTZ,
  max_score INTEGER DEFAULT 100,
  rubric JSONB,
  created_by UUID REFERENCES instructors(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_modules_age_group ON course_modules(age_group);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_instructor_schedule_time ON instructor_schedule(instructor_id, start_time);
CREATE INDEX IF NOT EXISTS idx_assignments_age_group ON assignments(age_group);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_instructors_updated_at ON instructors;
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_modules_updated_at ON course_modules;
CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON course_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for instructor tables
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow service role to manage instructors" ON instructors;
DROP POLICY IF EXISTS "Allow service role to manage course_modules" ON course_modules;
DROP POLICY IF EXISTS "Allow service role to manage course_lessons" ON course_lessons;
DROP POLICY IF EXISTS "Allow service role to manage instructor_schedule" ON instructor_schedule;
DROP POLICY IF EXISTS "Allow service role to manage assignments" ON assignments;

-- Allow service role to manage instructor tables
CREATE POLICY "Allow service role to manage instructors" ON instructors
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role to manage course_modules" ON course_modules
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role to manage course_lessons" ON course_lessons
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role to manage instructor_schedule" ON instructor_schedule
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role to manage assignments" ON assignments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Insert default instructor user (password: instructor123 - change this!)
INSERT INTO instructors (email, password_hash, name, bio, specialization, status) 
VALUES (
  'instructor@coastedcode.com',
  '$2b$10$qDypLE1QnExXXp.Nl7LY9.ag7/0VFu9RaIRsn1SdatfloV8vtlR0K', -- instructor123
  'Demo Instructor',
  'Experienced coding instructor specializing in kids education',
  ARRAY['Python', 'JavaScript', 'Scratch', 'Robotics'],
  'active'
) ON CONFLICT (email) DO NOTHING;

-- Verify the setup
SELECT 'Setup completed successfully!' as status;
SELECT 'Instructor created:' as info, email, name FROM instructors WHERE email = 'instructor@coastedcode.com';
SELECT 'Courses table columns:' as info, column_name FROM information_schema.columns WHERE table_name = 'courses' ORDER BY ordinal_position;
