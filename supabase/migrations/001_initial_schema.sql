-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'parent', 'admin');
CREATE TYPE enrollment_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE course_category AS ENUM ('coding', 'robotics', 'ai', 'general');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  display_name VARCHAR,
  age_band VARCHAR,
  role user_role DEFAULT 'student',
  enrollment_date TIMESTAMPTZ,
  course_enrolled VARCHAR,
  payment_reference VARCHAR,
  status VARCHAR DEFAULT 'active',
  address JSONB DEFAULT '{}',
  emergency_contact JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL,
  child_name VARCHAR,
  parent_name VARCHAR,
  parent_email VARCHAR,
  age_band VARCHAR,
  course_enrolled VARCHAR,
  payment_reference VARCHAR UNIQUE,
  amount INTEGER,
  currency VARCHAR DEFAULT 'GHS',
  status enrollment_status DEFAULT 'pending',
  enrollment_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  description TEXT,
  instructor VARCHAR,
  level course_level,
  category course_category,
  duration VARCHAR,
  modules JSONB DEFAULT '[]',
  prerequisites JSONB DEFAULT '[]',
  learning_objectives JSONB DEFAULT '[]',
  certification BOOLEAN DEFAULT false,
  price INTEGER,
  currency VARCHAR DEFAULT 'GHS',
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress table
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id VARCHAR,
  completion_percentage INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  time_spent INTEGER DEFAULT 0,
  completed_lessons JSONB DEFAULT '[]',
  quiz_scores JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guidance table
CREATE TABLE guidance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guardian_id UUID REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  screen_time_limit INTEGER DEFAULT 120,
  break_interval INTEGER DEFAULT 30,
  focus_mode_enabled BOOLEAN DEFAULT false,
  pin_enabled BOOLEAN DEFAULT false,
  pin_hash VARCHAR,
  restrictions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table (for tracking payment history)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR DEFAULT 'enrollment',
  reference VARCHAR UNIQUE NOT NULL,
  status VARCHAR DEFAULT 'pending',
  email VARCHAR,
  amount INTEGER,
  currency VARCHAR DEFAULT 'GHS',
  channel VARCHAR,
  paid_at TIMESTAMPTZ,
  meta JSONB DEFAULT '{}',
  enrollment_ref VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_code VARCHAR UNIQUE NOT NULL,
  email VARCHAR,
  plan_code VARCHAR,
  status VARCHAR,
  next_billing_date TIMESTAMPTZ,
  enrollment_ref VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_enrollments_payment_ref ON enrollments(payment_reference);
CREATE INDEX idx_enrollments_email ON enrollments(email);
CREATE INDEX idx_progress_user_course ON progress(user_id, course_id);
CREATE INDEX idx_guidance_student ON guidance(student_id);
CREATE INDEX idx_guidance_guardian ON guidance(guardian_id);
CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_subscriptions_code ON subscriptions(subscription_code);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guidance_updated_at BEFORE UPDATE ON guidance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Users can read/write their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Enrollments are readable by authenticated users
CREATE POLICY "Authenticated users can view enrollments" ON enrollments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create enrollments" ON enrollments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Courses are publicly readable
CREATE POLICY "Courses are publicly readable" ON courses
  FOR SELECT USING (true);

-- Progress data is user-specific
CREATE POLICY "Users can view own progress" ON progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Guidance data is guardian-specific
CREATE POLICY "Guardians can view own guidance" ON guidance
  FOR SELECT USING (auth.uid() = guardian_id);

CREATE POLICY "Guardians can update own guidance" ON guidance
  FOR UPDATE USING (auth.uid() = guardian_id);

CREATE POLICY "Guardians can insert own guidance" ON guidance
  FOR INSERT WITH CHECK (auth.uid() = guardian_id);

-- Payments are readable by authenticated users
CREATE POLICY "Authenticated users can view payments" ON payments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can create payments" ON payments
  FOR INSERT WITH CHECK (true);

-- Subscriptions are readable by authenticated users
CREATE POLICY "Authenticated users can view subscriptions" ON subscriptions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can create subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (true);
