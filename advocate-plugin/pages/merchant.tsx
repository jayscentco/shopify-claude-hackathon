import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { cn, formatCurrency, formatNumber, timeAgo } from '../lib/utils'
import { MOCK_ADVOCATES, MOCK_UGC_POSTS, CustomerProfile, UGCPost } from '../lib/advocate'

type Tab = 'overview' | 'advocates' | 'ugc' | 'settings'

export default function MerchantDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const totalFans = MOCK_ADVOCATES.length
  const totalPosts = MOCK_ADVOCATES.reduce((s, a) => s + a.totalPosts, 0)
  const totalClicks = MOCK_ADVOCATES.reduce((s, a) => s + a.totalClicks, 0)
  const totalConversions = MOCK_ADVOCATES.reduce((s, a) => s + a.totalConversions, 0)
  const totalRevenue = MOCK_UGC_POSTS.reduce((s, p) => s + p.revenue, 0)
  const totalRewards = MOCK_ADVOCATES.reduce((s, a) => s + a.totalEarned, 0)
  const roi = totalRewards > 0 ? totalRevenue / totalRewards : 0

  const navItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" /><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" /><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" /><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" /></svg> },
    { key: 'advocates', label: 'Fans', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" /></svg> },
    { key: 'ugc', label: 'UGC Gallery', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" /><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" /></svg> },
    { key: 'settings', label: 'Settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" /></svg> },
  ]

  return (
    <div className="min-h-screen bg-light flex">
      {/* Sidebar — dark */}
      <aside className="hidden md:flex w-60 bg-dark flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-dark-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" /></svg>
            </div>
            <span className="text-base font-semibold text-white tracking-tight">1000 Fans</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                activeTab === item.key
                  ? 'bg-primary/15 text-primary-200'
                  : 'text-gray-400 hover:text-white hover:bg-dark-200'
              )}>
              <span className={activeTab === item.key ? 'text-primary' : 'text-gray-500'}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-dark-300">
          <button onClick={() => router.push('/offer')} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            Customer demo &rarr;
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-light-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">
            {navItems.find(n => n.key === activeTab)?.label}
          </h1>
          <button onClick={() => router.push('/')} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Home</button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && <OverviewTab stats={{ totalFans, totalPosts, totalClicks, totalConversions, totalRevenue, totalRewards, roi }} />}
          {activeTab === 'advocates' && <FansTab />}
          {activeTab === 'ugc' && <UGCTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  )
}

