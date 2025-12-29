import React, { useState } from 'react';
import { ApplicationProvider, useApplications } from './context/ApplicationContext';
import { ApplicationCard } from './components/ApplicationCard';
import { ApplicationForm } from './components/ApplicationForm';
import { StatusFilter } from './components/StatusFilter';
import { JobSearchPanel } from './components/JobSearchPanel';
import { JobSearchResults } from './components/JobSearchResults';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { Plus, Briefcase, Search, FileText } from 'lucide-react';
import { JobSearchFilters, JobSearchResult } from './types';
import { jobSearchService } from './services/jobSearchService';

const Dashboard: React.FC = () => {
  const { filteredApplications, loading, error, addApplication } = useApplications();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'applications' | 'search'>('applications');
  const [searchResults, setSearchResults] = useState<JobSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleAdd = async (data: any) => {
    await addApplication(data);
    setIsAddModalOpen(false);
  };

  const handleSearch = async (filters: JobSearchFilters) => {
    setIsSearching(true);
    try {
      const results = await jobSearchService.searchJobs(filters);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveJob = async (job: JobSearchResult) => {
    try {
      await addApplication({
        company: job.company,
        role: job.title,
        status: 'Saved',
        application_date: new Date().toISOString().split('T')[0],
        job_url: job.url,
        notes: '',
        job_source: job.source,
        job_description: job.description,
        salary_range: job.salary,
        location: job.location,
        remote_option: job.remote ? 'Remote' : 'On-site',
        external_job_id: job.id,
      });
      alert('Job saved to your applications!');
    } catch (err) {
      console.error('Failed to save job:', err);
      alert('Failed to save job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="text-blue-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">ApplyWise</h1>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center">
              <Plus size={20} className="mr-2" />
              Add Application
            </Button>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('applications')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'applications'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="inline mr-2" size={20} />
                My Applications
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'search'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Search className="inline mr-2" size={20} />
                Search Jobs
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {activeTab === 'applications' ? (
          <>
            <StatusFilter />

            {filteredApplications.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <Briefcase className="mx-auto text-gray-400" size={48} />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No applications found</h3>
                <p className="mt-2 text-gray-500">
                  Get started by adding your first job application!
                </p>
                <Button onClick={() => setIsAddModalOpen(true)} className="mt-6">
                  <Plus size={20} className="mr-2" />
                  Add Your First Application
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <JobSearchPanel onSearch={handleSearch} isSearching={isSearching} />
            <JobSearchResults jobs={searchResults} onSaveJob={handleSaveJob} />
          </>
        )}
      </main>

      {/* Add Application Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Application"
      >
        <ApplicationForm onSubmit={handleAdd} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ApplicationProvider>
      <Dashboard />
    </ApplicationProvider>
  );
};

export default App;
