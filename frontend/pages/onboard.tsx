import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import {
  MOCK_CREATOR, MOCK_IMPORTED_PRODUCTS,
  saveProfile, saveProducts, getProfile,
  CreatorProfile,
} from '../lib/tasteshop'

const STEPS = ['Connect Instagram', 'Connect Gmail', 'Your Products']

export default function OnboardPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<CreatorProfile>(MOCK_CREATOR)
  const [productsImported, setProductsImported] = useState(false)

  useEffect(() => {
    const existing = getProfile()
    if (existing?.isPublished) router.replace('/dashboard')
  }, [router])

  // Mock Instagram OAuth
  const connectInstagram = () => {
    setLoading(true)
    setTimeout(() => {
      setProfile({ ...MOCK_CREATOR })
      saveProfile({ ...MOCK_CREATOR })
      setLoading(false)
      setStep(1)
    }, 1500)
  }

  // Mock Gmail connect + receipt scan
  const connectGmail = () => {
    setLoading(true)
    setTimeout(() => {
      saveProducts(MOCK_IMPORTED_PRODUCTS)
      setProductsImported(true)
      setLoading(false)
      setStep(2)
    }, 2000)
  }

  const goToEdit = () => {
    router.push('/edit')
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="text-lg font-semibold text-text-primary tracking-tight">TasteShop</span>
        </div>
        <span className="text-xs text-text-tertiary">Step {step + 1} of {STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-surface-2">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: '0%' }}
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepContainer key="step-0">
              <StepIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                </svg>
              </StepIcon>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Connect your Instagram</h2>
              <p className="text-sm text-text-secondary mb-8 max-w-sm text-center leading-relaxed">
                We'll use your profile photo, bio, and aesthetic to create your TasteShop page. Your handle becomes your shop URL.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={connectInstagram}
                disabled={loading}
                className={cn(
                  'flex items-center gap-3 px-8 py-3.5 rounded-lg font-semibold text-base transition-colors',
                  loading
                    ? 'bg-surface-2 text-text-tertiary cursor-wait'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:opacity-90'
                )}
              >
                {loading ? (
                  <>
                    <Spinner />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                    </svg>
                    Connect Instagram
                  </>
                )}
              </motion.button>

              <p className="text-xs text-text-tertiary mt-4">
                We only read your public profile. No posting access.
              </p>
            </StepContainer>
          )}

          {step === 1 && (
            <StepContainer key="step-1">
              {/* Show connected profile */}
              <div className="flex items-center gap-3 mb-8 bg-surface-1 border border-border rounded-lg px-4 py-3">
                <img
                  src={profile.profilePhoto}
                  alt={profile.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">{profile.displayName}</p>
                  <p className="text-xs text-text-tertiary">@{profile.instagramHandle}</p>
                </div>
                <span className="ml-auto text-xs text-accent font-medium">Connected</span>
              </div>

              <StepIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </StepIcon>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Connect your Gmail</h2>
              <p className="text-sm text-text-secondary mb-8 max-w-sm text-center leading-relaxed">
                We'll scan your Shopify order confirmations to auto-import products you've actually purchased.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={connectGmail}
                disabled={loading}
                className={cn(
                  'flex items-center gap-3 px-8 py-3.5 rounded-lg font-semibold text-base transition-colors',
                  loading
                    ? 'bg-surface-2 text-text-tertiary cursor-wait'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                )}
              >
                {loading ? (
                  <>
                    <Spinner dark />
                    {productsImported ? 'Found 8 products!' : 'Scanning receipts...'}
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" />
                      <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Connect Gmail
                  </>
                )}
              </motion.button>

              <button
                onClick={() => { saveProducts(MOCK_IMPORTED_PRODUCTS); setStep(2) }}
                className="text-xs text-text-tertiary hover:text-text-secondary mt-4 transition-colors"
              >
                Skip for now
              </button>
            </StepContainer>
          )}

          {step === 2 && (
            <StepContainer key="step-2">
              <StepIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </StepIcon>
              <h2 className="text-2xl font-bold text-text-primary mb-2">We found 8 products!</h2>
              <p className="text-sm text-text-secondary mb-6 max-w-sm text-center leading-relaxed">
                These were imported from your Shopify purchase receipts.
                You can edit, reorder, or hide them next.
              </p>

              {/* Mini product preview */}
              <div className="w-full max-w-md space-y-2 mb-8">
                {MOCK_IMPORTED_PRODUCTS.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 bg-surface-1 border border-border rounded-lg px-3 py-2.5">
                    <div className="w-8 h-8 rounded bg-surface-2 flex items-center justify-center text-text-tertiary text-xs overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        p.title.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{p.title}</p>
                      <p className="text-xs text-text-tertiary">${p.price.toFixed(2)}</p>
                    </div>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-md font-medium',
                      p.source === 'bought'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-status-info/10 text-status-info'
                    )}>
                      {p.source === 'bought' ? 'Verified' : 'Partnership'}
                    </span>
                  </div>
                ))}
                <div className="text-center text-xs text-text-tertiary py-1">
                  + 4 more products
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToEdit}
                className="px-8 py-3.5 bg-accent text-surface-0 rounded-lg font-semibold text-base hover:bg-accent/90 transition-colors"
              >
                Customize your page
              </motion.button>
            </StepContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col items-center max-w-md w-full"
    >
      {children}
    </motion.div>
  )
}

function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-16 h-16 rounded-2xl bg-surface-1 border border-border flex items-center justify-center text-accent mb-6">
      {children}
    </div>
  )
}

function Spinner({ dark = false }: { dark?: boolean }) {
  return (
    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={dark ? '#999' : 'rgba(255,255,255,0.3)'} strokeWidth="3" />
      <path d="M12 2a10 10 0 019.95 9" stroke={dark ? '#333' : 'white'} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
