import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { getProfile } from '../lib/tasteshop'

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // If already onboarded, redirect to dashboard
    const profile = getProfile()
    if (profile?.isPublished) {
      router.replace('/dashboard')
    }
  }, [router])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="text-lg font-semibold text-text-primary tracking-tight">TasteShop</span>
        </div>
        <button
          onClick={() => router.push('/onboard')}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-2xl text-center"
        >
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-xs text-accent font-medium">Powered by Shopify Collabs</span>
          </div>

          <h1 className="text-3xl md:text-[42px] md:leading-[1.15] font-bold text-text-primary mb-4 tracking-tight">
            Your purchases.<br />Your recommendations.<br />
            <span className="text-accent">Your shop.</span>
          </h1>

          <p className="text-base md:text-lg text-text-secondary max-w-lg mx-auto mb-10 leading-relaxed">
            TasteShop turns what you actually buy into a shoppable page your fans trust.
            Every product is verified. Partnerships are auto-disclosed. You earn on every sale.
          </p>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/onboard')}
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-accent text-surface-0 rounded-lg font-semibold text-base hover:bg-accent/90 transition-colors"
          >
            {/* Instagram icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
              <circle cx="18" cy="6" r="1.5" fill="currentColor" />
            </svg>
            Start with your Instagram
          </motion.button>

          <p className="text-xs text-text-tertiary mt-4">
            Takes 2 minutes. No credit card needed.
          </p>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mt-20 w-full"
        >
          <TrustCard
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
            title="Verified purchases"
            description="Every product is confirmed through real receipts. Your fans know it's genuine."
          />
          <TrustCard
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title="Auto-sync"
            description="Buy something new on Shopify? It shows up on your page automatically."
          />
          <TrustCard
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title="Earn on every sale"
            description="Tracked affiliate links through Shopify Collabs. Commission on every purchase."
          />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center">
        <span className="text-xs text-text-tertiary">
          TasteShop — Authentic creator commerce, built on Shopify
        </span>
      </footer>
    </div>
  )
}

function TrustCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-surface-1 border border-border rounded-lg p-5">
      <div className="text-accent mb-3">{icon}</div>
      <h3 className="text-sm font-medium text-text-primary mb-1.5">{title}</h3>
      <p className="text-xs text-text-tertiary leading-relaxed">{description}</p>
    </div>
  )
}
