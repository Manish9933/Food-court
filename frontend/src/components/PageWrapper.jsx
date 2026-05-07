import React from 'react'
import { motion } from 'framer-motion'

/**
 * 🍱 PageWrapper
 * Centrally manages the layout spacing and animations for all user-facing pages.
 * Handles the fixed navbar offset and provides a consistent vertical baseline.
 */
const PageWrapper = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`pt-32 pb-16 px-6 min-h-screen transition-all duration-500 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default PageWrapper
