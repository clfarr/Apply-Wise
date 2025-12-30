-- Create user_profile table for storing user information
CREATE TABLE IF NOT EXISTS user_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  summary TEXT,
  skills TEXT[],
  experience TEXT,
  education TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cover_letters table
CREATE TABLE IF NOT EXISTS cover_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  tone TEXT NOT NULL,
  ai_provider TEXT NOT NULL, -- 'openai' or 'claude'
  version INTEGER DEFAULT 1,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on application_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_cover_letters_application_id ON cover_letters(application_id);

-- Add updated_at trigger for user_profile
CREATE TRIGGER update_user_profile_updated_at
  BEFORE UPDATE ON user_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for cover_letters
CREATE TRIGGER update_cover_letters_updated_at
  BEFORE UPDATE ON cover_letters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- RLS policies (allow all for MVP)
CREATE POLICY "Enable all access for everyone on user_profile" ON user_profile
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for everyone on cover_letters" ON cover_letters
  FOR ALL
  USING (true)
  WITH CHECK (true);
