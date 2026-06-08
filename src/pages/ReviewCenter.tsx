import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  Star,
  Calendar,
  User,
  FileText,
  MessageSquare,
  Lightbulb,
  ThumbsUp,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import StatusBadge from '@/components/UI/StatusBadge';
import { useReviewStore } from '@/store/reviewStore';
import { useAuthStore } from '@/store/authStore';
import { useAuthorizationStore } from '@/store/authorizationStore';
import { cn } from '@/lib/utils';
import type { Review } from '@/types';

type ViewMode = 'list' | 'create' | 'detail';

interface ReviewFormData {
  dataQuality: number;
  usability: number;
  deliverySpeed: number;
  customerService: number;
  feedback: string;
  suggestions: string;
}

export default function ReviewCenter() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedAuthForReview, setSelectedAuthForReview] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    dataQuality: 5,
    usability: 5,
    deliverySpeed: 5,
    customerService: 5,
    feedback: '',
    suggestions: '',
  });

  const { user } = useAuthStore();
  const { reviews, loading, fetchReviews, submitReview } = useReviewStore();
  const { authorizations, fetchAuthorizations } = useAuthorizationStore();

  useEffect(() => {
    if (user) {
      fetchReviews(user.id);
      fetchAuthorizations(user.id, user.role);
    }
  }, [user, fetchReviews, fetchAuthorizations]);

  const reviewedAuthIds = reviews.map((r) => r.authorizationId);
  const pendingReviews = authorizations.filter(
    (a) => a.status === 'active' && !reviewedAuthIds.includes(a.id)
  );

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'high' && review.ratings.overall >= 4) ||
      (filter === 'medium' && review.ratings.overall >= 3 && review.ratings.overall < 4) ||
      (filter === 'low' && review.ratings.overall < 3);
    return matchesSearch && matchesFilter;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.ratings.overall, 0) / reviews.length).toFixed(1)
    : '0.0';

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBgColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-50 text-green-600';
    if (rating >= 3) return 'bg-yellow-50 text-yellow-600';
    return 'bg-red-50 text-red-600';
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false, onChange?: (v: number) => void) => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              'transition-all',
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200',
              interactive && 'cursor-pointer hover:scale-110'
            )}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  const handleSubmitReview = () => {
    if (!user || !selectedAuthForReview) return;
    
    const auth = authorizations.find((a) => a.id === selectedAuthForReview);
    if (!auth) return;

    const overall = parseFloat(
      (
        (reviewForm.dataQuality + reviewForm.usability + reviewForm.deliverySpeed + reviewForm.customerService) / 4
      ).toFixed(1)
    );

    submitReview({
      authorizationId: auth.id,
      productId: auth.productId,
      productName: auth.productName,
      reviewerId: user.id,
      reviewerName: user.name,
      ratings: {
        dataQuality: reviewForm.dataQuality,
        usability: reviewForm.usability,
        deliverySpeed: reviewForm.deliverySpeed,
        customerService: reviewForm.customerService,
        overall,
      },
      feedback: reviewForm.feedback,
      suggestions: reviewForm.suggestions,
    });

    setViewMode('list');
    setSelectedAuthForReview(null);
    setReviewForm({
      dataQuality: 5,
      usability: 5,
      deliverySpeed: 5,
      customerService: 5,
      feedback: '',
      suggestions: '',
    });
  };

  const ratingLabels: Record<keyof ReviewFormData, string> = {
    dataQuality: '数据质量',
    usability: '易用性',
    deliverySpeed: '交付速度',
    customerService: '客户服务',
    feedback: '使用反馈',
    suggestions: '改进建议',
  };

  const renderList = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">评价中心</h1>
          <p className="text-neutral-500 mt-1">管理您的产品评价和使用反馈</p>
        </div>
        {pendingReviews.length > 0 && user?.role === 'applicant' && (
          <button
            onClick={() => {
              setSelectedAuthForReview(pendingReviews[0].id);
              setViewMode('create');
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            待评价 ({pendingReviews.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">平均评分</span>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-neutral-800">{averageRating}</p>
            <div>{renderStars(parseFloat(averageRating), 'sm')}</div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">评价总数</span>
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-800 mt-2">{reviews.length}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">好评率</span>
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-800 mt-2">
            {reviews.length > 0 ? Math.round((reviews.filter(r => r.ratings.overall >= 4).length / reviews.length) * 100) : 0}%
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">待评价</span>
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-800 mt-2">{pendingReviews.length}</p>
        </div>
      </div>

      {pendingReviews.length > 0 && user?.role === 'applicant' && (
        <div className="card bg-accent-50 border-accent-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-accent-950 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-accent-800 mb-2">有待评价的授权</h3>
              <p className="text-accent-700 text-sm mb-3">
                您有 {pendingReviews.length} 个使用中的授权待评价，评价后可以帮助其他用户了解产品质量。
              </p>
              <div className="flex flex-wrap gap-2">
                {pendingReviews.map((auth) => (
                  <button
                    key={auth.id}
                    onClick={() => {
                      setSelectedAuthForReview(auth.id);
                      setViewMode('create');
                    }}
                    className="text-sm px-3 py-1.5 bg-white text-accent-800 rounded-lg hover:bg-accent-100 transition-colors border border-accent-200"
                  >
                    评价: {auth.productName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索评价..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-neutral-400 hidden sm:block mt-3" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input"
            >
              <option value="all">全部评分</option>
              <option value="high">4-5星</option>
              <option value="medium">3-4星</option>
              <option value="low">1-2星</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-950" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">暂无评价记录</p>
            {pendingReviews.length > 0 && user?.role === 'applicant' && (
              <button
                onClick={() => {
                  setSelectedAuthForReview(pendingReviews[0].id);
                  setViewMode('create');
                }}
                className="btn btn-primary mt-4"
              >
                立即评价
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                onClick={() => {
                  setSelectedReview(review);
                  setViewMode('detail');
                }}
                className="card p-4 hover:shadow-lg transition-all cursor-pointer border border-neutral-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-neutral-800">{review.productName}</h3>
                      <span className={cn('text-sm font-semibold px-2 py-0.5 rounded-full', getRatingBgColor(review.ratings.overall))}>
                        {review.ratings.overall}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      {renderStars(review.ratings.overall, 'sm')}
                      <span className="text-xs text-neutral-400 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {review.reviewerName}
                      </span>
                      <span className="text-xs text-neutral-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {review.createdAt}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-2">{review.feedback}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-xs text-neutral-400">
                        <span>数据质量:</span>
                        {renderStars(review.ratings.dataQuality, 'sm')}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-neutral-400">
                        <span>易用性:</span>
                        {renderStars(review.ratings.usability, 'sm')}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-neutral-400">
                        <span>交付速度:</span>
                        {renderStars(review.ratings.deliverySpeed, 'sm')}
                      </div>
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

  const renderCreateForm = () => {
    const auth = authorizations.find((a) => a.id === selectedAuthForReview);
    if (!auth) return null;

    const overall = (
      (reviewForm.dataQuality + reviewForm.usability + reviewForm.deliverySpeed + reviewForm.customerService) / 4
    ).toFixed(1);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedAuthForReview(null);
            }}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">提交评价</h1>
            <p className="text-neutral-500 mt-1">请对 {auth.productName} 进行评价</p>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-r from-primary-950 to-accent-950 text-white">
          <h3 className="text-lg font-semibold mb-2">{auth.productName}</h3>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <span>授权期限: {auth.startDate} 至 {auth.endDate}</span>
            <span>授权方: {auth.licensorName}</span>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-6">评分详情</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {(Object.keys(ratingLabels) as Array<keyof ReviewFormData>)
              .filter((key) => typeof reviewForm[key] === 'number')
              .map((key) => (
                <div key={key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <span className="font-medium text-neutral-700">{ratingLabels[key]}</span>
                  {renderStars(reviewForm[key] as number, 'lg', true, (v) => setReviewForm({ ...reviewForm, [key]: v }))}
                </div>
              ))}
          </div>

          <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl mb-6">
            <span className="text-lg font-medium text-neutral-700">综合评分</span>
            <span className={cn('text-5xl font-bold', getRatingColor(parseFloat(overall)))}>
              {overall}
            </span>
            {renderStars(parseFloat(overall), 'lg')}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                使用反馈 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reviewForm.feedback}
                onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                rows={4}
                placeholder="请分享您使用该数据产品的真实体验，包括数据质量、使用效果等方面..."
                className="input w-full resize-none"
              />
              <p className="text-xs text-neutral-400 mt-1 text-right">{reviewForm.feedback.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                改进建议
              </label>
              <textarea
                value={reviewForm.suggestions}
                onChange={(e) => setReviewForm({ ...reviewForm, suggestions: e.target.value })}
                rows={3}
                placeholder="您对产品有什么改进建议？我们会认真倾听每一位用户的声音..."
                className="input w-full resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedAuthForReview(null);
            }}
            className="btn btn-outline"
          >
            取消
          </button>
          <button
            onClick={handleSubmitReview}
            disabled={!reviewForm.feedback.trim()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            提交评价
          </button>
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!selectedReview) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedReview(null);
            }}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">评价详情</h1>
            <p className="text-neutral-500 mt-1">评价编号: {selectedReview.id}</p>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">{selectedReview.productName}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedReview.reviewerName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedReview.createdAt}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn('text-3xl font-bold', getRatingColor(selectedReview.ratings.overall))}>
                {selectedReview.ratings.overall}
              </span>
              {renderStars(selectedReview.ratings.overall, 'lg')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {(Object.keys(selectedReview.ratings) as Array<keyof typeof selectedReview.ratings>)
              .filter((key) => key !== 'overall')
              .map((key) => (
                <div key={key} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <span className="font-medium text-neutral-700">
                    {key === 'dataQuality' ? '数据质量' : 
                     key === 'usability' ? '易用性' :
                     key === 'deliverySpeed' ? '交付速度' : '客户服务'}
                  </span>
                  <div className="flex items-center gap-2">
                    {renderStars(selectedReview.ratings[key])}
                    <span className={cn('font-semibold', getRatingColor(selectedReview.ratings[key]))}>
                      {selectedReview.ratings[key]}.0
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-medium text-neutral-800 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent-950" />
                使用反馈
              </h3>
              <p className="text-neutral-600 leading-relaxed">{selectedReview.feedback}</p>
            </div>

            {selectedReview.suggestions && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  改进建议
                </h3>
                <p className="text-blue-700 leading-relaxed">{selectedReview.suggestions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {viewMode === 'list' && renderList()}
      {viewMode === 'create' && renderCreateForm()}
      {viewMode === 'detail' && renderDetail()}
    </div>
  );
}
