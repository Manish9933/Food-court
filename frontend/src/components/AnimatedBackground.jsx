import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import finalBackground from '../assets/vintage_street_final.png'

const AnimatedBackground = () => {
  const [stage, setStage] = useState('driving-in') // driving-in, handoff, driving-out

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev === 'driving-in') return 'handoff'
        if (prev === 'handoff') return 'driving-out'
        return 'driving-in'
      })
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0a0b12] select-none">
      {/* 🏙️ THE FINAL PREMIUM ILLUSTRATION BACKGROUND */}
      <motion.div 
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${finalBackground})`,
          filter: 'brightness(0.7) contrast(1.1) saturate(0.95)' 
        }}
      />
      
      {/* 🌌 SOFT ATMOSPHERIC MULTIPLY OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-black/20 z-10" />

      {/* 👨‍🍳 ENHANCED FLAT CHEF (STATIONARY) */}
      <div className="absolute left-[16%] bottom-[12%] w-[160px] h-auto z-30">
         <svg viewBox="0 0 100 200" className="w-full h-auto drop-shadow-2xl">
            <g fill="#2f3542">
               <rect x="38" y="150" width="8" height="45" rx="4" />
               <rect x="54" y="150" width="8" height="45" rx="4" />
               <rect x="32" y="188" width="18" height="10" rx="5" fill="#000" />
               <rect x="50" y="188" width="18" height="10" rx="5" fill="#000" />
            </g>
            <rect x="30" y="65" width="40" height="90" rx="12" fill="#ffffff" />
            {[...Array(3)].map((_, i) => (
               <g key={i} fill="#e5e7eb">
                  <circle cx="42" cy={85 + i*20} r="2" />
                  <circle cx="58" cy={85 + i*20} r="2" />
               </g>
            ))}
            <rect x="30" y="115" width="40" height="40" fill="#1e272e" rx="2" />
            <circle cx="50" cy="45" r="18" fill="#ffdbac" />
            <path d="M42 52 Q50 52 58 52" stroke="#333" fill="none" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="44" cy="42" r="2.5" fill="#333" />
            <circle cx="56" cy="42" r="2.5" fill="#333" />
            <rect x="32" y="15" width="36" height="25" rx="6" fill="#fff" />
            <circle cx="50" cy="18" r="15" fill="#fff" />
            <path d="M44 55 Q50 59 56 55" stroke="#333" fill="none" strokeWidth="1.5" />
            <motion.rect 
              animate={stage === 'handoff' ? { rotate: -40, x: 5 } : { rotate: 20, x: 0 }}
              x="20" y="75" width="12" height="45" rx="6" fill="#fff" 
              style={{ originX: '90%', originY: '10%' }}
            />
            <motion.g 
              animate={stage === 'handoff' ? { rotate: 45, x: -5 } : { rotate: -20, x: 0 }}
              style={{ originX: '10%', originY: '10%' }}
            >
               <rect x="68" y="75" width="12" height="45" rx="6" fill="#fff" />
               <AnimatePresence>
                 {stage === 'handoff' && (
                   <motion.rect 
                     initial={{ scale: 0, opacity: 0, y: -20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     x="80" y="95" width="30" height="25" rx="4" fill="#cd853f" 
                   />
                 )}
               </AnimatePresence>
            </motion.g>
         </svg>
      </div>

      {/* 🛵 DETAILED MOTORBIKE (VESPA STYLE) */}
      <motion.div 
        animate={
          stage === 'driving-in' ? { x: '100vw', opacity: 1 } :
          stage === 'handoff' ? { x: '25vw', opacity: 1 } :
          { x: '-25vw', opacity: 1 }
        }
        transition={{ duration: stage === 'handoff' ? 1.2 : 2.5, ease: "circOut" }}
        className="absolute bottom-[9%] w-[220px] h-auto z-40"
      >
        <div className="relative">
            <svg viewBox="0 0 160 100" className="w-full h-auto drop-shadow-2xl">
               <path d="M30 85 Q30 50 70 50 L110 50 Q130 50 130 85 Z" fill="#ef4444" />
               <circle cx="45" cy="82" r="16" fill="#1a1a1a" stroke="#fff" strokeWidth="3" />
               <circle cx="115" cy="82" r="16" fill="#1a1a1a" stroke="#fff" strokeWidth="3" />
               <rect x="110" y="40" width="8" height="35" rx="4" fill="#ef4444" />
               <circle cx="122" cy="45" r="7" fill="#fbc531" opacity="0.8" />
               <g transform="translate(65, 10)">
                  <rect x="0" y="25" width="28" height="45" rx="10" fill="#1e272e" />
                  <circle cx="14" cy="12" r="13" fill="#ffdbac" />
                  <rect x="7" y="11" width="2.5" height="4" fill="#333" />
                  <rect x="18" y="11" width="2.5" height="4" fill="#333" />
                  <rect x="-2" y="0" width="32" height="9" rx="3" fill="#ef4444" />
                  <motion.rect 
                    animate={stage === 'handoff' ? { rotate: -35 } : { rotate: 10 }}
                    x="-15" y="32" width="14" height="32" rx="6" fill="#1e272e" 
                    style={{ originX: '100%', originY: '10%' }}
                  />
               </g>
               <AnimatePresence>
                 {stage === 'driving-out' && (
                   <motion.rect 
                     initial={{ x: -15, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     x="80" y="25" width="35" height="30" rx="5" fill="#cd853f" 
                   />
                 )}
               </AnimatePresence>
               <rect x="25" y="30" width="38" height="38" rx="6" fill="#f59e0b" />
               <text x="37" y="58" fill="#fff" fontSize="24" fontWeight="1000">G</text>
            </svg>
            {stage !== 'handoff' && [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: [-15, -45], y: [0, -15], opacity: [0, 0.4, 0], scale: [1, 1.5, 2] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                className="absolute left-0 bottom-4 w-2.5 h-2.5 bg-white/20 rounded-full blur-[1px]"
              />
            ))}
        </div>
      </motion.div>

      {/* ✨ FINAL ATMOSPHERIC PARTICLES */}
      {[...Array(15)].map((_, i) => (
        <motion.div
           key={i}
           initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0 }}
           animate={{ 
             y: [null, Math.random() * 80 + "%"], 
             x: [null, Math.random() * 80 + "%"],
             opacity: [0, 0.3, 0] 
           }}
           transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 5 }}
           className="absolute w-1 h-1 bg-yellow-400/20 rounded-full z-15"
        />
      ))}

      {/* 🎞️ OVERLAY NOISE & VIGNETTE */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")'}} />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/45 z-50 pointer-events-none" />
    </div>
  )
}

export default AnimatedBackground
