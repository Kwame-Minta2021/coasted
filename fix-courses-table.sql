-- Fix courses table by adding missing columns
-- Run this in your Supabase SQL editor

-- Create age groups enum type (if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE age_group AS ENUM ('6-9', '10-13', '14-17');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add missing columns to courses table
DO $$ 
BEGIN
    -- Add instructor_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'instructor_id') THEN
        ALTER TABLE courses ADD COLUMN instructor_id UUID;
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

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY ordinal_position;
