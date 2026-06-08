import { useNavigate } from 'react-router-dom';
import { Heart, Eye, Database, Clock, MapPin, Building2 } from 'lucide-react';
import type { DataProduct } from '@/types';
import { useProductStore, useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: DataProduct;
}

const frequencyLabels: Record<string, string> = {
  daily: '每日更新',
  weekly: '每周更新',
  monthly: '每月更新',
  quarterly: '每季度更新',
  yearly: '每年更新',
};

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useProductStore();
  const { user } = useAuthStore();

  const isFavorite = favorites.includes(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="card overflow-hidden cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={product.coverImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <button
          onClick={handleFavoriteClick}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full transition-all duration-200',
            isFavorite
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-red-500'
          )}
        >
          <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
        </button>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            <span className="badge-accent">{product.category}</span>
            <span className="badge-primary">{product.industry}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary-950 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-neutral-500 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{product.region}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{frequencyLabels[product.updateFrequency]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{product.viewCount.toLocaleString()} 浏览</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            <span>质量 {product.qualityScore.overall}分</span>
          </div>
        </div>

        <div className="divider my-3" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={product.provider.avatar}
              alt={product.provider.name}
              className="w-6 h-6 rounded-full bg-neutral-200"
            />
            <span className="text-xs text-neutral-600">{product.provider.name}</span>
          </div>
          
          <div className="text-right">
            <span className="text-lg font-bold text-primary-950">
              ¥{product.pricing[0].price.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 ml-1">起</span>
          </div>
        </div>
      </div>
    </div>
  );
}
