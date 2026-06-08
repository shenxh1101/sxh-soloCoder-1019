import type { Application } from '@/types';

function generateId() {
  return 'app-' + Math.random().toString(36).substring(2, 11);
}

const productNames = [
  '全国居民消费行为分析数据集',
  '中小企业信用评估数据库',
  '城市交通流量实时数据',
  '医疗健康记录匿名化数据集',
  '电商用户画像标签体系',
];

const steps = [
  { id: 1, name: '提交申请' },
  { id: 2, name: '资质审核' },
  { id: 3, name: '沟通确认' },
  { id: 4, name: '授权确认' },
  { id: 5, name: '数据交付' },
];

const statuses: Application['status'][] = ['pending', 'reviewing', 'communicating', 'approved', 'rejected'];

export const mockApplications: Application[] = [
  {
    id: generateId(),
    productId: 'prod-001',
    productName: productNames[0],
    applicantId: 'user-001',
    applicantName: '张明',
    providerId: 'user-002',
    purpose: '用于客户消费行为分析，优化产品推荐算法',
    scenario: '电商平台个性化推荐系统开发',
    duration: 90,
    dataScale: '100万条记录',
    supplementaryMaterials: [
      {
        id: 'mat-001',
        name: '企业营业执照.pdf',
        url: '#',
        uploadedBy: 'user-001',
        uploadedAt: '2024-10-15 10:30',
      },
      {
        id: 'mat-002',
        name: '数据使用方案.docx',
        url: '#',
        uploadedBy: 'user-001',
        uploadedAt: '2024-10-15 10:35',
      },
    ],
    status: 'approved',
    currentStep: 5,
    steps: steps.map((s, i) => ({
      ...s,
      status: i < 5 ? 'completed' : 'pending',
      completedAt: `2024-10-${15 + i} 14:${30 + i * 5}`,
    })),
    messages: [
      {
        id: 'msg-001',
        senderId: 'user-001',
        senderName: '张明',
        senderRole: 'applicant',
        content: '您好，我们希望申请使用贵方的消费行为数据集，用于产品推荐算法的训练。',
        createdAt: '2024-10-15 10:30',
      },
      {
        id: 'msg-002',
        senderId: 'user-002',
        senderName: '李华',
        senderRole: 'provider',
        content: '您好，已收到您的申请。请补充说明数据的具体使用场景和数据量级需求。',
        createdAt: '2024-10-15 14:20',
      },
      {
        id: 'msg-003',
        senderId: 'user-001',
        senderName: '张明',
        senderRole: 'applicant',
        content: '好的，已上传补充材料。我们主要用于电商平台的个性化推荐系统开发，预计需要100万条左右的用户消费行为记录。',
        createdAt: '2024-10-15 16:45',
        attachments: [
          {
            id: 'mat-003',
            name: '数据使用场景说明.pdf',
            url: '#',
            uploadedBy: 'user-001',
            uploadedAt: '2024-10-15 16:45',
          },
        ],
      },
      {
        id: 'msg-004',
        senderId: 'user-002',
        senderName: '李华',
        senderRole: 'provider',
        content: '材料已收到并审核通过。我们将为您开通专业版授权，有效期90天。请确认授权范围。',
        createdAt: '2024-10-16 09:30',
      },
    ],
    authorizationScope: {
      dataRange: '2023-2024年全国居民消费行为数据，不含个人身份信息',
      usageLimitations: ['仅用于内部研发', '不得二次分发', '不得用于非法目的'],
      permittedPurposes: ['产品推荐算法训练', '用户行为分析研究', '内部业务优化'],
      dataSecurity: '需遵守数据安全协议，定期进行安全审计',
    },
    createdAt: '2024-10-15 10:30',
    updatedAt: '2024-10-18 14:00',
    selectedPricingTier: 'tier-2',
  },
  {
    id: generateId(),
    productId: 'prod-002',
    productName: productNames[1],
    applicantId: 'user-001',
    applicantName: '张明',
    providerId: 'user-004',
    purpose: '用于中小企业信贷风险评估模型训练',
    scenario: '金融科技公司信贷审批系统',
    duration: 180,
    dataScale: '50万条企业信用记录',
    supplementaryMaterials: [
      {
        id: 'mat-004',
        name: '金融许可证.pdf',
        url: '#',
        uploadedBy: 'user-001',
        uploadedAt: '2024-10-20 11:00',
      },
    ],
    status: 'communicating',
    currentStep: 3,
    steps: steps.map((s, i) => ({
      ...s,
      status: i < 2 ? 'completed' : i === 2 ? 'current' : 'pending',
      completedAt: i < 2 ? `2024-10-${20 + i} 10:00` : undefined,
    })),
    messages: [
      {
        id: 'msg-005',
        senderId: 'user-001',
        senderName: '张明',
        senderRole: 'applicant',
        content: '您好，我们公司是金融科技公司，需要信用评估数据用于信贷审批模型训练。',
        createdAt: '2024-10-20 11:00',
      },
      {
        id: 'msg-006',
        senderId: 'user-004',
        senderName: '陈伟',
        senderRole: 'provider',
        content: '您好，请问您需要的数据时间范围和地理范围是怎样的？另外请提供数据安全保障措施说明。',
        createdAt: '2024-10-20 15:30',
      },
    ],
    createdAt: '2024-10-20 11:00',
    updatedAt: '2024-10-20 15:30',
    selectedPricingTier: 'tier-3',
  },
  {
    id: generateId(),
    productId: 'prod-003',
    productName: productNames[2],
    applicantId: 'user-005',
    applicantName: '刘洋',
    providerId: 'user-002',
    purpose: '城市交通拥堵分析和路线优化',
    scenario: '智能交通管理系统',
    duration: 365,
    dataScale: '实时数据流',
    supplementaryMaterials: [],
    status: 'reviewing',
    currentStep: 2,
    steps: steps.map((s, i) => ({
      ...s,
      status: i < 1 ? 'completed' : i === 1 ? 'current' : 'pending',
      completedAt: i < 1 ? `2024-10-22 09:00` : undefined,
    })),
    messages: [
      {
        id: 'msg-007',
        senderId: 'user-005',
        senderName: '刘洋',
        senderRole: 'applicant',
        content: '您好，我们是交通管理部门，需要实时交通流量数据用于城市交通优化。',
        createdAt: '2024-10-22 09:00',
      },
    ],
    createdAt: '2024-10-22 09:00',
    updatedAt: '2024-10-22 09:00',
    selectedPricingTier: 'tier-2',
  },
  {
    id: generateId(),
    productId: 'prod-004',
    productName: productNames[3],
    applicantId: 'user-001',
    applicantName: '张明',
    providerId: 'user-004',
    purpose: '医疗健康趋势分析和预测模型',
    scenario: '医疗健康大数据分析平台',
    duration: 30,
    dataScale: '10万条匿名化健康记录',
    supplementaryMaterials: [
      {
        id: 'mat-005',
        name: '伦理审查批准书.pdf',
        url: '#',
        uploadedBy: 'user-001',
        uploadedAt: '2024-10-18 14:00',
      },
    ],
    status: 'rejected',
    currentStep: 2,
    steps: steps.map((s, i) => ({
      ...s,
      status: i < 2 ? 'completed' : 'pending',
      completedAt: i < 2 ? `2024-10-${18 + i} 14:00` : undefined,
    })),
    messages: [
      {
        id: 'msg-008',
        senderId: 'user-001',
        senderName: '张明',
        senderRole: 'applicant',
        content: '您好，我们需要医疗健康数据用于公共健康趋势分析研究。',
        createdAt: '2024-10-18 14:00',
      },
    ],
    rejectReason: '申请材料不完整，请补充数据脱敏处理方案和隐私保护措施说明。医疗数据敏感度较高，需要更详细的使用说明。',
    createdAt: '2024-10-18 14:00',
    updatedAt: '2024-10-19 16:30',
    selectedPricingTier: 'tier-1',
  },
  {
    id: generateId(),
    productId: 'prod-005',
    productName: productNames[4],
    applicantId: 'user-005',
    applicantName: '刘洋',
    providerId: 'user-002',
    purpose: '用户分层运营和精准营销',
    scenario: '零售电商用户运营系统',
    duration: 90,
    dataScale: '200万条用户画像标签',
    supplementaryMaterials: [],
    status: 'pending',
    currentStep: 1,
    steps: steps.map((s, i) => ({
      ...s,
      status: i < 1 ? 'completed' : i === 0 ? 'current' : 'pending',
      completedAt: undefined,
    })),
    messages: [],
    createdAt: '2024-10-25 10:00',
    updatedAt: '2024-10-25 10:00',
    selectedPricingTier: 'tier-2',
  },
];

export const getApplicationById = (id: string) => mockApplications.find((a) => a.id === id);

export const getApplicationsByUser = (userId: string, role: string) => {
  if (role === 'provider') {
    return mockApplications.filter((a) => a.providerId === userId);
  }
  return mockApplications.filter((a) => a.applicantId === userId);
};
