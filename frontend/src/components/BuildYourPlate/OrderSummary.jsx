import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingCart, RotateCcw, Star, Flame } from 'lucide-react'
import LogoIcon from '../LogoIcon'
import useCartStore from '../../store/useCartStore'
import { useNavigate } from 'react-router-dom'

/* Group plateItems by id → { item, qty } */
const groupItems = (plateItems) => {
  const map = {}
  plateItems.forEach((item) => {
    if (map[item.id]) {
      map[item.id].qty++
    } else {
      map[item.id] = { ...item, qty: 1 }
    }
  })
  return Object.values(map)
}

const OrderSummary = ({ plateItems, onRemoveItem, onClearPlate, onAddCombo }) => {
  const grouped      = groupItems(plateItems)
  const total        = plateItems.reduce((s, i) => s + i.price, 0)
  const totalCal     = plateItems.reduce((s, i) => s + i.calories, 0)
  const navigate     = useNavigate()
  const addToCart = useCartStore((state) => state.addToCart)

  const handlePlaceOrder = () => {
    // Add each unique item to cart with its quantity
    grouped.forEach(({ qty, ...item }) => {
      // The store's addToCart handles existing items by ID, 
      // but it adds +1 if called. 
      // If we want to add multiple at once, we should either loop or update the store.
      // Since addToCart only adds 1, I'll loop for now to avoid changing the store's logic.
      for (let i = 0; i < qty; i++) {
        addToCart({ 
          _id: item.id, 
          name: item.name, 
          price: item.price, 
          image: item.image || item.fallback 
        })
      }
    })
    navigate('/cart')
  }

  /* Helper: decrease qty by 1 (calls parent's legacy 2-arg handler) */
  const decreaseQty = (itemId) => onRemoveItem(itemId)

  /* Helper: increase qty by 1 */
  const increaseQty = (item) => {
    onRemoveItem(null, item)
  }

  /* Helper: remove all of this item type (calls decrease until 0) */
  const clearType = (itemId, qty) => {
    for (let i = 0; i < qty; i++) onRemoveItem(itemId)
  }

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">
          Summary
        </h2>
        <p className="text-lg font-black text-white/80 leading-tight">Order Details</p>
      </div>
      <div className="mx-4 border-t border-white/5 mb-3" />

      {/* Empty state */}
      {grouped.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="mb-4"
          >
            <LogoIcon size={64} />
          </motion.div>
          <p className="text-[13px] font-black text-white/30">Your plate is empty</p>
          <p className="text-[11px] text-white/15 mt-1">Add items from the left sidebar</p>
        </div>
      ) : (
        /* Items list */
        <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-2">
          <AnimatePresence initial={false}>
            {grouped.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-3
                           hover:border-white/10 transition-colors"
              >
                {/* Top row: emoji + name + price */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-white/90 truncate">{item.name}</p>
                    <div className="flex items-center gap-1 mt-0.5 text-white/25">
                      <Flame size={9} />
                      <span className="text-[9px] font-bold">{item.calories * item.qty} cal</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[13px] font-black text-primary-400">₹{item.price * item.qty}</p>
                    <p className="text-[9px] text-white/20">₹{item.price} each</p>
                  </div>
                </div>

                {/* Controls row */}
                <div className="flex items-center justify-between mt-2.5">
                  {/* Remove-all button */}
                  <button
                    onClick={() => clearType(item.id, item.qty)}
                    className="flex items-center gap-1 text-[10px] font-bold
                               text-red-400/40 hover:text-red-400 transition-colors"
                    title={`Remove all ${item.name}`}
                  >
                    <Trash2 size={10} />
                    <span>Remove</span>
                  </button>

                  {/* ─ qty + controls */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => decreaseQty(item.id)}
                      className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10
                                 border border-white/5 hover:border-white/15
                                 flex items-center justify-center
                                 text-white/40 hover:text-white transition-all"
                    >
                      <Minus size={11} />
                    </motion.button>

                    <AnimatePresence mode="wait">
                      <motion.span
                        key={item.qty}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-[14px] font-black text-white/80 w-5 text-center tabular-nums"
                      >
                        {item.qty}
                      </motion.span>
                    </AnimatePresence>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => increaseQty(item)}
                      className="w-7 h-7 rounded-xl bg-primary-500/10 hover:bg-primary-500/20
                                 border border-primary-500/20 hover:border-primary-500/40
                                 flex items-center justify-center
                                 text-primary-400 hover:text-primary-300 transition-all"
                    >
                      <Plus size={11} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 pb-4 pt-2 space-y-3">

        {/* Totals card */}
        <AnimatePresence>
          {grouped.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-2xl bg-white/[0.02] border border-white/5 p-3 space-y-2"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/30 font-medium">Items ({plateItems.length})</span>
                <span className="text-white/50 font-bold">₹{total}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/30 font-medium">Taxes & Fees (5%)</span>
                <span className="text-white/50 font-bold">₹{Math.round(total * 0.05)}</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-black text-white/70">Total</span>
                <motion.span
                  key={total}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-[17px] font-black text-primary-400"
                >
                  ₹{total + Math.round(total * 0.05)}
                </motion.span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                <span className="text-[9px] text-white/20 font-medium">{totalCal} cal total</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="space-y-2">
          {grouped.length > 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePlaceOrder}
                className="w-full py-3.5 rounded-2xl
                           bg-primary-600 hover:bg-primary-500 text-white
                           font-black text-[12px] uppercase tracking-[0.2em]
                           flex items-center justify-center gap-2.5
                           shadow-[0_8px_24px_rgba(249,115,22,0.3)] transition-all"
              >
                <ShoppingCart size={16} />
                Place Order
              </motion.button>

              <button
                onClick={onClearPlate}
                className="w-full py-2.5 rounded-2xl border border-white/5
                           text-white/30 hover:text-red-400
                           hover:border-red-500/20 hover:bg-red-500/5
                           font-black text-[11px] uppercase tracking-widest
                           flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw size={13} />
                Clear Plate
              </button>
            </>
          )}

          {/* Combo buttons */}
          <div className="pt-1">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/15 mb-2 text-center">
              Try a Combo
            </p>
            <div className="space-y-1.5">
              {[
                { name: 'Classic Thali', icon: <LogoIcon size={20} /> },
                { name: 'Paneer Feast',  icon: <LogoIcon size={20} /> },
                { name: 'Biryani Combo', icon: <LogoIcon size={20} /> },
              ].map((combo) => (
                <button
                  key={combo.name}
                  onClick={() => onAddCombo(combo.name)}
                  className="w-full px-4 py-2.5 rounded-xl
                             border border-white/5 bg-white/[0.02]
                             hover:border-primary-500/30 hover:bg-primary-500/5
                             text-white/30 hover:text-white/70
                             flex items-center gap-2.5 text-[11px] font-black transition-all"
                >
                  <span className="text-base">{combo.icon || combo.emoji}</span>
                  {combo.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
