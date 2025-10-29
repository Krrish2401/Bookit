export interface Experience {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  image: string;
  availableDates: string[];
  availableTimes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  referenceId: string;
  experienceId: string;
  experience: Experience;
  fullName: string;
  email: string;
  bookingDate: string;
  bookingTime: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
  discount: number;
  promoCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  experienceId: string;
  fullName: string;
  email: string;
  bookingDate: string;
  bookingTime: string;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
  discount: number;
  promoCode?: string;
}

export interface PromoCode {
  code: string;
  discount: number;
}

export interface AvailabilityResponse {
  date: string;
  time: string;
  availableSlots: number;
  totalBooked: number;
  maxCapacity: number;
  isAvailable: boolean;
}
