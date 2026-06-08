import { create } from 'zustand';
import type { Transaction } from '@/types';
import { mockTransactions, getTransactionsByUser } from '@/mock';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  fetchTransactions: (userId: string, role: string) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: mockTransactions,
  loading: false,

  fetchTransactions: (userId, role) => {
    set({ loading: true });
    setTimeout(() => {
      const transactions = getTransactionsByUser(userId, role);
      set({ transactions, loading: false });
    }, 300);
  },
}));
