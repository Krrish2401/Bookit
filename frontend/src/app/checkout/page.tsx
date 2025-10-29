'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { bookingService, promoCodeService } from '@/lib/services';
import { formatCurrency, calculatePricing } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookingDetails {
  experienceId: string;
  experienceTitle: string;
  experienceLocation: string;
  experienceImage: string;
  bookingDate: string;
  bookingTime: string;
  quantity: number;
  price: number;
  subtotal: number;
  taxes: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => {
    const storedDetails = sessionStorage.getItem('bookingDetails');
    if (!storedDetails) {
      toast.error('No booking details found');
      router.push('/');
      return;
    }
    setBookingDetails(JSON.parse(storedDetails));
  }, [router]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    try {
      setPromoLoading(true);
      const result = await promoCodeService.validate(promoCode.trim());
      setAppliedPromo(result);
      toast.success(`Promo code applied! ${result.discount}% discount`);
    } catch (error: unknown) {
      console.error('Error validating promo:', error);
      const message = error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response !== null && 'data' in error.response && typeof error.response.data === 'object' && error.response.data !== null && 'message' in error.response.data ? String(error.response.data.message) : 'Invalid promo code';
      toast.error(message);
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.success('Promo code removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the terms and safety policy');
      return;
    }

    if (!bookingDetails) {
      toast.error('Booking details not found');
      return;
    }

    try {
      setLoading(true);
      
      // Calculate final pricing with promo if applied
      const pricing = calculatePricing(
        bookingDetails.price,
        bookingDetails.quantity,
        appliedPromo?.discount || 0
      );

      const booking = await bookingService.create({
        experienceId: bookingDetails.experienceId,
        fullName,
        email,
        bookingDate: bookingDetails.bookingDate,
        bookingTime: bookingDetails.bookingTime,
        quantity: bookingDetails.quantity,
        subtotal: pricing.subtotal,
        taxes: pricing.taxes,
        total: pricing.total,
        discount: pricing.discount,
        promoCode: appliedPromo?.code || undefined,
      });

      // Store booking reference
      sessionStorage.setItem('bookingReference', booking.referenceId);
      sessionStorage.setItem('completedBooking', JSON.stringify(booking));
      
      toast.success('Booking confirmed!');
      router.push('/confirmation');
    } catch (error: unknown) {
      console.error('Error creating booking:', error);
      const message = error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response !== null && 'data' in error.response && typeof error.response.data === 'object' && error.response.data !== null && 'message' in error.response.data ? String(error.response.data.message) : 'Failed to create booking. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-[#4CAF50] mb-8 group transition-colors duration-300"
        >
          <ArrowLeft size={22} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold text-lg">Checkout</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-2 h-10 bg-[#4CAF50] rounded-full"></span>
              Your Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-gray-800 mb-3">
                  Full name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-300 text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all duration-300 text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Promo Code */}
              <div>
                <label htmlFor="promoCode" className="block text-sm font-bold text-gray-800 mb-3">
                  Promo code
                </label>
                {appliedPromo ? (
                  <div className="flex items-center gap-3 p-4 bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-sm animate-scale-in">
                    <div className="flex-1 flex items-center gap-3">
                      <div className="bg-green-500 text-white p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"/>
                        </svg>
                      </div>
                      <div>
                        <span className="text-green-800 font-bold block">{appliedPromo.code}</span>
                        <span className="text-green-600 text-sm">{appliedPromo.discount}% discount applied</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-red-600 hover:text-red-700 text-sm font-bold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent uppercase font-semibold text-gray-900 placeholder:text-gray-400 transition-all duration-300"
                      disabled={promoLoading}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoLoading}
                      className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-scale shadow-md"
                    >
                      {promoLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start bg-gray-50 p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 text-[#4CAF50] border-gray-300 rounded focus:ring-[#4CAF50] cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="ml-3 text-sm text-gray-700 cursor-pointer select-none">
                  I agree to the terms and safety policy
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#FFC107] to-[#FFB300] hover:from-[#FFB300] hover:to-[#FFA000] text-gray-900 py-5 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-hover-scale shadow-lg hover:shadow-2xl mt-8"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Pay and Confirm'
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#4CAF50] h-fit sticky top-24 animate-slide-in-right">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-2 h-10 bg-[#4CAF50] rounded-full"></span>
              Booking Summary
            </h2>
            
            <div className="space-y-6">
              <div className="bg-linear-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600">Experience</span>
                  <span className="font-bold text-gray-900 text-right max-w-[60%]">{bookingDetails.experienceTitle}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    Location
                  </span>
                  <span className="font-bold text-gray-900">{bookingDetails.experienceLocation}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    Date
                  </span>
                  <span className="font-bold text-gray-900">{bookingDetails.bookingDate}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    Time
                  </span>
                  <span className="font-bold text-gray-900">{bookingDetails.bookingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Quantity</span>
                  <span className="font-bold text-gray-900 text-xl">{bookingDetails.quantity}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-base">
                  <span className="text-gray-700 font-semibold">Subtotal</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {formatCurrency(bookingDetails.subtotal)}
                  </span>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between bg-green-50 -mx-8 px-8 py-3 border-l-4 border-green-500 animate-scale-in">
                    <span className="text-green-700 font-bold flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"/>
                      </svg>
                      Discount ({appliedPromo.discount}%)
                    </span>
                    <span className="font-bold text-green-700 text-lg">
                      -{formatCurrency(bookingDetails.subtotal * (appliedPromo.discount / 100))}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base">
                  <span className="text-gray-700 font-semibold">Taxes</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {formatCurrency(bookingDetails.taxes)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-2xl font-extrabold pt-4 border-t-2 border-gray-300 bg-linear-to-r from-[#4CAF50]/10 to-[#FFC107]/10 -mx-8 px-8 py-4 mt-4">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#4CAF50]">{formatCurrency(bookingDetails.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
