export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Interviewing'
  | 'Offer'
  | 'Rejected'
  | 'Ghosted';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  application_date: string;
  job_url?: string;
  notes?: string;
  job_source?: string;
  job_description?: string;
  salary_range?: string;
  location?: string;
  remote_option?: string;
  external_job_id?: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplicationInput {
  company: string;
  role: string;
  status: ApplicationStatus;
  application_date: string;
  job_url?: string;
  notes?: string;
  job_source?: string;
  job_description?: string;
  salary_range?: string;
  location?: string;
  remote_option?: string;
  external_job_id?: string;
}

export interface JobSearchFilters {
  query: string;
  location?: string;
  remote?: boolean;
  datePosted?: 'all' | 'today' | 'week' | 'month';
  employmentType?: 'fulltime' | 'parttime' | 'contractor' | 'intern';
}

export interface JobSearchResult {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  source: string;
  datePosted: string;
  remote: boolean;
  employmentType?: string;
}
