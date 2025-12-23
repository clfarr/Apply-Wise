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
}
