import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import LogoIcon from '../LogoIcon'


/* ─────────────────────────────────────────────
   Radial positions for up to 9 unique item slots
───────────────────────────────────────────── */
const PLATE_POSITIONS = [
  { top: '50%', left: '50%' },     // 0 – Center
  { top: '16%', left: '50%' },     // 1 – Top
  { top: '32%', left: '80%' },     // 2 – Top-Right
  { top: '66%', left: '80%' },     // 3 – Bottom-Right
  { top: '84%', left: '50%' },     // 4 – Bottom
  { top: '66%', left: '20%' },     // 5 – Bottom-Left
  { top: '32%', left: '20%' },     // 6 – Top-Left
  { top: '50%', left: '80%' },     // 7 – Right
  { top: '50%', left: '20%' },     // 8 – Left
]

/* ─────────────────────────────────────────────
   Per-item action menu (long-press / tap mobile)
───────────────────────────────────────────── */
const ActionMenu = ({ item, qty, onClose, onRemoveOne, onAddOne, onClearAll }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: 8 }}
    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    className="absolute z-50 bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2
               bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10
               rounded-2xl shadow-2xl p-2 min-w-[160px]"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Arrow pointer */}
    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3
                    bg-[#1a1a1a] border-r border-b border-white/10
                    rotate-45" />

    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest px-2 pt-1 pb-2 text-center border-b border-white/5">
      {item.name}
    </p>

    {/* Qty row */}
    <div className="flex items-center justify-between px-2 py-2.5 border-b border-white/5">
      <span className="text-[11px] text-white/40 font-bold">Qty</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onRemoveOne}
          className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8
                     flex items-center justify-center text-white/50 hover:text-white transition-all"
        >
          <Minus size={10} />
        </button>
        <span className="text-[13px] font-black text-white/80 w-4 text-center">{qty}</span>
        <button
          onClick={onAddOne}
          className="w-6 h-6 rounded-lg bg-primary-500/10 hover:bg-primary-500/20
                     border border-primary-500/20 flex items-center justify-center
                     text-primary-400 hover:text-primary-300 transition-all"
        >
          <Plus size={10} />
        </button>
      </div>
    </div>

    {/* Clear all of this type */}
    <button
      onClick={onClearAll}
      className="w-full flex items-center gap-2 px-2 py-2.5 text-[11px] font-bold
                 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
    >
      <Trash2 size={12} />
      Remove all ({qty})
    </button>

    {/* Close */}
    <button
      onClick={onClose}
      className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center
                 text-white/20 hover:text-white/60"
    >
      <X size={11} />
    </button>
  </motion.div>
)

