'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Experience } from '@/types';
import { experienceService } from '@/lib/services';
import ExperienceCard from '@/components/ExperienceCard';
import FilterBar from '@/components/FilterBar';
import toast from 'react-hot-toast';
import { useSearch } from '@/lib/searchContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const { query: searchQuery, setQuery } = useSearch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    filterExperiences();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, experiences]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await experienceService.getAll();
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const filterExperiences = () => {
    if (!searchQuery.trim()) {
      setFilteredExperiences(experiences);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = experiences.filter(
      (exp) =>
        exp.title.toLowerCase().includes(query) ||
        exp.location.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query)
    );
    setFilteredExperiences(filtered);
  };

  const handleFilterChange = (filterType: 'all' | 'title' | 'location', value: string) => {
    if (filterType === 'all') {
      setQuery('');
      setFilteredExperiences(experiences);
      return;
    }

    const filtered = experiences.filter((exp) => {
      if (filterType === 'title') {
        return exp.title.toLowerCase().includes(value.toLowerCase());
      } else if (filterType === 'location') {
        return exp.location.toLowerCase().includes(value.toLowerCase());
      }
      return true;
    });
    setFilteredExperiences(filtered);
    toast.success(`Filtered by ${filterType}: ${value}`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
  {/* Hero Section */}
  <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-700))' }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <motion.div
            className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Discover Amazing<br />Experiences
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto">
              Book your next adventure with Highway Delite
            </p>
          </motion.div>

            {/* Search is now in the header (shared via SearchProvider) */}
        </div>
      </section>

      {/* Experiences Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <FilterBar onFilterChange={handleFilterChange} />
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-base text-gray-600 font-medium">Loading amazing experiences...</p>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No experiences found</h2>
            <p className="text-base text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredExperiences.map((experience) => (
              <motion.div key={experience.id} variants={itemVariants}>
                <ExperienceCard experience={experience} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}
