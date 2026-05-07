import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, LogIn, Github, ArrowRight, ChefHat, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import AnimatedBackground from '../components/AnimatedBackground'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading } = useAuthStore()
  const navigate = useNavigate()

  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      const success = await login(email, password)
      if (success) {
        // Fetch fresh state to get the user role
        const user = useAuthStore.getState().user;
        if (user?.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
          setErrorMsg('Invalid email or password access protocol.')
      }
    } catch (error) {
      console.error(error)
      setErrorMsg(error.response?.data?.message || 'Connection to the central gateway failed.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-110px)] w-full flex items-center justify-center lg:justify-end lg:pr-[12%] px-4 py-8 relative overflow-hidden bg-[#0a0a0c]">
      <AnimatedBackground />

      {/* Login Card */}
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
            <div className="text-center mb-7">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-lg shadow-primary-500/20"
              >
                <ChefHat className="w-7 h-7 text-white" />
              </motion.div>

              <h1 className="text-2xl font-black text-white tracking-tight">
                Food<span className="text-primary-500 text-glow">Genie</span>
              </h1>
              <h2 className="text-2xl font-black text-white mt-1 mb-1.5 tracking-tight">Welcome Back!</h2>
              <p className="text-white/35 text-sm font-medium">Sign in to access your dining assistant.</p>

              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold"
                  >
                    ⚠️ {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
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
              <div>
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
                <div className="flex justify-end mt-1.5">
                  <button type="button" className="text-[10px] text-white/25 hover:text-primary-500 transition-colors uppercase font-bold tracking-widest">
                    Forgot Security Key?
                  </button>
                </div>
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
                  <>Sign In Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#111114] px-4 text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">Secure Gateways</span>
                </div>
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="flex items-center justify-center gap-2.5 bg-white/[0.03] border border-white/[0.07] hover:border-white/15 text-white/50 font-semibold py-3 rounded-xl transition-all text-xs"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                  Google
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="flex items-center justify-center gap-2.5 bg-white/[0.03] border border-white/[0.07] hover:border-white/15 text-white/50 font-semibold py-3 rounded-xl transition-all text-xs"
                >
                  <img src="https://www.svgrepo.com/show/303108/apple-black-logo.svg" className="w-4 h-4 invert opacity-40" alt="Apple" />
                  Apple
                </motion.button>
              </div>
            </form>

            {/* Footer */}
            <p className="text-center mt-6 text-white/20 text-xs font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-500 font-bold hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
