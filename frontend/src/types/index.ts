export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  category?: string;
  price: number;
  duration?: number;
  image: string;
  availableDates: string[];
  availableTimes: string[];
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
  discount?: number;
  promoCode?: string;
}

export interface Booking {
  id: string;
  referenceId: string;
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
  createdAt: string;
  updatedAt: string;
  experience: Experience;
}

export interface PromoCode {
  id?: number;
  code: string;
  discount: number;
  isActive?: boolean;
}
