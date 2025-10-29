"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { bookingService } from "@/lib/services";
import { Booking } from "@/types";
import { CheckCircle, Download, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ConfirmationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const referenceId = searchParams.get("ref");

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (referenceId) {
            fetchBooking(referenceId);
        } else {
            toast.error("No booking reference found");
            router.push("/");
        }
    }, [referenceId]);

    const fetchBooking = async (refId: string) => {
        try {
            setLoading(true);
            const data = await bookingService.getByReferenceId(refId);
            setBooking(data);
        } catch (error) {
            console.error("Error fetching booking:", error);
            toast.error("Failed to load booking details");
            router.push("/");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = async () => {
        if (!booking) return;

        try {
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.setTextColor(250, 204, 21);
            doc.text("highway delite", 105, 20, { align: "center" });

            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("Booking Receipt", 105, 35, { align: "center" });

            doc.setDrawColor(250, 204, 21);
            doc.setLineWidth(0.5);
            doc.line(20, 40, 190, 40);

            doc.setFillColor(254, 249, 195);
            doc.rect(20, 45, 170, 15, "F");
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(`Reference ID: ${booking.referenceId}`, 105, 55, { align: "center" });
            doc.setFont("helvetica", "normal");

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Experience Details", 20, 75);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Experience: ${booking.experience.title}`, 20, 85);
            doc.text(`Location: ${booking.experience.location}`, 20, 92);
            doc.text(`Date: ${booking.bookingDate}`, 20, 99);
            doc.text(`Time: ${booking.bookingTime}`, 20, 106);
            doc.text(`Quantity: ${booking.quantity} ${booking.quantity > 1 ? 'people' : 'person'}`, 20, 113);

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Customer Details", 20, 130);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Name: ${booking.fullName}`, 20, 140);
            doc.text(`Email: ${booking.email}`, 20, 147);

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Price Breakdown", 20, 164);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            
            const subtotal = booking.subtotal;
            const discount = booking.discount || 0;
            const taxes = booking.taxes;
            const total = booking.total;

            doc.text(`Subtotal:`, 20, 174);
            doc.text(formatCurrency(subtotal), 170, 174, { align: "right" });
            
            if (discount > 0) {
                doc.setTextColor(34, 197, 94); 
                doc.text(`Discount:`, 20, 181);
                doc.text(`-${formatCurrency(discount)}`, 170, 181, { align: "right" });
                doc.setTextColor(0, 0, 0);
            }
            
            doc.text(`Taxes (6%):`, 20, discount > 0 ? 188 : 181);
            doc.text(formatCurrency(taxes), 170, discount > 0 ? 188 : 181, { align: "right" });

            const totalY = discount > 0 ? 198 : 191;
            doc.setFillColor(250, 204, 21, 0.2);
            doc.rect(20, totalY - 5, 170, 10, "F");
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Total Amount:`, 20, totalY);
            doc.text(formatCurrency(total), 170, totalY, { align: "right" });

            if (booking.promoCode) {
                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(34, 197, 94);
                doc.text(`Promo Code Applied: ${booking.promoCode}`, 20, totalY + 7);
                doc.setTextColor(0, 0, 0);
            }

            doc.setDrawColor(250, 204, 21);
            doc.setLineWidth(0.5);
            doc.line(20, 265, 190, 265);
            
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text("Thank you for choosing highway delite!", 105, 273, { align: "center" });
            doc.text(`Booked on: ${new Date(booking.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, 105, 280, { align: "center" });

            // Save
            doc.save(`booking-receipt-${booking.referenceId}.pdf`);
            toast.success("Receipt downloaded successfully!");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate receipt");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-light)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-bg-card)] border-t-[var(--color-primary)] mx-auto mb-4"></div>
                    <p className="text-[var(--color-gray)] font-medium">Loading confirmation...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10">

            <div className="flex flex-col items-center max-w-md w-full">
                <div className="relative animate-scale-in">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                    <CheckCircle className="relative w-20 h-20 text-green-500 mb-6 animate-bounce" style={{ animationDuration: '2s' }} />
                </div>

                <h1 className="text-3xl font-bold mb-3 animate-fade-in text-[var(--color-dark)]">
                    Booking Confirmed!
                </h1>
                
                <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] bg-opacity-10 border-2 border-[var(--color-primary)] rounded-xl p-6 mb-8 w-full animate-slide-up shadow-lg">
                    <p className="text-sm text-[var(--color-gray)] mb-2 font-medium">Your Reference ID</p>
                    <p className="text-2xl font-bold text-[var(--color-dark)] tracking-wider mb-2 font-mono">
                        {booking.referenceId}
                    </p>
                    <p className="text-xs text-[var(--color-gray)] flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Save this for your records
                    </p>
                </div>

                <div className="text-center mb-8 animate-fade-in">
                    <p className="text-[var(--color-gray)] mb-2">
                        A confirmation email has been sent to
                    </p>
                    <p className="font-semibold text-[var(--color-dark)]">{booking.email}</p>
                </div>

                <div className="flex gap-4 mb-8 animate-slide-up">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] text-[var(--color-dark)] rounded-lg hover:bg-[var(--color-primary-hover)] transition-all transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <Download size={20} />
                        Download Receipt
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-[var(--color-bg-card)] text-[var(--color-dark)] rounded-lg hover:bg-[var(--color-border)] transition-all transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                        <div className="sticky top-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] px-6 py-4 flex justify-between items-center rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-[var(--color-dark)]">Booking Summary</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-[var(--color-dark)] hover:text-[var(--color-gray)] transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="bg-[var(--color-primary)] bg-opacity-10 border-2 border-[var(--color-primary)] rounded-xl p-4 mb-6">
                                <p className="text-sm text-[var(--color-gray)] mb-1 font-medium">Reference ID</p>
                                <p className="text-xl font-bold text-[var(--color-dark)] font-mono tracking-wider">
                                    {booking.referenceId}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-[var(--color-dark)] mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Experience Details
                                </h3>
                                <div className="bg-[var(--color-bg-light)] rounded-lg p-4 space-y-3">
                                    <div className="flex items-start">
                                        <img
                                            src={booking.experience.image}
                                            alt={booking.experience.title}
                                            className="w-24 h-24 object-cover rounded-lg mr-4"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-[var(--color-dark)] text-lg mb-1">
                                                {booking.experience.title}
                                            </p>
                                            <p className="text-sm text-[var(--color-gray)] flex items-center mb-1">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {booking.experience.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--color-border)]">
                                        <div>
                                            <p className="text-xs text-[var(--color-gray)]">Date</p>
                                            <p className="font-medium text-[var(--color-dark)]">{booking.bookingDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-gray)]">Time</p>
                                            <p className="font-medium text-[var(--color-dark)]">{booking.bookingTime}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-gray)]">Quantity</p>
                                            <p className="font-medium text-[var(--color-dark)]">
                                                {booking.quantity} {booking.quantity > 1 ? 'people' : 'person'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-[var(--color-dark)] mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Customer Details
                                </h3>
                                <div className="bg-[var(--color-bg-light)] rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-gray)]">Name:</span>
                                        <span className="font-medium text-[var(--color-dark)]">{booking.fullName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-gray)]">Email:</span>
                                        <span className="font-medium text-[var(--color-dark)]">{booking.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-[var(--color-dark)] mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Price Breakdown
                                </h3>
                                <div className="bg-[var(--color-bg-light)] rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-gray)]">Subtotal:</span>
                                        <span className="font-medium text-[var(--color-dark)]">{formatCurrency(booking.subtotal)}</span>
                                    </div>
                                    {booking.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount:</span>
                                            <span className="font-medium">-{formatCurrency(booking.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-gray)]">Taxes (6%):</span>
                                        <span className="font-medium text-[var(--color-dark)]">{formatCurrency(booking.taxes)}</span>
                                    </div>
                                    <div className="border-t border-[var(--color-border)] pt-2 flex justify-between items-center">
                                        <span className="text-lg font-bold text-[var(--color-dark)]">Total:</span>
                                        <span className="text-2xl font-bold text-[var(--color-dark)]">{formatCurrency(booking.total)}</span>
                                    </div>
                                    {booking.promoCode && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
                                            <p className="text-sm text-green-700 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Promo Code Applied: <span className="font-semibold ml-1">{booking.promoCode}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-center text-sm text-[var(--color-gray)] mb-6">
                                <p>Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                            </div>

                            <button
                                onClick={handleDownloadReceipt}
                                className="w-full py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] text-[var(--color-dark)] rounded-lg hover:bg-[var(--color-primary-hover)] transition-all transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                Download Receipt as PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
