import api from './api';
import { Experience, Booking, BookingFormData, PromoCode, AvailabilityResponse } from '@/types';

export const experienceService = {
  getAll: async (): Promise<Experience[]> => {
    const response = await api.get('/experiences');
    return response.data.data;
  },

  getById: async (id: string): Promise<Experience> => {
    const response = await api.get(`/experiences/${id}`);
    return response.data.data;
  },

  checkAvailability: async (id: string, date: string, time: string): Promise<AvailabilityResponse> => {
    const response = await api.get(`/experiences/${id}/availability`, {
      params: { date, time }
    });
    return response.data.data;
  },
};

export const bookingService = {
  create: async (bookingData: BookingFormData): Promise<Booking> => {
    const response = await api.post('/bookings', bookingData);
    return response.data.data;
  },

  getByReferenceId: async (referenceId: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${referenceId}`);
    return response.data.data;
  },
};

export const promoCodeService = {
  validate: async (code: string): Promise<PromoCode> => {
    const response = await api.get(`/promo-codes/validate/${code}`);
    return response.data.data;
  },
};
