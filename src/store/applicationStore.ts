import { create } from 'zustand';
import type { Application, Message, Material } from '@/types';
import { mockApplications, getApplicationById } from '@/mock';

interface ApplicationState {
  applications: Application[];
  selectedApplication: Application | null;
  loading: boolean;
  fetchApplications: (userId: string, role: string) => void;
  fetchApplicationById: (id: string) => void;
  createApplication: (data: Partial<Application>) => Application;
  sendMessage: (applicationId: string, message: Omit<Message, 'id' | 'createdAt'>) => void;
  uploadMaterial: (applicationId: string, material: Omit<Material, 'id'>) => void;
  approveApplication: (id: string, scope: Application['authorizationScope']) => void;
  rejectApplication: (id: string, reason: string) => void;
  clearSelectedApplication: () => void;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: mockApplications,
  selectedApplication: null,
  loading: false,

  fetchApplications: (userId, role) => {
    set({ loading: true });
    setTimeout(() => {
      let apps = [...mockApplications];
      if (role === 'provider') {
        apps = apps.filter((a) => a.providerId === userId);
      } else if (role === 'applicant') {
        apps = apps.filter((a) => a.applicantId === userId);
      }
      set({ applications: apps, loading: false });
    }, 300);
  },

  fetchApplicationById: (id) => {
    set({ loading: true });
    setTimeout(() => {
      const app = getApplicationById(id);
      if (app) {
        set({ selectedApplication: app, loading: false });
      }
    }, 200);
  },

  createApplication: (data) => {
    const newApp: Application = {
      id: 'app-' + Math.random().toString(36).substring(2, 11),
      productId: data.productId || '',
      productName: data.productName || '',
      applicantId: data.applicantId || 'user-001',
      applicantName: data.applicantName || '张明',
      providerId: data.providerId || 'user-002',
      purpose: data.purpose || '',
      scenario: data.scenario || '',
      duration: data.duration || 30,
      dataScale: data.dataScale || '',
      supplementaryMaterials: [],
      status: 'pending',
      currentStep: 1,
      steps: [
        { id: 1, name: '提交申请', status: 'current' },
        { id: 2, name: '资质审核', status: 'pending' },
        { id: 3, name: '沟通确认', status: 'pending' },
        { id: 4, name: '授权确认', status: 'pending' },
        { id: 5, name: '数据交付', status: 'pending' },
      ],
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      selectedPricingTier: data.selectedPricingTier,
    };
    set({ applications: [...get().applications, newApp] });
    return newApp;
  },

  sendMessage: (applicationId, message) => {
    const newMessage: Message = {
      ...message,
      id: 'msg-' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toLocaleString('zh-CN'),
    };
    const apps = get().applications.map((a) =>
      a.id === applicationId
        ? {
            ...a,
            messages: [...a.messages, newMessage],
            status: 'communicating' as const,
            updatedAt: new Date().toISOString(),
          }
        : a
    );
    set({ applications: apps });
    
    const selected = get().selectedApplication;
    if (selected && selected.id === applicationId) {
      set({
        selectedApplication: {
          ...selected,
          messages: [...selected.messages, newMessage],
          status: 'communicating',
        },
      });
    }
  },

  uploadMaterial: (applicationId, material) => {
    const newMaterial: Material = {
      ...material,
      id: 'mat-' + Math.random().toString(36).substring(2, 11),
    };
    const apps = get().applications.map((a) =>
      a.id === applicationId
        ? {
            ...a,
            supplementaryMaterials: [...a.supplementaryMaterials, newMaterial],
            updatedAt: new Date().toISOString(),
          }
        : a
    );
    set({ applications: apps });
    
    const selected = get().selectedApplication;
    if (selected && selected.id === applicationId) {
      set({
        selectedApplication: {
          ...selected,
          supplementaryMaterials: [...selected.supplementaryMaterials, newMaterial],
        },
      });
    }
  },

  approveApplication: (id, scope) => {
    const apps = get().applications.map((a) => {
      if (a.id !== id) return a;
      const steps = a.steps.map((s, i) =>
        i < 4 ? { ...s, status: 'completed' as const, completedAt: new Date().toLocaleString('zh-CN') } :
        i === 4 ? { ...s, status: 'current' as const } : s
      );
      return {
        ...a,
        status: 'approved' as const,
        currentStep: 5,
        steps,
        authorizationScope: scope,
        updatedAt: new Date().toISOString(),
      };
    });
    set({ applications: apps });
    
    const selected = get().selectedApplication;
    if (selected && selected.id === id) {
      const steps = selected.steps.map((s, i) =>
        i < 4 ? { ...s, status: 'completed' as const, completedAt: new Date().toLocaleString('zh-CN') } :
        i === 4 ? { ...s, status: 'current' as const } : s
      );
      set({
        selectedApplication: {
          ...selected,
          status: 'approved',
          currentStep: 5,
          steps,
          authorizationScope: scope,
        },
      });
    }
  },

  rejectApplication: (id, reason) => {
    const apps = get().applications.map((a) =>
      a.id === id
        ? {
            ...a,
            status: 'rejected' as const,
            rejectReason: reason,
            updatedAt: new Date().toISOString(),
          }
        : a
    );
    set({ applications: apps });
    
    const selected = get().selectedApplication;
    if (selected && selected.id === id) {
      set({
        selectedApplication: {
          ...selected,
          status: 'rejected',
          rejectReason: reason,
        },
      });
    }
  },

  clearSelectedApplication: () => {
    set({ selectedApplication: null });
  },
}));
