import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Heart, TrendingUp, Clock, Filter } from 'lucide-react';
import FilterPanel from '@/components/UI/FilterPanel';
import ProductCard from '@/components/UI/ProductCard';
import { useProductStore } from '@/store';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';

export default function DataCatalog() {
  const [searchParams] = useSearchParams();
  const { filteredProducts, loading, favorites, fetchProducts } = useProductStore();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const tab = searchParams.get('tab');

  useEffect(() => {
    if (tab === 'favorites') {
      setActiveTab('favorites');
    }
  }, [tab]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayProducts = activeTab === 'favorites'
    ? filteredProducts.filter((p) => favorites.includes(p.id))
    : filteredProducts;

  return (
    <div className="flex gap-6">
      <div className="hidden lg:block w-72 flex-shrink-0">
        <FilterPanel />
      </div>

      <div className="flex-1 min-w-0">
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTab === 'all'
                    ? 'bg-primary-950 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                全部产品
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  activeTab === 'favorites'
                    ? 'bg-primary-950 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                <Heart className="w-4 h-4" />
                我的收藏
                {favorites.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilterMobile(!showFilterMobile)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg text-sm"
              >
                <Filter className="w-4 h-4" />
                筛选
              </button>

              <div className="flex bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-md transition-all',
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-neutral-500'
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-md transition-all',
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-neutral-500'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {showFilterMobile && (
          <div className="lg:hidden mb-6">
            <FilterPanel />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-40 bg-neutral-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-full" />
                  <div className="h-4 bg-neutral-200 rounded w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-neutral-200 rounded w-16" />
                    <div className="h-6 bg-neutral-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <Filter className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              {activeTab === 'favorites' ? '暂无收藏产品' : '未找到匹配的数据产品'}
            </h3>
            <p className="text-neutral-500">
              {activeTab === 'favorites'
                ? '浏览数据目录，收藏您感兴趣的数据产品'
                : '请尝试调整筛选条件或搜索关键词'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="card p-4 flex gap-4 cursor-pointer hover:shadow-card-hover transition-all"
                onClick={() => (window.location.href = `/product/${product.id}`)}
              >
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="w-40 h-28 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge-accent">{product.category}</span>
                        <span className="badge-primary">{product.industry}</span>
                      </div>
                      <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-neutral-500 line-clamp-2 mb-2">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {product.region}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          质量 {product.qualityScore.overall}分
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {product.favoriteCount} 收藏
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary-950">
                        ¥{product.pricing[0].price.toLocaleString()}
                        <span className="text-xs text-neutral-400 font-normal ml-1">起</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        {product.pricing[0].duration}天
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
