import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

/**
 * 🔮 Aura Theme Selector
 * A premium, glass-morphic theme selection component inspired by 
 * modern Apple and Stripe design systems.
 */
const ThemeToggle = () => {
  const { currentTheme, applyTheme, PALETTES } = useTheme()
  const [hoveredTheme, setHoveredTheme] = useState(null)

  return (
    <div className="relative flex items-center gap-4 bg-[#0a0a0b]/40 backdrop-blur-3xl px-5 py-2.5 rounded-full border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group/aura">
      {/* Dynamic Animated Glow behind selected theme */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentTheme}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 rounded-full blur-[30px] pointer-events-none"
          style={{ 
            background: `radial-gradient(circle at center, rgb(${PALETTES[currentTheme]['--primary-500']} / 0.12) 0%, transparent 70%)` 
          }}
        />
      </AnimatePresence>

      <div className="flex items-center gap-3 relative z-10">
        {Object.entries(PALETTES).map(([theme, palette]) => {
          const isActive = currentTheme === theme
          return (
            <div key={theme} className="relative flex items-center justify-center">
              <button
                onClick={() => applyTheme(theme)}
                onMouseEnter={() => setHoveredTheme(theme)}
                onMouseLeave={() => setHoveredTheme(null)}
                className="relative z-20 outline-none p-1"
                aria-label={`${theme} theme`}
              >
                {/* Visual Circle */}
                <motion.div 
                  className="w-3.5 h-3.5 rounded-full relative overflow-hidden"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ 
                    background: `linear-gradient(135deg, rgb(${palette['--primary-500']}), rgb(${palette['--primary-600']}))`,
                    boxShadow: isActive ? `0 0 12px rgb(${palette['--primary-500']} / 0.5)` : 'none'
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                </motion.div>

                {/* Active Indicator Ring */}
                {isActive && (
                  <motion.div 
                    layoutId="activeAuraCircle"
                    className="absolute inset-0 rounded-full border border-primary-500/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary-500/5 animate-pulse" />
                  </motion.div>
                )}
              </button>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredTheme === theme && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full mb-3 px-2 py-1 bg-[#111114] border border-white/10 rounded-lg text-[9px] font-black text-white/90 uppercase tracking-widest pointer-events-none whitespace-nowrap shadow-2xl z-50"
                  >
                    {theme}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-[#111114]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      
      <div className="h-5 w-[1px] bg-white/10 mx-0.5 relative z-10" />
      
      {/* Labeling Section */}
      <div className="flex flex-col relative z-10">
        <div className="flex items-center gap-1">
          <span className="text-[8px] uppercase font-black tracking-widest text-white/30">
            Aura:
          </span>
          <motion.span 
            key={currentTheme}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] uppercase font-black tracking-widest text-primary-500 text-glow"
          >
            {currentTheme}
          </motion.span>
        </div>
        <span className="text-[7px] uppercase font-bold tracking-[0.2em] text-white/10 leading-none mt-0.5">
          Sync Active
        </span>
      </div>
    </div>
  )
}

export default ThemeToggle
