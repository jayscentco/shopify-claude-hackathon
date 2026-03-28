/**
 * Advocate Plugin — types, mock data, scoring logic, localStorage state.
 */

// --- Types ---

export interface CustomerProfile {
  id: string
  name: string
  email: string
  avatar: string
  // Shopify purchase history
  orderCount: number
  totalSpent: number
  avgOrderValue: number
  daysSinceLastOrder: number
  repeatRate: number // 0-1
  // Social profiles (connected)
  socials: SocialProfile[]
  // Scores
  loyaltyScore: number  // 0-100
  socialScore: number   // 0-100
  combinedScore: number // 0-100
  tier: 'premium' | 'standard' | 'new'
  // Advocate history
  totalPosts: number
  totalClicks: number
  totalConversions: number
  totalEarned: number
}

export interface SocialProfile {
  platform: 'instagram' | 'tiktok' | 'x'
  handle: string
  followers: number
  engagementRate: number
  connected: boolean
}

export interface AdvocateOffer {
  id: string
  customerId: string
  productId: string
  productTitle: string
  productImage: string
  productPrice: number
  rewardAmount: number
  trackedLink: string
  suggestedCaptions: string[]
  status: 'pending' | 'accepted' | 'posted' | 'verified' | 'expired'
  postUrl?: string
  // Performance
  clicks: number
  addToCarts: number
  conversions: number
  revenue: number
  createdAt: string
}

export interface UGCPost {
  id: string
  customerId: string
  customerName: string
  customerAvatar: string
  platform: 'instagram' | 'tiktok' | 'x'
  postUrl: string
  productTitle: string
  productImage: string
  reward: number
  clicks: number
  conversions: number
  revenue: number
  verifiedAt: string
}

// --- Mock Data ---

export const MOCK_CUSTOMER: CustomerProfile = {
  id: 'cust-1',
  name: 'Emma Wilson',
  email: 'emma.wilson@example.com',
  avatar: 'https://i.pravatar.cc/300?u=emmawilson',
  orderCount: 11,
  totalSpent: 1430,
  avgOrderValue: 130,
  daysSinceLastOrder: 4,
  repeatRate: 0.82,
  socials: [],
  loyaltyScore: 82,
  socialScore: 0,
  combinedScore: 0,
  tier: 'new',
  totalPosts: 0,
  totalClicks: 0,
  totalConversions: 0,
  totalEarned: 0,
}

export const MOCK_PRODUCT = {
  id: 'prod-1',
  title: 'Nike Air Max 90',
  image: '/products/signature-cap.png',
  price: 130,
  handle: 'nike-air-max-90',
  cogs: 42,
}

