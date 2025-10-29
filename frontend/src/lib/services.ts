import { api } from "./api";
import { Experience, Booking, BookingFormData, PromoCode } from "@/types";

export const experienceService = {
  getAll: async (): Promise<Experience[]> => {
    const response = await api.get("/experiences");
    return response.data.data || response.data;
  },

  getById: async (id: string): Promise<Experience> => {
    const response = await api.get(`/experiences/${id}`);
    return response.data.data || response.data;
  },
};

export const bookingService = {
  create: async (data: BookingFormData): Promise<Booking> => {
    const response = await api.post("/bookings", data);
    return response.data.data || response.data;
  },

  getByReferenceId: async (referenceId: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${referenceId}`);
    return response.data.data || response.data;
  },

  checkAvailability: async (experienceId: string, bookingDate: string, bookingTime: string): Promise<{ availableSlots: number; maxCapacity: number; isAvailable: boolean }> => {
    const response = await api.get(`/bookings/check-availability`, {
      params: { experienceId, bookingDate, bookingTime }
    });
    return response.data.data || response.data;
  },
};

export const promoCodeService = {
  validate: async (code: string): Promise<PromoCode> => {
    const response = await api.get(`/promo-codes/validate/${code}`);
    return response.data.data || response.data;
  },
};
