-- Admin Portal Database Schema for Coasted Code
-- Run these commands in your Supabase SQL editor

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'admin',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course content table
CREATE TABLE IF NOT EXISTS course_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  content_type VARCHAR NOT NULL CHECK (content_type IN ('video', 'document', 'quiz', 'assignment', 'lesson')),
  content_url VARCHAR,
  platform VARCHAR DEFAULT 'youtube' CHECK (platform IN ('youtube', 'vimeo', 'custom', 'pdf', 'text')),
  order_index INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student progress tracking
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  content_id UUID REFERENCES course_content(id) ON DELETE CASCADE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics views
CREATE OR REPLACE VIEW enrollment_analytics AS
SELECT 
  DATE_TRUNC('day', enrollment_date) as date,
  age_band,
  COUNT(*) as enrollments,
  SUM(amount) as revenue
FROM enrollments 
WHERE status = 'completed'
GROUP BY DATE_TRUNC('day', enrollment_date), age_band
ORDER BY date DESC;

-- Course progress analytics
CREATE OR REPLACE VIEW course_progress_analytics AS
SELECT 
  c.id as course_id,
  c.title as course_name,
  c.level as course_level,
  c.category as course_category,
  COUNT(DISTINCT sp.user_id) as active_students,
  AVG(sp.completion_percentage) as avg_progress,
  COUNT(sp.id) as total_activities,
  COUNT(DISTINCT CASE WHEN sp.completion_percentage = 100 THEN sp.user_id END) as completed_students
FROM courses c
LEFT JOIN student_progress sp ON c.id = sp.course_id
GROUP BY c.id, c.title, c.level, c.category;

-- Admin activity log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  action VARCHAR NOT NULL,
  resource_type VARCHAR NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_modules_updated_at BEFORE UPDATE ON course_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_content_updated_at BEFORE UPDATE ON course_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin users can only see their own records
CREATE POLICY "Admin users can view own profile" ON admin_users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Course content policies (admin only)
CREATE POLICY "Only admins can manage course content" ON course_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text
    )
  );

-- Student progress policies (admin can view all, students can view own)
CREATE POLICY "Admins can view all student progress" ON student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text
    )
  );

CREATE POLICY "Students can view own progress" ON student_progress
  FOR SELECT USING (user_id::text = auth.uid()::text);

-- Insert default admin user (password: admin123 - change this!)
-- You should change this password immediately after setup
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES (
  'admin@coastedcode.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
  'Admin User',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_content_course_id ON course_content(course_id);
CREATE INDEX IF NOT EXISTS idx_course_content_module_id ON course_content(module_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_user_id ON student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_course_id ON student_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);
