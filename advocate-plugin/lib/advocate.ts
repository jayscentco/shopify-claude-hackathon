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
  orderCount: 7,
  totalSpent: 892.00,
  avgOrderValue: 127.43,
  daysSinceLastOrder: 3,
  repeatRate: 0.85,
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
  title: 'Artist Collab Hoodie - Drop 01',
  image: '/products/artist-collab-hoodie.png',
  price: 120.00,
  handle: 'artist-collab-hoodie',
}

export const MOCK_ADVOCATES: CustomerProfile[] = [
  {
    id: 'adv-1', name: 'Sofia Martinez', email: 'sofia.m@demo.org',
    avatar: 'https://i.pravatar.cc/300?u=sofia',
    orderCount: 12, totalSpent: 1840, avgOrderValue: 153.33, daysSinceLastOrder: 5, repeatRate: 0.92,
    socials: [{ platform: 'instagram', handle: '@sofiamartinez', followers: 24500, engagementRate: 4.2, connected: true }],
    loyaltyScore: 91, socialScore: 78, combinedScore: 85, tier: 'premium',
    totalPosts: 6, totalClicks: 1842, totalConversions: 47, totalEarned: 185.00,
  },
  {
    id: 'adv-2', name: 'James Chen', email: 'james.chen@test.io',
    avatar: 'https://i.pravatar.cc/300?u=jameschen',
    orderCount: 8, totalSpent: 1120, avgOrderValue: 140.00, daysSinceLastOrder: 12, repeatRate: 0.75,
    socials: [{ platform: 'tiktok', handle: '@jamesc', followers: 89200, engagementRate: 6.8, connected: true }],
    loyaltyScore: 74, socialScore: 88, combinedScore: 81, tier: 'premium',
    totalPosts: 4, totalClicks: 3210, totalConversions: 68, totalEarned: 240.00,
  },
  {
    id: 'adv-3', name: 'Liam O\'Brien', email: 'liam.obrien@example.com',
    avatar: 'https://i.pravatar.cc/300?u=liam',
    orderCount: 5, totalSpent: 445, avgOrderValue: 89.00, daysSinceLastOrder: 21, repeatRate: 0.60,
    socials: [{ platform: 'instagram', handle: '@liamob', followers: 3200, engagementRate: 3.1, connected: true }],
    loyaltyScore: 55, socialScore: 42, combinedScore: 49, tier: 'standard',
    totalPosts: 2, totalClicks: 186, totalConversions: 4, totalEarned: 30.00,
  },
  {
    id: 'adv-4', name: 'Ava Johnson', email: 'ava.j@test.io',
    avatar: 'https://i.pravatar.cc/300?u=avaj',
    orderCount: 15, totalSpent: 2680, avgOrderValue: 178.67, daysSinceLastOrder: 2, repeatRate: 0.95,
    socials: [
      { platform: 'instagram', handle: '@avajohnson', followers: 156000, engagementRate: 5.1, connected: true },
      { platform: 'tiktok', handle: '@avaj', followers: 312000, engagementRate: 8.2, connected: true },
    ],
    loyaltyScore: 96, socialScore: 95, combinedScore: 96, tier: 'premium',
    totalPosts: 11, totalClicks: 12400, totalConversions: 289, totalEarned: 890.00,
  },
  {
    id: 'adv-5', name: 'Noah Kim', email: 'noah.kim@demo.org',
    avatar: 'https://i.pravatar.cc/300?u=noahkim',
    orderCount: 3, totalSpent: 210, avgOrderValue: 70.00, daysSinceLastOrder: 45, repeatRate: 0.33,
    socials: [{ platform: 'x', handle: '@noahk', followers: 890, engagementRate: 1.8, connected: true }],
    loyaltyScore: 32, socialScore: 18, combinedScore: 25, tier: 'standard',
    totalPosts: 1, totalClicks: 42, totalConversions: 1, totalEarned: 8.00,
  },
  {
    id: 'adv-6', name: 'Mia Anderson', email: 'mia.a@example.com',
    avatar: 'https://i.pravatar.cc/300?u=miaa',
    orderCount: 9, totalSpent: 1350, avgOrderValue: 150.00, daysSinceLastOrder: 8, repeatRate: 0.78,
    socials: [{ platform: 'instagram', handle: '@miaanderson', followers: 45600, engagementRate: 3.8, connected: true }],
    loyaltyScore: 78, socialScore: 72, combinedScore: 75, tier: 'premium',
    totalPosts: 5, totalClicks: 2100, totalConversions: 38, totalEarned: 155.00,
  },
]

