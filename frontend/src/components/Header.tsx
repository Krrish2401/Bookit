'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useSearch } from '@/lib/searchContext';
import { useState } from 'react';

export default function Header() {
    const { scrollY } = useScroll();
    const headerShadow = useTransform(
        scrollY,
        [0, 50],
        ['0px 0px 0px rgba(0,0,0,0)', '0px 4px 20px rgba(0,0,0,0.1)']
    );
    const headerBg = useTransform(
        scrollY,
        [0, 50],
        ['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']
    );

    const { query, setQuery } = useSearch();
    const [local, setLocal] = useState(query);

    return (
        <motion.header
            style={{
                boxShadow: headerShadow,
                backgroundColor: headerBg
            }}
            className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-100"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative w-8 h-8 shrink-0"
                        >
                            <Image
                                src="https://cdn-icons-png.flaticon.com/512/854/854929.png"
                                alt="Highway Delite"
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                        <span className="text-xl font-bold whitespace-nowrap" style={{ color: 'var(--primary)' }}>
                            Highway Delite
                        </span>
                    </Link>

                    {/* Center search - visible on md+ */}
                    <div className="hidden md:flex flex-1 justify-center px-6">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setQuery(local);
                        }}
                        className="w-full max-w-2xl relative"
                      >
                        <input
                          value={local}
                          onChange={(e) => setLocal(e.target.value)}
                          placeholder="Search experiences"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm placeholder:text-gray-400 shadow-sm focus:outline-none"
                          style={{ boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}
                        />
                        <button
                          type="submit"
                          className="absolute right-1 top-1/2 -translate-y-1/2 primary-btn text-sm px-3 py-2"
                        >
                          <Search size={16} />
                        </button>
                      </form>
                    </div>

                    {/* Search Button (mobile) */}
                    <div className="md:hidden">
                      <button
                        onClick={() => setQuery(local)}
                        className="primary-btn shadow-sm flex items-center gap-2 px-3 py-2"
                      >
                        <Search size={18} />
                      </button>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
