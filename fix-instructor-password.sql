-- Fix instructor password hash
-- The current password hash might be incorrect

-- Check current instructor data
SELECT id, email, password_hash, name, status FROM instructors WHERE email = 'instructor@coastedcode.com';

-- Update the password hash to a correct bcrypt hash for 'instructor123'
UPDATE instructors 
SET password_hash = '$2b$10$qDypLE1QnExXXp.Nl7LY9.ag7/0VFu9RaIRsn1SdatfloV8vtlR0K'
WHERE email = 'instructor@coastedcode.com';

-- Verify the update
SELECT id, email, password_hash, name, status FROM instructors WHERE email = 'instructor@coastedcode.com';
