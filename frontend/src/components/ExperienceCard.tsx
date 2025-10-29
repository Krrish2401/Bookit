'use client';

import { motion } from 'framer-motion';
import { Experience } from '@/types';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Link href={`/details/${experience.id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="card overflow-hidden flex flex-col transition-all duration-300 p-2"
      >
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-100">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Location badge */}
          <div className="absolute top-3 right-3 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md" style={{ backgroundColor: 'var(--glass)' }}>
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
              {experience.location}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
            {experience.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-1">
            {experience.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">FROM</span>
              <span className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                {formatCurrency(experience.price)}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="primary-btn text-sm font-bold"
            >
              View Details
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
