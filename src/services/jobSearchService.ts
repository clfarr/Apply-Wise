import { JobSearchFilters, JobSearchResult } from '../types';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'jsearch.p.rapidapi.com';

export const jobSearchService = {
  async searchJobs(filters: JobSearchFilters): Promise<JobSearchResult[]> {
    if (!RAPIDAPI_KEY) {
      console.error('RapidAPI key not configured');
      // Return mock data for development/testing
      return this.getMockJobs(filters);
    }

    try {
      const params = new URLSearchParams({
        query: filters.query,
        ...(filters.location && { location: filters.location }),
        ...(filters.remote && { remote_jobs_only: 'true' }),
        ...(filters.datePosted && filters.datePosted !== 'all' && { date_posted: filters.datePosted }),
        ...(filters.employmentType && { employment_types: filters.employmentType.toUpperCase() }),
        num_pages: '1',
        page: '1',
      });

      const response = await fetch(
        `https://${RAPIDAPI_HOST}/search?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      return this.transformResults(data.data || []);
    } catch (error) {
      console.error('Job search error:', error);
      // Fallback to mock data on error
      return this.getMockJobs(filters);
    }
  },

  transformResults(rawResults: any[]): JobSearchResult[] {
    return rawResults.map((job: any) => ({
      id: job.job_id || `job-${Math.random().toString(36).substr(2, 9)}`,
      title: job.job_title || 'Untitled Position',
      company: job.employer_name || 'Unknown Company',
      location: job.job_city && job.job_state
        ? `${job.job_city}, ${job.job_state}`
        : job.job_country || 'Remote',
      description: job.job_description || '',
      salary: job.job_min_salary && job.job_max_salary
        ? `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}`
        : job.job_salary_period
        ? `Salary info available`
        : undefined,
      url: job.job_apply_link || job.job_google_link || '#',
      source: job.job_publisher || 'JSearch',
      datePosted: job.job_posted_at_datetime_utc || new Date().toISOString(),
      remote: job.job_is_remote || false,
      employmentType: job.job_employment_type?.toLowerCase(),
    }));
  },

  getMockJobs(filters: JobSearchFilters): JobSearchResult[] {
    const mockJobs: JobSearchResult[] = [
      {
        id: 'mock-1',
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        description: 'We are looking for a Senior Software Engineer to join our team. You will work on cutting-edge technologies including React, TypeScript, and Node.js. This role offers the opportunity to work on challenging problems and make a real impact.',
        salary: '$120,000 - $180,000',
        url: 'https://example.com/job1',
        source: 'LinkedIn',
        datePosted: new Date().toISOString(),
        remote: true,
        employmentType: 'fulltime',
      },
      {
        id: 'mock-2',
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        description: 'Join our fast-growing startup as a Frontend Developer. We use React, TypeScript, and modern web technologies. Great benefits and equity options available.',
        salary: '$90,000 - $130,000',
        url: 'https://example.com/job2',
        source: 'Indeed',
        datePosted: new Date(Date.now() - 86400000).toISOString(),
        remote: false,
        employmentType: 'fulltime',
      },
      {
        id: 'mock-3',
        title: 'Full Stack Engineer',
        company: 'Innovation Labs',
        location: 'Remote',
        description: 'Remote-first company seeking a Full Stack Engineer. Work with React, Node.js, PostgreSQL, and AWS. Competitive salary and fully remote work environment.',
        salary: '$100,000 - $150,000',
        url: 'https://example.com/job3',
        source: 'Remote.co',
        datePosted: new Date(Date.now() - 172800000).toISOString(),
        remote: true,
        employmentType: 'fulltime',
      },
      {
        id: 'mock-4',
        title: 'React Developer',
        company: 'Digital Agency',
        location: 'Austin, TX',
        description: 'Looking for an experienced React Developer to build modern web applications for our clients. Must have strong JavaScript/TypeScript skills.',
        salary: '$85,000 - $120,000',
        url: 'https://example.com/job4',
        source: 'Glassdoor',
        datePosted: new Date(Date.now() - 259200000).toISOString(),
        remote: false,
        employmentType: 'fulltime',
      },
      {
        id: 'mock-5',
        title: 'Software Engineering Intern',
        company: 'MegaCorp',
        location: 'Seattle, WA',
        description: 'Summer internship opportunity for aspiring software engineers. Learn from industry experts and work on real projects. Great mentorship and learning opportunities.',
        salary: '$25 - $35 per hour',
        url: 'https://example.com/job5',
        source: 'Indeed',
        datePosted: new Date(Date.now() - 432000000).toISOString(),
        remote: false,
        employmentType: 'intern',
      },
    ];

    // Filter mock jobs based on search criteria
    return mockJobs.filter(job => {
      const matchesQuery = job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
                          job.company.toLowerCase().includes(filters.query.toLowerCase()) ||
                          job.description.toLowerCase().includes(filters.query.toLowerCase());

      const matchesLocation = !filters.location ||
                             job.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchesRemote = filters.remote === undefined || job.remote === filters.remote;

      const matchesEmploymentType = !filters.employmentType ||
                                   job.employmentType === filters.employmentType;

      return matchesQuery && matchesLocation && matchesRemote && matchesEmploymentType;
    });
  },
};
