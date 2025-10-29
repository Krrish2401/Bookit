"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, IndianRupee } from "lucide-react";
import { Experience } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ExperienceCardProps {
    experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
    return (
        <Link
            href={`/details/${experience.id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
            <div className="relative h-48">
                <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="object-cover"
                />
                {experience.category && (
                    <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {experience.category}
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {experience.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {experience.description}
                </p>

                <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{experience.location}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>{experience.duration || 3} hours</span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center text-primary font-bold text-lg">
                            <IndianRupee className="h-5 w-5" />
                            <span>{formatCurrency(experience.price)}</span>
                        </div>
                        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
