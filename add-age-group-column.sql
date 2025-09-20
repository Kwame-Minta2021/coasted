-- Simple script to add age_group column to courses table
-- Run this step by step in Supabase SQL Editor

-- Step 1: Create the age_group enum type
CREATE TYPE age_group AS ENUM ('6-9', '10-13', '14-17');

-- Step 2: Add the age_group column to courses table
ALTER TABLE courses ADD COLUMN age_group age_group;

-- Step 3: Add instructor_id column (nullable for now)
ALTER TABLE courses ADD COLUMN instructor_id UUID;

-- Step 4: Add difficulty_level column
ALTER TABLE courses ADD COLUMN difficulty_level INTEGER DEFAULT 1;

-- Step 5: Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY ordinal_position;
