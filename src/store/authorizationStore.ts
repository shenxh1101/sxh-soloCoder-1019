import { create } from 'zustand';
import type { Authorization, DeliveryRecord } from '@/types';
import { mockAuthorizations, getAuthorizationById } from '@/mock';

interface AuthorizationState {
  authorizations: Authorization[];
  selectedAuthorization: Authorization | null;
  loading: boolean;
  fetchAuthorizations: (userId: string, role: string) => void;
  fetchAuthorizationById: (id: string) => void;
  renewAuthorization: (id: string, duration: number) => void;
  terminateAuthorization: (id: string, reason: string) => void;
  addDeliveryRecord: (id: string, record: Omit<DeliveryRecord, 'id'>) => void;
  clearSelectedAuthorization: () => void;
}

export const useAuthorizationStore = create<AuthorizationState>((set, get) => ({
  authorizations: mockAuthorizations,
  selectedAuthorization: null,
  loading: false,

  fetchAuthorizations: (userId, role) => {
    set({ loading: true });
    setTimeout(() => {
      let auths = [...mockAuthorizations];
      if (role === 'provider') {
        auths = auths.filter((a) => a.licensorId === userId);
      } else if (role === 'applicant') {
        auths = auths.filter((a) => a.licenseeId === userId);
      }
      set({ authorizations: auths, loading: false });
    }, 300);
  },

  fetchAuthorizationById: (id) => {
    set({ loading: true });
    setTimeout(() => {
      const auth = getAuthorizationById(id);
      if (auth) {
        set({ selectedAuthorization: auth, loading: false });
      }
    }, 200);
  },

  renewAuthorization: (id, duration) => {
    const auths = get().authorizations.map((a) =>
      a.id === id ? { ...a, status: 'renewing' as const } : a
    );
    set({ authorizations: auths });
    
    const selected = get().selectedAuthorization;
    if (selected && selected.id === id) {
      set({ selectedAuthorization: { ...selected, status: 'renewing' } });
    }
  },

  terminateAuthorization: (id, reason) => {
    const auths = get().authorizations.map((a) =>
      a.id === id ? { ...a, status: 'terminated' as const } : a
    );
    set({ authorizations: auths });
    
    const selected = get().selectedAuthorization;
    if (selected && selected.id === id) {
      set({ selectedAuthorization: { ...selected, status: 'terminated' } });
    }
  },

  addDeliveryRecord: (id, record) => {
    const newRecord: DeliveryRecord = {
      ...record,
      id: 'del-' + Math.random().toString(36).substring(2, 11),
    };
    const auths = get().authorizations.map((a) =>
      a.id === id
        ? { ...a, deliveryRecords: [...a.deliveryRecords, newRecord] }
        : a
    );
    set({ authorizations: auths });
    
    const selected = get().selectedAuthorization;
    if (selected && selected.id === id) {
      set({
        selectedAuthorization: {
          ...selected,
          deliveryRecords: [...selected.deliveryRecords, newRecord],
        },
      });
    }
  },

  clearSelectedAuthorization: () => {
    set({ selectedAuthorization: null });
  },
}));
