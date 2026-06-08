import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Ban,
  FileText,
  Download,
  Send,
  Building,
  Shield,
  Key,
  HardDrive,
} from 'lucide-react';
import StatusBadge from '@/components/UI/StatusBadge';
import { useAuthorizationStore } from '@/store/authorizationStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import type { Authorization, DeliveryRecord } from '@/types';

type ViewMode = 'list' | 'detail';

export default function AuthorizationManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedAuthId, setSelectedAuthId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewDuration, setRenewDuration] = useState(90);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [terminateReason, setTerminateReason] = useState('');
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryRecord, setDeliveryRecord] = useState<Omit<DeliveryRecord, 'id'>>({
    method: 'api',
    deliveredAt: '',
    deliveredBy: '',
    description: '',
  });

  const { user } = useAuthStore();
  const {
    authorizations,
    selectedAuthorization,
    loading,
    fetchAuthorizations,
    fetchAuthorizationById,
    renewAuthorization,
    terminateAuthorization,
    addDeliveryRecord,
    clearSelectedAuthorization,
  } = useAuthorizationStore();

  useEffect(() => {
    if (user) {
      fetchAuthorizations(user.id, user.role);
    }
  }, [user, fetchAuthorizations]);

  useEffect(() => {
    if (selectedAuthId) {
      fetchAuthorizationById(selectedAuthId);
    }
    return () => clearSelectedAuthorization();
  }, [selectedAuthId, fetchAuthorizationById, clearSelectedAuthorization]);

  const filteredAuthorizations = authorizations.filter((auth) => {
    const matchesStatus = statusFilter === 'all' || auth.status === statusFilter;
    const matchesSearch = auth.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'expired':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'terminated':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'renewing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5" />;
      case 'expired':
        return <Clock className="w-5 h-5" />;
      case 'terminated':
        return <XCircle className="w-5 h-5" />;
      case 'renewing':
        return <RefreshCw className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const handleRenew = () => {
    if (!selectedAuthorization) return;
    renewAuthorization(selectedAuthorization.id, renewDuration);
    setShowRenewModal(false);
    setRenewDuration(90);
  };

  const handleTerminate = () => {
    if (!selectedAuthorization || !terminateReason.trim()) return;
    terminateAuthorization(selectedAuthorization.id, terminateReason.trim());
    setShowTerminateModal(false);
    setTerminateReason('');
  };

  const handleAddDelivery = () => {
    if (!selectedAuthorization || !user) return;
    addDeliveryRecord(selectedAuthorization.id, {
      ...deliveryRecord,
      deliveredBy: user.name,
      deliveredAt: new Date().toLocaleString('zh-CN'),
    });
    setShowDeliveryModal(false);
    setDeliveryRecord({
      method: 'api',
      deliveredAt: '',
      deliveredBy: '',
      description: '',
    });
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      api: 'API 接口',
      download: '文件下载',
      sftp: 'SFTP 传输',
      manual: '人工交付',
    };
    return labels[method] || method;
  };

  const renderList = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">授权管理</h1>
        <p className="text-neutral-500 mt-1">查看和管理您的数据产品授权</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '全部授权', value: authorizations.length, color: 'bg-primary-950' },
          { label: '使用中', value: authorizations.filter(a => a.status === 'active').length, color: 'bg-green-500' },
          { label: '续期中', value: authorizations.filter(a => a.status === 'renewing').length, color: 'bg-blue-500' },
          { label: '已过期', value: authorizations.filter(a => a.status === 'expired' || a.status === 'terminated').length, color: 'bg-orange-500' },
        ].map((stat, index) => (
          <div key={index} className="card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">{stat.label}</span>
              <div className={cn('w-3 h-3 rounded-full', stat.color)} />
            </div>
            <p className="text-3xl font-bold text-neutral-800 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索授权..."
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
              <option value="active">使用中</option>
              <option value="renewing">续期中</option>
              <option value="expired">已过期</option>
              <option value="terminated">已终止</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-950" />
          </div>
        ) : filteredAuthorizations.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">暂无授权记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAuthorizations.map((auth) => {
              const daysRemaining = getDaysRemaining(auth.endDate);
              return (
                <div
                  key={auth.id}
                  onClick={() => {
                    setSelectedAuthId(auth.id);
                    setViewMode('detail');
                  }}
                  className="card p-4 hover:shadow-lg transition-all cursor-pointer border border-neutral-100"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-neutral-800">{auth.productName}</h3>
                        <StatusBadge status={auth.status} />
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mb-3">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {user?.role === 'provider' ? `被授权方: ${auth.licenseeName}` : `授权方: ${auth.licensorName}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {auth.startDate} 至 {auth.endDate}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {auth.scope.permittedPurposes.slice(0, 3).map((purpose, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full">
                            {purpose}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg border',
                        getStatusColor(auth.status)
                      )}>
                        {getStatusIcon(auth.status)}
                        <div>
                          <p className="text-sm font-medium">
                            {auth.status === 'active' && `${daysRemaining} 天后到期`}
                            {auth.status === 'renewing' && '续期审核中'}
                            {auth.status === 'expired' && '已过期'}
                            {auth.status === 'terminated' && '已终止'}
                          </p>
                          <p className="text-xs opacity-75">
                            {auth.deliveryRecords.length} 次交付
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selectedAuthorization) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-950" />
        </div>
      );
    }

    const isProvider = user?.role === 'provider';
    const isLicensee = user?.role === 'applicant';
    const canRenew = isLicensee && (selectedAuthorization.status === 'active' || selectedAuthorization.status === 'expired');
    const canTerminate = (isProvider || isLicensee) && selectedAuthorization.status === 'active';
    const canAddDelivery = isProvider && selectedAuthorization.status === 'active';
    const daysRemaining = getDaysRemaining(selectedAuthorization.endDate);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedAuthId(null);
            }}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-800">{selectedAuthorization.productName}</h1>
              <StatusBadge status={selectedAuthorization.status} />
            </div>
            <p className="text-neutral-500 mt-1">
              授权编号: {selectedAuthorization.id}
            </p>
          </div>
          <div className="flex gap-2">
            {canRenew && (
              <button
                onClick={() => setShowRenewModal(true)}
                className="btn btn-primary"
              >
                <RefreshCw className="w-4 h-4" />
                申请续期
              </button>
            )}
            {canAddDelivery && (
              <button
                onClick={() => setShowDeliveryModal(true)}
                className="btn btn-outline"
              >
                <Send className="w-4 h-4" />
                新增交付
              </button>
            )}
            {canTerminate && (
              <button
                onClick={() => setShowTerminateModal(true)}
                className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50"
              >
                <Ban className="w-4 h-4" />
                终止授权
              </button>
            )}
          </div>
        </div>

        <div className={cn(
          'flex items-center justify-between p-4 rounded-xl border',
          getStatusColor(selectedAuthorization.status)
        )}>
          <div className="flex items-center gap-4">
            {getStatusIcon(selectedAuthorization.status)}
            <div>
              <h3 className="font-semibold">
                {selectedAuthorization.status === 'active' && '授权有效'}
                {selectedAuthorization.status === 'renewing' && '续期审核中'}
                {selectedAuthorization.status === 'expired' && '授权已过期'}
                {selectedAuthorization.status === 'terminated' && '授权已终止'}
              </h3>
              <p className="text-sm opacity-75">
                授权期限: {selectedAuthorization.startDate} 至 {selectedAuthorization.endDate}
              </p>
            </div>
          </div>
          {selectedAuthorization.status === 'active' && (
            <div className="text-right">
              <p className="text-2xl font-bold">{daysRemaining}</p>
              <p className="text-sm opacity-75">天后到期</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-accent-950" />
                授权双方
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-500 mb-1">授权方</p>
                  <p className="font-semibold text-neutral-800">{selectedAuthorization.licensorName}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-500 mb-1">被授权方</p>
                  <p className="font-semibold text-neutral-800">{selectedAuthorization.licenseeName}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-950" />
                授权范围
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    数据范围
                  </h4>
                  <p className="text-green-700 text-sm">{selectedAuthorization.scope.dataRange}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    允许用途
                  </h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    {selectedAuthorization.scope.permittedPurposes.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    使用限制
                  </h4>
                  <ul className="text-orange-700 text-sm space-y-1">
                    {selectedAuthorization.scope.usageLimitations.map((l, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <XCircle className="w-3 h-3" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    数据安全
                  </h4>
                  <p className="text-purple-700 text-sm">{selectedAuthorization.scope.dataSecurity}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-950" />
                交付记录
              </h2>
              {selectedAuthorization.deliveryRecords.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>暂无交付记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedAuthorization.deliveryRecords.map((record, index) => (
                    <div
                      key={record.id}
                      className="flex gap-4 p-4 bg-neutral-50 rounded-lg"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-accent-950 text-white flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>
                        {index < selectedAuthorization.deliveryRecords.length - 1 && (
                          <div className="absolute top-10 left-1/2 w-0.5 h-full bg-neutral-200 -translate-x-1/2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-neutral-800">
                            {getMethodLabel(record.method)}
                          </span>
                          <span className="text-xs text-neutral-400">{record.deliveredAt}</span>
                        </div>
                        <p className="text-sm text-neutral-600 mb-1">{record.description}</p>
                        <p className="text-xs text-neutral-400">交付人: {record.deliveredBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">授权信息</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-500">开始日期</p>
                  <p className="font-medium text-neutral-800">{selectedAuthorization.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">结束日期</p>
                  <p className="font-medium text-neutral-800">{selectedAuthorization.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">授权期限</p>
                  <p className="font-medium text-neutral-800">
                    {Math.ceil((new Date(selectedAuthorization.endDate).getTime() - new Date(selectedAuthorization.startDate).getTime()) / (1000 * 60 * 60 * 24))} 天
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">交付次数</p>
                  <p className="font-medium text-neutral-800">{selectedAuthorization.deliveryRecords.length} 次</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">创建时间</p>
                  <p className="font-medium text-neutral-800">{selectedAuthorization.createdAt}</p>
                </div>
              </div>
            </div>

            {canRenew && (
              <div className="card bg-accent-50 border-accent-200">
                <h3 className="font-semibold text-accent-800 mb-2">需要续期？</h3>
                <p className="text-sm text-accent-700 mb-4">
                  {selectedAuthorization.status === 'active'
                    ? '您的授权即将到期，点击申请续期继续使用数据。'
                    : '您的授权已过期，可以申请续期重新获得使用权限。'}
                </p>
                <button
                  onClick={() => setShowRenewModal(true)}
                  className="btn btn-primary w-full"
                >
                  <RefreshCw className="w-4 h-4" />
                  申请续期
                </button>
              </div>
            )}
          </div>
        </div>

        {showRenewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-800">申请续期</h2>
                <p className="text-neutral-500 text-sm mt-1">选择续期时长，提交续期申请</p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  续期时长（天）
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[30, 90, 180, 365].map((days) => (
                    <button
                      key={days}
                      onClick={() => setRenewDuration(days)}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all',
                        renewDuration === days
                          ? 'border-accent-950 bg-accent-50 text-accent-800'
                          : 'border-neutral-200 hover:border-neutral-300'
                      )}
                    >
                      <p className="font-bold">{days}</p>
                      <p className="text-xs text-neutral-500">天</p>
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={renewDuration}
                  onChange={(e) => setRenewDuration(parseInt(e.target.value) || 0)}
                  min={1}
                  max={365}
                  placeholder="或自定义天数"
                  className="input w-full"
                />
              </div>
              <div className="p-6 border-t border-neutral-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowRenewModal(false)}
                  className="btn btn-outline"
                >
                  取消
                </button>
                <button
                  onClick={handleRenew}
                  disabled={renewDuration <= 0}
                  className="btn btn-primary"
                >
                  提交申请
                </button>
              </div>
            </div>
          </div>
        )}

        {showTerminateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-800">终止授权</h2>
                <p className="text-neutral-500 text-sm mt-1">请填写终止原因</p>
              </div>
              <div className="p-6">
                <textarea
                  value={terminateReason}
                  onChange={(e) => setTerminateReason(e.target.value)}
                  rows={4}
                  placeholder="请详细说明终止授权的原因..."
                  className="input w-full resize-none"
                />
              </div>
              <div className="p-6 border-t border-neutral-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowTerminateModal(false)}
                  className="btn btn-outline"
                >
                  取消
                </button>
                <button
                  onClick={handleTerminate}
                  disabled={!terminateReason.trim()}
                  className="btn bg-red-500 text-white hover:bg-red-600"
                >
                  确认终止
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeliveryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-800">新增交付记录</h2>
                <p className="text-neutral-500 text-sm mt-1">记录数据交付信息</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    交付方式
                  </label>
                  <select
                    value={deliveryRecord.method}
                    onChange={(e) => setDeliveryRecord({ ...deliveryRecord, method: e.target.value as any })}
                    className="input w-full"
                  >
                    <option value="api">API 接口</option>
                    <option value="download">文件下载</option>
                    <option value="sftp">SFTP 传输</option>
                    <option value="manual">人工交付</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    交付说明
                  </label>
                  <textarea
                    value={deliveryRecord.description}
                    onChange={(e) => setDeliveryRecord({ ...deliveryRecord, description: e.target.value })}
                    rows={3}
                    placeholder="请描述交付内容和访问方式..."
                    className="input w-full resize-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-neutral-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeliveryModal(false)}
                  className="btn btn-outline"
                >
                  取消
                </button>
                <button
                  onClick={handleAddDelivery}
                  disabled={!deliveryRecord.description.trim()}
                  className="btn btn-primary"
                >
                  确认交付
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
      {viewMode === 'detail' && renderDetail()}
    </div>
  );
}
