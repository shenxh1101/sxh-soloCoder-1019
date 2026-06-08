import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useProductStore } from '@/store';
import { cn } from '@/lib/utils';

const industries = ['金融', '医疗健康', '零售电商', '交通物流', '教育', '能源', '制造业', '农业', '政务', '文化娱乐'];
const regions = ['华东', '华北', '华南', '华中', '西南', '西北', '东北', '全国'];
const frequencies = [
  { value: 'daily', label: '每日更新' },
  { value: 'weekly', label: '每周更新' },
  { value: 'monthly', label: '每月更新' },
  { value: 'quarterly', label: '每季度更新' },
  { value: 'yearly', label: '每年更新' },
];

const sortOptions = [
  { value: 'latest', label: '最新发布' },
  { value: 'popular', label: '最受欢迎' },
  { value: 'price-low', label: '价格从低到高' },
  { value: 'price-high', label: '价格从高到低' },
  { value: 'rating', label: '质量评分' },
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="font-medium text-neutral-800 text-sm">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-neutral-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        )}
      </button>
      {isOpen && <div className="pb-3 animate-slide-down">{children}</div>}
    </div>
  );
}

export default function FilterPanel() {
  const { filters, setFilters, filteredProducts } = useProductStore();

  const handleClearFilters = () => {
    setFilters({
      industry: '',
      region: '',
      updateFrequency: '',
      search: '',
      sortBy: 'latest',
    });
  };

  const hasActiveFilters = filters.industry || filters.region || filters.updateFrequency;

  return (
    <div className="card p-4 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-950" />
          <span className="font-semibold text-neutral-800">筛选条件</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-neutral-500 hover:text-primary-950 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            清除
          </button>
        )}
      </div>

      <div className="space-y-1">
        <FilterSection title="行业分类">
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setFilters({ industry: filters.industry === industry ? '' : industry })}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-md transition-all duration-200',
                  filters.industry === industry
                    ? 'bg-primary-950 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                {industry}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="覆盖地区">
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setFilters({ region: filters.region === region ? '' : region })}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-md transition-all duration-200',
                  filters.region === region
                    ? 'bg-primary-950 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                {region}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="更新频率">
          <div className="space-y-1">
            {frequencies.map((freq) => (
              <button
                key={freq.value}
                onClick={() =>
                  setFilters({
                    updateFrequency: filters.updateFrequency === freq.value ? '' : freq.value,
                  })
                }
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200 text-left',
                  filters.updateFrequency === freq.value
                    ? 'bg-primary-50 text-primary-950'
                    : 'text-neutral-600 hover:bg-neutral-50'
                )}
              >
                <span
                  className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                    filters.updateFrequency === freq.value
                      ? 'border-primary-950 bg-primary-950'
                      : 'border-neutral-300'
                  )}
                >
                  {filters.updateFrequency === freq.value && (
                    <span className="w-2 h-2 bg-white rounded-full" />
                  )}
                </span>
                {freq.label}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="排序方式">
          <div className="space-y-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilters({ sortBy: option.value })}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200 text-left',
                  filters.sortBy === option.value
                    ? 'bg-primary-50 text-primary-950'
                    : 'text-neutral-600 hover:bg-neutral-50'
                )}
              >
                <span
                  className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                    filters.sortBy === option.value
                      ? 'border-primary-950 bg-primary-950'
                      : 'border-neutral-300'
                  )}
                >
                  {filters.sortBy === option.value && (
                    <span className="w-2 h-2 bg-white rounded-full" />
                  )}
                </span>
                {option.label}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <p className="text-sm text-neutral-500">
          找到 <span className="font-semibold text-primary-950">{filteredProducts.length}</span> 个数据产品
        </p>
      </div>
    </div>
  );
}
