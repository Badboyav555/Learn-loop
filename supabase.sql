-- 1. Custom Users Table (Hashed passwords ke liye)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. User Profiles Table (Onboarding data)
CREATE TABLE profiles (
  id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT DEFAULT 'Student',
  year TEXT,
  branch TEXT,
  subjects TEXT[],
  study_time TEXT,
  goal TEXT,
  streak INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Quiz Results Table
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INT,
  total_questions INT,
  accuracy INT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Activity Log Table (Progress page ke liye)
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- (Kyunki hum custom auth use kar rahe hain, 
-- humein anon ko read/write allow karna padega)
-- ==========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Users Table Policies
CREATE POLICY "Allow signup" ON users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow login" ON users FOR SELECT TO anon USING (true);

-- Profiles Table Policies
CREATE POLICY "Allow profile insert" ON profiles FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow profile read" ON profiles FOR SELECT TO anon USING (true);
CREATE POLICY "Allow profile update" ON profiles FOR UPDATE TO anon USING (true);

-- Quiz Results Policies
CREATE POLICY "Allow quiz insert" ON quiz_results FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow quiz read" ON quiz_results FOR SELECT TO anon USING (true);

-- Activity Logs Policies
CREATE POLICY "Allow log insert" ON activity_logs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow log read" ON activity_logs FOR SELECT TO anon USING (true);
