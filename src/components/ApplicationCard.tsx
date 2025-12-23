import React, { useState } from 'react';
import { JobApplication } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { ApplicationForm } from './ApplicationForm';
import { useApplications } from '../context/ApplicationContext';
import { ExternalLink, Calendar, Edit2, Trash2 } from 'lucide-react';

interface ApplicationCardProps {
  application: JobApplication;
}

const statusColors: Record<string, string> = {
  Saved: 'bg-gray-100 text-gray-800',
  Applied: 'bg-blue-100 text-blue-800',
  Interviewing: 'bg-purple-100 text-purple-800',
  Offer: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Ghosted: 'bg-orange-100 text-orange-800',
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const { updateApplication, deleteApplication } = useApplications();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdate = async (data: any) => {
    await updateApplication(application.id, data);
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    await deleteApplication(application.id);
    setIsDeleteModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{application.company}</h3>
              <p className="text-gray-600 mt-1">{application.role}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[application.status]
              }`}
            >
              {application.status}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Calendar size={16} className="mr-2" />
            Applied: {formatDate(application.application_date)}
          </div>

          {/* Notes */}
          {application.notes && (
            <p className="text-gray-700 text-sm mb-4 line-clamp-3">{application.notes}</p>
          )}

          {/* Actions */}
          <div className="mt-auto flex flex-wrap gap-2">
            {application.job_url && (
              <a
                href={application.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink size={16} className="mr-1" />
                View Job
              </a>
            )}
            <div className="ml-auto flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center"
              >
                <Edit2 size={16} className="mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Application"
      >
        <ApplicationForm
          initialData={application}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Application"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this application for{' '}
            <strong>{application.role}</strong> at <strong>{application.company}</strong>?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Application
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