export const MOCK_ADVOCATES: CustomerProfile[] = [
  {
    id: 'adv-1', name: 'Sofia Martinez', email: 'sofia.m@demo.org',
    avatar: 'https://i.pravatar.cc/300?u=sofia',
    orderCount: 14, totalSpent: 2180, avgOrderValue: 156, daysSinceLastOrder: 5, repeatRate: 0.92,
    socials: [{ platform: 'instagram', handle: '@sofiamartinez', followers: 24500, engagementRate: 4.2, connected: true }],
    loyaltyScore: 91, socialScore: 78, combinedScore: 85, tier: 'premium',
    totalPosts: 8, totalClicks: 3420, totalConversions: 86, totalEarned: 310,
  },
  {
    id: 'adv-2', name: 'James Chen', email: 'james.chen@test.io',
    avatar: 'https://i.pravatar.cc/300?u=jameschen',
    orderCount: 9, totalSpent: 1260, avgOrderValue: 140, daysSinceLastOrder: 12, repeatRate: 0.75,
    socials: [{ platform: 'tiktok', handle: '@jamesc', followers: 89200, engagementRate: 6.8, connected: true }],
    loyaltyScore: 74, socialScore: 88, combinedScore: 81, tier: 'premium',
    totalPosts: 5, totalClicks: 5840, totalConversions: 142, totalEarned: 420,
  },
  {
    id: 'adv-3', name: 'Liam O\'Brien', email: 'liam.obrien@example.com',
    avatar: 'https://i.pravatar.cc/300?u=liam',
    orderCount: 6, totalSpent: 540, avgOrderValue: 90, daysSinceLastOrder: 21, repeatRate: 0.60,
    socials: [{ platform: 'instagram', handle: '@liamob', followers: 3200, engagementRate: 3.1, connected: true }],
    loyaltyScore: 55, socialScore: 42, combinedScore: 49, tier: 'standard',
    totalPosts: 2, totalClicks: 310, totalConversions: 7, totalEarned: 35,
  },
  {
    id: 'adv-4', name: 'Ava Johnson', email: 'ava.j@test.io',
    avatar: 'https://i.pravatar.cc/300?u=avaj',
    orderCount: 18, totalSpent: 3200, avgOrderValue: 178, daysSinceLastOrder: 2, repeatRate: 0.95,
    socials: [
      { platform: 'instagram', handle: '@avajohnson', followers: 156000, engagementRate: 5.1, connected: true },
      { platform: 'tiktok', handle: '@avaj', followers: 312000, engagementRate: 8.2, connected: true },
    ],
    loyaltyScore: 96, socialScore: 95, combinedScore: 96, tier: 'premium',
    totalPosts: 14, totalClicks: 21800, totalConversions: 524, totalEarned: 1580,
  },
  {
    id: 'adv-5', name: 'Noah Kim', email: 'noah.kim@demo.org',
    avatar: 'https://i.pravatar.cc/300?u=noahkim',
    orderCount: 3, totalSpent: 260, avgOrderValue: 87, daysSinceLastOrder: 45, repeatRate: 0.33,
    socials: [{ platform: 'x', handle: '@noahk', followers: 890, engagementRate: 1.8, connected: true }],
    loyaltyScore: 32, socialScore: 18, combinedScore: 25, tier: 'standard',
    totalPosts: 1, totalClicks: 64, totalConversions: 2, totalEarned: 10,
  },
  {
    id: 'adv-6', name: 'Mia Anderson', email: 'mia.a@example.com',
    avatar: 'https://i.pravatar.cc/300?u=miaa',
    orderCount: 10, totalSpent: 1580, avgOrderValue: 158, daysSinceLastOrder: 8, repeatRate: 0.78,
    socials: [{ platform: 'instagram', handle: '@miaanderson', followers: 45600, engagementRate: 3.8, connected: true }],
    loyaltyScore: 78, socialScore: 72, combinedScore: 75, tier: 'premium',
    totalPosts: 6, totalClicks: 3900, totalConversions: 71, totalEarned: 265,
  },
]

export const MOCK_UGC_POSTS: UGCPost[] = [
  {
    id: 'ugc-1', customerId: 'adv-4', customerName: 'Ava Johnson', customerAvatar: 'https://i.pravatar.cc/300?u=avaj',
    platform: 'instagram', postUrl: 'https://instagram.com/p/abc123',
    productTitle: 'Nike Air Max 90', productImage: '/products/signature-cap.png',
    reward: 26, clicks: 4820, conversions: 118, revenue: 15340, verifiedAt: '2026-03-26T14:30:00Z',
  },
  {
    id: 'ugc-2', customerId: 'adv-2', customerName: 'James Chen', customerAvatar: 'https://i.pravatar.cc/300?u=jameschen',
    platform: 'tiktok', postUrl: 'https://tiktok.com/@jamesc/video/123',
    productTitle: 'Nike Tech Fleece Hoodie', productImage: '/products/everyday-hoodie.png',
    reward: 30, clicks: 3640, conversions: 84, revenue: 10920, verifiedAt: '2026-03-25T10:15:00Z',
  },
  {
    id: 'ugc-3', customerId: 'adv-1', customerName: 'Sofia Martinez', customerAvatar: 'https://i.pravatar.cc/300?u=sofia',
    platform: 'instagram', postUrl: 'https://instagram.com/p/def456',
    productTitle: 'Nike Heritage Backpack', productImage: '/products/heritage-leather-wallet.png',
    reward: 12, clicks: 1180, conversions: 34, revenue: 1700, verifiedAt: '2026-03-24T09:00:00Z',
  },
  {
    id: 'ugc-4', customerId: 'adv-6', customerName: 'Mia Anderson', customerAvatar: 'https://i.pravatar.cc/300?u=miaa',
    platform: 'instagram', postUrl: 'https://instagram.com/p/ghi789',
    productTitle: 'Nike Sportswear Joggers', productImage: '/products/essential-joggers.png',
    reward: 15, clicks: 890, conversions: 21, revenue: 1470, verifiedAt: '2026-03-23T16:45:00Z',
  },
  {
    id: 'ugc-5', customerId: 'adv-4', customerName: 'Ava Johnson', customerAvatar: 'https://i.pravatar.cc/300?u=avaj',
    platform: 'tiktok', postUrl: 'https://tiktok.com/@avaj/video/456',
    productTitle: 'Nike Dri-FIT Tee', productImage: '/products/classic-logo-tee.png',
    reward: 10, clicks: 6200, conversions: 156, revenue: 5460, verifiedAt: '2026-03-22T11:20:00Z',
  },
]

