'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Experience, AvailabilityResponse } from '@/types';
import { experienceService } from '@/lib/services';
import { formatCurrency, calculatePricing } from '@/lib/utils';
import { ArrowLeft, Minus, Plus, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function DetailsPage() {
    const params = useParams();
    const router = useRouter();
    const experienceId = params.id as string;

    const [experience, setExperience] = useState<Experience | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    useEffect(() => {
        fetchExperience();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [experienceId]);

    useEffect(() => {
        if (selectedDate && selectedTime && experienceId) {
            checkAvailability();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, selectedTime]);

    const fetchExperience = async () => {
        try {
            setLoading(true);
            const data = await experienceService.getById(experienceId);
            setExperience(data);
            // Set default values
            if (data.availableDates.length > 0) {
                setSelectedDate(data.availableDates[0]);
            }
            if (data.availableTimes.length > 0) {
                setSelectedTime(data.availableTimes[0]);
            }
        } catch (error) {
            console.error('Error fetching experience:', error);
            toast.error('Failed to load experience details');
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async () => {
        if (!selectedDate || !selectedTime) return;

        try {
            setCheckingAvailability(true);
            const data = await experienceService.checkAvailability(
                experienceId,
                selectedDate,
                selectedTime
            );
            setAvailability(data);
        } catch (error) {
            console.error('Error checking availability:', error);
            toast.error('Failed to check availability');
        } finally {
            setCheckingAvailability(false);
        }
    };

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        const maxAllowed = availability ? Math.min(10, availability.availableSlots) : 10;
        if (newQuantity >= 1 && newQuantity <= maxAllowed) {
            setQuantity(newQuantity);
        }
    };

    const handleConfirm = () => {
        if (!selectedDate || !selectedTime) {
            toast.error('Please select a date and time');
            return;
        }

        if (availability && !availability.isAvailable) {
            toast.error('Sorry, this time slot is fully booked');
            return;
        }

        if (availability && quantity > availability.availableSlots) {
            toast.error(`Only ${availability.availableSlots} slots available. Please adjust quantity.`);
            return;
        }

        // Store booking details in session storage
        const bookingDetails = {
            experienceId: experience!.id,
            experienceTitle: experience!.title,
            experienceLocation: experience!.location,
            experienceImage: experience!.image,
            bookingDate: selectedDate,
            bookingTime: selectedTime,
            quantity,
            price: experience!.price,
            ...calculatePricing(experience!.price, quantity),
        };

        sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        router.push('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="relative inline-block mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4CAF50] border-t-transparent absolute top-0 left-0"></div>
                    </div>
                    <p className="text-base text-gray-600 font-medium">Loading experience...</p>
                </div>
            </div>
        );
    }

    if (!experience) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-5xl mb-3">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Experience not found</h2>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Go back to home
                    </button>
                </div>
            </div>
        );
    }

    const { subtotal, taxes, total } = calculatePricing(experience.price, quantity);

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-[#4CAF50] mb-6 group transition-colors duration-300"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="font-semibold">Details</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Experience Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src={experience.image}
                                alt={experience.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {experience.title}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-600">
                                <svg className="w-5 h-5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                <span className="font-medium">{experience.location}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#4CAF50] rounded-full"></span>
                                About
                            </h2>
                            <p className="text-gray-700 leading-relaxed">{experience.description}</p>
                        </div>

                        {/* Date Selection */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar size={20} className="text-[#4CAF50]" />
                                Choose date
                            </h2>
                            <div className="flex gap-2 flex-wrap">
                                {experience.availableDates.map((date) => (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 ${selectedDate === date
                                                ? 'bg-[#FFC107] border-[#FFC107] text-gray-900'
                                                : 'bg-white border-gray-300 text-gray-700 hover:border-[#FFC107]'
                                            }`}
                                    >
                                        {date}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Selection */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-[#4CAF50]" />
                                Choose time
                            </h2>
                            <div className="flex gap-2 flex-wrap">
                                {experience.availableTimes.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 ${selectedTime === time
                                                ? 'bg-[#FFC107] border-[#FFC107] text-gray-900'
                                                : 'bg-white border-gray-300 text-gray-700 hover:border-[#FFC107]'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                                </svg>
                                All times are in IST (GMT +5:30)
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20 border border-gray-200">
                            <div className="space-y-5">
                                <div className="border-b border-gray-200 pb-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Experience</span>
                                        <span className="font-semibold text-gray-900">{experience.title}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Date</span>
                                        <span className="font-semibold text-gray-900">{selectedDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span className="font-medium">Time</span>
                                        <span className="font-semibold text-gray-900">{selectedTime}</span>
                                    </div>
                                </div>

                                {/* Availability Status */}
                                {availability && (
                                    <div className={`p-3 rounded-lg border transition-all duration-300 ${
                                        !availability.isAvailable 
                                            ? 'bg-red-50 border-red-200' 
                                            : availability.availableSlots <= 3 
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : 'bg-green-50 border-green-200'
                                    }`}>
                                        {!availability.isAvailable ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                                <p className="text-xs font-semibold text-red-700">
                                                    Sold out
                                                </p>
                                            </div>
                                        ) : availability.availableSlots <= 3 ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                                                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                                <p className="text-xs font-semibold text-yellow-700">
                                                    Only {availability.availableSlots} slots left!
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                                <p className="text-xs font-semibold text-green-700">
                                                    {availability.availableSlots} slots available
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quantity Selector */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-3">
                                        Quantity
                                    </label>
                                    <div className="flex items-center justify-center gap-4 bg-gray-50 p-3 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            className="w-10 h-10 rounded-full border-2 border-[#4CAF50] flex items-center justify-center hover:bg-[#4CAF50] hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="text-3xl font-bold text-gray-900 w-12 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= (availability ? Math.min(10, availability.availableSlots) : 10)}
                                            className="w-10 h-10 rounded-full border-2 border-[#4CAF50] flex items-center justify-center hover:bg-[#4CAF50] hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-gray-200 pt-4 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 font-medium">Starts at</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(experience.price)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700 font-medium">Subtotal</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700 font-medium">Taxes</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(taxes)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-lg font-bold pt-3 border-t border-gray-200 bg-green-50 -mx-6 px-6 py-3 mt-3 rounded-b-xl">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-[#4CAF50]">{formatCurrency(total)}</span>
                                    </div>
                                </div>

                                {/* Confirm Button */}
                                <button
                                    onClick={handleConfirm}
                                    className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-gray-900 py-3 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
