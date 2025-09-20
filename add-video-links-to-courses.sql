-- Add video_links column to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS video_links TEXT[] DEFAULT '{}';

-- Add comment to explain the column
COMMENT ON COLUMN courses.video_links IS 'Array of video URLs for course content (YouTube, Vimeo, etc.)';

-- Update existing courses to have empty video_links array if null
UPDATE courses 
SET video_links = '{}' 
WHERE video_links IS NULL;
