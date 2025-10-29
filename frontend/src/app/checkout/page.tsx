"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { experienceService, bookingService, promoCodeService } from "@/lib/services";
import { Experience, BookingFormData } from "@/types";
import { formatCurrency, calculateSubtotal, calculateTotal, TAX_RATE } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CheckoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [experience, setExperience] = useState<Experience | null>(null);
    const [bookingData, setBookingData] = useState<any>(null);
    const [discount, setDiscount] = useState(0);
    const [promoApplied, setPromoApplied] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        promoCode: "",
        agreeToTerms: false,
    });

    useEffect(() => {
        // Get booking data from sessionStorage
        const storedData = sessionStorage.getItem("bookingData");
        if (!storedData) {
            toast.error("No booking data found");
            router.push("/");
            return;
        }

        const data = JSON.parse(storedData);
        setBookingData(data);
        fetchExperience(data.experienceId);
    }, []);

    const fetchExperience = async (id: string) => {
        try {
            const data = await experienceService.getById(id);
            setExperience(data);
        } catch (error) {
            console.error("Error fetching experience:", error);
            toast.error("Failed to load experience details");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleApplyPromo = async () => {
        if (!formData.promoCode.trim()) {
            toast.error("Please enter a promo code");
            return;
        }

        try {
            const promoData = await promoCodeService.validate(formData.promoCode);
            if (promoData && promoData.discount) {
                setDiscount(promoData.discount / 100);
                setPromoApplied(true);
                toast.success(`Promo applied: ${promoData.discount}% off`);
            }
        } catch (error: any) {
            setDiscount(0);
            setPromoApplied(false);
            toast.error(error.response?.data?.message || "Invalid promo code");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.agreeToTerms) {
            toast.error("Please agree to the terms and safety policy");
            return;
        }

        try {
            setLoading(true);

            const baseSubtotal = calculateSubtotal(experience!.price, bookingData.quantity);
            const discountAmount = baseSubtotal * discount;
            const subtotalAfterDiscount = baseSubtotal - discountAmount;
            const taxesAmount = Math.round(subtotalAfterDiscount * TAX_RATE);
            const totalAmount = subtotalAfterDiscount + taxesAmount;

            const bookingPayload: BookingFormData = {
                experienceId: bookingData.experienceId,
                fullName: formData.name,
                email: formData.email,
                bookingDate: bookingData.date,
                bookingTime: bookingData.timeSlot,
                quantity: bookingData.quantity,
                subtotal: baseSubtotal,
                taxes: taxesAmount,
                total: totalAmount,
                discount: discountAmount,
                promoCode: promoApplied ? formData.promoCode : undefined,
            };

            const result = await bookingService.create(bookingPayload);

            // Clear sessionStorage
            sessionStorage.removeItem("bookingData");

            toast.success("Booking confirmed!");
            router.push(`/confirmation?ref=${result.referenceId}`);
        } catch (error: any) {
            console.error("Error creating booking:", error);
            toast.error(error.response?.data?.message || "Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    if (!experience || !bookingData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-light)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-bg-card)] border-t-[var(--color-primary)] mx-auto mb-4"></div>
                    <p className="text-[var(--color-gray)] font-medium">Loading checkout...</p>
                </div>
            </div>
        );
    }

    const baseSubtotal = calculateSubtotal(experience.price, bookingData.quantity);
    const subtotalAfterDiscount = baseSubtotal - baseSubtotal * discount;
    const taxes = Math.round(subtotalAfterDiscount * TAX_RATE);
    const total = subtotalAfterDiscount + taxes;

    return (
        <div className="min-h-screen bg-[var(--color-bg-light)] py-10">
            {/* Back Button */}
            <div className="px-6 md:px-16">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[var(--color-dark)] hover:text-[var(--color-gray)] transition-colors mb-6"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-medium">Details</span>
                </button>
            </div>

            {/* Checkout Section */}
            <div className="flex flex-col lg:flex-row justify-between gap-10 px-6 md:px-16">
                {/* Left: Form */}
                <div className="flex-1 bg-[var(--color-bg-card)] rounded-2xl p-6 shadow-lg animate-slide-left">
                    <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Checkout
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="px-4 py-3 rounded-lg bg-[#dddddd] border border-[var(--color-border)] text-[var(--color-dark)] placeholder:text-[var(--color-gray)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] focus:outline-none transition-all"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="px-4 py-3 rounded-lg bg-[#dddddd] border border-[var(--color-border)] text-[var(--color-dark)] placeholder:text-[var(--color-gray)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] focus:outline-none transition-all"
                            />
                        </div>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                name="promoCode"
                                placeholder="Promo code"
                                value={formData.promoCode}
                                onChange={handleInputChange}
                                className="flex-1 px-4 py-3 rounded-lg bg-[#dddddd] border border-[var(--color-border)] text-[var(--color-dark)] placeholder:text-[var(--color-gray)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] focus:outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleApplyPromo}
                                className="bg-[var(--color-dark)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-dark-hover)] transform hover:scale-105 transition-all"
                            >
                                Apply
                            </button>
                        </div>

                        {promoApplied && discount > 0 && (
                            <div className="text-green-600 text-sm mb-4 bg-green-50 p-3 rounded-lg flex items-center animate-scale-in">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Promo applied: {(discount * 100).toFixed(0)}% off
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleInputChange}
                                className="w-4 h-4 accent-[var(--color-primary)]"
                            />
                            <label className="text-sm text-[var(--color-gray)]">
                                I agree to the terms and safety policy
                            </label>
                        </div>
                    </form>
                </div>

                <div className="w-full lg:w-1/3 bg-[var(--color-bg-card)] rounded-2xl p-6 h-fit shadow-xl border border-[var(--color-bg-card)] animate-slide-right">
                    <h3 className="text-xl font-bold text-[var(--color-dark)] mb-4">Booking Summary</h3>
                    <div className="space-y-3 pb-4 border-b border-[var(--color-border)]">
                        <div className="flex justify-between text-[var(--color-gray)]">
                            <span className="font-medium">Experience</span>
                            <span className="font-semibold text-[var(--color-dark)]">{experience.title}</span>
                        </div>
                        <div className="flex justify-between text-[var(--color-gray)]">
                            <span>Date</span>
                            <span className="font-medium">{bookingData.date}</span>
                        </div>
                        <div className="flex justify-between text-[var(--color-gray)]">
                            <span>Time</span>
                            <span className="font-medium">{bookingData.timeSlot}</span>
                        </div>
                        <div className="flex justify-between text-[var(--color-gray)]">
                            <span>Quantity</span>
                            <span className="font-medium">{bookingData.quantity} {bookingData.quantity > 1 ? 'people' : 'person'}</span>
                        </div>
                    </div>

                    <div className="py-4 space-y-2">
                        <div className="flex justify-between text-[var(--color-gray)]">
                            <span>Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotalAfterDiscount)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--color-gray)]">
                            <span>Taxes (6%)</span>
                            <span className="font-medium">{formatCurrency(taxes)}</span>
                        </div>
                    </div>

                    <div className="bg-opacity-10 -mx-6 px-6 py-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-[var(--color-dark)]">Total</span>
                            <span className="text-2xl font-bold text-[var(--color-dark)]">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!formData.agreeToTerms || loading}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 transform ${
                            formData.agreeToTerms && !loading
                                ? 'bg-[var(--color-primary)] text-[var(--color-dark)] hover:bg-[var(--color-primary-hover)] hover:scale-105 shadow-lg hover:shadow-xl'
                                : 'bg-[var(--color-disabled)] text-[var(--color-gray)] cursor-not-allowed'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--color-gray)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : "Pay and Confirm"}
                    </button>

                    <div className="mt-4 flex items-center justify-center text-sm text-[var(--color-gray)]">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Secure payment processing
                    </div>
                </div>
            </div>
        </div>
    );
}
