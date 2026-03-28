import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatCurrency, formatNumber } from '../lib/utils'
import {
  MOCK_CUSTOMER, MOCK_PRODUCT,
  saveCustomer, calculateLoyaltyScore, calculateSocialScore,
  calculateReward, getTier,
  CustomerProfile, SocialProfile,
} from '../lib/advocate'

export default function OfferPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState<CustomerProfile>(MOCK_CUSTOMER)
  const [connectedPlatforms, setConnectedPlatforms] = useState<SocialProfile[]>([])
  const [reward, setReward] = useState(0)
  const [postUrl, setPostUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  // AI log entries that appear on the RHS
  const [aiLogs, setAiLogs] = useState<{ text: string; type: 'info' | 'score' | 'decision' | 'action' }[]>([])

  useEffect(() => { setMounted(true) }, [])

  const addLog = (text: string, type: 'info' | 'score' | 'decision' | 'action' = 'info') => {
    setAiLogs(prev => [...prev, { text, type }])
  }

  const connectPlatform = (platform: 'instagram' | 'tiktok' | 'x') => {
    setLoading(true)
    addLog(`Initiating OAuth flow for ${platform}...`, 'action')
    setTimeout(() => {
      const mockProfiles: Record<string, SocialProfile> = {
        instagram: { platform: 'instagram', handle: '@emmawilson', followers: 18400, engagementRate: 3.8, connected: true },
        tiktok: { platform: 'tiktok', handle: '@emmaw', followers: 42100, engagementRate: 5.6, connected: true },
        x: { platform: 'x', handle: '@emma_w', followers: 5200, engagementRate: 2.1, connected: true },
      }
      const profile = mockProfiles[platform]
      setConnectedPlatforms(prev => [...prev, profile])
      addLog(`Connected ${platform}: ${profile.handle}`, 'info')
      addLog(`Followers: ${formatNumber(profile.followers)} · Engagement: ${profile.engagementRate}%`, 'score')
      setLoading(false)
    }, 1200)
  }

  const calculateScores = () => {
    setLoading(true)
    addLog('Running scoring algorithm...', 'action')

    setTimeout(() => {
      const loyaltyScore = calculateLoyaltyScore(customer)
      addLog(`Loyalty score: ${loyaltyScore}/100`, 'score')
      addLog(`  Orders: ${customer.orderCount} · AOV: ${formatCurrency(customer.avgOrderValue)}`, 'info')
      addLog(`  Recency: ${customer.daysSinceLastOrder}d · Repeat rate: ${(customer.repeatRate * 100).toFixed(0)}%`, 'info')

      const socialScore = calculateSocialScore(connectedPlatforms)
      addLog(`Social score: ${socialScore}/100`, 'score')
      addLog(`  Best reach: ${formatNumber(Math.max(...connectedPlatforms.map(p => p.followers)))} followers`, 'info')

      const combined = Math.round(loyaltyScore * 0.4 + socialScore * 0.6)
      addLog(`Combined: ${loyaltyScore}×0.4 + ${socialScore}×0.6 = ${combined}`, 'score')

      const tier = getTier(combined)
      addLog(`Tier assigned: ${tier.toUpperCase()}`, 'decision')

      const rewardAmount = calculateReward(loyaltyScore, socialScore)
      addLog(`COGS lookup: $42 → profit: $88 → max reward: $26`, 'info')
      addLog(`Offer: $26 × (${combined}/100) = ${formatCurrency(rewardAmount)}`, 'decision')

      const updated = { ...customer, socials: connectedPlatforms, loyaltyScore, socialScore, combinedScore: combined, tier }
      setCustomer(updated)
      saveCustomer(updated)
      setReward(rewardAmount)
      setLoading(false)
      setStep(2)
    }, 1500)
  }

  const acceptOffer = () => {
    addLog('Offer accepted — generating tracked link...', 'action')
    addLog('Link: shop.co/r/emmaw-hoodie01', 'info')
    addLog('UTM: source=1000fans, customer=emmaw, product=hoodie01', 'info')
    addLog('Generating AI caption suggestions...', 'action')
    setStep(3)
  }

  const submitPost = () => {
    addLog('Verifying post URL via API...', 'action')
    setStep(4)
  }

  const verifyPost = () => {
    setLoading(true)
    addLog(`Fetching post from ${postUrl}...`, 'action')
    setTimeout(() => {
      addLog('Post found — checking for tracked link...', 'info')
      addLog('Tracked link detected in post ✓', 'decision')
      addLog(`Issuing ${formatCurrency(reward)} store credit to customer...`, 'action')
      addLog('Store credit applied ✓', 'decision')
      addLog('Scheduling performance tracking (7-day window)...', 'action')
      addLog('Re-engagement email queued for day 7...', 'action')
      setLoading(false)
      setStep(5)
    }, 2000)
  }

  const showNextOffer = () => {
    addLog('7 days later — post performance review triggered', 'action')
    addLog('Tracked link clicks: 284 · Add-to-carts: 38 · Sales: 12', 'score')
    addLog('Revenue attributed: $1,440', 'score')
    addLog('Performance: ABOVE AVERAGE — upgrading next offer', 'decision')
    addLog('New reward calculated: $30 (was $' + reward + ')', 'decision')
    addLog('Selected product for next offer: Nike Tech Fleece Hoodie ($130)', 'info')
    addLog('Sending re-engagement email...', 'action')
    setStep(6)
  }

  const copyLink = () => {
    navigator.clipboard.writeText('https://shop.co/r/emmaw-hoodie01')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-light">
      {/* Top bar */}
      <div className="bg-white border-b border-light-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#6B5FF6" /></svg>
          <span className="text-lg font-semibold text-gray-900 tracking-tight">1000 Fans</span>
          <span className="text-xs bg-primary-50 text-primary font-semibold px-2.5 py-0.5 rounded-full ml-2">Demo Mode</span>
        </div>
        <div className="flex items-center gap-3">
          {step > 0 && step < 5 && (
            <div className="flex items-center gap-2">
              {[1,2,3,4].map(s => (
                <div key={s} className={cn('w-8 h-1 rounded-full transition-colors', s <= step ? 'bg-primary' : 'bg-light-200')} />
              ))}
            </div>
          )}
          <button onClick={() => router.push('/merchant')} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Merchant view →
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex min-h-[calc(100vh-65px)]">
        {/* LEFT: Customer experience */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <Step key="s0">
                <div className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4 mb-10 w-full max-w-md">
                  <div className="w-16 h-16 rounded-xl bg-light overflow-hidden flex-shrink-0">
                    <img src={MOCK_PRODUCT.image} alt={MOCK_PRODUCT.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-success uppercase tracking-wide mb-0.5">Order confirmed</p>
                    <p className="text-sm font-semibold text-gray-900">{MOCK_PRODUCT.title}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(MOCK_PRODUCT.price)}</p>
                  </div>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">You're one of us.</h2>
                <p className="text-base text-gray-500 mb-3 max-w-sm text-center leading-relaxed">
                  We're a small brand and people like you are the reason we're still here. You keep coming back, and that means everything to us.
                </p>
                <p className="text-base text-gray-500 mb-10 max-w-sm text-center leading-relaxed">
                  We'd love for you to help us grow — share the products you already love with your world, and we'll <span className="font-semibold text-primary">thank you with store credit</span>.
                </p>

                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setStep(1); addLog('Customer clicked "Count me in"', 'action'); addLog(`Shopify data pulled: ${customer.orderCount} orders, ${formatCurrency(customer.totalSpent)} LTV, ${formatCurrency(customer.avgOrderValue)} AOV`, 'info'); addLog(`Recency: ${customer.daysSinceLastOrder} days since last order`, 'info'); addLog(`Repeat rate: ${(customer.repeatRate * 100).toFixed(0)}%`, 'info'); addLog('Customer qualifies for 1000 Fans program (≥2 orders) ✓', 'decision') }}
                  className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-600 transition-colors shadow-glow">
                  Count me in
                </motion.button>
                <p className="text-sm text-gray-400 mt-4">Join the people who are helping us grow</p>
              </Step>
            )}

            {step === 1 && (
              <Step key="s1">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <path d="M16 8a6 6 0 01-12 0 6 6 0 0112 0z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 21a10 10 0 0120 0" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Where do you share?</h2>
                <p className="text-base text-gray-500 mb-8 max-w-sm text-center leading-relaxed">
                  Connect the platforms where you talk to your people. This helps us understand how to work together.
                </p>

                <div className="w-full max-w-sm space-y-3 mb-8">
                  <SocialBtn platform="instagram" label="Instagram" connected={connectedPlatforms.some(p => p.platform === 'instagram')} profile={connectedPlatforms.find(p => p.platform === 'instagram')} onClick={() => connectPlatform('instagram')} loading={loading} gradient="from-[#833AB4] via-[#E1306C] to-[#F77737]" />
                  <SocialBtn platform="tiktok" label="TikTok" connected={connectedPlatforms.some(p => p.platform === 'tiktok')} profile={connectedPlatforms.find(p => p.platform === 'tiktok')} onClick={() => connectPlatform('tiktok')} loading={loading} gradient="from-[#010101] to-[#333]" />
                  <SocialBtn platform="x" label="X (Twitter)" connected={connectedPlatforms.some(p => p.platform === 'x')} profile={connectedPlatforms.find(p => p.platform === 'x')} onClick={() => connectPlatform('x')} loading={loading} gradient="from-[#1A1A1A] to-[#444]" />
                </div>

                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={calculateScores}
                  disabled={connectedPlatforms.length === 0 || loading}
                  className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-600 transition-colors shadow-glow disabled:opacity-40 disabled:shadow-none">
                  {loading ? 'Calculating your offer...' : 'See my offer'}
                </motion.button>
              </Step>
            )}

            {step === 2 && (
              <Step key="s2">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mb-8">
                  <span className="text-3xl font-bold text-primary">{formatCurrency(reward)}</span>
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Here's how you can help</h2>
                <p className="text-base text-gray-500 mb-8 max-w-sm text-center leading-relaxed">
                  Show your people something you genuinely love. That's it. If they buy through your link, we'll send you <span className="font-semibold text-primary">{formatCurrency(reward)} in store credit</span> as a thank you.
                </p>

                <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-5 mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-light overflow-hidden flex-shrink-0">
                      <img src={MOCK_PRODUCT.image} alt={MOCK_PRODUCT.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{MOCK_PRODUCT.title}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(MOCK_PRODUCT.price)}</p>
                    </div>
                  </div>
                  <div className="border-t border-light-200 pt-4 space-y-2.5">
                    {['Snap a real photo — be yourself, not an ad', 'Share it with your tracked link', `We'll thank you with ${formatCurrency(reward)} store credit`].map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-success flex-shrink-0"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span className="text-sm text-gray-600">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={acceptOffer}
                  className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-600 transition-colors shadow-glow">
                  I want to help
                </motion.button>
              </Step>
            )}

            {step === 3 && (
              <Step key="s3">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">You're all set</h2>
                <p className="text-base text-gray-500 mb-8 max-w-sm text-center leading-relaxed">
                  Here's your link and a few caption ideas. But honestly — just be yourself. Your people trust you because you're real.
                </p>
                <div className="w-full max-w-md space-y-4 mb-8">
                  <div className="bg-white rounded-2xl shadow-card p-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your tracked link</p>
                    <div className="flex items-center gap-2 bg-light rounded-xl px-4 py-3">
                      <span className="text-sm text-gray-700 flex-1 truncate font-mono">https://shop.co/r/emmaw-hoodie01</span>
                      <button onClick={copyLink} className="flex-shrink-0 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary-600 transition-colors">
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-card p-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Suggested captions</p>
                    {[`I've been wearing this nonstop. Supporting a brand I actually believe in — link in bio if you want one.`, `Found this small brand a while back and haven't looked back. This piece is unreal.`, `Not sponsored. Not gifted. Just something I bought and genuinely love. Thought you should know.`].map((c, i) => (
                      <button key={i} onClick={() => navigator.clipboard.writeText(c)}
                        className="block w-full text-left text-sm text-gray-600 bg-light rounded-xl px-4 py-3 mb-2 hover:bg-light-100 transition-colors leading-relaxed">"{c}"</button>
                    ))}
                  </div>
                  <div className="bg-primary-50 rounded-2xl p-5 flex items-start gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary flex-shrink-0 mt-0.5"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" /><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    <div>
                      <p className="text-sm font-semibold text-primary-900 mb-1">Make it yours</p>
                      <p className="text-sm text-primary-700 leading-relaxed">A quick photo of you with the product goes a long way. No need for a studio — real is what works.</p>
                    </div>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={submitPost}
                  className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-600 transition-colors shadow-glow">
                  I've posted it
                </motion.button>
              </Step>
            )}

            {step === 4 && (
              <Step key="s4">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">You posted it!</h2>
                <p className="text-base text-gray-500 mb-8 max-w-sm text-center leading-relaxed">
                  Drop the link to your post below and we'll send your <span className="font-semibold text-primary">{formatCurrency(reward)} thank-you credit</span> straight away.
                </p>
                <div className="w-full max-w-md mb-8">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Post URL</label>
                  <input type="text" value={postUrl} onChange={e => setPostUrl(e.target.value)} placeholder="https://instagram.com/p/..."
                    className="w-full px-4 py-3.5 bg-white border border-light-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-soft" />
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={verifyPost} disabled={!postUrl || loading}
                  className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-600 transition-colors shadow-glow disabled:opacity-40 disabled:shadow-none">
                  {loading ? 'Verifying post...' : 'Submit for verification'}
                </motion.button>
              </Step>
            )}

            {step === 5 && (
              <Step key="s5">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-8">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-success">
                    <motion.path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
                  </svg>
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Thank you. Really.</h2>
                <p className="text-base text-gray-500 mb-8 max-w-sm text-center leading-relaxed">
                  You just helped a small brand reach new people. <span className="font-bold text-success">{formatCurrency(reward)}</span> in store credit is on the way — our small way of saying thanks. We'll show you how your post does over the next week.
                </p>
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-5 mb-8">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Post performance (updates live)</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-xl font-bold text-gray-300">—</p><p className="text-xs text-gray-400 mt-1">Clicks</p></div>
                    <div><p className="text-xl font-bold text-gray-300">—</p><p className="text-xs text-gray-400 mt-1">Add to carts</p></div>
                    <div><p className="text-xl font-bold text-gray-300">—</p><p className="text-xs text-gray-400 mt-1">Sales</p></div>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={showNextOffer}
                  className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-600 transition-colors shadow-glow">
                  See what happens next →
                </motion.button>
                <p className="text-sm text-gray-400 mt-3">Simulates 7 days later</p>
              </Step>
            )}

            {/* Step 6: Re-engagement offer — 7 days later */}
            {step === 6 && (
              <Step key="s6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary/20 mb-6">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" /><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  <span className="text-xs text-primary font-semibold">7 days later — email from the brand</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">You made a real difference.</h2>
                <p className="text-lg text-gray-500 mb-3 max-w-sm text-center leading-relaxed">
                  Because of you, 12 new people discovered us and bought something they love.
                </p>
                <p className="text-base text-gray-500 mb-8 max-w-sm text-center leading-relaxed">
                  We don't take that for granted. Thank you for being part of this.
                </p>

                {/* Results card */}
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-5 mb-6">
                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-gray-900 mb-1">12</p>
                    <p className="text-base text-gray-500">new customers found us because of you</p>
                  </div>
                  <div className="bg-green-50 rounded-xl px-4 py-3 text-center">
                    <p className="text-sm text-success font-semibold">You're one of our top 10 fans this month</p>
                  </div>
                </div>

                {/* Next offer */}
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-elevated p-6 mb-8 border-2 border-primary/20">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">You've earned this</p>
                  <p className="text-sm text-gray-500 mb-4">Because your last post helped us so much, we'd love to keep working together.</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-light overflow-hidden flex-shrink-0">
                      <img src="/products/nike-tech-fleece-hoodie.png" alt="Nike Tech Fleece Hoodie" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">Nike Tech Fleece Hoodie</p>
                      <p className="text-sm text-gray-500">{formatCurrency(130)}</p>
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-4 mb-4">
                    <p className="text-base text-gray-800 leading-relaxed">
                      Share this one with your people and we'll give you <span className="font-bold text-primary">{formatCurrency(30)} in store credit</span> — that's enough for a <span className="font-bold text-gray-900">free Nike Dri-FIT Tee</span> on us.
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 text-center">The more you help us grow, the more we can give back to you.</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => { setStep(0); setConnectedPlatforms([]); setPostUrl(''); setAiLogs([]) }}
                    className="px-6 py-3 bg-white border border-light-200 text-gray-600 rounded-full text-sm font-semibold hover:bg-light transition-colors shadow-soft">
                    Restart demo
                  </button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => router.push('/merchant')}
                    className="px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-600 transition-colors shadow-glow">
                    View merchant side
                  </motion.button>
                </div>
              </Step>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Under the Hood panel */}
        <div className="hidden lg:flex w-[380px] bg-dark flex-col flex-shrink-0 border-l border-dark-300">
          <div className="px-5 py-4 border-b border-dark-300 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-white">Under the Hood</span>
            <span className="text-xs text-gray-500 ml-auto">AI Engine</span>
          </div>

          {/* Live scoring panel */}
          <div className="px-5 py-4 border-b border-dark-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Live Scores</p>
            <div className="space-y-3">
              <MiniScore label="Loyalty Score" value={customer.loyaltyScore} detail={`${customer.orderCount} orders · ${formatCurrency(customer.avgOrderValue)} AOV`} />
              <MiniScore label="Social Score" value={customer.socialScore} detail={connectedPlatforms.length > 0 ? `${formatNumber(connectedPlatforms.reduce((s, p) => s + p.followers, 0))} followers` : 'No socials connected'} />
              <div className="border-t border-dark-300 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">Combined</span>
                <span className="text-sm font-bold text-primary">{customer.combinedScore || '—'}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Tier</span>
                <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full',
                  customer.tier === 'premium' ? 'bg-primary/20 text-primary-200' :
                  customer.tier === 'standard' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-dark-200 text-gray-400'
                )}>
                  {customer.tier === 'new' && !customer.combinedScore ? '—' : customer.tier}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Reward</span>
                <span className="text-sm font-bold text-white">{reward ? formatCurrency(reward) : '—'}</span>
              </div>
            </div>
          </div>

          {/* Formula */}
          <div className="px-5 py-4 border-b border-dark-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Formula (COGS-based)</p>
            <div className="bg-dark-100 rounded-xl px-3 py-2.5 font-mono text-xs text-gray-400 leading-relaxed">
              <p><span className="text-gray-500">product:</span> <span className="text-white">$130</span> price, <span className="text-white">$42</span> COGS</p>
              <p><span className="text-primary-200">profit</span> = $130 - $42 = <span className="text-white">$88</span></p>
              <p><span className="text-primary-200">max_reward</span> = $88 × <span className="text-yellow-300">0.30</span> = <span className="text-white">$26</span></p>
              <p><span className="text-primary-200">offer</span> = max × (score / 100)</p>
              <p className="mt-1"><span className="text-primary-200">combined</span> = loyalty×<span className="text-yellow-300">0.4</span> + social×<span className="text-yellow-300">0.6</span></p>
            </div>
          </div>

          {/* Activity log */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Activity Log</p>
            <div className="space-y-2">
              {aiLogs.length === 0 && (
                <p className="text-xs text-gray-600 italic">Waiting for customer interaction...</p>
              )}
              {aiLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2"
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                    log.type === 'action' ? 'bg-primary' :
                    log.type === 'score' ? 'bg-yellow-400' :
                    log.type === 'decision' ? 'bg-success' :
                    'bg-gray-500'
                  )} />
                  <span className={cn('text-xs leading-relaxed',
                    log.type === 'decision' ? 'text-success font-semibold' :
                    log.type === 'score' ? 'text-yellow-300' :
                    log.type === 'action' ? 'text-primary-200' :
                    'text-gray-400'
                  )}>
                    {log.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }} className="flex flex-col items-center max-w-md w-full">
      {children}
    </motion.div>
  )
}

