import React from 'react';
import { motion } from 'framer-motion';

const LogoIcon = ({ className = "", size = 48 }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Enchanted Aura */}
      <div className="absolute inset-0 bg-primary-500/20 blur-[25px] rounded-full scale-125" />
      
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]"
      >
        {/* Enchanted Plate */}
        <ellipse cx="50" cy="85" rx="38" ry="10" fill="url(#plate_gradient_icon)" opacity="0.3" />
        <ellipse cx="50" cy="83" rx="32" ry="7" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />

        {/* Fork (Left) */}
        <path d="M22 78V58" stroke="url(#silver_gradient_icon)" strokeWidth="3" strokeLinecap="round" />
        <mask id="fork_mask_icon">
          <ellipse cx="22" cy="46" rx="7" ry="11" fill="white" />
          <rect x="18" y="34" width="1.5" height="12" fill="black" />
          <rect x="21.25" y="34" width="1.5" height="12" fill="black" />
          <rect x="24.5" y="34" width="1.5" height="12" fill="black" />
        </mask>
        <ellipse cx="22" cy="46" rx="7" ry="11" fill="url(#silver_gradient_icon)" mask="url(#fork_mask_icon)" />

        {/* Spoon (Right) */}
        <path d="M78 78V58" stroke="url(#silver_gradient_icon)" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="78" cy="46" rx="7" ry="11" fill="url(#silver_gradient_icon)" />

        {/* Magic Silver Coffee Cup */}
        <path d="M32 55C32 55 32 82 50 82C68 82 68 55 68 55H32Z" fill="url(#silver_gradient_icon)" />
        <path d="M68 62C78 62 78 75 68 75" stroke="url(#silver_gradient_icon)" strokeWidth="4" strokeLinecap="round" />

        {/* Enchanted Steam */}
        <motion.g>
          <motion.path 
            d="M42 45C42 45 35 30 50 25C65 20 75 30 75 15" 
            stroke="url(#steam_gradient_icon)" 
            strokeWidth="3" 
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.8, 0], y: [0, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path 
            d="M58 45C58 45 65 35 50 30C35 25 30 35 30 20" 
            stroke="url(#steam_gradient_icon)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.6, 0], y: [0, -5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
          />
        </motion.g>

        <defs>
          <linearGradient id="plate_gradient_icon" x1="12" y1="85" x2="88" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="silver_gradient_icon" x1="16" y1="20" x2="84" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#94A3B8" />
            <stop offset="1" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="steam_gradient_icon" x1="30" y1="5" x2="75" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F472B6" />
            <stop offset="1" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LogoIcon;
