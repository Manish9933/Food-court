import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FoodCard from './FoodCard'
const FoodSidebar = ({ plateItems, onAddItem, foodCategories }) => {
  const [activeCategory, setActiveCategory] = useState('breads')

  const currentCategory = foodCategories?.find((c) => c.id === activeCategory)
  const plateItemIds = plateItems.map((i) => i.id)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">
          Choose Items
        </h2>
        <p className="text-lg font-black text-white/80 leading-tight">Build Your Plate</p>
      </div>

      {/* Category Tabs */}
      <div className="px-3 pb-3">
        <div className="grid grid-cols-2 gap-1.5">
          {foodCategories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-3 py-2.5 rounded-xl text-left transition-all duration-300 border
                ${activeCategory === cat.id
                  ? `bg-gradient-to-br ${cat.color} ${cat.borderColor} text-white/90`
                  : 'border-white/5 bg-white/[0.02] text-white/30 hover:text-white/60 hover:border-white/10'
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{cat.icon}</span>
                <div>
                  <p className="text-[11px] font-black tracking-wide leading-none">{cat.name}</p>
                  <p className="text-[9px] text-white/30 mt-0.5">{cat.items.length} items</p>
                </div>
              </div>
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="cat-active"
                  className="absolute inset-0 rounded-xl border border-white/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-white/5 mb-3" />

      {/* Food Items List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 scrollbar-thin">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {currentCategory?.items.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                isSelected={plateItemIds.includes(item.id)}
                onAdd={onAddItem}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FoodSidebar
