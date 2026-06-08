import type { DataProduct } from '@/types';

const industries = ['金融', '医疗健康', '零售电商', '交通物流', '教育', '能源', '制造业', '农业', '政务', '文化娱乐'];
const regions = ['华东', '华北', '华南', '华中', '西南', '西北', '东北', '全国'];
const frequencies = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] as const;
const categories = ['基础数据集', '分析数据集', 'API 服务', '数据报告', '模型数据集'];
const tags = [
  '用户画像', '消费行为', '地理位置', '信用评估', '医疗记录',
  '供应链', '气象数据', '交通流量', '教育评估', '能源消耗',
  '市场分析', '风险控制', '客户洞察', '运营优化', '智能推荐'
];

function generateId() {
  return 'prod-' + Math.random().toString(36).substring(2, 11);
}

function generateSampleData() {
  const fieldTypes = ['string', 'number', 'date', 'boolean', 'integer'];
  const fieldNames = ['id', 'name', 'value', 'date', 'status', 'region', 'category', 'amount', 'count', 'score'];
  
  const fields = fieldNames.slice(0, 5).map((name, i) => ({
    name,
    type: fieldTypes[i % fieldTypes.length],
    description: `${name}字段的详细描述信息`,
  }));

  const rows = Array.from({ length: 5 }, (_, i) => {
    const row: Record<string, any> = {};
    fields.forEach((field) => {
      switch (field.type) {
        case 'string':
          row[field.name] = `示例数据 ${i + 1}`;
          break;
        case 'number':
        case 'integer':
          row[field.name] = Math.floor(Math.random() * 10000);
          break;
        case 'date':
          row[field.name] = `2024-0${Math.floor(Math.random() * 9) + 1}-0${Math.floor(Math.random() * 9) + 1}`;
          break;
        case 'boolean':
          row[field.name] = Math.random() > 0.5;
          break;
        default:
          row[field.name] = '-';
      }
    });
    return row;
  });

  return { fields, rows };
}

function generateQualityScore() {
  const completeness = Math.floor(Math.random() * 15) + 85;
  const accuracy = Math.floor(Math.random() * 15) + 85;
  const timeliness = Math.floor(Math.random() * 15) + 85;
  return {
    completeness,
    accuracy,
    timeliness,
    overall: Math.round((completeness + accuracy + timeliness) / 3),
    report: '本数据集经过严格的质量校验，数据来源可靠，更新及时。完整性指标反映数据记录的完整程度，准确性指标反映数据值的正确程度，时效性指标反映数据更新的及时程度。',
  };
}

function generatePricing() {
  return [
    {
      id: 'tier-1',
      name: '基础版',
      duration: 30,
      price: 999,
      description: '适合个人开发者和小型项目',
      features: ['API 调用 10,000 次/月', '基础技术支持', '标准数据更新频率', '非商用授权'],
    },
    {
      id: 'tier-2',
      name: '专业版',
      duration: 90,
      price: 4999,
      description: '适合中小企业和中型项目',
      features: ['API 调用 100,000 次/月', '优先技术支持', '高频数据更新', '商用授权', '定制化数据导出'],
    },
    {
      id: 'tier-3',
      name: '企业版',
      duration: 365,
      price: 19999,
      description: '适合大型企业和复杂项目',
      features: ['API 调用不限次数', '7x24 专属支持', '实时数据更新', '独家商用授权', '定制化开发', 'SLA 服务保障', '数据安全审计'],
    },
  ];
}

const productNames = [
  '全国居民消费行为分析数据集',
  '中小企业信用评估数据库',
  '城市交通流量实时数据',
  '医疗健康记录匿名化数据集',
  '电商用户画像标签体系',
  '供应链物流追踪数据服务',
  '全国气象历史数据汇编',
  '教育质量评估分析报告',
  '能源消耗统计数据集',
  '金融市场风险分析模型',
  '农业生产环境监测数据',
  '政务公开数据整合服务',
  '文化娱乐消费趋势分析',
  '旅游出行行为洞察报告',
  '房地产市场交易数据库',
  '人力资源流动分析数据',
  '科技创新能力评估体系',
  '环境保护监测数据服务',
  '食品安全溯源数据链',
  '社会舆情分析实时数据',
  '工业生产效率分析数据集',
  '跨境贸易统计数据库',
];

const providers = [
  { id: 'user-002', name: '数据服务股份有限公司', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li' },
  { id: 'user-004', name: '智能数据科技公司', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chen' },
];

export const mockProducts: DataProduct[] = productNames.map((name, index) => ({
  id: generateId(),
  name,
  description: `本${name}包含了丰富的行业数据资源，经过专业的数据清洗和标准化处理。数据覆盖全国主要地区，时间跨度超过5年，可广泛应用于市场分析、风险评估、业务优化等多个场景。所有数据均已完成匿名化处理，严格遵守数据安全和隐私保护相关法规。`,
  provider: providers[index % providers.length],
  category: categories[index % categories.length],
  industry: industries[index % industries.length],
  region: regions[index % regions.length],
  updateFrequency: frequencies[index % frequencies.length],
  tags: tags.slice(index % 5, (index % 5) + 3),
  coverImage: `https://picsum.photos/seed/${index + 1}/400/240`,
  sampleData: generateSampleData(),
  qualityScore: generateQualityScore(),
  pricing: generatePricing(),
  status: index < 18 ? 'published' : index < 20 ? 'pending' : 'rejected',
  createdAt: `2024-0${Math.floor(index / 4) + 1}-15`,
  updatedAt: `2024-1${Math.floor(index / 8) + 1}-20`,
  favoriteCount: Math.floor(Math.random() * 500) + 50,
  viewCount: Math.floor(Math.random() * 5000) + 500,
  isFavorite: index === 2 || index === 5,
  rejectReason: index === 20 ? '数据质量不达标，请补充数据来源说明和质量检测报告' : undefined,
}));

export const getProductById = (id: string) => mockProducts.find((p) => p.id === id);

export const getPendingProducts = () => mockProducts.filter((p) => p.status === 'pending' || p.status === 'rejected');