export const MOCK_OFFERS: AdvocateOffer[] = [
  {
    id: 'off-1', customerId: 'adv-4', productId: 'prod-1',
    productTitle: 'Nike Air Max 90', productImage: '/products/signature-cap.png', productPrice: 130,
    rewardAmount: 26, trackedLink: 'https://nike.com/r/avaj-airmax01',
    suggestedCaptions: [
      'These Air Max 90s are everything. Link in bio.',
      'Been wearing these nonstop since they arrived.',
    ],
    status: 'verified', postUrl: 'https://instagram.com/p/abc123',
    clicks: 4820, addToCarts: 580, conversions: 118, revenue: 15340,
    createdAt: '2026-03-25T10:00:00Z',
  },
  {
    id: 'off-2', customerId: 'adv-2', productId: 'prod-2',
    productTitle: 'Nike Tech Fleece Hoodie', productImage: '/products/everyday-hoodie.png', productPrice: 130,
    rewardAmount: 30, trackedLink: 'https://nike.com/r/jamesc-techfleece01',
    suggestedCaptions: [
      'This Tech Fleece is unreal. Had to share.',
      'Best hoodie I own. Not even close.',
    ],
    status: 'verified', postUrl: 'https://tiktok.com/@jamesc/video/123',
    clicks: 3640, addToCarts: 420, conversions: 84, revenue: 10920,
    createdAt: '2026-03-24T08:00:00Z',
  },
]

// --- Scoring ---

export function calculateLoyaltyScore(customer: {
  orderCount: number; totalSpent: number; avgOrderValue: number;
  daysSinceLastOrder: number; repeatRate: number;
}): number {
  const orderScore = Math.min(customer.orderCount / 10, 1) * 25
  const spendScore = Math.min(customer.totalSpent / 2000, 1) * 25
  const recencyScore = Math.max(0, 1 - customer.daysSinceLastOrder / 90) * 25
  const repeatScore = customer.repeatRate * 25
  return Math.round(orderScore + spendScore + recencyScore + repeatScore)
}

export function calculateSocialScore(socials: SocialProfile[]): number {
  if (socials.length === 0) return 0
  let best = 0
  for (const s of socials) {
    const followerScore = Math.min(Math.log10(Math.max(s.followers, 1)) / 6, 1) * 50
    const engagementScore = Math.min(s.engagementRate / 8, 1) * 50
    best = Math.max(best, followerScore + engagementScore)
  }
  return Math.round(best)
}

export function calculateReward(loyaltyScore: number, socialScore: number, baseMin: number = 5, baseMax: number = 50): number {
  const combined = loyaltyScore * 0.4 + socialScore * 0.6
  const reward = baseMin + (combined / 100) * (baseMax - baseMin)
  return Math.round(reward)
}

export function getTier(combinedScore: number): 'premium' | 'standard' | 'new' {
  if (combinedScore >= 60) return 'premium'
  if (combinedScore >= 30) return 'standard'
  return 'new'
}

// --- localStorage ---

const STORAGE_KEYS = {
  customer: 'advocate_customer',
  step: 'advocate_step',
}

export function getCustomer(): CustomerProfile | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEYS.customer)
  return raw ? JSON.parse(raw) : null
}

export function saveCustomer(c: CustomerProfile) {
  localStorage.setItem(STORAGE_KEYS.customer, JSON.stringify(c))
}

export function getStep(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(STORAGE_KEYS.step) || '0', 10)
}

export function saveStep(s: number) {
  localStorage.setItem(STORAGE_KEYS.step, String(s))
}

export function resetAdvocate() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k))
}
