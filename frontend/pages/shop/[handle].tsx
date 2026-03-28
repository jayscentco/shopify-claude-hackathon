import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { cn, formatCurrency } from '../../lib/utils'
import {
  getProfile, getProducts, getCategories, getCheckoutUrl,
  TasteShopProduct, CreatorProfile,
} from '../../lib/tasteshop'

export default function ShopPage() {
  const router = useRouter()
  const { handle } = router.query
  const [profile, setProfile] = useState<CreatorProfile | null>(null)
  const [products, setProducts] = useState<TasteShopProduct[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const p = getProfile()
    if (!p) return
    setProfile(p)
    setProducts(getProducts().filter(prod => !prod.hidden))
  }, [handle])

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <p className="text-text-tertiary">Loading...</p>
      </div>
    )
  }

  const categories = ['All', ...getCategories(products)]
  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory)

  const verifiedCount = products.filter(p => p.source === 'bought').length
  const totalCount = products.length

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Trust banner */}
      <div className="bg-accent/5 border-b border-accent/10 px-4 py-2.5 text-center">
        <p className="text-xs text-accent/80">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="inline mr-1.5 -mt-0.5">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" />
          </svg>
          Verified by TasteShop &mdash; {verifiedCount} of {totalCount} products confirmed via purchase receipts. Partnerships auto-disclosed.
        </p>
      </div>

      {/* Creator header */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-6">
        <div className="flex flex-col items-center text-center">
          <img
            src={profile.profilePhoto}
            alt={profile.displayName}
            className="w-20 h-20 rounded-full mb-4 ring-2 ring-border ring-offset-2 ring-offset-surface-0"
          />
          <h1 className="text-2xl font-bold text-text-primary mb-1">{profile.displayName}</h1>
          <p className="text-sm text-text-tertiary mb-1">@{profile.instagramHandle}</p>
          <p className="text-sm text-text-secondary max-w-sm mb-6">{profile.bio}</p>

          {/* Category tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 w-full justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                  activeCategory === cat
                    ? 'bg-accent text-surface-0'
                    : 'bg-surface-1 text-text-secondary hover:text-text-primary border border-border'
                )}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1 opacity-60">
                    {products.filter(p => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              creatorHandle={profile.instagramHandle}
              index={i}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-tertiary text-sm">No products in this category.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-sm font-semibold text-text-primary tracking-tight">TasteShop</span>
        </div>
        <p className="text-xs text-text-tertiary">
          Authentic creator commerce, verified by TasteShop
        </p>
      </footer>
    </div>
  )
}

function ProductCard({ product, creatorHandle, index }: {
  product: TasteShopProduct
  creatorHandle: string
  index: number
}) {
  const checkoutUrl = getCheckoutUrl(product, creatorHandle)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-surface-1 border border-border rounded-lg overflow-hidden group"
    >
      {/* Image placeholder */}
      <div className="aspect-square bg-surface-2 flex items-center justify-center relative">
        {product.image ? (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-3xl text-text-tertiary/30 font-bold">{product.title.charAt(0)}</span>
        )}

        {/* Badge */}
        <div className="absolute top-2 left-2">
          {product.source === 'bought' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-accent/20 text-accent backdrop-blur-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" />
              </svg>
              Verified Purchase
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-status-info/20 text-status-info backdrop-blur-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Partnership Disclosed
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-text-primary truncate mb-0.5">{product.title}</p>
        <p className="text-xs text-text-tertiary mb-3">
          {product.category} &middot; {product.vendor}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary">{formatCurrency(product.price)}</span>
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-accent text-surface-0 rounded-md text-xs font-semibold hover:bg-accent/90 transition-colors"
          >
            Buy
          </a>
        </div>
      </div>
    </motion.div>
  )
}