/* ─────────────────────────────────────────────
   Single grouped plate item (shows qty badge)
───────────────────────────────────────────── */
const PlateItem = ({ item, qty, posIndex, onRemoveOne, onAddOne, onClearAll }) => {
  const [imgError, setImgError] = useState(false)
  const [showMenu, setShowMenu]   = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const longPressTimer = useRef(null)
  const pos = PLATE_POSITIONS[posIndex % PLATE_POSITIONS.length]

  /* Long-press detection for mobile */
  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setShowMenu(true), 500)
  }
  const cancelLongPress = () => clearTimeout(longPressTimer.current)

  const handleTap = (e) => {
    e.stopPropagation()
    // On small screens show menu; on large screens ❌ button handles it
    if (window.innerWidth < 1024) setShowMenu((v) => !v)
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -20 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0, rotate: 20 }}
      whileHover={{ scale: 1.12, zIndex: 30 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        transform: 'translate(-50%, -50%)',
      }}
      className="group cursor-pointer select-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => { setIsHovered(false); setShowMenu(false) }}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
      onClick={handleTap}
    >
      <div className="relative">

        {/* Glow ring on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.3 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-full bg-primary-500/25 blur-md pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Food image circle */}
        <div
          className={`w-[60px] h-[60px] rounded-full overflow-hidden shadow-xl
                      border-2 transition-all duration-300 bg-white/5
                      ${isHovered
                        ? 'border-primary-400/60 shadow-[0_0_20px_rgba(249,115,22,0.35)]'
                        : 'border-white/20'
                      }`}
        >
          <img
            src={imgError ? item.fallback : item.image}
            alt={item.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* ❌ Remove button — visible on desktop hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={(e) => { e.stopPropagation(); onRemoveOne() }}
              aria-label={`Remove ${item.name}`}
              className="absolute -top-1.5 -right-1.5 z-20 w-[22px] h-[22px]
                         bg-red-500 hover:bg-red-400 rounded-full
                         flex items-center justify-center
                         shadow-[0_2px_12px_rgba(239,68,68,0.5)]
                         border border-red-300/40 transition-colors"
            >
              <X size={11} className="text-white" strokeWidth={3} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Qty badge (show if qty > 1) */}
        <AnimatePresence>
          {qty > 1 && (
            <motion.div
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -bottom-1 -right-1 z-10 min-w-[18px] h-[18px] px-1
                         bg-primary-600 border border-primary-400/50 rounded-full
                         flex items-center justify-center
                         text-[9px] font-black text-white shadow-lg"
            >
              ×{qty}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Name tooltip */}
        <AnimatePresence>
          {isHovered && !showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-10"
            >
              <span className="text-[9px] font-black text-white/70
                               bg-black/70 backdrop-blur-sm
                               px-2 py-0.5 rounded-full border border-white/10">
                {item.name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Menu (mobile long-press / mobile tap) */}
        <AnimatePresence>
          {showMenu && (
            <ActionMenu
              item={item}
              qty={qty}
              onClose={() => setShowMenu(false)}
              onRemoveOne={() => { onRemoveOne(); if (qty <= 1) setShowMenu(false) }}
              onAddOne={() => onAddOne()}
              onClearAll={() => { onClearAll(); setShowMenu(false) }}
            />
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Main PlateCanvas
───────────────────────────────────────────── */
const PlateCanvas = ({ plateItems, onRemoveOneById, onAddOneById, onClearTypeById }) => {

  /* Deduplicate: group by item.id → { item, qty, posIndex } */
  const grouped = (() => {
    const map = {}
    let posIdx = 0
    plateItems.forEach((item) => {
      if (map[item.id]) {
        map[item.id].qty++
      } else {
        map[item.id] = { item, qty: 1, posIndex: posIdx++ }
      }
    })
    return Object.values(map)
  })()

  const totalCal = plateItems.reduce((s, i) => s + i.calories, 0)
  const calPct   = Math.min((totalCal / 2000) * 100, 100)

  return (
    <div className="flex flex-col items-center justify-center h-full py-6 px-4">

      {/* Header */}
      <div className="text-center mb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20 mb-1">
          Your Plate
        </p>
        <h2 className="text-xl font-black text-white/80 flex items-center justify-center gap-2">
          {plateItems.length === 0
            ? <>Start Building <LogoIcon size={24} /></>
            : `${plateItems.length} Item${plateItems.length > 1 ? 's' : ''} Added`
          }
        </h2>
        {plateItems.length > 0 && (
          <p className="text-[10px] text-white/20 mt-0.5 font-medium">
            Hover an item to remove · Long-press on mobile
          </p>
        )}
      </div>

      {/* Plate */}
      <div className="relative flex items-center justify-center">
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-full bg-primary-500/5 blur-3xl scale-125 pointer-events-none" />

        <div className="relative w-[330px] h-[330px] sm:w-[370px] sm:h-[370px]">
          {/* Outer decorative ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/5
                          bg-gradient-to-br from-white/[0.03] to-transparent" />
          {/* Inner ring */}
          <div className="absolute inset-4 rounded-full border border-white/[0.06]
                          bg-gradient-to-br from-[#1a1a1a] to-[#111]" />
          {/* Plate surface */}
          <div className="absolute inset-8 rounded-full
                          bg-gradient-to-br from-[#1e1e1e] via-[#181818] to-[#141414]
                          shadow-inner border border-white/5">
            {/* Inner dashed rim */}
            <div className="absolute inset-3 rounded-full border border-dashed border-white/[0.04]" />

            {/* Empty state */}
            <AnimatePresence>
              {plateItems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    className="mb-3"
                  >
                    <LogoIcon size={80} />
                  </motion.div>
                  <p className="text-[11px] font-black text-white/20 uppercase tracking-widest">
                    Tap items to add
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Grouped food items */}
          <AnimatePresence>
            {grouped.map(({ item, qty, posIndex }) => (
              <PlateItem
                key={item.id}
                item={item}
                qty={qty}
                posIndex={posIndex}
                onRemoveOne={() => onRemoveOneById(item.id)}
                onAddOne={() => onAddOneById(item)}
                onClearAll={() => onClearTypeById(item.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Calorie bar */}
      <AnimatePresence>
        {plateItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 w-full max-w-[330px]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                Est. Calories
              </span>
              <span className={`text-[12px] font-black transition-colors ${
                calPct > 80 ? 'text-rose-400' : calPct > 60 ? 'text-amber-400' : 'text-primary-400'
              }`}>
                {totalCal} kcal
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${calPct}%` }}
                transition={{ type: 'spring', stiffness: 70, damping: 20 }}
                className={`h-full rounded-full ${
                  calPct > 80
                    ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                    : calPct > 60
                      ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                      : 'bg-gradient-to-r from-primary-600 to-primary-400'
                }`}
              />
            </div>
            <p className="text-[9px] text-white/15 mt-1 text-right font-medium">
              of 2000 kcal daily goal
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PlateCanvas
