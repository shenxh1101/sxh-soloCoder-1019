import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  Calendar,
  User,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  CreditCard,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import StatusBadge from '@/components/UI/StatusBadge';
import { useTransactionStore } from '@/store/transactionStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types';

type ViewMode = 'list' | 'detail';

export default function TransactionRecords() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<string>('all');

  const { user } = useAuthStore();
  const { transactions, loading, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    if (user) {
      fetchTransactions(user.id, user.role);
    }
  }, [user, fetchTransactions]);

  const isDateInRange = (dateStr: string, range: string): boolean => {
    const today = new Date('2026-06-08');
    const transDate = new Date(dateStr.split(' ')[0]);

    if (range === 'all') return true;

    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    switch (range) {
      case 'today':
        return transDate >= startOfToday;
      case 'week':
        return transDate >= startOfWeek;
      case 'month':
        return transDate >= startOfMonth;
      case 'quarter':
        return transDate >= startOfQuarter;
      case 'year':
        return transDate >= startOfYear;
      default:
        return true;
    }
  };

  const filteredTransactions = transactions.filter((trans) => {
    const matchesStatus = statusFilter === 'all' || trans.status === statusFilter;
    const matchesSearch = trans.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = isDateInRange(trans.createdAt, dateRange);
    return matchesStatus && matchesSearch && matchesDate;
  });

  const totalAmount = filteredTransactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCount = filteredTransactions.filter((t) => t.status === 'completed').length;

  const getMonthIncome = () => {
    return filteredTransactions
      .filter((t) => t.status === 'completed' && (user?.role === 'provider' || user?.role === 'admin'))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthExpense = () => {
    return filteredTransactions
      .filter((t) => t.status === 'completed' && user?.role === 'applicant')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getRoleBasedLabel = (trans: Transaction) => {
    if (user?.role === 'provider') {
      return {
        party: `买方: ${trans.buyerName}`,
        amountLabel: '收入',
        amountClass: 'text-green-600',
        amountPrefix: '+',
      };
    }
    return {
      party: `卖方: ${trans.sellerName}`,
      amountLabel: '支出',
      amountClass: 'text-red-600',
      amountPrefix: '-',
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'refunded':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderList = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">交易记录</h1>
        <p className="text-neutral-500 mt-1">查看和管理您的交易记录</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">交易总额</span>
            <div className="w-10 h-10 rounded-lg bg-accent-100 text-accent-950 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-800 mt-2">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">交易笔数</span>
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-800 mt-2">{totalCount}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">本期收入</span>
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-800 mt-2">
            {formatCurrency(getMonthIncome())}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {dateRange === 'all' ? '全部时间' :
             dateRange === 'today' ? '今日' :
             dateRange === 'week' ? '本周' :
             dateRange === 'month' ? '本月' :
             dateRange === 'quarter' ? '本季度' : '本年'}
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">本期支出</span>
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-800 mt-2">
            {formatCurrency(getMonthExpense())}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {dateRange === 'all' ? '全部时间' :
             dateRange === 'today' ? '今日' :
             dateRange === 'week' ? '本周' :
             dateRange === 'month' ? '本月' :
             dateRange === 'quarter' ? '本季度' : '本年'}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索交易..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-neutral-400 hidden sm:block mt-3" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input"
            >
              <option value="all">全部时间</option>
              <option value="today">今天</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
              <option value="year">本年</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">全部状态</option>
              <option value="completed">已完成</option>
              <option value="pending">待支付</option>
              <option value="refunded">已退款</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-950" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">暂无交易记录</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">产品名称</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500 hidden md:table-cell">交易方</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500 hidden sm:table-cell">金额</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500 hidden lg:table-cell">期限</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">状态</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500 hidden md:table-cell">时间</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((trans) => {
                  const roleInfo = getRoleBasedLabel(trans);
                  return (
                    <tr
                      key={trans.id}
                      className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-950 to-accent-950 flex items-center justify-center text-white font-semibold">
                            {trans.productName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-800 line-clamp-1">{trans.productName}</p>
                            <p className="text-xs text-neutral-400">{trans.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <p className="text-sm text-neutral-600">{roleInfo.party}</p>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <p className={cn('font-semibold', roleInfo.amountClass)}>
                          {roleInfo.amountPrefix}
                          {formatCurrency(trans.amount)}
                        </p>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <p className="text-sm text-neutral-600">{trans.duration} 天</p>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={trans.status} />
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <p className="text-sm text-neutral-500">{trans.createdAt}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedTransaction(trans);
                            setViewMode('detail');
                          }}
                          className="text-sm text-primary-950 hover:text-accent-950 transition-colors"
                        >
                          详情
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selectedTransaction) return null;

    const roleInfo = getRoleBasedLabel(selectedTransaction);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedTransaction(null);
            }}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">交易详情</h1>
            <p className="text-neutral-500 mt-1">交易编号: {selectedTransaction.id}</p>
          </div>
        </div>

        <div className={cn(
          'flex items-center justify-between p-6 rounded-xl border',
          getStatusColor(selectedTransaction.status)
        )}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/50 flex items-center justify-center">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {selectedTransaction.status === 'completed' && '交易成功'}
                {selectedTransaction.status === 'refunded' && '已退款'}
                {selectedTransaction.status === 'pending' && '待支付'}
              </h3>
              <p className="text-sm opacity-75">
                {roleInfo.amountLabel}: {roleInfo.amountPrefix}{formatCurrency(selectedTransaction.amount)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {roleInfo.amountPrefix}{formatCurrency(selectedTransaction.amount)}
            </p>
            <p className="text-sm opacity-75">{selectedTransaction.createdAt}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">商品信息</h2>
              <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-950 to-accent-950 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {selectedTransaction.productName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-800">{selectedTransaction.productName}</h3>
                  <p className="text-sm text-neutral-500 mt-1">产品编号: {selectedTransaction.productId}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Calendar className="w-4 h-4" />
                      使用期限: {selectedTransaction.duration} 天
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-neutral-800">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">交易双方</h2>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-950 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                    {selectedTransaction.sellerName.charAt(0)}
                  </div>
                  <p className="font-semibold text-neutral-800">{selectedTransaction.sellerName}</p>
                  <p className="text-sm text-neutral-500">卖方</p>
                </div>
                <ArrowRight className="w-8 h-8 text-neutral-300" />
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent-100 text-accent-950 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                    {selectedTransaction.buyerName.charAt(0)}
                  </div>
                  <p className="font-semibold text-neutral-800">{selectedTransaction.buyerName}</p>
                  <p className="text-sm text-neutral-500">买方</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">交易信息</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">交易编号</span>
                  <span className="text-sm font-medium text-neutral-800">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">交易时间</span>
                  <span className="text-sm font-medium text-neutral-800">{selectedTransaction.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">交易状态</span>
                  <StatusBadge status={selectedTransaction.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">授权编号</span>
                  <span className="text-sm font-medium text-neutral-800">{selectedTransaction.authorizationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">支付方式</span>
                  <span className="text-sm font-medium text-neutral-800">在线支付</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">费用明细</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">商品金额</span>
                  <span className="text-sm font-medium text-neutral-800">{formatCurrency(selectedTransaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">平台服务费</span>
                  <span className="text-sm font-medium text-neutral-800">{formatCurrency(selectedTransaction.amount * 0.02)}</span>
                </div>
                <div className="border-t border-neutral-100 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-800">合计</span>
                    <span className="text-xl font-bold text-neutral-800">
                      {formatCurrency(selectedTransaction.amount + selectedTransaction.amount * 0.02)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn btn-outline w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              下载凭证
            </button>
          </div>
        </div>
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
