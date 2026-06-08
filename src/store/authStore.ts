import { create } from 'zustand';
import type { User } from '@/types';
import { mockUsers } from '@/mock';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: string) => void;
  logout: () => void;
  switchRole: (role: 'provider' | 'applicant' | 'admin') => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: mockUsers[0],
  isAuthenticated: true,

  login: (email, role) => {
    const user = mockUsers.find(
      (u) => u.email === email || u.role === role
    ) || mockUsers[0];
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  switchRole: (role) => {
    const { user } = get();
    if (!user) return;
    const roleUser = mockUsers.find((u) => u.role === role) || user;
    set({ user: roleUser });
  },
}));
