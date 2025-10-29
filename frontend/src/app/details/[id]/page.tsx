"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { experienceService, bookingService } from "@/lib/services";
import { Experience } from "@/types";
import { formatCurrency, calculateSubtotal, calculateTotal, TAX_RATE } from "@/lib/utils";
import toast from "react-hot-toast";

export default function DetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [experience, setExperience] = useState<Experience | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [availableSlots, setAvailableSlots] = useState<number | null>(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [timeSlotAvailability, setTimeSlotAvailability] = useState<Record<string, number>>({});

    useEffect(() => {
        if (params.id) {
            fetchExperience(params.id as string);
        }
    }, [params.id]);

    useEffect(() => {
        if (experience && selectedDate && selectedTime) {
            checkAvailability();
        }
    }, [experience, selectedDate, selectedTime]);

    useEffect(() => {
        if (experience && selectedDate && experience.availableTimes) {
            checkAllTimeSlotsAvailability();
        }
    }, [experience, selectedDate]);

    const fetchExperience = async (id: string) => {
        try {
            setLoading(true);
            const data = await experienceService.getById(id);
            setExperience(data);
            // Set first available date and time as default
            if (data.availableDates && data.availableDates.length > 0) {
                setSelectedDate(data.availableDates[0]);
            }
            if (data.availableTimes && data.availableTimes.length > 0) {
                setSelectedTime(data.availableTimes[0]);
            }
        } catch (error) {
            console.error("Error fetching experience:", error);
            toast.error("Failed to load experience details");
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async () => {
        if (!experience || !selectedDate || !selectedTime) return;
        
        try {
            setCheckingAvailability(true);
            const availability = await bookingService.checkAvailability(
                experience.id,
                selectedDate,
                selectedTime
            );
            setAvailableSlots(availability.availableSlots);
            
            if (quantity > availability.availableSlots) {
                setQuantity(Math.max(1, availability.availableSlots));
            }
        } catch (error) {
            console.error("Error checking availability:", error);
            setAvailableSlots(null);
        } finally {
            setCheckingAvailability(false);
        }
    };

    const checkAllTimeSlotsAvailability = async () => {
        if (!experience || !selectedDate || !experience.availableTimes) return;
        
        try {
            const availabilityPromises = experience.availableTimes.map(async (time) => {
                try {
                    const availability = await bookingService.checkAvailability(
                        experience.id,
                        selectedDate,
                        time
                    );
                    return { time, slots: availability.availableSlots };
                } catch (error) {
                    console.error(`Error checking availability for ${time}:`, error);
                    return { time, slots: 0 };
                }
            });
            
            const results = await Promise.all(availabilityPromises);
            const availabilityMap: Record<string, number> = {};
            results.forEach(({ time, slots }) => {
                availabilityMap[time] = slots;
            });
            setTimeSlotAvailability(availabilityMap);
        } catch (error) {
            console.error("Error checking time slots availability:", error);
        }
    };

    const handleBooking = () => {
        if (!selectedDate) {
            toast.error("Please select a date");
            return;
        }
        if (!selectedTime) {
            toast.error("Please select a time slot");
            return;
        }
        if (availableSlots !== null && availableSlots < quantity) {
            toast.error(`Only ${availableSlots} slot(s) available`);
            return;
        }
        if (availableSlots === 0) {
            toast.error("This slot is fully booked. Please select another time.");
            return;
        }

        const bookingData = {
            experienceId: experience!.id,
            date: selectedDate,
            timeSlot: selectedTime,
            quantity,
        };

        sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
        router.push("/checkout");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-light)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-bg-card)] border-t-[var(--color-primary)] mx-auto mb-4"></div>
                    <p className="text-[var(--color-gray)] font-medium">Loading experience details...</p>
                </div>
            </div>
        );
    }

    if (!experience) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-light)]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-4">
                        Experience not found
                    </h2>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-[var(--color-primary)] text-[var(--color-dark)] px-6 py-2 rounded-lg hover:bg-[var(--color-primary-hover)]"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const subtotal = calculateSubtotal(experience.price, quantity);
    const total = calculateTotal(subtotal);
    const taxes = Math.round(subtotal * TAX_RATE);

    return (
        <div className="min-h-screen bg-[var(--color-bg-light)] py-10">
            <div className="px-6 md:px-16">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-[var(--color-dark)] hover:text-[var(--color-gray)] transition-colors mb-6"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-medium">Home</span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-10 px-6 md:px-16">
                <div className="flex-1">
                    <img
                        src={experience.image}
                        alt={experience.title}
                        className="w-full h-72 object-cover rounded-2xl mb-6"
                    />
                    <h2 className="text-2xl font-semibold text-[var(--color-dark)] mb-2">
                        {experience.title}
                    </h2>
                    <p className="text-[var(--color-gray)] mb-6">
                        {experience.description}
                    </p>

                    <h3 className="font-medium text-[var(--color-dark)] mb-2">Choose date</h3>
                    <div className="flex flex-wrap gap-3 mb-6">
                        {experience.availableDates && experience.availableDates.map((date) => (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                                    selectedDate === date
                                        ? 'bg-[var(--color-primary)] text-[var(--color-dark)] border-[var(--color-primary)]'
                                        : 'bg-white text-[var(--color-gray)] border-[var(--color-border)] hover:bg-[var(--color-bg-light)]'
                                }`}
                            >
                                {date}
                            </button>
                        ))}
                    </div>

                    <h3 className="font-medium text-[var(--color-dark)] mb-2">Choose time</h3>
                    <div className="flex flex-wrap gap-3 mb-6">
                        {experience.availableTimes && experience.availableTimes.map((time) => {
                            const slotsAvailable = timeSlotAvailability[time];
                            const isFullyBooked = slotsAvailable === 0;
                            const isSelected = selectedTime === time;
                            
                            return (
                                <button
                                    key={time}
                                    onClick={() => !isFullyBooked && setSelectedTime(time)}
                                    disabled={isFullyBooked}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition ${
                                        isFullyBooked
                                            ? 'bg-[var(--color-disabled)] text-[var(--color-gray)] border-[var(--color-disabled)] cursor-not-allowed opacity-60'
                                            : isSelected
                                                ? 'bg-[var(--color-primary)] text-[var(--color-dark)] border-[var(--color-primary)]'
                                                : 'bg-white text-[var(--color-gray)] border-[var(--color-border)] hover:bg-[var(--color-bg-light)]'
                                    }`}
                                >
                                    <span>{time}</span>
                                    {slotsAvailable !== undefined && (
                                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                            isFullyBooked
                                                ? 'bg-[var(--color-border)] text-[var(--color-gray)]'
                                                : slotsAvailable >= 7
                                                    ? 'text-green-600'
                                                    : slotsAvailable >= 4
                                                        ? 'text-orange-600'
                                                        : 'text-red-600'
                                        }`}>
                                            {isFullyBooked ? 'Sold out' : `${slotsAvailable} left`}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <p className="text-xs text-[var(--color-gray)] mb-6">
                        All times are in IST (GMT +5:30)
                    </p>

                    <h3 className="font-medium text-[var(--color-dark)] mb-2">About</h3>
                    <p className="text-[var(--color-gray)] text-sm bg-[var(--color-bg-card)] p-3 rounded-lg">
                        Scenic routes, trained guides, and safety briefing. Minimum age 10.
                    </p>
                </div>
                <div className="w-full lg:w-1/3 bg-[var(--color-bg-card)] rounded-2xl p-6 h-fit">
                    <div className="flex justify-between text-[var(--color-gray)] mb-2">
                        <span>Starts at</span>
                        <span className="font-medium text-[var(--color-dark)]">{formatCurrency(experience.price)}</span>
                    </div>

                    <div className="flex justify-between items-center text-[var(--color-gray)] mb-2">
                        <span>Quantity</span>
                        <div className="flex items-center border border-[var(--color-border)] rounded-md">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={availableSlots === 0}
                                className="px-3 py-1 text-[var(--color-gray)] hover:bg-[#F0F0F0] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                −
                            </button>
                            <span className="px-4 py-1 bg-white">{quantity}</span>
                            <button
                                onClick={() => setQuantity(availableSlots !== null ? Math.min(availableSlots, quantity + 1) : quantity + 1)}
                                disabled={availableSlots === 0 || (availableSlots !== null && quantity >= availableSlots)}
                                className="px-3 py-1 text-[var(--color-gray)] hover:bg-[#F0F0F0] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between text-[var(--color-gray)] mb-1">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--color-gray)] mb-3">
                        <span>Taxes</span>
                        <span>{formatCurrency(taxes)}</span>
                    </div>
                    <hr className="mb-3 border-[var(--color-border)]" />
                    <div className="flex justify-between font-semibold text-[var(--color-dark)] text-lg mb-4">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>

                    <button 
                        onClick={handleBooking}
                        className={`w-full py-2 rounded-lg font-medium transition ${
                            selectedDate && selectedTime && availableSlots !== 0
                                ? 'bg-[var(--color-primary)] text-[var(--color-dark)] hover:bg-[var(--color-primary-hover)] cursor-pointer'
                                : 'bg-[var(--color-disabled)] text-[var(--color-gray)] cursor-not-allowed'
                        }`}
                        disabled={!selectedDate || !selectedTime || availableSlots === 0}
                    >
                        {availableSlots === 0 ? 'Fully Booked' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}
