"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { experienceService } from "@/lib/services";
import { Experience } from "@/types";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>(
        []
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExperiences();
    }, []);

    useEffect(() => {
        const urlSearch = searchParams.get("search");
        setSearchQuery(urlSearch || "");
    }, [searchParams]);

    useEffect(() => {
        filterExperiences();
    }, [experiences, searchQuery]);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const data = await experienceService.getAll();
            setExperiences(data);
            setFilteredExperiences(data);
        } catch (error) {
            console.error("Error fetching experiences:", error);
            toast.error("Failed to load experiences");
        } finally {
            setLoading(false);
        }
    };

    const filterExperiences = () => {
        // Ensure experiences is an array before filtering
        if (!Array.isArray(experiences) || experiences.length === 0) {
            setFilteredExperiences([]);
            return;
        }

        let filtered = experiences;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (exp) =>
                    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    exp.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredExperiences(filtered);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-light)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-bg-card)] border-t-[var(--color-primary)] mx-auto mb-4"></div>
                    <p className="text-[var(--color-gray)] font-medium">Loading experiences...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-light)] py-10">
            {/* Hero Section */}
            <div className="px-6 md:px-16 mt-6 mb-8 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-dark)] mb-3">
                    Discover Your Next Adventure
                </h1>
                <p className="text-lg text-[var(--color-gray)]">
                    Book unique experiences and create unforgettable memories
                </p>
            </div>

            {/* Experience Grid */}
            <main className="px-6 md:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.isArray(filteredExperiences) && filteredExperiences.length > 0 ? (
                    filteredExperiences.map((exp, index) => (
                        <div
                            key={exp.id}
                            className="bg-[#f0f0f0] rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-2 animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onClick={() => router.push(`/details/${exp.id}`)}
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={exp.image}
                                    alt={exp.title}
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">
                                        {exp.title}
                                    </h3>
                                    <span className="text-sm bg-[var(--color-bg-card)] text-[var(--color-gray)] px-2 py-0.5 rounded group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-dark)] transition-colors">
                                        {exp.location}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--color-gray)] mt-2 line-clamp-2">
                                    {exp.description || "Curated small-group experience. Certified guide. Safety first with gear included."}
                                </p>
                                <div className="flex justify-between items-center mt-4">
                                    <p className="font-semibold text-[var(--color-gray)]">
                                        From <span className="text-[var(--color-dark)] text-lg">{formatCurrency(exp.price)}</span>
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/details/${exp.id}`);
                                        }}
                                        className="bg-[var(--color-primary)] text-[var(--color-dark)] px-3 py-1 rounded-md text-sm font-medium hover:bg-[var(--color-primary-hover)] transform hover:scale-105 transition-all duration-200"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : null}
            </main>

            {(!Array.isArray(filteredExperiences) || filteredExperiences.length === 0) && !loading && (
                <div className="text-center py-12 animate-fade-in">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl text-[var(--color-gray)] font-medium mb-2">
                        No experiences found
                    </p>
                    <p className="text-[var(--color-gray)]">
                        Try adjusting your search or browse all experiences
                    </p>
                </div>
            )}
        </div>
    );
}
