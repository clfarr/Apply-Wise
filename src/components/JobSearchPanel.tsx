import React, { useState } from 'react';
import { JobSearchFilters } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Search } from 'lucide-react';

interface JobSearchPanelProps {
  onSearch: (filters: JobSearchFilters) => void;
  isSearching: boolean;
}

export const JobSearchPanel: React.FC<JobSearchPanelProps> = ({ onSearch, isSearching }) => {
  const [filters, setFilters] = useState<JobSearchFilters>({
    query: '',
    location: '',
    remote: undefined,
    datePosted: 'all',
    employmentType: undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.query.trim()) {
      onSearch(filters);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Jobs</h2>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main Search */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Job title, keywords, or company"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={isSearching || !filters.query.trim()}>
            <Search size={20} className="mr-2" />
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Location (optional)"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />

          <Select
            value={filters.remote === undefined ? '' : filters.remote ? 'true' : 'false'}
            onChange={(e) =>
              setFilters({
                ...filters,
                remote: e.target.value === '' ? undefined : e.target.value === 'true',
              })
            }
            options={[
              { value: '', label: 'All Locations' },
              { value: 'true', label: 'Remote Only' },
              { value: 'false', label: 'On-site Only' },
            ]}
          />

          <Select
            value={filters.datePosted || 'all'}
            onChange={(e) =>
              setFilters({
                ...filters,
                datePosted: e.target.value as JobSearchFilters['datePosted'],
              })
            }
            options={[
              { value: 'all', label: 'Any Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Past Week' },
              { value: 'month', label: 'Past Month' },
            ]}
          />

          <Select
            value={filters.employmentType || ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                employmentType: e.target.value as JobSearchFilters['employmentType'] || undefined,
              })
            }
            options={[
              { value: '', label: 'All Types' },
              { value: 'fulltime', label: 'Full-time' },
              { value: 'parttime', label: 'Part-time' },
              { value: 'contractor', label: 'Contract' },
              { value: 'intern', label: 'Internship' },
            ]}
          />
        </div>
      </form>
    </div>
  );
};
