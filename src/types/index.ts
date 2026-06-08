export interface User {
  id: string;
  name: string;
  email: string;
  role: 'provider' | 'applicant' | 'admin';
  company: string;
  avatar: string;
  phone: string;
}

export interface Field {
  name: string;
  type: string;
  description: string;
}

export interface SampleData {
  fields: Field[];
  rows: Record<string, any>[];
}

export interface QualityScore {
  completeness: number;
  accuracy: number;
  timeliness: number;
  overall: number;
  report: string;
}

export interface PricingTier {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  features: string[];
}

export interface DataProduct {
  id: string;
  name: string;
  description: string;
  provider: {
    id: string;
    name: string;
    avatar: string;
  };
  category: string;
  industry: string;
  region: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  tags: string[];
  coverImage: string;
  sampleData: SampleData;
  qualityScore: QualityScore;
  pricing: PricingTier[];
  status: 'draft' | 'pending' | 'published' | 'rejected';
  createdAt: string;
  updatedAt: string;
  favoriteCount: number;
  viewCount: number;
  isFavorite?: boolean;
  rejectReason?: string;
}

export interface ApplicationStep {
  id: number;
  name: string;
  status: 'completed' | 'current' | 'pending';
  completedAt?: string;
}

export interface Material {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'provider' | 'applicant' | 'admin';
  content: string;
  attachments?: Material[];
  createdAt: string;
}

export interface AuthorizationScope {
  dataRange: string;
  usageLimitations: string[];
  permittedPurposes: string[];
  dataSecurity: string;
}

export interface Application {
  id: string;
  productId: string;
  productName: string;
  applicantId: string;
  applicantName: string;
  providerId: string;
  purpose: string;
  scenario: string;
  duration: number;
  dataScale: string;
  supplementaryMaterials: Material[];
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'communicating';
  currentStep: number;
  steps: ApplicationStep[];
  messages: Message[];
  authorizationScope?: AuthorizationScope;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
  selectedPricingTier?: string;
}

export interface DeliveryRecord {
  id: string;
  method: 'api' | 'download' | 'sftp' | 'manual';
  deliveredAt: string;
  deliveredBy: string;
  description: string;
}

export interface Authorization {
  id: string;
  applicationId: string;
  productId: string;
  productName: string;
  licenseeId: string;
  licenseeName: string;
  licensorId: string;
  licensorName: string;
  scope: AuthorizationScope;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'terminated' | 'renewing';
  deliveryRecords: DeliveryRecord[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  authorizationId: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  duration: number;
  status: 'completed' | 'refunded' | 'pending';
  createdAt: string;
}

export interface Review {
  id: string;
  authorizationId: string;
  productId: string;
  productName: string;
  reviewerId: string;
  reviewerName: string;
  ratings: {
    dataQuality: number;
    usability: number;
    deliverySpeed: number;
    customerService: number;
    overall: number;
  };
  feedback: string;
  suggestions: string;
  createdAt: string;
}

export interface Statistics {
  totalProducts: number;
  totalTransactions: number;
  totalAmount: number;
  totalUsers: number;
  monthlyTrend: { month: string; transactions: number; amount: number }[];
  topProducts: { productId: string; productName: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  regionDistribution: { region: string; count: number }[];
}

export interface FilterOptions {
  industry: string;
  region: string;
  updateFrequency: string;
  search: string;
  sortBy: string;
}
