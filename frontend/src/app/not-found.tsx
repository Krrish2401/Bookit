'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-[#4CAF50] mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Sorry, we could not find the page you are looking for.
                    Let us get you back to discovering amazing experiences!
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-[#FFC107] hover:bg-[#FFB300] text-gray-900 px-6 py-3 rounded-md font-semibold transition-colors"
                >
                    <Home size={20} />
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
