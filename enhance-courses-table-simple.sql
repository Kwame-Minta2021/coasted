-- Enhance courses table with additional fields for comprehensive course management
-- This script adds new columns to support the enhanced course creation and display

-- Add new columns to courses table
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS prerequisites TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS duration_weeks INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS course_image TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Add comments to explain the new columns
COMMENT ON COLUMN courses.prerequisites IS 'Array of prerequisites for the course';
COMMENT ON COLUMN courses.duration_weeks IS 'Course duration in weeks';
COMMENT ON COLUMN courses.max_students IS 'Maximum number of students allowed in the course';
COMMENT ON COLUMN courses.price IS 'Course price in Ghana Cedis';
COMMENT ON COLUMN courses.is_published IS 'Whether the course is published and visible to students';
COMMENT ON COLUMN courses.course_image IS 'URL to the course cover image';
COMMENT ON COLUMN courses.tags IS 'Array of tags for course categorization and search';

-- Update existing courses to have default values
UPDATE courses
SET prerequisites = '{}',
    duration_weeks = 4,
    max_students = 20,
    price = 0.00,
    is_published = true,
    course_image = '',
    tags = '{}'
WHERE prerequisites IS NULL 
   OR duration_weeks IS NULL 
   OR max_students IS NULL 
   OR price IS NULL 
   OR is_published IS NULL 
   OR course_image IS NULL 
   OR tags IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price);
CREATE INDEX IF NOT EXISTS idx_courses_age_group ON courses(age_group);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

-- Add check constraints for data integrity
ALTER TABLE courses
ADD CONSTRAINT IF NOT EXISTS check_duration_positive CHECK (duration_weeks > 0),
ADD CONSTRAINT IF NOT EXISTS check_max_students_positive CHECK (max_students > 0),
ADD CONSTRAINT IF NOT EXISTS check_price_non_negative CHECK (price >= 0);