function SocialBtn({ platform, label, connected, profile, onClick, loading, gradient }: {
  platform: string; label: string; connected: boolean; profile?: SocialProfile; onClick: () => void; loading: boolean; gradient: string
}) {
  const icons: Record<string, React.ReactNode> = {
    instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" /><circle cx="18" cy="6" r="1.5" fill="currentColor" /></svg>,
    tiktok: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    x: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  }

  if (connected && profile) {
    return (
      <div className="flex items-center gap-3 bg-white border-2 border-primary/20 rounded-xl px-4 py-3.5 shadow-soft">
        <span className="text-primary">{icons[platform]}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{profile.handle}</p>
          <p className="text-xs text-gray-500">{formatNumber(profile.followers)} followers · {profile.engagementRate}% engagement</p>
        </div>
        <span className="text-xs font-bold text-success bg-green-50 px-2.5 py-1 rounded-full">Connected</span>
      </div>
    )
  }

  return (
    <button onClick={onClick} disabled={loading}
      className={cn('w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white font-semibold text-sm transition-all shadow-card',
        `bg-gradient-to-r ${gradient}`, loading ? 'opacity-50' : 'hover:shadow-elevated hover:-translate-y-0.5')}>
      {icons[platform]}
      Connect {label}
    </button>
  )
}

function MiniScore({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-bold text-white">{value || '—'}/100</span>
      </div>
      <div className="h-1.5 bg-dark-200 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-primary rounded-full"
        />
      </div>
      <p className="text-xs text-gray-600 mt-0.5">{detail}</p>
    </div>
  )
}
