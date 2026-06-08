import { create } from 'zustand';
import type { DataProduct, FilterOptions } from '@/types';
import { mockProducts, getProductById } from '@/mock';

interface ProductState {
  products: DataProduct[];
  filteredProducts: DataProduct[];
  selectedProduct: DataProduct | null;
  filters: FilterOptions;
  loading: boolean;
  favorites: string[];
  setFilters: (filters: Partial<FilterOptions>) => void;
  fetchProducts: () => void;
  fetchProductById: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearSelectedProduct: () => void;
  updateProductStatus: (id: string, status: DataProduct['status'], rejectReason?: string) => void;
}

const defaultFilters: FilterOptions = {
  industry: '',
  region: '',
  updateFrequency: '',
  search: '',
  sortBy: 'latest',
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: mockProducts,
  filteredProducts: mockProducts.filter((p) => p.status === 'published'),
  selectedProduct: null,
  filters: defaultFilters,
  loading: false,
  favorites: mockProducts.filter((p) => p.isFavorite).map((p) => p.id),

  setFilters: (newFilters) => {
    const filters = { ...get().filters, ...newFilters };
    let products = [...get().products].filter((p) => p.status === 'published');

    if (filters.industry) {
      products = products.filter((p) => p.industry === filters.industry);
    }
    if (filters.region) {
      products = products.filter((p) => p.region === filters.region);
    }
    if (filters.updateFrequency) {
      products = products.filter((p) => p.updateFrequency === filters.updateFrequency);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    switch (filters.sortBy) {
      case 'latest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        products.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'price-low':
        products.sort((a, b) => a.pricing[0].price - b.pricing[0].price);
        break;
      case 'price-high':
        products.sort((a, b) => b.pricing[0].price - a.pricing[0].price);
        break;
      case 'rating':
        products.sort((a, b) => b.qualityScore.overall - a.qualityScore.overall);
        break;
    }

    set({ filters, filteredProducts: products });
  },

  fetchProducts: () => {
    set({ loading: true });
    setTimeout(() => {
      const products = mockProducts.filter((p) => p.status === 'published');
      set({ products: mockProducts, filteredProducts: products, loading: false });
    }, 300);
  },

  fetchProductById: (id) => {
    set({ loading: true });
    setTimeout(() => {
      const product = getProductById(id);
      if (product) {
        set({ selectedProduct: product, loading: false });
      }
    }, 200);
  },

  toggleFavorite: (id) => {
    const favorites = get().favorites;
    const isFavorite = favorites.includes(id);
    
    if (isFavorite) {
      set({ favorites: favorites.filter((fid) => fid !== id) });
    } else {
      set({ favorites: [...favorites, id] });
    }
  },

  clearSelectedProduct: () => {
    set({ selectedProduct: null });
  },

  updateProductStatus: (id, status, rejectReason) => {
    const products = get().products.map((p) =>
      p.id === id ? { ...p, status, rejectReason } : p
    );
    set({ products, filteredProducts: products.filter((p) => p.status === 'published') });
  },
}));
