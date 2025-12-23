import React from 'react';
import { ApplicationStatus } from '../types';
import { useApplications } from '../context/ApplicationContext';

const filters: Array<{ value: ApplicationStatus | 'All'; label: string }> = [
  { value: 'All', label: 'All' },
  { value: 'Saved', label: 'Saved' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Ghosted', label: 'Ghosted' },
];

export const StatusFilter: React.FC = () => {
  const { selectedStatus, setSelectedStatus, applications } = useApplications();

  const getCount = (status: ApplicationStatus | 'All'): number => {
    if (status === 'All') return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Status</h3>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const count = getCount(filter.value);
          const isActive = selectedStatus === filter.value;

          return (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
};
