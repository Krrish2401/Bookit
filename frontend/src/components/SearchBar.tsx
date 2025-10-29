'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search experiences' }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-5 py-4 pr-14 border-none bg-white rounded-xl focus:outline-none text-gray-900 text-base placeholder:text-gray-500 shadow-lg focus:shadow-xl transition-all duration-300"
        />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          <div className="primary-btn p-2.5 rounded-lg flex items-center justify-center">
            <Search className="text-gray-900" size={20} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
