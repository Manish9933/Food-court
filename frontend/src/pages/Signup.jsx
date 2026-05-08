import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import AnimatedBackground from '../components/AnimatedBackground'
import Logo from '../components/Logo'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(fullName, email, password)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-[calc(100vh-110px)] w-full flex items-center justify-center lg:justify-end lg:pr-[12%] px-4 py-8 relative overflow-hidden bg-[#0a0a0c]">
      <AnimatedBackground />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-[#111114]/85 backdrop-blur-3xl rounded-[2rem] border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Inner ambient glow */}
          <div className="absolute -top-20 -right-20 w-52 h-52 bg-primary-500/10 blur-[90px] rounded-full pointer-events-none" />

          {/* Card Content */}
          <div className="p-8 sm:p-10">

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <Logo className="scale-125 mb-4" />
              <h2 className="text-2xl font-black text-white mt-1 mb-1.5 tracking-tight">Create Account</h2>
              <p className="text-white/35 text-sm font-medium">Join FoodGenie for personalized dining.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* Full Name */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-primary-500 transition-colors duration-200" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary-500/40 focus:border-primary-500/60 transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-primary-500 transition-colors duration-200" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary-500/40 focus:border-primary-500/60 transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-primary-500 transition-colors duration-200" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary-500/40 focus:border-primary-500/60 transition-all"
                  required
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-4 rounded-xl shadow-[0_16px_40px_rgba(var(--primary-rgb),0.3)] flex items-center justify-center gap-2.5 transition-all text-sm uppercase tracking-[0.15em] relative overflow-hidden group mt-1"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <p className="text-center mt-6 text-white/20 text-xs font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup
