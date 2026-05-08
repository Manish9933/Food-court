import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 group p-2 rounded-2xl transition-all duration-500 hover:bg-white/[0.02] ${className}`}>
      <div className="relative">
        {/* Animated Background Aura - Pulsing & Rotating */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-primary-500/30 via-indigo-500/20 to-pink-500/30 blur-[20px] rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-all duration-1000"
          animate={{ 
            rotate: [0, 360],
            scale: [1.1, 1.3, 1.1]
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        {/* Magic Particles - Drifting around the icon */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
              initial={{ x: 20, y: 20, opacity: 0 }}
              animate={{ 
                x: [20, Math.random() * 60 - 30], 
                y: [20, Math.random() * 60 - 30],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
                repeat: Infinity, 
                delay: i * 0.5 
              }}
            />
          ))}
        </div>

        {/* Main Logo Icon Container */}
        <div className="relative z-10 flex items-center justify-center">
          <svg 
            width="44" 
            height="44" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] transition-all duration-700"
          >
            {/* Enchanted Plate */}
            <motion.ellipse 
              cx="50" cy="85" rx="38" ry="10" 
              fill="url(#plate_gradient_main)" 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <ellipse cx="50" cy="83" rx="32" ry="7" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />

            {/* Fork (Left) - Matching Spoon silhouette */}
            <motion.g
              whileHover={{ rotate: -15, x: -2, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <path d="M22 78V58" stroke="url(#silver_gradient_main)" strokeWidth="3" strokeLinecap="round" />
              <mask id="fork_mask_main">
                <ellipse cx="22" cy="46" rx="7" ry="11" fill="white" />
                <rect x="18" y="34" width="1.2" height="12" fill="black" />
                <rect x="21.4" y="34" width="1.2" height="12" fill="black" />
                <rect x="24.8" y="34" width="1.2" height="12" fill="black" />
              </mask>
              <ellipse cx="22" cy="46" rx="7" ry="11" fill="url(#silver_gradient_main)" mask="url(#fork_mask_main)" />
              <ellipse cx="20.5" cy="43" rx="2" ry="4" fill="white" fillOpacity="0.2" />
            </motion.g>

            {/* Spoon (Right) */}
            <motion.g
              whileHover={{ rotate: 15, x: 2, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <path d="M78 78V58" stroke="url(#silver_gradient_main)" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="78" cy="46" rx="7" ry="11" fill="url(#silver_gradient_main)" />
              <ellipse cx="76.5" cy="43" rx="2" ry="4" fill="white" fillOpacity="0.2" />
            </motion.g>

            {/* Magic Silver Coffee Cup */}
            <motion.path 
              d="M32 55C32 55 32 82 50 82C68 82 68 55 68 55H32Z" 
              fill="url(#silver_gradient_main)" 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
            <path d="M68 62C78 62 78 75 68 75" stroke="url(#silver_gradient_main)" strokeWidth="4" strokeLinecap="round" />

            {/* Enchanted Steam */}
            <motion.g>
              {[
                { d: "M42 45C42 45 35 30 50 25C65 20 75 30 75 15", delay: 0, dur: 3 },
                { d: "M58 45C58 45 65 35 50 30C35 25 30 35 30 20", delay: 0.6, dur: 2.5 }
              ].map((path, i) => (
                <motion.path 
                  key={i}
                  d={path.d}
                  stroke="url(#steam_gradient_main)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: [0, 1, 1], 
                    opacity: [0, 0.7, 0],
                    y: [0, -5]
                  }}
                  transition={{ duration: path.dur, repeat: Infinity, delay: path.delay, ease: "easeInOut" }}
                />
              ))}
            </motion.g>

            <defs>
              <linearGradient id="plate_gradient_main" x1="12" y1="85" x2="88" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="silver_gradient_main" x1="16" y1="20" x2="84" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.5" stopColor="#94A3B8" />
                <stop offset="1" stopColor="#64748B" />
              </linearGradient>
              <linearGradient id="steam_gradient_main" x1="30" y1="5" x2="75" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F472B6" />
                <stop offset="1" stopColor="#A855F7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="flex flex-col -gap-1.5 ml-1">
        <div className="relative">
          <motion.span 
            className="heading-premium text-[26px] primary-gradient-text leading-none tracking-tight relative z-10 group-hover:brightness-125 transition-all duration-500 block pr-1"
          >
            FoodGenie
          </motion.span>
          

          {/* Text Reflection/Glow */}
          <span className="absolute inset-0 heading-premium text-[26px] primary-gradient-text leading-none tracking-tight blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-700 select-none pointer-events-none pr-1">
            FoodGenie
          </span>
          
        </div>
        
        <div className="flex items-center gap-1.5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '6px' }}
            className="h-[1px] bg-gradient-to-r from-primary-500/40 to-transparent" 
          />
          <span className="text-[7px] text-white/25 uppercase font-black tracking-[0.4em] whitespace-nowrap">
            AI Gastronomy
          </span>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '6px' }}
            className="h-[1px] bg-gradient-to-l from-primary-500/40 to-transparent" 
          />
        </div>
      </div>
    </div>
  );
};

export default Logo;
