import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Check, Flame } from 'lucide-react'

const FoodCard = ({ item, isSelected, onAdd }) => {
  const [imgError, setImgError] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAdd = () => {
    onAdd(item)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.02 }}
      className={`relative group rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer
        ${isSelected
          ? 'border-primary-500/60 bg-primary-500/10 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
          : 'border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]'
        }`}
      onClick={handleAdd}
    >
      {/* Selected Glow Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none" />
      )}

      <div className="p-3 flex items-center gap-3">
        {/* Food Image */}
        <div className="relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-white/5">
          <img
            src={imgError ? item.fallback : item.image}
            alt={item.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* shine */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-black text-white/90 leading-tight truncate">{item.name}</p>
          <p className="text-[10px] text-white/30 mt-0.5 truncate">{item.description}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] font-black text-primary-400">₹{item.price}</span>
            <div className="flex items-center gap-0.5 text-white/20">
              <Flame size={9} />
              <span className="text-[9px] font-bold">{item.calories} cal</span>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.stopPropagation(); handleAdd() }}
          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 font-black
            ${justAdded
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : isSelected
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500 hover:text-white'
                : 'bg-white/5 text-white/40 border border-white/5 hover:bg-primary-500 hover:text-white hover:border-primary-500'
            }`}
        >
          <motion.div
            key={justAdded ? 'check' : 'plus'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {justAdded ? <Check size={14} /> : <Plus size={14} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
      )}
    </motion.div>
  )
}

export default FoodCard
