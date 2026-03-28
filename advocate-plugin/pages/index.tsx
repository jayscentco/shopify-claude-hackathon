import React from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { formatCurrency } from '../lib/utils'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      {/* Nav — dark */}
      <nav className="bg-dark px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">1000 Fans</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/merchant')} className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">
            Merchant Dashboard
          </button>
          <button onClick={() => router.push('/offer')} className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-600 transition-colors shadow-glow">
            Try the demo
          </button>
        </div>
      </nav>

      {/* Hero — dark */}
      <section className="bg-dark px-6 md:px-12 pt-20 pb-24 md:pt-28 md:pb-32 relative overflow-hidden">
        {/* Gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary-200 font-medium">Shopify Plugin</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
            Turn your best customers<br />
            into your best <span className="text-primary-200">fans</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            1000 Fans identifies loyal customers after checkout, scores their social reach,
            and offers personalized store credit for sharing. Automated micro-influencer marketing that pays for itself.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/offer')}
              className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-600 transition-colors shadow-glow"
            >
              See customer experience
            </motion.button>
            <button
              onClick={() => router.push('/merchant')}
              className="px-8 py-3.5 bg-dark-100 border border-dark-300 text-white rounded-full font-semibold text-base hover:bg-dark-200 transition-colors"
            >
              Merchant dashboard
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats — light */}
      <section className="bg-light px-6 md:px-12 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          <StatBlock value="23x" label="Average ROI on store credit" />
          <StatBlock value="4.2%" label="Post-to-purchase conversion" />
          <StatBlock value="$0" label="Upfront cost to merchants" />
        </div>
      </section>

      {/* How it works — white */}
      <section className="bg-white px-6 md:px-12 py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-base text-gray-500 max-w-lg mx-auto">Four steps from checkout to attributed revenue. No manual outreach needed.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Smart targeting', desc: 'After checkout, high-value customers see an exclusive invite. Everyone else gets a standard referral link.' },
              { num: '02', title: 'Connect socials', desc: 'Customer links Instagram, TikTok, or X. We calculate their reach and your loyalty score for them.' },
              { num: '03', title: 'Personalized offer', desc: 'Algorithm combines both scores to generate a custom store credit offer. $5-50 range, fully configurable.' },
              { num: '04', title: 'Post & earn', desc: 'They share a photo with a tracked link. You get UGC + attributed sales. They get store credit.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-light rounded-2xl p-6 shadow-soft"
              >
                <span className="text-sm font-bold text-primary mb-3 block">{step.num}</span>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props — dark */}
      <section className="bg-dark px-6 md:px-12 py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Why 1000 Fans</h2>
            <p className="text-base text-gray-400 max-w-lg mx-auto">Your customers are already talking about you. Now you can track it, reward it, and scale it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
              title="Zero outreach"
              description="Your best fans are already buying from you. 1000 Fans finds and activates them automatically."
            />
            <ValueCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" /><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
              title="UGC gallery"
              description="Every verified post becomes content you can reuse with permission. Real customer photos, not stock images."
            />
            <ValueCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 20V10M18 20V4M6 20v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
              title="Self-optimizing"
              description="The algorithm learns which customers drive the most sales and automatically adjusts future offers."
            />
          </div>
        </div>
      </section>

      {/* CTA — light */}
      <section className="bg-white px-6 md:px-12 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to activate your fans?</h2>
          <p className="text-base text-gray-500 mb-8">Install in 5 minutes. See your first attributed sale within a week.</p>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/offer')}
              className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-600 transition-colors shadow-glow"
            >
              Try the customer demo
            </motion.button>
            <button
              onClick={() => router.push('/merchant')}
              className="px-8 py-3.5 bg-light border border-light-200 text-gray-700 rounded-full font-semibold text-base hover:bg-light-100 transition-colors shadow-soft"
            >
              View merchant dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark px-6 md:px-12 py-6 text-center">
        <span className="text-sm text-gray-500">1000 Fans — Turn your best customers into your best marketers</span>
      </footer>
    </div>
  )
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold text-primary">{value}</p>
      <p className="text-sm text-gray-500 mt-2">{label}</p>
    </div>
  )
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-dark-100 rounded-2xl p-6 border border-dark-300">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}
