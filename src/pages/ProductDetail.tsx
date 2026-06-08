import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  ArrowLeft,
  Clock,
  MapPin,
  Database,
  RefreshCw,
  CheckCircle,
  Star,
  Eye,
  Download,
  Shield,
  FileText,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from '@/components/UI/StatusBadge';
import { useProductStore, useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { mockReviews, getReviewsByProduct } from '@/mock';

const tabs = [
  { id: 'intro', label: '产品介绍' },
  { id: 'sample', label: '数据样例' },
  { id: 'quality', label: '质量说明' },
  { id: 'pricing', label: '规格定价' },
  { id: 'reviews', label: '用户评价' },
];

const frequencyLabels: Record<string, string> = {
  daily: '每日更新',
  weekly: '每周更新',
  monthly: '每月更新',
  quarterly: '每季度更新',
  yearly: '每年更新',
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedProduct, loading, favorites, toggleFavorite, fetchProductById, clearSelectedProduct } = useProductStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('intro');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
    return () => clearSelectedProduct();
  }, [id, fetchProductById, clearSelectedProduct]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.pricing.length > 0) {
      setSelectedTier(selectedProduct.pricing[0].id);
    }
  }, [selectedProduct]);

  const isFavorite = selectedProduct ? favorites.includes(selectedProduct.id) : false;
  const productReviews = selectedProduct ? getReviewsByProduct(selectedProduct.id) : [];
  const averageRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.ratings.overall, 0) / productReviews.length).toFixed(1)
    : '0.0';

  if (loading || !selectedProduct) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-64 bg-neutral-200 rounded-xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="h-32 bg-neutral-200 rounded-xl" />
          <div className="h-32 bg-neutral-200 rounded-xl" />
          <div className="h-32 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const selectedPricing = selectedProduct.pricing.find((p) => p.id === selectedTier);

  const handleApply = () => {
    navigate(`/applications?mode=create&productId=${selectedProduct.id}&tier=${selectedTier}`);
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-950 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回数据目录
      </button>

      <div className="card overflow-hidden mb-6">
        <div className="relative h-56 bg-gradient-primary">
          <div className="absolute inset-0 bg-black/30" />
          <img
            src={selectedProduct.coverImage}
            alt={selectedProduct.name}
            className="w-full h-full object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-accent text-white bg-white/20 backdrop-blur">
                {selectedProduct.category}
              </span>
              <span className="badge-primary text-white bg-white/20 backdrop-blur">
                {selectedProduct.industry}
              </span>
              <StatusBadge status={selectedProduct.status} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {selectedProduct.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Database className="w-4 h-4" />
                质量评分 {selectedProduct.qualityScore.overall}分
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {selectedProduct.viewCount.toLocaleString()} 浏览
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {averageRating} 分 ({productReviews.length}条评价)
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={selectedProduct.provider.avatar}
                  alt={selectedProduct.provider.name}
                  className="w-12 h-12 rounded-full bg-neutral-200"
                />
                <div>
                  <p className="font-medium text-neutral-900">{selectedProduct.provider.name}</p>
                  <p className="text-sm text-neutral-500">官方认证数据提供商</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    覆盖地区
                  </div>
                  <p className="font-semibold text-neutral-900">{selectedProduct.region}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
                    <RefreshCw className="w-4 h-4" />
                    更新频率
                  </div>
                  <p className="font-semibold text-neutral-900">
                    {frequencyLabels[selectedProduct.updateFrequency]}
                  </p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
                    <FileText className="w-4 h-4" />
                    发布时间
                  </div>
                  <p className="font-semibold text-neutral-900">{selectedProduct.createdAt}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    更新时间
                  </div>
                  <p className="font-semibold text-neutral-900">{selectedProduct.updatedAt}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProduct.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-50 text-primary-800 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-neutral-50 rounded-xl p-5">
                <div className="mb-4">
                  <p className="text-sm text-neutral-500 mb-1">选择规格</p>
                  <div className="space-y-2">
                    {selectedProduct.pricing.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={cn(
                          'w-full p-3 rounded-lg border-2 text-left transition-all',
                          selectedTier === tier.id
                            ? 'border-primary-950 bg-primary-50'
                            : 'border-neutral-200 bg-white hover:border-primary-300'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-neutral-900">{tier.name}</span>
                          <span className="text-primary-950 font-bold">
                            ¥{tier.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">{tier.duration}天</p>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPricing && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-neutral-200">
                    <p className="text-xs text-neutral-500 mb-2">包含权益</p>
                    <ul className="space-y-1">
                      {selectedPricing.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-neutral-600">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all',
                      isFavorite
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-neutral-300 text-neutral-600 hover:border-primary-300 hover:text-primary-950'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
                    {isFavorite ? '已收藏' : '收藏'}
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 btn-primary py-2.5"
                  >
                    立即申请
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-neutral-200">
          <div className="flex gap-1 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'tab',
                  activeTab === tab.id && 'tab-active'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'intro' && (
            <div className="prose prose-sm max-w-none animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">产品介绍</h3>
              <p className="text-neutral-600 leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              <h4 className="font-semibold mb-3">数据特点</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {[
                  '数据覆盖范围广，包含全国主要地区',
                  '时间跨度长，历史数据完整',
                  '经过严格的数据清洗和标准化处理',
                  '支持多种数据格式和接口调用',
                  '定期更新，保证数据时效性',
                  '匿名化处理，符合隐私保护要求',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-neutral-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <h4 className="font-semibold mb-3">应用场景</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['市场分析', '风险评估', '业务优化', '产品研发', '用户研究', '战略规划'].map((item, i) => (
                  <div key={i} className="p-3 bg-neutral-50 rounded-lg text-center">
                    <p className="text-neutral-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sample' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">数据样例</h3>
              <p className="text-sm text-neutral-500 mb-4">
                以下为数据样例展示，实际数据以交付内容为准
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50">
                      {selectedProduct.sampleData.fields.map((field) => (
                        <th key={field.name} className="px-4 py-3 text-left font-medium text-neutral-700">
                          <div>{field.name}</div>
                          <div className="text-xs text-neutral-400 font-normal">
                            {field.type} - {field.description}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.sampleData.rows.map((row, i) => (
                      <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50">
                        {selectedProduct.sampleData.fields.map((field) => (
                          <td key={field.name} className="px-4 py-3 text-neutral-600">
                            {String(row[field.name])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-neutral-500">
                  共 {selectedProduct.sampleData.fields.length} 个字段，展示 {selectedProduct.sampleData.rows.length} 条样例数据
                </span>
                <button className="btn-outline text-sm py-1.5 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  下载完整样例
                </button>
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-semibold mb-6">质量说明</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    {selectedProduct.qualityScore.completeness}%
                  </div>
                  <p className="text-sm text-neutral-600">数据完整性</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl">
                  <div className="text-4xl font-bold text-green-600 mb-1">
                    {selectedProduct.qualityScore.accuracy}%
                  </div>
                  <p className="text-sm text-neutral-600">数据准确性</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
                  <div className="text-4xl font-bold text-purple-600 mb-1">
                    {selectedProduct.qualityScore.timeliness}%
                  </div>
                  <p className="text-sm text-neutral-600">数据时效性</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl">
                  <div className="text-4xl font-bold text-amber-600 mb-1">
                    {selectedProduct.qualityScore.overall}%
                  </div>
                  <p className="text-sm text-neutral-600">综合评分</p>
                </div>
              </div>

              <div className="p-5 bg-neutral-50 rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <Shield className="w-5 h-5 text-primary-950 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-1">质量检测报告</h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {selectedProduct.qualityScore.report}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-semibold mb-6">规格定价</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedProduct.pricing.map((tier) => (
                  <div
                    key={tier.id}
                    className={cn(
                      'p-6 rounded-xl border-2 transition-all cursor-pointer',
                      selectedTier === tier.id
                        ? 'border-primary-950 bg-primary-50/50'
                        : 'border-neutral-200 hover:border-primary-300'
                    )}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg text-neutral-900">{tier.name}</h4>
                      {selectedTier === tier.id && (
                        <CheckCircle className="w-5 h-5 text-primary-950" />
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">{tier.description}</p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-primary-950">
                        ¥{tier.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-neutral-400">/{tier.duration}天</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply();
                      }}
                      className={cn(
                        'w-full py-2.5 rounded-lg font-medium transition-all',
                        selectedTier === tier.id
                          ? 'bg-primary-950 text-white hover:bg-primary-800'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      )}
                    >
                      选择此规格
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">用户评价</h3>
                <span className="text-sm text-neutral-500">共 {productReviews.length} 条评价</span>
              </div>

              {productReviews.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
                  <p className="text-neutral-500">暂无用户评价</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {productReviews.map((review) => (
                    <div key={review.id} className="p-5 border border-neutral-200 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-950 font-semibold">
                            {review.reviewerName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{review.reviewerName}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'w-3 h-3',
                                    i < Math.floor(review.ratings.overall)
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-neutral-300'
                                  )}
                                />
                              ))}
                              <span className="text-xs text-neutral-500 ml-1">
                                {review.ratings.overall}分
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-neutral-400">{review.createdAt}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center p-2 bg-neutral-50 rounded">
                          <p className="text-xs text-neutral-500">数据质量</p>
                          <p className="font-semibold text-neutral-800">{review.ratings.dataQuality}分</p>
                        </div>
                        <div className="text-center p-2 bg-neutral-50 rounded">
                          <p className="text-xs text-neutral-500">易用性</p>
                          <p className="font-semibold text-neutral-800">{review.ratings.usability}分</p>
                        </div>
                        <div className="text-center p-2 bg-neutral-50 rounded">
                          <p className="text-xs text-neutral-500">交付速度</p>
                          <p className="font-semibold text-neutral-800">{review.ratings.deliverySpeed}分</p>
                        </div>
                        <div className="text-center p-2 bg-neutral-50 rounded">
                          <p className="text-xs text-neutral-500">客户服务</p>
                          <p className="font-semibold text-neutral-800">{review.ratings.customerService}分</p>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-600 mb-2">{review.feedback}</p>
                      {review.suggestions && (
                        <p className="text-sm text-neutral-500">
                          <span className="text-accent-700 font-medium">建议：</span>
                          {review.suggestions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
