-- Add new columns for job search data
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS job_source TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS job_description TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS salary_range TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS remote_option TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS external_job_id TEXT;

-- Create index on external_job_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_job_applications_external_id ON job_applications(external_job_id);

-- Create index on location for filtering
CREATE INDEX IF NOT EXISTS idx_job_applications_location ON job_applications(location);
