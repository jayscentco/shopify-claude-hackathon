import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { cn, formatCurrency } from '../lib/utils'
import {
  getProfile, getProducts, saveProducts, saveProfile,
  TasteShopProduct, CreatorProfile, getCategories,
} from '../lib/tasteshop'
import Modal from '../components/ui/Modal'

export default function EditPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<CreatorProfile | null>(null)
  const [products, setProducts] = useState<TasteShopProduct[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const p = getProfile()
    if (!p) { router.replace('/onboard'); return }
    setProfile(p)
    setProducts(getProducts())
  }, [router])

  const updateProducts = (updated: TasteShopProduct[]) => {
    setProducts(updated)
    saveProducts(updated)
  }

  const toggleHide = (id: string) => {
    updateProducts(products.map(p =>
      p.id === id ? { ...p, hidden: !p.hidden } : p
    ))
  }

  const removeProduct = (id: string) => {
    updateProducts(products.filter(p => p.id !== id))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const arr = [...products]
    ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
    arr.forEach((p, i) => p.position = i)
    updateProducts(arr)
  }

  const moveDown = (index: number) => {
    if (index === products.length - 1) return
    const arr = [...products]
    ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
    arr.forEach((p, i) => p.position = i)
    updateProducts(arr)
  }

  const addGiftedProduct = (product: Partial<TasteShopProduct>) => {
    const newProduct: TasteShopProduct = {
      id: `ts-custom-${Date.now()}`,
      title: product.title || 'New Product',
      handle: (product.title || 'new-product').toLowerCase().replace(/\s+/g, '-'),
      price: product.price || 0,
      image: null,
      category: product.category || 'Other',
      vendor: product.partnerBrand || 'Unknown',
      shopifyUrl: product.shopifyUrl || '',
      variantId: '',
      source: 'partnership',
      partnerBrand: product.partnerBrand,
      note: product.note,
      hidden: false,
      position: products.length,
      clicks: 0,
      sales: 0,
      earnings: 0,
    }
    updateProducts([...products, newProduct])
    setShowAddModal(false)
  }

  const publish = () => {
    if (!profile) return
    const updated = { ...profile, isPublished: true }
    saveProfile(updated)
    setProfile(updated)
    router.push('/published')
  }

  if (!mounted || !profile) return null

  const visible = products.filter(p => !p.hidden)
  const hidden = products.filter(p => p.hidden)
  const categories = getCategories(products)

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-surface-0/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-6 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-lg font-semibold text-text-primary tracking-tight">TasteShop</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/shop/${profile.instagramHandle}`)}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Preview
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={publish}
              className="px-5 py-2 bg-accent text-surface-0 rounded-lg font-semibold text-sm hover:bg-accent/90 transition-colors"
            >
              Publish
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={profile.profilePhoto}
            alt={profile.displayName}
            className="w-14 h-14 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-text-primary">{profile.displayName}</h1>
            <p className="text-sm text-text-tertiary">tasteshop.com/@{profile.instagramHandle}</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Products" value={visible.length.toString()} />
          <StatCard label="Categories" value={categories.length.toString()} />
          <StatCard label="Partnerships" value={products.filter(p => p.source === 'partnership').length.toString()} />
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-text-primary">Your Products</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-1 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add product
          </button>
        </div>

        {/* Product list */}
        <div className="space-y-2 mb-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: product.hidden ? 0.5 : 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex items-center gap-3 bg-surface-1 border border-border rounded-lg px-4 py-3',
                product.hidden && 'opacity-50'
              )}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveUp(index)}
                  className="text-text-tertiary hover:text-text-primary transition-colors p-0.5"
                  disabled={index === 0}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 2l4 4H2z" fill="currentColor" /></svg>
                </button>
                <button
                  onClick={() => moveDown(index)}
                  className="text-text-tertiary hover:text-text-primary transition-colors p-0.5"
                  disabled={index === products.length - 1}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 10l4-4H2z" fill="currentColor" /></svg>
                </button>
              </div>

              {/* Product image */}
              <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-text-tertiary text-sm font-medium flex-shrink-0 overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  product.title.charAt(0)
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary truncate">{product.title}</p>
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0',
                    product.source === 'bought'
                      ? 'bg-accent/10 text-accent'
                      : 'bg-status-info/10 text-status-info'
                  )}>
                    {product.source === 'bought' ? 'Verified Purchase' : 'Partnership'}
                  </span>
                </div>
                <p className="text-xs text-text-tertiary">
                  {product.category} &middot; {formatCurrency(product.price)}
                  {product.partnerBrand && ` &middot; via ${product.partnerBrand}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => toggleHide(product.id)}
                  className={cn(
                    'p-1.5 rounded-md transition-colors text-xs',
                    product.hidden
                      ? 'text-accent hover:bg-accent/10'
                      : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-2'
                  )}
                  title={product.hidden ? 'Show' : 'Hide'}
                >
                  {product.hidden ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="p-1.5 rounded-md text-text-tertiary hover:text-status-error hover:bg-status-error/10 transition-colors"
                  title="Remove"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hidden products section */}
        {hidden.length > 0 && (
          <div className="border-t border-border pt-6">
            <p className="text-xs text-text-tertiary mb-3">{hidden.length} hidden product{hidden.length > 1 ? 's' : ''} — not visible on your public page</p>
          </div>
        )}
      </div>

      {/* Add product modal */}
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addGiftedProduct}
      />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-1 border border-border rounded-lg px-4 py-3 text-center">
      <p className="text-xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-tertiary mt-0.5">{label}</p>
    </div>
  )
}

function AddProductModal({ open, onClose, onAdd }: {
  open: boolean
  onClose: () => void
  onAdd: (product: Partial<TasteShopProduct>) => void
}) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    onAdd({
      title,
      price: parseFloat(price) || 0,
      category: category || 'Other',
      partnerBrand: brand,
      shopifyUrl: url,
      note,
    })
    setTitle(''); setPrice(''); setCategory(''); setBrand(''); setUrl(''); setNote('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Add a product">
      <div className="space-y-4">
        <p className="text-xs text-text-secondary mb-4">
          Add a product from a brand partnership. TasteShop will automatically label it with a "Partnership Disclosed" badge.
        </p>
        <Field label="Product title" value={title} onChange={setTitle} placeholder="e.g. Limited Edition Sneakers" />
        <Field label="Shopify product URL" value={url} onChange={setUrl} placeholder="https://store.myshopify.com/products/..." />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price" value={price} onChange={setPrice} placeholder="99.00" />
          <Field label="Category" value={category} onChange={setCategory} placeholder="Shoes" />
        </div>
        <Field label="Brand name" value={brand} onChange={setBrand} placeholder="Nike" />
        <Field label="Note (optional)" value={note} onChange={setNote} placeholder="Love this collab!" />

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!title}
            className="flex-1 px-4 py-2.5 bg-accent text-surface-0 rounded-lg font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-40"
          >
            Add product
          </motion.button>
        </div>
      </div>
    </Modal>
  )
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string
}) {
  return (
    <div>
      <label className="text-xs text-text-tertiary mb-1.5 block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 transition-colors"
      />
    </div>
  )
}
