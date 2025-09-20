-- Fix Database Schema Issues for Coasted Code

-- 1. Add video_links column to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS video_links TEXT[] DEFAULT '{}';

-- 2. Add missing columns to course_modules table
ALTER TABLE course_modules 
ADD COLUMN IF NOT EXISTS age_group TEXT,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- 3. Create instructor_schedule table if it doesn't exist
CREATE TABLE IF NOT EXISTS instructor_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    max_students INTEGER DEFAULT 20,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(50), -- 'daily', 'weekly', 'monthly'
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create course_lessons table if it doesn't exist
CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 30,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create assignments table if it doesn't exist
CREATE TABLE IF NOT EXISTS assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    max_points INTEGER DEFAULT 100,
    assignment_type VARCHAR(50) DEFAULT 'homework', -- 'homework', 'project', 'quiz'
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Update existing courses to have empty video_links array if null
UPDATE courses 
SET video_links = '{}' 
WHERE video_links IS NULL;

-- 7. Update existing course_modules to have default values
UPDATE course_modules 
SET age_group = '6-9',
    is_published = false,
    estimated_duration = 60,
    order_index = 0
WHERE age_group IS NULL OR is_published IS NULL OR estimated_duration IS NULL OR order_index IS NULL;

-- 8. Add comments to explain the columns
COMMENT ON COLUMN courses.video_links IS 'Array of video URLs for course content (YouTube, Vimeo, etc.)';
COMMENT ON COLUMN course_modules.age_group IS 'Target age group for this module';
COMMENT ON COLUMN course_modules.is_published IS 'Whether this module is published and visible to students';
COMMENT ON COLUMN course_modules.estimated_duration IS 'Estimated duration in minutes';
COMMENT ON COLUMN course_modules.order_index IS 'Order of modules within a course';

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_age_group ON course_modules(age_group);
CREATE INDEX IF NOT EXISTS idx_instructor_schedule_instructor_id ON instructor_schedule(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_schedule_start_time ON instructor_schedule(start_time);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_assignments_lesson_id ON assignments(lesson_id);
