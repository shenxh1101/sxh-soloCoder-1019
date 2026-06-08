import type { Authorization } from '@/types';

function generateId() {
  return 'auth-' + Math.random().toString(36).substring(2, 11);
}

const productNames = [
  '全国居民消费行为分析数据集',
  '中小企业信用评估数据库',
  '电商用户画像标签体系',
  '金融市场风险分析模型',
];

const statuses: Authorization['status'][] = ['active', 'expired', 'terminated', 'renewing'];

export const mockAuthorizations: Authorization[] = [
  {
    id: generateId(),
    applicationId: 'app-001',
    productId: 'prod-001',
    productName: productNames[0],
    licenseeId: 'user-001',
    licenseeName: '张明',
    licensorId: 'user-002',
    licensorName: '李华',
    scope: {
      dataRange: '2023-2024年全国居民消费行为数据，不含个人身份信息',
      usageLimitations: ['仅用于内部研发', '不得二次分发', '不得用于非法目的'],
      permittedPurposes: ['产品推荐算法训练', '用户行为分析研究', '内部业务优化'],
      dataSecurity: '需遵守数据安全协议，定期进行安全审计',
    },
    startDate: '2024-10-20',
    endDate: '2025-01-18',
    status: 'active',
    deliveryRecords: [
      {
        id: 'del-001',
        method: 'api',
        deliveredAt: '2024-10-20 14:30',
        deliveredBy: '李华',
        description: 'API 接口已开通，已发送访问密钥至您的注册邮箱',
      },
      {
        id: 'del-002',
        method: 'download',
        deliveredAt: '2024-10-20 15:00',
        deliveredBy: '李华',
        description: '历史数据集已上传至下载中心，可登录后下载',
      },
    ],
    createdAt: '2024-10-18 14:00',
  },
  {
    id: generateId(),
    applicationId: 'app-002',
    productId: 'prod-002',
    productName: productNames[1],
    licenseeId: 'user-005',
    licenseeName: '刘洋',
    licensorId: 'user-004',
    licensorName: '陈伟',
    scope: {
      dataRange: '2023-2024年长三角地区中小企业信用数据',
      usageLimitations: ['仅限信贷审批使用', '不得对外披露', '数据保留期限不超过授权期'],
      permittedPurposes: ['信贷风险评估', '授信额度测算', '贷后风险监控'],
      dataSecurity: '符合金融行业数据安全标准，需通过等保三级认证',
    },
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    status: 'renewing',
    deliveryRecords: [
      {
        id: 'del-003',
        method: 'sftp',
        deliveredAt: '2024-09-01 10:00',
        deliveredBy: '陈伟',
        description: 'SFTP 访问权限已开通，初始数据已同步',
      },
      {
        id: 'del-004',
        method: 'api',
        deliveredAt: '2024-09-02 09:00',
        deliveredBy: '陈伟',
        description: '实时查询接口已开通，支持单笔和批量查询',
      },
    ],
    createdAt: '2024-08-28 10:00',
  },
  {
    id: generateId(),
    applicationId: 'app-003',
    productId: 'prod-003',
    productName: productNames[2],
    licenseeId: 'user-001',
    licenseeName: '张明',
    licensorId: 'user-002',
    licensorName: '李华',
    scope: {
      dataRange: '电商平台用户画像标签体系，共5大类200+标签',
      usageLimitations: ['仅限内部营销使用', '不得用于用户歧视性定价'],
      permittedPurposes: ['用户分层运营', '精准营销投放', '流失用户召回'],
      dataSecurity: '需建立用户标签管理规范，定期进行合规审查',
    },
    startDate: '2024-06-01',
    endDate: '2024-08-30',
    status: 'expired',
    deliveryRecords: [
      {
        id: 'del-005',
        method: 'download',
        deliveredAt: '2024-06-01 14:00',
        deliveredBy: '李华',
        description: '全量用户标签数据已提供下载',
      },
      {
        id: 'del-006',
        method: 'download',
        deliveredAt: '2024-07-01 10:00',
        deliveredBy: '李华',
        description: '月度更新数据已发布',
      },
      {
        id: 'del-007',
        method: 'download',
        deliveredAt: '2024-08-01 10:00',
        deliveredBy: '李华',
        description: '月度更新数据已发布',
      },
    ],
    createdAt: '2024-05-28 14:00',
  },
  {
    id: generateId(),
    applicationId: 'app-004',
    productId: 'prod-004',
    productName: productNames[3],
    licenseeId: 'user-005',
    licenseeName: '刘洋',
    licensorId: 'user-004',
    licensorName: '陈伟',
    scope: {
      dataRange: '金融市场风险分析模型及训练数据',
      usageLimitations: ['仅限内部风险管控使用', '模型输出结果不得作为唯一决策依据'],
      permittedPurposes: ['市场风险预警', '投资组合优化', '风险压力测试'],
      dataSecurity: '模型使用需记录审计日志，定期进行模型有效性验证',
    },
    startDate: '2024-07-15',
    endDate: '2025-07-14',
    status: 'terminated',
    deliveryRecords: [
      {
        id: 'del-008',
        method: 'manual',
        deliveredAt: '2024-07-15 14:00',
        deliveredBy: '陈伟',
        description: '模型文件及训练数据已通过加密传输方式交付',
      },
    ],
    createdAt: '2024-07-10 14:00',
  },
];

export const getAuthorizationById = (id: string) => mockAuthorizations.find((a) => a.id === id);

export const getAuthorizationsByUser = (userId: string, role: string) => {
  if (role === 'provider') {
    return mockAuthorizations.filter((a) => a.licensorId === userId);
  }
  return mockAuthorizations.filter((a) => a.licenseeId === userId);
};
