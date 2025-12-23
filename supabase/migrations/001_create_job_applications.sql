-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted')),
  application_date DATE NOT NULL,
  job_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on status for filtering
CREATE INDEX idx_job_applications_status ON job_applications(status);

-- Create index on application_date for sorting
CREATE INDEX idx_job_applications_application_date ON job_applications(application_date DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- For MVP, we'll allow all operations without authentication
-- In production, you should add proper authentication policies
CREATE POLICY "Enable all access for everyone" ON job_applications
  FOR ALL
  USING (true)
  WITH CHECK (true);
