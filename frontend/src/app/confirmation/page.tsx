'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Booking } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export default function ConfirmationPage() {
    const router = useRouter();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [referenceId, setReferenceId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Use a function to handle the async logic
        const loadBookingData = () => {
            const storedReference = sessionStorage.getItem('bookingReference');
            const storedBooking = sessionStorage.getItem('completedBooking');

            if (!storedReference || !storedBooking) {
                toast.error('No booking found');
                router.push('/');
                return;
            }

            // Set state in a microtask to avoid synchronous setState warning
            Promise.resolve().then(() => {
                setReferenceId(storedReference);
                setBooking(JSON.parse(storedBooking));
                setIsLoading(false);
            });
        };

        loadBookingData();
    }, [router]);

    const downloadReceipt = () => {
        if (!booking) return;

        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(24);
            doc.setTextColor(76, 175, 80);
            doc.text('Highway Delite', 20, 20);

            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('Booking Receipt', 20, 35);

            // Reference ID
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Reference ID: ${booking.referenceId}`, 20, 45);

            // Divider
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 50, 190, 50);

            // Customer Details
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Customer Details', 20, 60);

            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            doc.text(`Name: ${booking.fullName}`, 20, 70);
            doc.text(`Email: ${booking.email}`, 20, 78);

            // Booking Details
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Booking Details', 20, 93);

            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            doc.text(`Experience: ${booking.experience.title}`, 20, 103);
            doc.text(`Location: ${booking.experience.location}`, 20, 111);
            doc.text(`Date: ${booking.bookingDate}`, 20, 119);
            doc.text(`Time: ${booking.bookingTime}`, 20, 127);
            doc.text(`Quantity: ${booking.quantity}`, 20, 135);

            // Divider
            doc.line(20, 145, 190, 145);

            // Pricing
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Payment Summary', 20, 155);

            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            doc.text(`Subtotal:`, 20, 165);
            doc.text(`${formatCurrency(booking.subtotal)}`, 160, 165, { align: 'right' });

            doc.text(`Taxes:`, 20, 173);
            doc.text(`${formatCurrency(booking.taxes)}`, 160, 173, { align: 'right' });

            doc.setFontSize(13);
            doc.setTextColor(0, 0, 0);
            doc.text(`Total:`, 20, 185);
            doc.text(`${formatCurrency(booking.total)}`, 160, 185, { align: 'right' });

            // Footer
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text('Thank you for booking with Highway Delite!', 105, 270, { align: 'center' });
            doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 105, 275, { align: 'center' });

            // Save PDF
            doc.save(`booking-receipt-${booking.referenceId}.pdf`);
            toast.success('Receipt downloaded successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to download receipt');
        }
    };

    const handleBackToHome = () => {
        // Clear session storage
        sessionStorage.removeItem('bookingDetails');
        sessionStorage.removeItem('bookingReference');
        sessionStorage.removeItem('completedBooking');
        router.push('/');
    };

    if (isLoading || !booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center">
                            <CheckCircle className="text-white" size={48} />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Booking Confirmed
                    </h1>

                    {/* Reference ID */}
                    <p className="text-gray-600 mb-8">
                        Ref ID: <span className="font-semibold text-gray-900">{referenceId}</span>
                    </p>

                    {/* Booking Details Card */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Experience:</span>
                                <span className="font-medium text-gray-900">{booking.experience.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Location:</span>
                                <span className="font-medium text-gray-900">{booking.experience.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium text-gray-900">{booking.bookingDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Time:</span>
                                <span className="font-medium text-gray-900">{booking.bookingTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Quantity:</span>
                                <span className="font-medium text-gray-900">{booking.quantity}</span>
                            </div>

                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(booking.subtotal)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Taxes:</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(booking.taxes)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-gray-900">Total:</span>
                                    <span className="text-gray-900">{formatCurrency(booking.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={downloadReceipt}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#4CAF50] hover:bg-[#45a049] text-white py-3 rounded-md font-semibold transition-colors"
                        >
                            <Download size={20} />
                            Download Receipt
                        </button>

                        <button
                            onClick={handleBackToHome}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-md font-semibold transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>

                    {/* Confirmation Email Notice */}
                    <p className="text-sm text-gray-500 mt-6">
                        A confirmation email has been sent to <span className="font-medium">{booking.email}</span>
                    </p>
                </div>
            </div>
        </main>
    );
}
