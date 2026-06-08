import type { Review } from '@/types';

function generateId() {
  return 'rev-' + Math.random().toString(36).substring(2, 11);
}

const productNames = [
  '全国居民消费行为分析数据集',
  '中小企业信用评估数据库',
  '电商用户画像标签体系',
  '金融市场风险分析模型',
  '城市交通流量实时数据',
];

const feedbacks = [
  '数据质量很高，字段完整，更新及时，对我们的推荐系统提升很大。API 接口响应速度快，技术支持也很到位。',
  '信用评估数据覆盖范围广，准确率高，有效提升了我们的风控模型效果。建议增加更多小微企业的数据。',
  '用户画像标签体系丰富，分类清晰，营销活动转化率提升了20%以上。希望能增加更多行为标签。',
  '风险分析模型专业可靠，压力测试表现良好。但文档可以更详细一些，特别是参数调优部分。',
  '实时交通数据延迟低，准确性好，对路线优化帮助很大。希望能覆盖更多二三线城市。',
];

const suggestions = [
  '希望能增加数据可视化展示功能，方便快速了解数据分布。',
  '建议提供更灵活的数据导出格式，支持自定义字段选择。',
  '希望能增加数据对比分析功能，方便不同时间段数据对比。',
  '建议提供 API 调用的 SDK，方便集成到现有系统中。',
  '希望能增加数据采样功能，可以先小范围测试效果。',
];

export const mockReviews: Review[] = [
  {
    id: generateId(),
    authorizationId: 'auth-001',
    productId: 'prod-001',
    productName: productNames[0],
    reviewerId: 'user-001',
    reviewerName: '张明',
    ratings: {
      dataQuality: 5,
      usability: 4,
      deliverySpeed: 5,
      customerService: 4,
      overall: 4.5,
    },
    feedback: feedbacks[0],
    suggestions: suggestions[0],
    createdAt: '2024-11-15 10:30',
  },
  {
    id: generateId(),
    authorizationId: 'auth-002',
    productId: 'prod-002',
    productName: productNames[1],
    reviewerId: 'user-005',
    reviewerName: '刘洋',
    ratings: {
      dataQuality: 5,
      usability: 5,
      deliverySpeed: 4,
      customerService: 5,
      overall: 4.8,
    },
    feedback: feedbacks[1],
    suggestions: suggestions[1],
    createdAt: '2024-11-10 14:20',
  },
  {
    id: generateId(),
    authorizationId: 'auth-003',
    productId: 'prod-003',
    productName: productNames[2],
    reviewerId: 'user-001',
    reviewerName: '张明',
    ratings: {
      dataQuality: 4,
      usability: 5,
      deliverySpeed: 5,
      customerService: 5,
      overall: 4.7,
    },
    feedback: feedbacks[2],
    suggestions: suggestions[2],
    createdAt: '2024-09-15 09:45',
  },
  {
    id: generateId(),
    authorizationId: 'auth-004',
    productId: 'prod-004',
    productName: productNames[3],
    reviewerId: 'user-005',
    reviewerName: '刘洋',
    ratings: {
      dataQuality: 4,
      usability: 3,
      deliverySpeed: 4,
      customerService: 4,
      overall: 3.8,
    },
    feedback: feedbacks[3],
    suggestions: suggestions[3],
    createdAt: '2024-08-20 16:30',
  },
  {
    id: generateId(),
    authorizationId: 'auth-005',
    productId: 'prod-005',
    productName: productNames[4],
    reviewerId: 'user-001',
    reviewerName: '张明',
    ratings: {
      dataQuality: 5,
      usability: 4,
      deliverySpeed: 5,
      customerService: 4,
      overall: 4.5,
    },
    feedback: feedbacks[4],
    suggestions: suggestions[4],
    createdAt: '2024-10-20 11:15',
  },
];

export const getReviewById = (id: string) => mockReviews.find((r) => r.id === id);

export const getReviewsByProduct = (productId: string) =>
  mockReviews.filter((r) => r.productId === productId);

export const getReviewsByUser = (userId: string) =>
  mockReviews.filter((r) => r.reviewerId === userId);
