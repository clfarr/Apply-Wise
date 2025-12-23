import React, { useState } from 'react';
import { ApplicationProvider, useApplications } from './context/ApplicationContext';
import { ApplicationCard } from './components/ApplicationCard';
import { ApplicationForm } from './components/ApplicationForm';
import { StatusFilter } from './components/StatusFilter';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { Plus, Briefcase } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { filteredApplications, loading, error, addApplication } = useApplications();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAdd = async (data: any) => {
    await addApplication(data);
    setIsAddModalOpen(false);
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

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