export const MOCK_UGC_POSTS: UGCPost[] = [
  {
    id: 'ugc-1', customerId: 'adv-4', customerName: 'Ava Johnson', customerAvatar: 'https://i.pravatar.cc/300?u=avaj',
    platform: 'instagram', postUrl: 'https://instagram.com/p/abc123',
    productTitle: 'Artist Collab Hoodie', productImage: '/products/artist-collab-hoodie.png',
    reward: 35, clicks: 2840, conversions: 62, revenue: 7440, verifiedAt: '2026-03-26T14:30:00Z',
  },
  {
    id: 'ugc-2', customerId: 'adv-2', customerName: 'James Chen', customerAvatar: 'https://i.pravatar.cc/300?u=jameschen',
    platform: 'tiktok', postUrl: 'https://tiktok.com/@jamesc/video/123',
    productTitle: 'Embroidered Varsity Jacket', productImage: '/products/embroidered-varsity-jacket.png',
    reward: 40, clicks: 1890, conversions: 41, revenue: 7585, verifiedAt: '2026-03-25T10:15:00Z',
  },
  {
    id: 'ugc-3', customerId: 'adv-1', customerName: 'Sofia Martinez', customerAvatar: 'https://i.pravatar.cc/300?u=sofia',
    platform: 'instagram', postUrl: 'https://instagram.com/p/def456',
    productTitle: 'Signature Cap', productImage: '/products/signature-cap.png',
    reward: 20, clicks: 620, conversions: 18, revenue: 576, verifiedAt: '2026-03-24T09:00:00Z',
  },
  {
    id: 'ugc-4', customerId: 'adv-6', customerName: 'Mia Anderson', customerAvatar: 'https://i.pravatar.cc/300?u=miaa',
    platform: 'instagram', postUrl: 'https://instagram.com/p/ghi789',
    productTitle: 'Essential Joggers', productImage: '/products/essential-joggers.png',
    reward: 18, clicks: 410, conversions: 9, revenue: 495, verifiedAt: '2026-03-23T16:45:00Z',
  },
  {
    id: 'ugc-5', customerId: 'adv-4', customerName: 'Ava Johnson', customerAvatar: 'https://i.pravatar.cc/300?u=avaj',
    platform: 'tiktok', postUrl: 'https://tiktok.com/@avaj/video/456',
    productTitle: 'Classic Logo Tee', productImage: '/products/classic-logo-tee.png',
    reward: 25, clicks: 4200, conversions: 89, revenue: 2581, verifiedAt: '2026-03-22T11:20:00Z',
  },
]

export const MOCK_OFFERS: AdvocateOffer[] = [
  {
    id: 'off-1', customerId: 'adv-4', productId: 'prod-1',
    productTitle: 'Artist Collab Hoodie', productImage: '/products/artist-collab-hoodie.png', productPrice: 120,
    rewardAmount: 35, trackedLink: 'https://shop.co/r/avaj-hoodie01',
    suggestedCaptions: [
      'Obsessed with this collab hoodie. Link in bio for you guys.',
      'This drop is insane. Wearing it every day since it arrived.',
      'Not sponsored, just genuinely love this piece. Link below.',
    ],
    status: 'verified', postUrl: 'https://instagram.com/p/abc123',
    clicks: 2840, addToCarts: 340, conversions: 62, revenue: 7440,
    createdAt: '2026-03-25T10:00:00Z',
  },
  {
    id: 'off-2', customerId: 'adv-2', productId: 'prod-2',
    productTitle: 'Embroidered Varsity Jacket', productImage: '/products/embroidered-varsity-jacket.png', productPrice: 185,
    rewardAmount: 40, trackedLink: 'https://shop.co/r/jamesc-varsity01',
    suggestedCaptions: [
      'This jacket is everything. Had to share.',
      'Best purchase this year. Quality is unreal.',
    ],
    status: 'verified', postUrl: 'https://tiktok.com/@jamesc/video/123',
    clicks: 1890, addToCarts: 220, conversions: 41, revenue: 7585,
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
