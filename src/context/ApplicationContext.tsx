import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JobApplication, JobApplicationInput, ApplicationStatus } from '../types';
import { applicationService } from '../services/applicationService';

interface ApplicationContextType {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  selectedStatus: ApplicationStatus | 'All';
  setSelectedStatus: (status: ApplicationStatus | 'All') => void;
  filteredApplications: JobApplication[];
  addApplication: (application: JobApplicationInput) => Promise<void>;
  updateApplication: (id: string, application: Partial<JobApplicationInput>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  refreshApplications: () => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};

interface ApplicationProviderProps {
  children: ReactNode;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({ children }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'All'>('All');

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationService.getAll();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = selectedStatus === 'All'
    ? applications
    : applications.filter(app => app.status === selectedStatus);

  const addApplication = async (application: JobApplicationInput) => {
    try {
      setError(null);
      await applicationService.create(application);
      await loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add application');
      throw err;
    }
  };

  const updateApplication = async (id: string, application: Partial<JobApplicationInput>) => {
    try {
      setError(null);
      await applicationService.update(id, application);
      await loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application');
      throw err;
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      setError(null);
      await applicationService.delete(id);
      await loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application');
      throw err;
    }
  };

  const value: ApplicationContextType = {
    applications,
    loading,
    error,
    selectedStatus,
    setSelectedStatus,
    filteredApplications,
    addApplication,
    updateApplication,
    deleteApplication,
    refreshApplications: loadApplications,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};