function OverviewTab({ stats }: { stats: { totalFans: number; totalPosts: number; totalClicks: number; totalConversions: number; totalRevenue: number; totalRewards: number; roi: number } }) {
  const { totalFans, totalPosts, totalClicks, totalConversions, totalRevenue, totalRewards, roi } = stats
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI title="Active Fans" value={totalFans.toString()} change="+18%" />
        <KPI title="Total Posts" value={totalPosts.toString()} change="+24%" />
        <KPI title="Attributed Revenue" value={formatCurrency(totalRevenue)} change="+32%" accent />
        <KPI title="ROI on Rewards" value={`${roi.toFixed(1)}x`} change="+8%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Funnel */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-5">Advocacy Funnel</h3>
          <div className="space-y-4">
            <FunnelRow label="Offers sent" value={42} max={42} />
            <FunnelRow label="Accepted" value={29} max={42} />
            <FunnelRow label="Posts created" value={totalPosts} max={42} />
            <FunnelRow label="Verified" value={totalPosts - 2} max={42} />
          </div>
          <div className="mt-5 pt-5 border-t border-light-200 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-gray-900">{formatNumber(totalClicks)}</p>
              <p className="text-xs text-gray-500 mt-0.5">Clicks</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{totalConversions}</p>
              <p className="text-xs text-gray-500 mt-0.5">Conversions</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{((totalConversions / totalClicks) * 100).toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-0.5">CVR</p>
            </div>
          </div>
        </div>

        {/* Top Fans */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-light-200">
            <h3 className="text-sm font-semibold text-gray-900">Top Fans</h3>
            <p className="text-xs text-gray-500">By attributed revenue</p>
          </div>
          <div className="divide-y divide-light-200">
            {MOCK_ADVOCATES.sort((a, b) => b.totalConversions - a.totalConversions).slice(0, 5).map((adv, i) => (
              <div key={adv.id} className="flex items-center gap-3 px-6 py-3.5">
                <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                <img src={adv.avatar} alt={adv.name} className="w-9 h-9 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{adv.name}</p>
                  <p className="text-xs text-gray-500">{adv.socials[0]?.handle} · {formatNumber(adv.socials[0]?.followers || 0)} followers</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatCurrency(adv.totalConversions * 55)}</p>
                  <p className="text-xs text-gray-400">{adv.totalPosts} posts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI banner */}
      <div className="bg-primary-50 rounded-2xl px-6 py-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-primary"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-primary-900">
            {formatCurrency(totalRewards)} in store credit → {formatCurrency(totalRevenue)} in attributed revenue
          </p>
          <p className="text-xs text-primary-700">
            Every $1 in store credit generates ${roi.toFixed(2)} in sales · CPA: {formatCurrency(totalRewards / Math.max(totalConversions, 1))}
          </p>
        </div>
      </div>
    </>
  )
}

function FansTab() {
  const sorted = [...MOCK_ADVOCATES].sort((a, b) => b.combinedScore - a.combinedScore)
  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="px-6 py-4 border-b border-light-200">
        <h3 className="text-sm font-semibold text-gray-900">All Fans</h3>
        <p className="text-xs text-gray-500">{sorted.length} enrolled</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-light-200 bg-light">
              {['Customer', 'Tier', 'Loyalty', 'Social', 'Combined', 'Posts', 'Clicks', 'Conversions', 'Earned'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-light-200">
            {sorted.map(adv => (
              <tr key={adv.id} className="hover:bg-light/50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <img src={adv.avatar} alt={adv.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{adv.name}</p>
                      <p className="text-xs text-gray-500">{adv.socials[0]?.handle || adv.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full',
                    adv.tier === 'premium' ? 'bg-primary-50 text-primary' : 'bg-light-100 text-gray-600')}>
                    {adv.tier}
                  </span>
                </td>
                <td className="px-4 py-3.5"><Score value={adv.loyaltyScore} /></td>
                <td className="px-4 py-3.5"><Score value={adv.socialScore} /></td>
                <td className="px-4 py-3.5"><Score value={adv.combinedScore} /></td>
                <td className="px-4 py-3.5 text-sm text-gray-900">{adv.totalPosts}</td>
                <td className="px-4 py-3.5 text-sm text-gray-900">{formatNumber(adv.totalClicks)}</td>
                <td className="px-4 py-3.5 text-sm text-gray-900">{adv.totalConversions}</td>
                <td className="px-4 py-3.5 text-sm font-bold text-primary">{formatCurrency(adv.totalEarned)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UGCTab() {
  return (
    <>
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">UGC Gallery</h3>
        <p className="text-sm text-gray-500">Verified customer posts you can reuse (with permission)</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_UGC_POSTS.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="aspect-video bg-light relative overflow-hidden">
              <img src={post.productImage} alt={post.productTitle} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 shadow-soft">
                {post.platform === 'instagram' ? 'IG' : post.platform === 'tiktok' ? 'TikTok' : 'X'}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <img src={post.customerAvatar} alt={post.customerName} className="w-7 h-7 rounded-full" />
                <span className="text-sm font-semibold text-gray-900">{post.customerName}</span>
                <span className="text-xs text-gray-400 ml-auto">{timeAgo(post.verifiedAt)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{post.productTitle}</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-sm font-bold text-gray-900">{formatNumber(post.clicks)}</p><p className="text-xs text-gray-400">Clicks</p></div>
                <div><p className="text-sm font-bold text-gray-900">{post.conversions}</p><p className="text-xs text-gray-400">Sales</p></div>
                <div><p className="text-sm font-bold text-primary">{formatCurrency(post.revenue)}</p><p className="text-xs text-gray-400">Revenue</p></div>
              </div>
              <div className="mt-4 pt-4 border-t border-light-200 flex items-center justify-between">
                <span className="text-xs text-gray-400">Reward: {formatCurrency(post.reward)}</span>
                <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline">View post →</a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

function SettingsTab() {
  const exampleProducts = [
    { title: 'Artist Collab Hoodie', price: 120, cogs: 38, margin: 68.3, maxReward: 24.60 },
    { title: 'Embroidered Varsity Jacket', price: 185, cogs: 62, margin: 66.5, maxReward: 36.90 },
    { title: 'Heritage Leather Wallet', price: 89, cogs: 28, margin: 68.5, maxReward: 18.30 },
    { title: 'Essential Joggers', price: 55, cogs: 18, margin: 67.3, maxReward: 11.10 },
    { title: 'Signature Cap', price: 32, cogs: 8, margin: 75.0, maxReward: 7.20 },
  ]

  return (
    <div className="max-w-2xl">
      {/* Auto-config banner */}
      <div className="bg-green-50 rounded-2xl px-5 py-4 flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-success"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Zero configuration needed</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            1000 Fans reads cost-of-goods (COGS) directly from your Shopify product data and automatically calculates reward ceilings per product. No setup required.
          </p>
        </div>
      </div>

      {/* How it works */}
      <h3 className="text-base font-semibold text-gray-900 mb-2">How rewards are calculated</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        We read the <span className="font-mono text-xs bg-light-100 px-1.5 py-0.5 rounded">cost_per_item</span> field from each Shopify variant, calculate the profit margin, and set the maximum reward at 30% of profit. The scoring algorithm then places each customer within that range.
      </p>

      {/* Formula */}
      <div className="bg-dark rounded-2xl px-5 py-4 mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Formula</p>
        <div className="font-mono text-sm leading-relaxed space-y-1">
          <p><span className="text-primary-200">profit</span> <span className="text-gray-500">=</span> <span className="text-white">price</span> <span className="text-gray-500">-</span> <span className="text-white">COGS</span></p>
          <p><span className="text-primary-200">max_reward</span> <span className="text-gray-500">=</span> <span className="text-white">profit</span> <span className="text-gray-500">×</span> <span className="text-yellow-300">0.30</span></p>
          <p><span className="text-primary-200">offer</span> <span className="text-gray-500">=</span> <span className="text-white">max_reward</span> <span className="text-gray-500">×</span> <span className="text-white">(combined_score / 100)</span></p>
        </div>
        <p className="text-xs text-gray-500 mt-3">For proven performers, the multiplier can exceed 1.0 based on past post ROI.</p>
      </div>

      {/* Live product table */}
      <h3 className="text-base font-semibold text-gray-900 mb-4">Your products (auto-calculated)</h3>
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-light-200 bg-light">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">COGS</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Margin</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Max Reward</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-200">
            {exampleProducts.map(p => (
              <tr key={p.title} className="hover:bg-light/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">{formatCurrency(p.cogs)}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">{p.margin.toFixed(1)}%</td>
                <td className="px-4 py-3 text-sm font-bold text-primary text-right">{formatCurrency(p.maxReward)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overrides */}
      <h3 className="text-base font-semibold text-gray-900 mb-4">Optional overrides</h3>
      <div className="space-y-3">
        {[
          { label: 'Profit share %', value: '30%', desc: 'What % of profit you\'re willing to offer as store credit (default 30%)' },
          { label: 'Min orders to qualify', value: '2', desc: 'Customers need at least this many orders to see the offer' },
          { label: 'Performance multiplier cap', value: '1.5x', desc: 'Max boost for proven top performers (applied to max_reward)' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-soft px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{s.label}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
            <span className="text-sm font-bold text-primary bg-primary-50 px-4 py-1.5 rounded-full">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function KPI({ title, value, change, accent }: { title: string; value: string; change: string; accent?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-soft px-5 py-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
      <p className={cn('text-2xl font-bold mb-1', accent ? 'text-primary' : 'text-gray-900')}>{value}</p>
      <span className="text-xs font-semibold text-success">{change} <span className="text-gray-400 font-normal">vs last month</span></span>
    </motion.div>
  )
}

function FunnelRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}</span>
      </div>
      <div className="h-2 bg-light rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  )
}

function Score({ value }: { value: number }) {
  return (
    <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full',
      value >= 70 ? 'bg-green-50 text-success' : value >= 40 ? 'bg-amber-50 text-warning' : 'bg-light-100 text-gray-500')}>
      {value}
    </span>
  )
}
