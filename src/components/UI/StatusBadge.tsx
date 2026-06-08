import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: '待审核', className: 'badge-warning' },
  reviewing: { label: '审核中', className: 'badge-info' },
  communicating: { label: '沟通中', className: 'badge-primary' },
  approved: { label: '已通过', className: 'badge-success' },
  rejected: { label: '已拒绝', className: 'badge-error' },
  active: { label: '使用中', className: 'badge-success' },
  expired: { label: '已过期', className: 'badge-warning' },
  terminated: { label: '已终止', className: 'badge-error' },
  renewing: { label: '续期中', className: 'badge-primary' },
  completed: { label: '已完成', className: 'badge-success' },
  refunded: { label: '已退款', className: 'badge-error' },
  draft: { label: '草稿', className: 'badge-info' },
  published: { label: '已上架', className: 'badge-success' },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'badge-info' };

  return (
    <span className={cn(config.className, className)}>
      {config.label}
    </span>
  );
}
