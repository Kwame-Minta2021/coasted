-- Create instructors table
-- Run this after adding the age_group column

-- Create instructors table
CREATE TABLE instructors (
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

-- Insert default instructor user (password: instructor123)
INSERT INTO instructors (email, password_hash, name, bio, specialization, status) 
VALUES (
  'instructor@coastedcode.com',
  '$2b$10$qDypLE1QnExXXp.Nl7LY9.ag7/0VFu9RaIRsn1SdatfloV8vtlR0K', -- instructor123
  'Courses Instructor',
  'Experienced coding instructor specializing in kids education',
  ARRAY['Python', 'JavaScript', 'Scratch', 'Robotics'],
  'active'
);

-- Verify instructor was created
SELECT id, email, name, status FROM instructors WHERE email = 'instructor@coastedcode.com';
