import React from 'react';
import { JobSearchResult } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { MapPin, DollarSign, Calendar, ExternalLink, Plus, Building2 } from 'lucide-react';

interface JobDetailsModalProps {
  job: JobSearchResult;
  isOpen: boolean;
  onClose: () => void;
  onSaveJob: (job: JobSearchResult) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
  onSaveJob,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSaveJob = () => {
    onSaveJob(job);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Job Details">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center text-lg text-gray-700 mb-4">
            <Building2 size={20} className="mr-2" />
            {job.company}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              {job.location}
              {job.remote && <span className="ml-1 text-green-600 font-medium">(Remote)</span>}
            </div>

            {job.salary && (
              <div className="flex items-center">
                <DollarSign size={16} className="mr-1" />
                {job.salary}
              </div>
            )}

            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              Posted {formatDate(job.datePosted)}
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-3">
            <span className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-700">
              {job.source}
            </span>
            {job.employmentType && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs capitalize">
                {job.employmentType}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h4>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
            {job.description || 'No description available.'}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={handleSaveJob}
            className="flex-1 inline-flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Save to Tracker
          </Button>

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="secondary" className="w-full inline-flex items-center justify-center">
              <ExternalLink size={20} className="mr-2" />
              Apply on {job.source}
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
};
