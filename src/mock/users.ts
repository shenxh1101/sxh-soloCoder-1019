import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: '张明',
    email: 'zhangming@example.com',
    role: 'applicant',
    company: '科技创新有限公司',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    phone: '13800138001',
  },
  {
    id: 'user-002',
    name: '李华',
    email: 'lihua@example.com',
    role: 'provider',
    company: '数据服务股份有限公司',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    phone: '13800138002',
  },
  {
    id: 'user-003',
    name: '王芳',
    email: 'wangfang@example.com',
    role: 'admin',
    company: '数据要素流通平台',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    phone: '13800138003',
  },
  {
    id: 'user-004',
    name: '陈伟',
    email: 'chenwei@example.com',
    role: 'provider',
    company: '智能数据科技公司',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen',
    phone: '13800138004',
  },
  {
    id: 'user-005',
    name: '刘洋',
    email: 'liuyang@example.com',
    role: 'applicant',
    company: '金融科技集团',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liu',
    phone: '13800138005',
  },
];

export const currentUser: User = mockUsers[0];
