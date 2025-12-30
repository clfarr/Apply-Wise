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

export type CoverLetterTone = 'professional' | 'enthusiastic' | 'technical';
export type AIProvider = 'openai' | 'claude';

export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  summary?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfileInput {
  full_name?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  summary?: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

export interface CoverLetter {
  id: string;
  application_id: string;
  content: string;
  tone: CoverLetterTone;
  ai_provider: AIProvider;
  version: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoverLetterInput {
  application_id: string;
  content: string;
  tone: CoverLetterTone;
  ai_provider: AIProvider;
  version?: number;
  is_favorite?: boolean;
}

export interface GenerateCoverLetterRequest {
  jobDescription: string;
  companyName: string;
  roleName: string;
  userProfile: UserProfile;
  tone: CoverLetterTone;
  aiProvider: AIProvider;
}
