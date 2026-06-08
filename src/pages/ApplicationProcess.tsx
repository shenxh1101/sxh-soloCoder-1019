import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  MessageSquare,
  Paperclip,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ChevronLeft,
  Download,
  Upload,
  Calendar,
  Building,
  User,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import StatusBadge from '@/components/UI/StatusBadge';
import StepIndicator from '@/components/UI/StepIndicator';
import { useApplicationStore } from '@/store/applicationStore';
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { cn } from '@/lib/utils';
import type { Application, Message, Material, AuthorizationScope } from '@/types';

const applicationSchema = z.object({
  productId: z.string().min(1, '请选择数据产品'),
  purpose: z.string().min(10, '使用目的至少10个字符').max(500, '使用目的不超过500个字符'),
  scenario: z.string().min(10, '应用场景至少10个字符').max(500, '应用场景不超过500个字符'),
  duration: z.coerce.number().min(1, '使用期限至少1天').max(365, '使用期限不超过365天'),
  dataScale: z.string().min(1, '请填写数据量级需求'),
  selectedPricingTier: z.string().min(1, '请选择定价方案'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

type ViewMode = 'list' | 'create' | 'detail';

export default function ApplicationProcess() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authScope, setAuthScope] = useState<AuthorizationScope>({
    dataRange: '',
    usageLimitations: [],
    permittedPurposes: [],
    dataSecurity: '',
  });
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { user } = useAuthStore();
  const { products } = useProductStore();
  const {
    applications,
    selectedApplication,
    loading,
    fetchApplications,
    fetchApplicationById,
    createApplication,
    sendMessage,
    uploadMaterial,
    approveApplication,
    rejectApplication,
    clearSelectedApplication,
  } = useApplicationStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      duration: 90,
    },
  });

  const selectedProductId = watch('productId');
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  useEffect(() => {
    if (user) {
      fetchApplications(user.id, user.role);
    }
  }, [user, fetchApplications]);

  useEffect(() => {
    if (selectedAppId) {
      fetchApplicationById(selectedAppId);
    }
    return () => clearSelectedApplication();
  }, [selectedAppId, fetchApplicationById, clearSelectedApplication]);

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = app.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateApplication = (data: ApplicationFormData) => {
    if (!user) return;
    const product = products.find((p) => p.id === data.productId);
    const newApp = createApplication({
      ...data,
      productName: product?.name,
      applicantId: user.id,
      applicantName: user.name,
      providerId: product?.provider.id,
    });
    setSelectedAppId(newApp.id);
    setViewMode('detail');
    reset();
  };

  const handleSendMessage = () => {
    if (!selectedApplication || !newMessage.trim() || !user) return;
    sendMessage(selectedApplication.id, {
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: newMessage.trim(),
    });
    setNewMessage('');
  };

  const handleUploadMaterial = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedApplication || !user || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    uploadMaterial(selectedApplication.id, {
      name: file.name,
      url: '#',
      uploadedBy: user.id,
      uploadedAt: new Date().toLocaleString('zh-CN'),
    });
    e.target.value = '';
  };

  const handleApprove = () => {
    if (!selectedApplication) return;
    approveApplication(selectedApplication.id, authScope);
    setShowAuthModal(false);
  };

  const handleReject = () => {
    if (!selectedApplication || !rejectReason.trim()) return;
    rejectApplication(selectedApplication.id, rejectReason.trim());
    setShowRejectModal(false);
    setRejectReason('');
  };

  const renderList = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">申请管理</h1>
          <p className="text-neutral-500 mt-1">管理您的数据产品申请和审批</p>
        </div>
        {user?.role === 'applicant' && (
          <button
            onClick={() => setViewMode('create')}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新建申请
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索申请..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-neutral-400 hidden sm:block mt-3" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">全部状态</option>
              <option value="pending">待审核</option>
              <option value="reviewing">审核中</option>
              <option value="communicating">沟通中</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-950" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">暂无申请记录</p>
            {user?.role === 'applicant' && (
              <button
                onClick={() => setViewMode('create')}
                className="btn btn-primary mt-4"
              >
                创建第一个申请
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  setSelectedAppId(app.id);
                  setViewMode('detail');
                }}
                className="card p-4 hover:shadow-lg transition-all cursor-pointer border border-neutral-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-neutral-800">{app.productName}</h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-sm text-neutral-500 line-clamp-2 mb-3">
                      {app.purpose}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {user?.role === 'provider' ? `申请人: ${app.applicantName}` : `申请人: ${app.applicantName}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        申请时间: {app.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        使用期限: {app.duration}天
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.messages.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <MessageSquare className="w-3 h-3" />
                        {app.messages.length}
                      </span>
                    )}
                    {app.supplementaryMaterials.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <Paperclip className="w-3 h-3" />
                        {app.supplementaryMaterials.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderCreateForm = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setViewMode('list')}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">新建数据使用申请</h1>
          <p className="text-neutral-500 mt-1">填写申请信息，提交数据使用申请</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleCreateApplication)} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-accent-950" />
            选择数据产品
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                数据产品 <span className="text-red-500">*</span>
              </label>
              <select {...register('productId')} className="input w-full">
                <option value="">请选择数据产品</option>
                {products
                  .filter((p) => p.status === 'published')
                  .map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.provider.name}
                    </option>
                  ))}
              </select>
              {errors.productId && (
                <p className="text-red-500 text-sm mt-1">{errors.productId.message}</p>
              )}
            </div>

            {selectedProduct && (
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="font-medium text-neutral-800 mb-2">{selectedProduct.name}</h4>
                <p className="text-sm text-neutral-500 mb-3">{selectedProduct.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedProduct.pricing.map((tier) => (
                    <label
                      key={tier.id}
                      className={cn(
                        'relative border-2 rounded-lg p-4 cursor-pointer transition-all',
                        watch('selectedPricingTier') === tier.id
                          ? 'border-accent-950 bg-accent-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      )}
                    >
                      <input
                        type="radio"
                        {...register('selectedPricingTier')}
                        value={tier.id}
                        className="sr-only"
                      />
                      <h5 className="font-semibold text-neutral-800">{tier.name}</h5>
                      <p className="text-2xl font-bold text-accent-950 mt-1">
                        ¥{tier.price}
                      </p>
                      <p className="text-xs text-neutral-500">{tier.duration}天</p>
                      <p className="text-xs text-neutral-500 mt-2">{tier.description}</p>
                    </label>
                  ))}
                </div>
                {errors.selectedPricingTier && (
                  <p className="text-red-500 text-sm mt-2">{errors.selectedPricingTier.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-950" />
            申请信息
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                使用目的 <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('purpose')}
                rows={3}
                placeholder="请详细描述您使用该数据的目的..."
                className="input w-full resize-none"
              />
              {errors.purpose && (
                <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                应用场景 <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('scenario')}
                rows={3}
                placeholder="请描述数据的具体应用场景..."
                className="input w-full resize-none"
              />
              {errors.scenario && (
                <p className="text-red-500 text-sm mt-1">{errors.scenario.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                使用期限（天） <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('duration')}
                min={1}
                max={365}
                placeholder="请输入使用期限"
                className="input w-full"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                数据量级需求 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('dataScale')}
                placeholder="如：100万条记录、实时数据流等"
                className="input w-full"
              />
              {errors.dataScale && (
                <p className="text-red-500 text-sm mt-1">{errors.dataScale.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="btn btn-outline"
          >
            取消
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '提交申请'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderDetail = () => {
    if (!selectedApplication) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-950" />
        </div>
      );
    }

    const isProvider = user?.role === 'provider';
    const canApprove = isProvider && selectedApplication.status !== 'approved' && selectedApplication.status !== 'rejected';
    const canCommunicate = selectedApplication.status !== 'approved' && selectedApplication.status !== 'rejected';

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedAppId(null);
            }}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-800">{selectedApplication.productName}</h1>
              <StatusBadge status={selectedApplication.status} />
            </div>
            <p className="text-neutral-500 mt-1">
              申请编号: {selectedApplication.id} | 创建时间: {selectedApplication.createdAt}
            </p>
          </div>
          {canApprove && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowRejectModal(true)}
                className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />
                拒绝
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn btn-primary"
              >
                <CheckCircle className="w-4 h-4" />
                通过
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">申请进度</h2>
          <StepIndicator
            steps={selectedApplication.steps}
            currentStep={selectedApplication.currentStep}
          />
        </div>

        {selectedApplication.rejectReason && (
          <div className="card bg-red-50 border-red-200">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">申请被拒绝</h3>
                <p className="text-red-700 text-sm mt-1">{selectedApplication.rejectReason}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">申请信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-500">使用目的</label>
                  <p className="text-neutral-800 mt-1">{selectedApplication.purpose}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500">应用场景</label>
                  <p className="text-neutral-800 mt-1">{selectedApplication.scenario}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500">使用期限</label>
                  <p className="text-neutral-800 mt-1">{selectedApplication.duration} 天</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500">数据量级</label>
                  <p className="text-neutral-800 mt-1">{selectedApplication.dataScale}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500">申请人</label>
                  <p className="text-neutral-800 mt-1">{selectedApplication.applicantName}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500">申请时间</label>
                  <p className="text-neutral-800 mt-1">{selectedApplication.createdAt}</p>
                </div>
              </div>
            </div>

            {selectedApplication.authorizationScope && (
              <div className="card">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  授权范围
                </h2>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">数据范围</h4>
                    <p className="text-green-700 text-sm">{selectedApplication.authorizationScope.dataRange}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">允许用途</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      {selectedApplication.authorizationScope.permittedPurposes.map((p, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-2">使用限制</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      {selectedApplication.authorizationScope.usageLimitations.map((l, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <XCircle className="w-3 h-3" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">数据安全</h4>
                    <p className="text-purple-700 text-sm">{selectedApplication.authorizationScope.dataSecurity}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent-950" />
                在线沟通
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                {selectedApplication.messages.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>暂无消息记录</p>
                  </div>
                ) : (
                  selectedApplication.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-3',
                        msg.senderId === user?.id ? 'flex-row-reverse' : ''
                      )}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0',
                          msg.senderRole === 'provider' ? 'bg-accent-950' : 
                          msg.senderRole === 'applicant' ? 'bg-primary-950' : 'bg-neutral-500'
                        )}
                      >
                        {msg.senderName.charAt(0)}
                      </div>
                      <div
                        className={cn(
                          'max-w-[70%]',
                          msg.senderId === user?.id ? 'items-end' : 'items-start'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-neutral-700">
                            {msg.senderName}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {msg.createdAt}
                          </span>
                        </div>
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2',
                            msg.senderId === user?.id
                              ? 'bg-primary-950 text-white rounded-tr-none'
                              : 'bg-neutral-100 text-neutral-800 rounded-tl-none'
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {msg.attachments.map((att) => (
                                <a
                                  key={att.id}
                                  href={att.url}
                                  className={cn(
                                    'flex items-center gap-2 text-xs p-2 rounded',
                                    msg.senderId === user?.id
                                      ? 'bg-white/20 hover:bg-white/30'
                                      : 'bg-white hover:bg-neutral-50'
                                  )}
                                >
                                  <Paperclip className="w-3 h-3" />
                                  {att.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {canCommunicate && (
                <div className="border-t border-neutral-100 pt-4">
                  <div className="flex gap-2">
                    <label className="btn btn-outline cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleUploadMaterial}
                      />
                    </label>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="输入消息..."
                      className="input flex-1"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="btn btn-primary"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-accent-950" />
                补充材料
              </h2>
              {selectedApplication.supplementaryMaterials.length === 0 ? (
                <p className="text-neutral-400 text-sm text-center py-4">暂无补充材料</p>
              ) : (
                <div className="space-y-2">
                  {selectedApplication.supplementaryMaterials.map((mat) => (
                    <a
                      key={mat.id}
                      href={mat.url}
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-neutral-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-800 truncate">{mat.name}</p>
                        <p className="text-xs text-neutral-400">{mat.uploadedAt}</p>
                      </div>
                      <Download className="w-4 h-4 text-neutral-400" />
                    </a>
                  ))}
                </div>
              )}
              {canCommunicate && (
                <label className="btn btn-outline w-full mt-4 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  上传材料
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUploadMaterial}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-800">确认授权范围</h2>
                <p className="text-neutral-500 text-sm mt-1">请设置授权范围后通过申请</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    数据范围
                  </label>
                  <textarea
                    value={authScope.dataRange}
                    onChange={(e) => setAuthScope({ ...authScope, dataRange: e.target.value })}
                    rows={2}
                    placeholder="描述授权的数据范围..."
                    className="input w-full resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    允许用途（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={authScope.permittedPurposes.join(', ')}
                    onChange={(e) => setAuthScope({ ...authScope, permittedPurposes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="如：产品推荐算法训练, 用户行为分析研究"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    使用限制（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={authScope.usageLimitations.join(', ')}
                    onChange={(e) => setAuthScope({ ...authScope, usageLimitations: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="如：仅用于内部研发, 不得二次分发"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    数据安全要求
                  </label>
                  <textarea
                    value={authScope.dataSecurity}
                    onChange={(e) => setAuthScope({ ...authScope, dataSecurity: e.target.value })}
                    rows={2}
                    placeholder="描述数据安全要求..."
                    className="input w-full resize-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-neutral-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="btn btn-outline"
                >
                  取消
                </button>
                <button
                  onClick={handleApprove}
                  className="btn btn-primary"
                >
                  确认并通过
                </button>
              </div>
            </div>
          </div>
        )}

        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-800">拒绝申请</h2>
                <p className="text-neutral-500 text-sm mt-1">请填写拒绝原因</p>
              </div>
              <div className="p-6">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  placeholder="请详细说明拒绝原因..."
                  className="input w-full resize-none"
                />
              </div>
              <div className="p-6 border-t border-neutral-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="btn btn-outline"
                >
                  取消
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="btn bg-red-500 text-white hover:bg-red-600"
                >
                  确认拒绝
                </button>
              </div>
            </div>
          </div>
        )}
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
