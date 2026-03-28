import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { getProfile, CreatorProfile } from '../lib/tasteshop'

export default function PublishedPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<CreatorProfile | null>(null)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const p = getProfile()
    if (!p) { router.replace('/onboard'); return }
    setProfile(p)
  }, [router])

  if (!mounted || !profile) return null

  const shopUrl = `tasteshop.com/@${profile.instagramHandle}`
  const localUrl = `/shop/${profile.instagramHandle}`

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${shopUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-md w-full text-center"
      >
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-accent">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </svg>
        </motion.div>

        <h1 className="text-2xl font-bold text-text-primary mb-2">Your TasteShop is live!</h1>
        <p className="text-sm text-text-secondary mb-8">
          Share your page with your audience. Every purchase through your page earns you commission.
        </p>

        {/* URL card */}
        <div className="bg-surface-1 border border-border rounded-xl p-5 mb-6">
          <p className="text-xs text-text-tertiary mb-2">Your shop URL</p>
          <div className="flex items-center gap-2 bg-surface-2 rounded-lg px-4 py-3 mb-4">
            <span className="text-sm text-text-primary font-medium flex-1 text-left truncate">{shopUrl}</span>
            <button
              onClick={copyLink}
              className="flex-shrink-0 px-3 py-1.5 bg-accent text-surface-0 rounded-md text-xs font-semibold hover:bg-accent/90 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* QR code placeholder */}
          <div className="bg-white rounded-lg p-4 inline-block mb-3">
            <div className="w-32 h-32 grid grid-cols-8 grid-rows-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    // Simple deterministic pattern for QR-like appearance
                    (i < 24 && (i % 8 < 3 || (i < 8 && i % 8 > 4))) ||
                    (i > 39 && i % 8 < 3) ||
                    (i % 7 === 0) || (i % 11 === 0)
                      ? 'bg-gray-900'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-text-tertiary">Scan to visit your shop</p>
        </div>

        {/* Share options */}
        <div className="space-y-2 mb-8">
          <p className="text-xs text-text-tertiary mb-3">Add to your socials</p>
          <div className="grid grid-cols-3 gap-2">
            <ShareButton label="Instagram Bio" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="18" cy="6" r="1.5" fill="currentColor" />
              </svg>
            } />
            <ShareButton label="TikTok Bio" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            } />
            <ShareButton label="Share Link" icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            } />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push(localUrl)}
            className="flex-1 px-4 py-2.5 bg-surface-1 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            View your shop
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/dashboard')}
            className="flex-1 px-4 py-2.5 bg-accent text-surface-0 rounded-lg font-semibold text-sm hover:bg-accent/90 transition-colors"
          >
            Go to dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

function ShareButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button className="flex flex-col items-center gap-2 py-3 bg-surface-1 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors">
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  )
}
