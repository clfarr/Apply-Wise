import React, { useState } from 'react';
import { JobSearchResult } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { JobDetailsModal } from './JobDetailsModal';
import { MapPin, DollarSign, Calendar, Building2, ExternalLink, Plus } from 'lucide-react';

interface JobSearchResultsProps {
  jobs: JobSearchResult[];
  onSaveJob: (job: JobSearchResult) => void;
}

export const JobSearchResults: React.FC<JobSearchResultsProps> = ({ jobs, onSaveJob }) => {
  const [selectedJob, setSelectedJob] = useState<JobSearchResult | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <Building2 className="mx-auto text-gray-400" size={48} />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
        <p className="mt-2 text-gray-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Job Info */}
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h4>
                  <p className="text-lg text-gray-700 mb-3">{job.company}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {job.location}
                      {job.remote && ' (Remote)'}
                    </div>

                    {job.salary && (
                      <div className="flex items-center">
                        <DollarSign size={16} className="mr-1" />
                        {job.salary}
                      </div>
                    )}

                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {formatDate(job.datePosted)}
                    </div>
                  </div>

                  <p className="text-gray-700 line-clamp-2 mb-3">{job.description}</p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {job.source}
                    </span>
                    {job.employmentType && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                        {job.employmentType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedJob(job)}
                    className="flex-1 md:flex-none"
                  >
                    View Details
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => onSaveJob(job)}
                    className="flex-1 md:flex-none inline-flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Save Job
                  </Button>

                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none"
                  >
                    <Button variant="secondary" size="sm" className="w-full inline-flex items-center justify-center">
                      <ExternalLink size={16} className="mr-1" />
                      Apply
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onSaveJob={onSaveJob}
        />
      )}
    </>
  );
};
