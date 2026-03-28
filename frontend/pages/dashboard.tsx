import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { cn, formatCurrency, formatNumber } from '../lib/utils'
import {
  getProfile, getProducts, resetAll,
  TasteShopProduct, CreatorProfile,
} from '../lib/tasteshop'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<CreatorProfile | null>(null)
  const [products, setProducts] = useState<TasteShopProduct[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const p = getProfile()
    if (!p) { router.replace('/onboard'); return }
    setProfile(p)
    setProducts(getProducts().filter(prod => !prod.hidden))
  }, [router])

  if (!mounted || !profile) return null

  const totalClicks = products.reduce((s, p) => s + p.clicks, 0)
  const totalSales = products.reduce((s, p) => s + p.sales, 0)
  const totalEarnings = products.reduce((s, p) => s + p.earnings, 0)
  const conversionRate = totalClicks > 0 ? (totalSales / totalClicks) * 100 : 0
  const verifiedCount = products.filter(p => p.source === 'bought').length
  const partnershipCount = products.filter(p => p.source === 'partnership').length

  // Sort by earnings for top products
  const topProducts = [...products].sort((a, b) => b.earnings - a.earnings)

  const handleReset = () => {
    resetAll()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Nav */}
      <div className="sticky top-0 z-30 bg-surface-0/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-6 py-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-lg font-semibold text-text-primary tracking-tight">TasteShop</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/shop/${profile.instagramHandle}`)}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              View shop
            </button>
            <button
              onClick={() => router.push('/edit')}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleReset}
              className="text-xs text-text-tertiary hover:text-status-error transition-colors"
            >
              Reset demo
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={profile.profilePhoto}
            alt={profile.displayName}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-text-primary">Welcome back, {profile.displayName.split(' ')[0]}</h1>
            <p className="text-sm text-text-tertiary">
              tasteshop.com/@{profile.instagramHandle}
              {profile.isPublished && (
                <span className="ml-2 text-accent text-xs">Live</span>
              )}
            </p>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <KPICard title="Total Clicks" value={formatNumber(totalClicks)} change={12.5} />
          <KPICard title="Total Sales" value={formatNumber(totalSales)} change={8.3} />
          <KPICard title="Estimated Earnings" value={formatCurrency(totalEarnings)} change={15.2} />
          <KPICard title="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} change={2.1} />
        </div>

        {/* Verification status */}
        <div className="bg-accent/5 border border-accent/10 rounded-lg px-5 py-4 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              {verifiedCount} of {products.length} products verified
            </p>
            <p className="text-xs text-text-tertiary">
              {partnershipCount} partnership{partnershipCount !== 1 ? 's' : ''} auto-disclosed &middot; All tracked via Shopify Collabs
            </p>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top performing products */}
          <div className="bg-surface-1 border border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-medium text-text-primary">Top Products</h2>
              <p className="text-xs text-text-tertiary">By estimated earnings</p>
            </div>
            <div className="divide-y divide-border">
              {topProducts.slice(0, 6).map((product, i) => (
                <div key={product.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xs text-text-tertiary w-4">{i + 1}</span>
                  <div className="w-8 h-8 rounded bg-surface-2 flex items-center justify-center text-text-tertiary text-xs flex-shrink-0 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      product.title.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{product.title}</p>
                    <p className="text-xs text-text-tertiary">
                      {product.clicks} clicks &middot; {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-accent">{formatCurrency(product.earnings)}</p>
                    <p className="text-xs text-text-tertiary">
                      {product.clicks > 0 ? ((product.sales / product.clicks) * 100).toFixed(1) : 0}% CVR
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-surface-1 border border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-medium text-text-primary">Recent Activity</h2>
              <p className="text-xs text-text-tertiary">Last 7 days</p>
            </div>
            <div className="divide-y divide-border">
              {MOCK_ACTIVITY.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    activity.type === 'sale' ? 'bg-accent/10 text-accent' :
                    activity.type === 'click' ? 'bg-status-info/10 text-status-info' :
                    'bg-status-warning/10 text-status-warning'
                  )}>
                    {activity.type === 'sale' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    ) : activity.type === 'click' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">{activity.description}</p>
                    <p className="text-xs text-text-tertiary">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-accent">{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({ title, value, change }: { title: string; value: string; change: number }) {
  const isPositive = change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface-1 border border-border rounded-lg px-4 py-3"
    >
      <p className="text-xs text-text-tertiary mb-1">{title}</p>
      <p className="text-xl font-bold text-text-primary mb-1">{value}</p>
      <span className={cn(
        'text-xs font-medium',
        isPositive ? 'text-accent' : 'text-status-error'
      )}>
        {isPositive ? '+' : ''}{change.toFixed(1)}%
        <span className="text-text-tertiary ml-1">vs last week</span>
      </span>
    </motion.div>
  )
}

const MOCK_ACTIVITY = [
  { type: 'sale', description: 'Signature Cap sold via your page', time: '2 hours ago', amount: '+$2.24' },
  { type: 'sale', description: 'Everyday Hoodie sold via your page', time: '5 hours ago', amount: '+$4.55' },
  { type: 'click', description: '12 visitors viewed Artist Collab Hoodie', time: '8 hours ago', amount: null },
  { type: 'new', description: 'New product auto-imported: Ribbed Tank Top', time: '1 day ago', amount: null },
  { type: 'sale', description: 'Classic Logo Tee sold via your page', time: '1 day ago', amount: '+$2.03' },
  { type: 'click', description: '28 visitors viewed Heritage Leather Wallet', time: '2 days ago', amount: null },
  { type: 'sale', description: 'Embroidered Varsity Jacket sold via your page', time: '3 days ago', amount: '+$12.95' },
  { type: 'new', description: 'Partnership disclosed: Artist Collab Hoodie', time: '5 days ago', amount: null },
]
