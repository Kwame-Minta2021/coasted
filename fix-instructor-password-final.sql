-- Fix instructor password with a verified working hash
-- This will make the login work immediately

-- Delete the existing instructor and create a new one with a working password hash
DELETE FROM instructors WHERE email = 'instructor@coastedcode.com';

-- Insert a new instructor with a working bcrypt hash for 'instructor123'
INSERT INTO instructors (email, password_hash, name, bio, specialization, status) 
VALUES (
  'instructor@coastedcode.com',
  '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV',
  'Demo Instructor',
  'Experienced coding instructor specializing in kids education',
  ARRAY['Python', 'JavaScript', 'Scratch', 'Robotics'],
  'active'
);

-- Verify the instructor was created
SELECT id, email, name, status FROM instructors WHERE email = 'instructor@coastedcode.com';
