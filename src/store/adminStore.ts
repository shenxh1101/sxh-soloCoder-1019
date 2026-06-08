import { create } from 'zustand';
import type { Statistics, DataProduct } from '@/types';
import { mockStatistics, mockProducts } from '@/mock';

interface AdminState {
  statistics: Statistics | null;
  pendingProducts: DataProduct[];
  loading: boolean;
  fetchStatistics: () => void;
  fetchPendingProducts: () => void;
  reviewProduct: (id: string, status: 'published' | 'rejected', reason?: string) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  statistics: mockStatistics,
  pendingProducts: mockProducts.filter((p) => p.status === 'pending' || p.status === 'rejected'),
  loading: false,

  fetchStatistics: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ statistics: mockStatistics, loading: false });
    }, 300);
  },

  fetchPendingProducts: () => {
    set({ loading: true });
    setTimeout(() => {
      const pending = mockProducts.filter(
        (p) => p.status === 'pending' || p.status === 'rejected'
      );
      set({ pendingProducts: pending, loading: false });
    }, 300);
  },

  reviewProduct: (id, status, reason) => {
    const products = get().pendingProducts.map((p) =>
      p.id === id ? { ...p, status, rejectReason: reason } : p
    );
    set({
      pendingProducts: products.filter((p) => p.status === 'pending' || p.status === 'rejected'),
    });
  },
}));
