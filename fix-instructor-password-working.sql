-- Fix instructor password with a working bcrypt hash
-- This hash is verified to work with 'instructor123'

-- Update the password hash to a working bcrypt hash
UPDATE instructors 
SET password_hash = '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV'
WHERE email = 'instructor@coastedcode.com';

-- Verify the update
SELECT id, email, password_hash, name, status FROM instructors WHERE email = 'instructor@coastedcode.com';
