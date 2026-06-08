import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronLeft,
  CheckCircle,
  XCircle,
  FileText,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Eye,
  Clock,
  Star,
  Calendar,
  Building,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import StatusBadge from '@/components/UI/StatusBadge';
import { useAdminStore } from '@/store/adminStore';
import { useProductStore } from '@/store/productStore';
import { cn } from '@/lib/utils';
import type { DataProduct } from '@/types';

type TabType = 'statistics' | 'review';
type ViewMode = 'list' | 'detail';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('statistics');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedProduct, setSelectedProduct] = useState<DataProduct | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { statistics, pendingProducts, loading, fetchStatistics, fetchPendingProducts, reviewProduct } = useAdminStore();
  const { products } = useProductStore();

  useEffect(() => {
    if (location.pathname.includes('/review')) {
      setActiveTab('review');
    } else if (location.pathname.includes('/statistics')) {
      setActiveTab('statistics');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setViewMode('list');
    navigate(`/admin/${tab === 'review' ? 'review' : 'statistics'}`);
  };

  useEffect(() => {
    fetchStatistics();
    fetchPendingProducts();
  }, [fetchStatistics, fetchPendingProducts]);

  const filteredPendingProducts = pendingProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    if (amount >= 10000) {
      return `¥${(amount / 10000).toFixed(1)}万`;
    }
    return `¥${amount.toLocaleString()}`;
  };

  const COLORS = ['#0F3460', '#16C79A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

  const handleApprove = (product: DataProduct) => {
    reviewProduct(product.id, 'published');
    setViewMode('list');
    setSelectedProduct(null);
  };

  const handleReject = () => {
    if (!selectedProduct || !rejectReason.trim()) return;
    reviewProduct(selectedProduct.id, 'rejected', rejectReason.trim());
    setShowRejectModal(false);
    setRejectReason('');
    setViewMode('list');
    setSelectedProduct(null);
  };

  const renderStatisticsTab = () => {
    if (!statistics) return null;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">运营统计</h1>
          <p className="text-neutral-500 mt-1">平台运营数据概览和分析</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">上架产品</span>
              <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-950 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-800 mt-2">{statistics.totalProducts}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              12.5% 较上月
            </p>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">交易笔数</span>
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-800 mt-2">{statistics.totalTransactions}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              8.3% 较上月
            </p>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">交易总额</span>
              <div className="w-10 h-10 rounded-lg bg-accent-100 text-accent-950 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-800 mt-2">{formatCurrency(statistics.totalAmount)}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              15.2% 较上月
            </p>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">注册用户</span>
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-800 mt-2">{statistics.totalUsers}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              6.8% 较上月
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent-950" />
              交易趋势
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={statistics.monthlyTrend}>
                  <defs>
                    <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F3460" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0F3460" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16C79A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16C79A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="transactions"
                    stroke="#0F3460"
                    fill="url(#colorTransactions)"
                    strokeWidth={2}
                    name="交易笔数"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="amount"
                    stroke="#16C79A"
                    fill="url(#colorAmount)"
                    strokeWidth={2}
                    name="交易金额"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-accent-950" />
              品类分布
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statistics.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statistics.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statistics.categoryDistribution.map((item, index) => (
                <div key={item.category} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-neutral-600 truncate">{item.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-950" />
              热销产品 TOP5
            </h2>
            <div className="space-y-3">
              {statistics.topProducts.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg"
                >
                  <span className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white',
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-neutral-400' :
                    index === 2 ? 'bg-orange-500' : 'bg-neutral-300'
                  )}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-800 truncate">{product.productName}</p>
                    <p className="text-xs text-neutral-500">成交 {product.count} 次</p>
                  </div>
                  <div className="w-24 bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-950 to-accent-950 h-2 rounded-full"
                      style={{ width: `${(product.count / statistics.topProducts[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent-950" />
              地区分布
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.regionDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis
                    type="category"
                    dataKey="region"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" name="数量" radius={[0, 4, 4, 0]}>
                    {statistics.regionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewList = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">上架审核</h1>
          <p className="text-neutral-500 mt-1">审核数据产品上架申请</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">待审核:</span>
          <span className="text-lg font-bold text-primary-950">
            {pendingProducts.filter(p => p.status === 'pending').length}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索产品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-neutral-400 hidden sm:block mt-3" />
            <select className="input">
              <option value="all">全部状态</option>
              <option value="pending">待审核</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-950" />
          </div>
        ) : filteredPendingProducts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <p className="text-neutral-500">暂无待审核产品</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPendingProducts.map((product) => (
              <div
                key={product.id}
                className="card p-4 hover:shadow-lg transition-all border border-neutral-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="w-full lg:w-48 h-32 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.coverImage && (
                      <img
                        src={product.coverImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-neutral-800">{product.name}</h3>
                          <StatusBadge status={product.status} />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {product.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Eye className="w-4 h-4" />
                        {product.viewCount}
                        <Star className="w-4 h-4 ml-2" />
                        {product.qualityScore.overall}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {product.provider.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {product.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {product.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {product.region}
                      </span>
                    </div>
                    {product.rejectReason && (
                      <div className="mb-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-600">
                          <span className="font-medium">上次拒绝原因:</span> {product.rejectReason}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setViewMode('detail');
                        }}
                        className="btn btn-outline text-sm"
                      >
                        查看详情
                      </button>
                      {product.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(product)}
                            className="btn btn-primary text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            通过
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowRejectModal(true);
                            }}
                            className="btn bg-red-500 text-white hover:bg-red-600 text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            拒绝
                          </button>
                        </>
                      )}
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

  const renderReviewDetail = () => {
    if (!selectedProduct) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedProduct(null);
            }}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-800">{selectedProduct.name}</h1>
              <StatusBadge status={selectedProduct.status} />
            </div>
            <p className="text-neutral-500 mt-1">产品编号: {selectedProduct.id}</p>
          </div>
          {selectedProduct.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(selectedProduct)}
                className="btn btn-primary"
              >
                <CheckCircle className="w-4 h-4" />
                通过上架
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="btn bg-red-500 text-white hover:bg-red-600"
              >
                <XCircle className="w-4 h-4" />
                拒绝
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="w-full h-64 bg-neutral-100 rounded-xl overflow-hidden mb-6">
                {selectedProduct.coverImage && (
                  <img
                    src={selectedProduct.coverImage}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">产品介绍</h2>
              <p className="text-neutral-600 leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">数据样例</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50">
                      {selectedProduct.sampleData.fields.map((field) => (
                        <th key={field.name} className="text-left py-3 px-4 font-medium text-neutral-700">
                          {field.name}
                          <span className="block text-xs text-neutral-400 font-normal">{field.type}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.sampleData.rows.slice(0, 3).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-neutral-50">
                        {selectedProduct.sampleData.fields.map((field) => (
                          <td key={field.name} className="py-3 px-4 text-neutral-600">
                            {row[field.name]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">质量评分</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{selectedProduct.qualityScore.completeness}</p>
                  <p className="text-sm text-green-700 mt-1">完整性</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{selectedProduct.qualityScore.accuracy}</p>
                  <p className="text-sm text-blue-700 mt-1">准确性</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{selectedProduct.qualityScore.timeliness}</p>
                  <p className="text-sm text-purple-700 mt-1">时效性</p>
                </div>
                <div className="text-center p-4 bg-accent-50 rounded-lg">
                  <p className="text-3xl font-bold text-accent-950">{selectedProduct.qualityScore.overall}</p>
                  <p className="text-sm text-accent-800 mt-1">综合评分</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-800 mb-2">质量检测报告</h4>
                <p className="text-sm text-neutral-600">{selectedProduct.qualityScore.report}</p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">规格定价</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedProduct.pricing.map((tier) => (
                  <div key={tier.id} className="border border-neutral-200 rounded-xl p-4">
                    <h4 className="font-semibold text-neutral-800">{tier.name}</h4>
                    <p className="text-3xl font-bold text-accent-950 mt-2">¥{tier.price}</p>
                    <p className="text-sm text-neutral-500">{tier.duration}天</p>
                    <p className="text-xs text-neutral-500 mt-2">{tier.description}</p>
                    <ul className="mt-3 space-y-1">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="text-xs text-neutral-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">提供商信息</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-950 to-accent-950 flex items-center justify-center text-white text-xl font-bold">
                  {selectedProduct.provider.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">{selectedProduct.provider.name}</p>
                  <p className="text-sm text-neutral-500">ID: {selectedProduct.provider.id}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">产品信息</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">分类</span>
                  <span className="text-sm font-medium text-neutral-800">{selectedProduct.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">行业</span>
                  <span className="text-sm font-medium text-neutral-800">{selectedProduct.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">地区</span>
                  <span className="text-sm font-medium text-neutral-800">{selectedProduct.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">更新频率</span>
                  <span className="text-sm font-medium text-neutral-800">
                    {selectedProduct.updateFrequency === 'daily' ? '每日' :
                     selectedProduct.updateFrequency === 'weekly' ? '每周' :
                     selectedProduct.updateFrequency === 'monthly' ? '每月' :
                     selectedProduct.updateFrequency === 'quarterly' ? '每季度' : '每年'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">浏览量</span>
                  <span className="text-sm font-medium text-neutral-800">{selectedProduct.viewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">收藏数</span>
                  <span className="text-sm font-medium text-neutral-800">{selectedProduct.favoriteCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">创建时间</span>
                  <span className="text-sm font-medium text-neutral-800">{selectedProduct.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">标签</h2>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.tags.map((tag, i) => (
                  <span key={i} className="text-sm px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-800">拒绝上架</h2>
                <p className="text-neutral-500 text-sm mt-1">请填写拒绝原因</p>
              </div>
              <div className="p-6">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  placeholder="请详细说明拒绝上架的原因..."
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
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleTabChange('statistics')}
          className={cn(
            'px-6 py-2.5 rounded-lg font-medium transition-all',
            activeTab === 'statistics'
              ? 'bg-primary-950 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          )}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          成交统计
        </button>
        <button
          onClick={() => handleTabChange('review')}
          className={cn(
            'px-6 py-2.5 rounded-lg font-medium transition-all',
            activeTab === 'review'
              ? 'bg-primary-950 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          )}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          上架审核
          {pendingProducts.filter(p => p.status === 'pending').length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {pendingProducts.filter(p => p.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'statistics' && renderStatisticsTab()}
      {activeTab === 'review' && viewMode === 'list' && renderReviewList()}
      {activeTab === 'review' && viewMode === 'detail' && renderReviewDetail()}
    </div>
  );
}
