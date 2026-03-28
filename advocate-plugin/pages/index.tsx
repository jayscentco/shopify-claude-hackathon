import React from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

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
            Your customers already<br />
            love you. <span className="text-primary-200">Let them show it.</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            1000 Fans finds your most loyal customers after checkout and invites them to help you grow — by sharing products they already buy. No influencer outreach. No ad spend. Just real fans, real posts, real sales.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/offer')}
              className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-600 transition-colors shadow-glow"
            >
              See the fan experience
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
          <StatBlock value="$0" label="Setup cost — reads COGS from Shopify automatically" />
          <StatBlock value="23x" label="Average return on store credit given" />
          <StatBlock value="0" label="Influencers you need to find and email" />
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
            <p className="text-base text-gray-500 max-w-lg mx-auto">From checkout to new customers — without you lifting a finger.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'We spot your fans', desc: 'After checkout, 1000 Fans checks their purchase history. Repeat buyers and high-value customers get an exclusive invite.' },
              { num: '02', title: 'They connect socials', desc: 'Your fan links their Instagram, TikTok, or X. We learn about their audience so we can make the right offer.' },
              { num: '03', title: 'Smart reward from COGS', desc: 'We read your product margins directly from Shopify and calculate a reward that makes sense for both of you. No configuration needed.' },
              { num: '04', title: 'They share, you grow', desc: 'They post about a product they genuinely bought. New customers discover you through someone they trust. Everyone wins.' },
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

      {/* The flywheel — dark */}
      <section className="bg-dark px-6 md:px-12 py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">The flywheel</h2>
            <p className="text-base text-gray-400 max-w-lg mx-auto">It doesn't stop after one post. The more they help, the more they earn — and the more you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
              title="Fan posts, you get customers"
              description="Their post brings in 12 new customers. You didn't pay for an ad — someone who loves your brand told their friends."
            />
            <ValueCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
              title="You thank them with credit"
              description="Reward is auto-calculated from your margins. No guesswork — Shopify COGS data sets the ceiling. You never overspend."
            />
            <ValueCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              title="Good posts get bigger offers"
              description="After 7 days we measure results. Strong performers get better offers next time. The system learns who drives real growth."
            />
          </div>
        </div>
      </section>

      {/* What makes this different — white */}
      <section className="bg-white px-6 md:px-12 py-20 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Not another influencer tool</h2>
          <div className="space-y-6">
            {[
              { before: 'Influencer platforms', after: '1000 Fans', left: 'You find creators, negotiate rates, hope they post.', right: 'Your fans find themselves. They already bought the product.' },
              { before: 'Referral programs', after: '1000 Fans', left: 'Generic 10% off code. No targeting. No social proof.', right: 'Personalized offers based on loyalty + reach. Real photos, not just links.' },
              { before: 'Manual outreach', after: '1000 Fans', left: 'DM creators. Send free product. Pray for a post.', right: 'Runs after every checkout. Zero manual work. Scales with your store.' },
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="bg-light-100 rounded-2xl p-5 border border-light-200">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{row.before}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{row.left}</p>
                </div>
                <div className="bg-primary-50 rounded-2xl p-5 border border-primary/10">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">{row.after}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{row.right}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark */}
      <section className="bg-dark px-6 md:px-12 py-20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">You don't need 1000 influencers.<br />You need 1000 fans.</h2>
          <p className="text-base text-gray-400 mb-8">Install in 5 minutes. No configuration — we read your margins from Shopify. Your fans do the rest.</p>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/offer')}
              className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary-600 transition-colors shadow-glow"
            >
              See the fan experience
            </motion.button>
            <button
              onClick={() => router.push('/merchant')}
              className="px-8 py-3.5 bg-dark-100 border border-dark-300 text-white rounded-full font-semibold text-base hover:bg-dark-200 transition-colors"
            >
              Merchant dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark border-t border-dark-300 px-6 md:px-12 py-6 text-center">
        <span className="text-sm text-gray-500">1000 Fans — Your customers are your best marketers. Let them prove it.</span>
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
