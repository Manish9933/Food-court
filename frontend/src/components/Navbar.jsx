import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  ShoppingCart, User, Search, BrainCircuit, LogOut, ChevronDown, 
  Shield, X, Sparkles, ArrowRight, UtensilsCrossed, Menu as MenuIcon 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useCartStore from '../store/useCartStore'
import useAuthStore from '../store/useAuthStore'

import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const itemCount = useCartStore((state) => state.getItemCount())
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const menuRef = useRef(null)
  const searchRef = useRef(null)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate('/menu', { state: { search: searchQuery.trim() } })
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handleEsc)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <div className="fixed top-10 left-0 w-full z-[9999] flex justify-center px-4 md:px-10">
      <nav className="glass max-w-8xl w-full rounded-[2rem] pl-4 md:pl-5 pr-4 md:pr-10 py-4 flex items-center bg-[#0a0a0b]/10 backdrop-blur-3xl border border-white/5 shadow-2xl relative h-[76px]">
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div 
              key="search-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex items-center gap-6 px-4 h-full"
              ref={searchRef}
            >
              <Search className="text-primary-500 animate-pulse" size={26} />
              <input 
                type="text" 
                autoFocus
                placeholder="Find flavors, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                className="flex-1 bg-transparent border-none text-2xl font-black text-white placeholder:text-white/10 focus:outline-none tracking-tight"
              />
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-white/30 font-black tracking-[0.2em] uppercase">Press</span>
                  <span className="text-[10px] text-primary-500 font-black">ESC</span>
                  <span className="text-[9px] text-white/30 font-black tracking-[0.2em] uppercase">to close</span>
                </div>
                <button 
                  onClick={() => {setIsSearchOpen(false); setSearchQuery('')}}
                  className="p-3 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-all group active:scale-90"
                >
                  <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="nav-mode"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full flex justify-between items-center h-full"
            >
              <Link to="/" className="flex items-center gap-3 group">
                <span className="heading-premium text-3xl primary-gradient-text">FoodGenie</span>
                <div className="bg-primary-500/10 p-2 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-primary-500/20">
                  <BrainCircuit size={24} className="text-primary-500" />
                </div>
              </Link>

              <div className="hidden lg:flex gap-2 items-center">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Menu', path: '/menu' },
                  { name: 'AI Match', path: '/recommend' },
                  { name: 'Track', path: '/track-order' },
                  { name: 'Build Plate', path: '/build-plate' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${
                      isActive(item.path) ? 'text-white' : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    {isActive(item.path) && (
                      <motion.div 
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white/5 border border-white/5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden sm:block">
                  <ThemeToggle />
                </div>
                
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-3 hover:bg-white/5 rounded-2xl text-white/30 hover:text-white transition-all group active:scale-95"
                >
                  <Search size={22} className="group-hover:scale-110 transition-transform" />
                </button>
                
                <Link to="/cart" className="relative group p-3 hover:bg-white/5 rounded-2xl transition-all active:scale-95">
                  <ShoppingCart size={22} className="group-hover:text-primary-500 transition-colors" />
                  {itemCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary-600 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-glow border-2 border-[#111114]">
                      {itemCount}
                    </span>
                  )}
                </Link>
                
                <div className="h-6 w-[1px] bg-white/5 mx-1 md:mx-2" />

                {user ? (
                  <div className="relative" ref={menuRef}>
                    <button 
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center gap-2 md:gap-3 p-1 md:p-1.5 pr-2 md:pr-4 rounded-2xl hover:bg-white/5 transition-all group"
                    >
                      <div className="bg-primary-500/10 w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center border border-primary-500/10 transition-all group-hover:border-primary-500/30 overflow-hidden shadow-lg shadow-primary-900/10">
                        <User size={18} className="text-primary-500" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-[9px] text-white/20 uppercase font-black tracking-widest leading-none mb-1 opacity-50">Authorized</p>
                        <p className="text-sm font-black leading-none text-white/90">{user.name?.split(' ')[0]}</p>
                      </div>
                      <ChevronDown size={14} className={`text-white/10 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 15, scale: 0.95 }}
                          className="absolute top-full right-0 mt-4 w-64 md:w-72 bg-[#0a0a0b]/98 backdrop-blur-3xl p-2 rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden z-[9999]"
                        >
                          <div className="px-6 md:px-8 py-6 md:py-8 border-b border-white/5 mb-3 bg-white/[0.01]">
                             <p className="text-[10px] text-primary-500 uppercase tracking-[0.4em] font-black mb-3 opacity-90">Session Operator</p>
                             <p className="text-base md:text-lg font-bold truncate tracking-tight text-white">{user.name}</p>
                             <p className="text-[10px] md:text-[11px] text-white/30 font-medium truncate mt-1">{user.email}</p>
                          </div>

                          <div className="px-2 space-y-1.5 pb-2">
                            {user.role === 'admin' && (
                              <Link 
                                to="/admin" 
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full flex items-center justify-between px-6 py-4 md:py-5 bg-primary-500/10 hover:bg-primary-600 text-primary-500 hover:text-white rounded-3xl transition-all font-black text-[10px] md:text-[11px] uppercase tracking-[0.25em] group/admin"
                              >
                                 <div className="flex items-center gap-4">
                                   <Shield size={18} className="group-hover/admin:scale-110 transition-transform" /> Admin Gateway
                                 </div>
                                 <ArrowRight size={14} className="opacity-0 group-hover/admin:opacity-100 group-hover/admin:translate-x-1 transition-all" />
                              </Link>
                            )}
                            
                             <Link 
                               to="/orders" 
                               onClick={() => setIsMenuOpen(false)}
                               className="w-full flex items-center gap-4 px-6 py-4 md:py-5 hover:bg-white/5 rounded-3xl transition-all font-black text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/40 hover:text-white group/orders text-left"
                             >
                                <ShoppingCart size={18} className="group-hover/orders:scale-110 transition-transform" /> Order History
                             </Link>

                             <Link 
                               to="/profile" 
                               onClick={() => setIsMenuOpen(false)}
                               className="w-full flex items-center gap-4 px-6 py-4 md:py-5 hover:bg-white/5 rounded-3xl transition-all font-black text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/40 hover:text-white group/profile text-left"
                             >
                                <User size={18} className="group-hover/profile:scale-110 transition-transform" /> My Account
                             </Link>

                            <button 
                              onClick={handleLogout}
                              className="w-full flex items-center gap-4 px-6 py-4 md:py-5 mt-3 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-[2rem] transition-all font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] group/logout shadow-2xl shadow-rose-950/20"
                            >
                              <LogOut size={18} className="group-hover/logout:-translate-x-1 transition-transform" /> Log Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button 
                    onClick={() => navigate('/login')}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative flex items-center gap-2 bg-primary-600 text-white px-4 md:pl-5 md:pr-4 py-2.5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] overflow-hidden group shadow-[0_8px_24px_rgba(var(--primary-rgb),0.4)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    <span className="relative z-10 hidden md:inline">Sign In</span>
                    <ShoppingCart size={14} className="md:hidden relative z-10" />
                    <motion.div
                      className="relative z-10 bg-white/15 rounded-lg p-1 hidden md:block"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                      <ArrowRight size={12} />
                    </motion.div>
                  </motion.button>
                )}

                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-3 hover:bg-white/5 rounded-2xl text-white/30 hover:text-white transition-all active:scale-95"
                >
                  <MenuIcon size={24} />
                </button>
              </div>

              {/* Mobile Navigation Overlay */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="absolute top-[90px] left-0 w-full bg-[#0a0a0b]/95 backdrop-blur-3xl rounded-[2.5rem] p-4 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden lg:hidden z-[9999]"
                  >
                    <div className="flex flex-col gap-2">
                      {[
                        { name: 'Home', path: '/' },
                        { name: 'Menu', path: '/menu' },
                        { name: 'AI Match', path: '/recommend' },
                        { name: 'Track Order', path: '/track-order' },
                        { name: 'Order History', path: '/orders' },
                        { name: 'Build Plate', path: '/build-plate' }
                      ].map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-8 py-5 rounded-3xl transition-all font-black text-[11px] uppercase tracking-[0.3em] ${
                            isActive(item.path) ? 'bg-primary-600 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {item.name}
                          <ArrowRight size={14} className={isActive(item.path) ? 'opacity-100 animate-pulse' : 'opacity-0'} />
                        </Link>
                      ))}
                      <div className="h-px bg-white/5 my-2" />
                      <div className="flex justify-between items-center px-8 py-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Display Mode</span>
                        <ThemeToggle />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  )
}

export default Navbar
