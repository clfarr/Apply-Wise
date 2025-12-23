import React, { useState, FormEvent } from 'react';
import { JobApplication, JobApplicationInput, ApplicationStatus } from '../types';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

interface ApplicationFormProps {
  initialData?: JobApplication;
  onSubmit: (data: JobApplicationInput) => Promise<void>;
  onCancel: () => void;
}

const statusOptions: { value: ApplicationStatus; label: ApplicationStatus }[] = [
  { value: 'Saved', label: 'Saved' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Ghosted', label: 'Ghosted' },
];

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<JobApplicationInput>({
    company: initialData?.company || '',
    role: initialData?.role || '',
    status: initialData?.status || 'Saved',
    application_date: initialData?.application_date || new Date().toISOString().split('T')[0],
    job_url: initialData?.job_url || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof JobApplicationInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof JobApplicationInput, string>> = {};

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role/position is required';
    }

    if (!formData.application_date) {
      newErrors.application_date = 'Application date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Company *"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          error={errors.company}
          placeholder="e.g., Google"
        />

        <Input
          label="Role/Position *"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          error={errors.role}
          placeholder="e.g., Software Engineer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Status *"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
          options={statusOptions}
          error={errors.status}
        />

        <Input
          label="Application Date *"
          type="date"
          value={formData.application_date}
          onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
          error={errors.application_date}
        />
      </div>

      <Input
        label="Job URL"
        type="url"
        value={formData.job_url}
        onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
        placeholder="https://example.com/job-posting"
      />

      <TextArea
        label="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        placeholder="Add any notes about this application..."
        rows={4}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Application' : 'Add Application'}
        </Button>
      </div>
    </form>
  );
};
