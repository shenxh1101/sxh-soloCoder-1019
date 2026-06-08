import { create } from 'zustand';
import type { Review } from '@/types';
import { mockReviews, getReviewsByUser } from '@/mock';

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  fetchReviews: (userId: string) => void;
  submitReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: mockReviews,
  loading: false,

  fetchReviews: (userId) => {
    set({ loading: true });
    setTimeout(() => {
      const reviews = getReviewsByUser(userId);
      set({ reviews, loading: false });
    }, 300);
  },

  submitReview: (review) => {
    const newReview: Review = {
      ...review,
      id: 'rev-' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toLocaleString('zh-CN'),
    };
    set({ reviews: [...get().reviews, newReview] });
  },
}));
