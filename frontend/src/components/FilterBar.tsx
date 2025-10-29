'use client';

import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filterType: 'all' | 'title' | 'location', value: string) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const handleFilterClick = (filterType: 'all' | 'title' | 'location', value: string, label: string) => {
    setActiveFilter(label);
    onFilterChange(filterType, value);
  };

  const filters = [
    { type: 'all' as const, value: '', label: 'All' },
    { type: 'title' as const, value: 'Kayaking', label: 'Kayaking' },
    { type: 'location' as const, value: 'Udupi', label: 'Udupi' },
    { type: 'location' as const, value: 'Karnataka', label: 'Karnataka' },
    { type: 'location' as const, value: 'Bangalore', label: 'Bangalore' },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap card p-4">
      <div className="flex items-center gap-2 pr-2 border-r border-gray-200">
        <Filter size={18} style={{ color: 'var(--primary)' }} />
        <span className="text-sm font-semibold text-gray-700">Filters:</span>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.label;
          return (
            <motion.button
              key={filter.label}
              onClick={() => handleFilterClick(filter.type, filter.value, filter.label)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={isActive ? { backgroundColor: 'var(--primary)', color: '#fff' } : undefined}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filter.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
