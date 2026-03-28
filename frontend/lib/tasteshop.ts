/**
 * TasteShop — shared types, mock data, and localStorage state management.
 */

// --- Types ---

export interface CreatorProfile {
  instagramHandle: string
  displayName: string
  bio: string
  profilePhoto: string
  vibe: 'light' | 'dark'
  accentColor: string
  isPublished: boolean
}

export interface TasteShopProduct {
  id: string
  title: string
  handle: string
  price: number
  image: string | null
  category: string
  vendor: string
  shopifyUrl: string
  variantId: string
  source: 'bought' | 'partnership'
  partnerBrand?: string
  note?: string
  hidden: boolean
  position: number
  clicks: number
  sales: number
  earnings: number
}

// --- Mock Creator ---

export const MOCK_CREATOR: CreatorProfile = {
  instagramHandle: 'davidbeckham',
  displayName: 'David Beckham',
  bio: 'Football legend. Style icon. Living my best life.',
  profilePhoto: 'https://i.pravatar.cc/300?u=davidbeckham',
  vibe: 'dark',
  accentColor: '#00FF94',
  isPublished: false,
}

// --- Mock imported products (from "Gmail receipt scanning") ---

export const MOCK_IMPORTED_PRODUCTS: TasteShopProduct[] = [
  {
    id: 'ts-1', title: 'Classic Logo Tee', handle: 'classic-logo-tee',
    price: 29.00, image: '/products/classic-logo-tee.png', category: 'T-Shirts', vendor: 'House Brand',
    shopifyUrl: 'https://gzh-07.myshopify.com/products/classic-logo-tee',
    variantId: 'gid://shopify/ProductVariant/20000', source: 'bought',
    hidden: false, position: 0, clicks: 142, sales: 23, earnings: 46.00,
  },
  {
    id: 'ts-2', title: 'Everyday Hoodie', handle: 'everyday-hoodie',
    price: 65.00, image: '/products/everyday-hoodie.png', category: 'Hoodies', vendor: 'House Brand',
    shopifyUrl: 'https://gzh-07.myshopify.com/products/everyday-hoodie',
    variantId: 'gid://shopify/ProductVariant/20100', source: 'bought',
    hidden: false, position: 1, clicks: 98, sales: 14, earnings: 63.00,
  },
  {
    id: 'ts-3', title: 'Essential Joggers', handle: 'essential-joggers',
    price: 55.00, image: '/products/essential-joggers.png', category: 'Pants', vendor: 'House Brand',
    shopifyUrl: 'https://gzh-07.myshopify.com/products/essential-joggers',
    variantId: 'gid://shopify/ProductVariant/20300', source: 'bought',
    hidden: false, position: 2, clicks: 76, sales: 9, earnings: 34.65,
  },
  {
    id: 'ts-4', title: 'Signature Cap', handle: 'signature-cap',
    price: 32.00, image: '/products/signature-cap.png', category: 'Accessories', vendor: 'House Brand',
    shopifyUrl: 'https://gzh-07.myshopify.com/products/signature-cap',
    variantId: 'gid://shopify/ProductVariant/20200', source: 'bought',
    hidden: false, position: 3, clicks: 210, sales: 41, earnings: 91.52,
  },
  {
    id: 'ts-5', title: 'Artist Collab Hoodie - Drop 01', handle: 'artist-collab-hoodie-drop-01',
    price: 120.00, image: '/products/artist-collab-hoodie.png', category: 'Hoodies', vendor: 'House Brand',
    shopifyUrl: 'https://gzh-07.myshopify.com/products/artist-collab-hoodie',
    variantId: 'gid://shopify/ProductVariant/22000', source: 'partnership', partnerBrand: 'House Brand',
    hidden: false, position: 4, clicks: 187, sales: 19, earnings: 159.60,
  },
  {
    id: 'ts-6', title: 'Heritage Leather Wallet', handle: 'heritage-leather-wallet',
    price: 89.00, image: '/products/heritage-leather-wallet.png', category: 'Accessories', vendor: 'House Brand',
    shopifyUrl: 'https://gzh-07.myshopify.com/products/heritage-leather-wallet',
    variantId: 'gid://shopify/ProductVariant/22300', source: 'bought',
    hidden: false, position: 5, clicks: 64, sales: 7, earnings: 43.47,
  },
  {
    id: 'ts-7', title: 'Embroidered Varsity Jacket', handle: 'embroidered-varsity-jacket',
    price: 185.00, image: '/products/embroidered-varsity-jacket.png', category: 'Outerwear', vendor: 'House Brand',
    shopifyUrl: 'https://gzh-07.myshopify.com/products/embroidered-varsity-jacket',
    variantId: 'gid://shopify/ProductVariant/22100', source: 'partnership', partnerBrand: 'House Brand',
    hidden: false, position: 6, clicks: 153, sales: 11, earnings: 142.45,
  },
  {
    id: 'ts-8', title: 'Premium Scented Candle Set', handle: 'premium-scented-candle-set',
    price: 48.00, image: '/products/premium-scented-candle-set.png', category: 'Home', vendor: 'House Brand',
    shopifyUrl: 'https://gzh-07.myshopify.com/products/premium-scented-candle-set',
    variantId: 'gid://shopify/ProductVariant/22400', source: 'bought',
    hidden: false, position: 7, clicks: 45, sales: 5, earnings: 16.80,
  },
]

// --- localStorage helpers ---

const STORAGE_KEYS = {
  profile: 'tasteshop_profile',
  products: 'tasteshop_products',
  onboardStep: 'tasteshop_onboard_step',
}

export function getProfile(): CreatorProfile | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEYS.profile)
  return raw ? JSON.parse(raw) : null
}

export function saveProfile(profile: CreatorProfile) {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile))
}

export function getProducts(): TasteShopProduct[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(STORAGE_KEYS.products)
  return raw ? JSON.parse(raw) : []
}

export function saveProducts(products: TasteShopProduct[]) {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products))
}

export function getOnboardStep(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(STORAGE_KEYS.onboardStep) || '0', 10)
}

export function saveOnboardStep(step: number) {
  localStorage.setItem(STORAGE_KEYS.onboardStep, String(step))
}

export function resetAll() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k))
}

// --- Helpers ---

export function getCategories(products: TasteShopProduct[]): string[] {
  const cats = new Set(products.filter(p => !p.hidden).map(p => p.category))
  return Array.from(cats).sort()
}

export function getCheckoutUrl(product: TasteShopProduct, creatorHandle: string): string {
  const base = product.shopifyUrl.replace('/products/', '/cart/')
  const variantNum = product.variantId.split('/').pop()
  return `${product.shopifyUrl}?utm_source=tasteshop&utm_medium=creator&utm_content=${creatorHandle}&variant=${variantNum}`
}
