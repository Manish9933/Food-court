import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  ShoppingCart, User, Search, BrainCircuit, LogOut, ChevronDown, 
  Shield, X, Sparkles, ArrowRight, UtensilsCrossed, Menu as MenuIcon,
  TrendingUp, Clock, Command, Mic, Cpu, History, Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import useCartStore from '../store/useCartStore'
import useAuthStore from '../store/useAuthStore'

import ThemeToggle from './ThemeToggle'
import Logo from './Logo'

const Navbar = () => {
  const itemCount = useCartStore((state) => state.getItemCount())
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Basic UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Neural Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [searchSelectedIndex, setSearchSelectedIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState({
    trending: ['Truffle Pasta', 'Dragon Sushi', 'Neon Ramen', 'Gold Leaf Burger'],
    recent: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
    aiRecommended: ['Cyber Salad', 'Plasma Pizza', 'Quantum Curry']
  })

  const menuRef = useRef(null)
  const searchInputRef = useRef(null)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  // Neural Search API Call
  const performNeuralSearch = async (queryToSearch) => {
    if (!queryToSearch || queryToSearch.trim().length <= 1) {
      setSearchResults([])
      return
    }

    setIsSearchLoading(true)
    try {
      const { data } = await axios.get(`/api/menu?search=${queryToSearch}`)
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setSearchResults(data.slice(0, 5))
      } else {
        console.warn("Search API did not return an array:", data)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Neural Search failed', error)
      setSearchResults([])
    } finally {
      setIsSearchLoading(false)
    }
  }

  // Handle Search Input Changes (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      performNeuralSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle Search Overlay Focus & Body Scroll
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = '' // Standard reset
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isSearchOpen])

  const handleSearchSelect = (item) => {
    const itemName = typeof item === 'string' ? item : item.name
    const newRecent = [item, ...suggestions.recent.filter(i => (typeof i === 'string' ? i : i.name) !== itemName)].slice(0, 5)
    
    localStorage.setItem('recentSearches', JSON.stringify(newRecent))
    setSuggestions(prev => ({ ...prev, recent: newRecent }))
    
    // EXPLICIT SYNC CLEANUP
    setIsSearchOpen(false)
    setSearchQuery('')
    document.body.style.overflow = '' 
    
    // Use a small delay for navigation to ensure state updates finish
    setTimeout(() => {
      navigate('/menu', { state: { search: itemName } })
    }, 100)
  }

  const handleSearchKeyDown = (e) => {
    const totalItems = searchResults.length + suggestions.trending.length + suggestions.recent.length
    if (e.key === 'ArrowDown') {
      setSearchSelectedIndex(prev => (prev + 1) % totalItems)
    } else if (e.key === 'ArrowUp') {
      setSearchSelectedIndex(prev => (prev - 1 + totalItems) % totalItems)
    } else if (e.key === 'Enter') {
       if (searchSelectedIndex === -1 && searchQuery.trim()) {
         handleSearchSelect(searchQuery.trim())
       }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  // Close User Menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <div className="fixed top-10 left-0 w-full z-[9999] flex justify-center px-4 md:px-10">
        <nav className="glass max-w-8xl w-full rounded-[2rem] pl-4 md:pl-5 pr-4 md:pr-10 py-4 flex items-center bg-[#0a0a0b]/10 backdrop-blur-3xl border border-white/5 shadow-2xl relative h-[76px]">
          <div className="w-full flex justify-between items-center h-full">
            <Link to="/" className="hover:opacity-90 transition-opacity shrink-0">
              <Logo />
            </Link>

            {/* Desktop Links */}
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

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2.5 px-4 py-3 hover:bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all group active:scale-95 border border-transparent hover:border-white/5"
                title="Global Search"
              >
                <div className="relative">
                  <Search size={20} className="group-hover:scale-110 transition-transform group-hover:text-primary-500" />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-primary-500/20 blur-md rounded-full -z-10"
                  />
                </div>
                <span className="hidden xl:block text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0">AI Search</span>
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
                      <p className="text-[9px] text-primary-500/60 uppercase font-black tracking-widest leading-none mb-1">Authorized</p>
                      <p className="text-sm font-black leading-none text-white/90">{user.name?.split(' ')[0]}</p>
                    </div>
                    <ChevronDown size={14} className={`text-white/20 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                        className="absolute top-full right-0 mt-6 w-64 md:w-72 bg-[#0a0a0b]/95 backdrop-blur-[40px] p-2 rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden z-[9999]"
                      >
                        <div className="px-6 md:px-8 py-8 border-b border-white/5 mb-3 bg-gradient-to-b from-white/[0.02] to-transparent relative">
                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
                           <p className="text-[10px] text-primary-400 uppercase tracking-[0.4em] font-black mb-3">Session Operator</p>
                           <p className="text-base md:text-lg font-bold truncate tracking-tight text-white">{user.name}</p>
                           <p className="text-[10px] md:text-[11px] text-white/40 font-medium truncate mt-1">{user.email}</p>
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
                             className="w-full flex items-center gap-4 px-6 py-4 md:py-5 hover:bg-primary-500/5 rounded-3xl transition-all duration-300 font-black text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/40 hover:text-primary-400 group/orders text-left border border-transparent hover:border-primary-500/10"
                           >
                              <ShoppingCart size={18} className="group-hover/orders:scale-110 group-hover/orders:rotate-3 transition-transform" /> Order History
                           </Link>

                           <Link 
                             to="/profile" 
                             onClick={() => setIsMenuOpen(false)}
                             className="w-full flex items-center gap-4 px-6 py-4 md:py-5 hover:bg-primary-500/5 rounded-3xl transition-all duration-300 font-black text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/40 hover:text-primary-400 group/profile text-left border border-transparent hover:border-primary-500/10"
                           >
                              <User size={18} className="group-hover/profile:scale-110 group-hover/profile:-rotate-3 transition-transform" /> My Account
                           </Link>

                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-6 py-4 md:py-5 mt-3 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-[2rem] transition-all duration-300 font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] group/logout shadow-lg hover:shadow-rose-500/20"
                          >
                            <LogOut size={18} className="group-hover/logout:-translate-x-1 group-hover/logout:rotate-12 transition-transform" /> Log Out
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
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-[90px] left-4 right-4 bg-[#0a0a0b]/95 backdrop-blur-3xl rounded-[2.5rem] p-4 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden lg:hidden z-[9999]"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ultra-Premium Neural Search Overlay (Integrated) */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-4 md:px-6"
          >
            {/* Neural Backdrop */}
            <div 
              className="absolute inset-0 bg-[#050506]/90 backdrop-blur-[40px]"
              onClick={() => setIsSearchOpen(false)}
            />

            {/* Animated Particles/Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, 50, 0],
                  y: [0, -30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary-500/10 blur-[120px] rounded-full"
              />
              <motion.div 
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                  x: [0, -50, 0],
                  y: [0, 30, 0]
                }}
                transition={{ duration: 12, repeat: Infinity }}
                className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-[120px] rounded-full"
              />
            </div>

            {/* Search Container */}
            <motion.div 
              initial={{ y: 20, scale: 0.95, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: 20, scale: 0.95, opacity: 0, filter: 'blur(10px)' }}
              className="relative w-full max-w-3xl z-10"
            >
              {/* Input Wrapper with Gradient Border */}
              <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 rounded-[2.5rem] opacity-30 blur-[2px] group-focus-within:opacity-100 group-focus-within:blur-[4px] transition-all duration-700 animate-gradient-x" />
                
                <div className="relative bg-[#0a0a0b] rounded-[2.5rem] p-2 flex items-center gap-4 border border-white/5 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div 
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12"
                    />
                  </div>

                  <div className="pl-6 flex items-center gap-4">
                    <div className="relative">
                      <Search className="text-primary-500 transition-transform duration-500 group-focus-within:scale-110" size={24} />
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-primary-500 blur-md rounded-full -z-10"
                      />
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                      <Cpu size={12} className="text-primary-400 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary-400">AI Intelligent</span>
                    </div>
                  </div>

                  <input 
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search gourmet dishes, chefs, cuisines..."
                    className="flex-1 bg-transparent border-none py-6 text-xl md:text-2xl font-bold text-white placeholder:text-white/40 focus:outline-none"
                  />

                  <div className="flex items-center gap-2 pr-4">
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.button 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setSearchQuery('')}
                          className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
                        >
                          <X size={20} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                    
                    <button 
                      onClick={() => setIsSearchOpen(false)}
                      className="p-3 bg-white/10 hover:bg-rose-500/20 rounded-2xl text-white/60 hover:text-rose-500 transition-all active:scale-90 group/close"
                    >
                      <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>

                    <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl border border-white/10">
                      <Command size={12} className="text-white/40" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">K</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions Overlay */}
              <AnimatePresence>
                {(searchQuery.length > 0 || !isSearchLoading) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 bg-[#0a0a0b]/95 backdrop-blur-[50px] rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
                  >
                    <div className="p-8 grid md:grid-cols-[1.5fr_1fr] gap-10">
                      <div className="space-y-8">
                        {searchQuery.length > 0 ? (
                          <div>
                            <div className="flex items-center gap-3 mb-6">
                              <Zap size={18} className="text-primary-500" />
                              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/60">Instant Matches</h3>
                            </div>
                            
                            {isSearchLoading ? (
                              <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                  <div key={i} className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                                ))}
                              </div>
                            ) : (Array.isArray(searchResults) && searchResults.length > 0) ? (
                              <div className="space-y-3">
                                {searchResults.map((item, idx) => (
                                  <motion.button
                                    key={item._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleSearchSelect(item)}
                                    className="w-full flex items-center gap-5 p-4 rounded-[2rem] hover:bg-primary-500 transition-all group text-left"
                                  >
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 shrink-0 border border-white/10 group-hover:border-white/30 transition-colors">
                                      <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-bold text-white group-hover:text-white transition-colors uppercase tracking-tight">{item.name}</h4>
                                      <p className="text-xs text-white/40 group-hover:text-white/60 line-clamp-1">{item.description}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-black text-primary-500 group-hover:text-white transition-colors">₹{item.price}</p>
                                      <ArrowRight size={14} className="ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                                    </div>
                                  </motion.button>
                                ))}
                              </div>
                            ) : (
                              <div className="py-20 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Search size={32} className="text-white/10" />
                                </div>
                                <p className="text-white/20 font-black uppercase tracking-[0.4em] text-xs italic">No culinary matches found</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-3 mb-6">
                              <TrendingUp size={18} className="text-primary-500" />
                              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/60">Trending Now</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {suggestions.trending.map((item, idx) => (
                                <motion.button
                                  key={item}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSearchSelect(item)}
                                  className="px-6 py-3 bg-white/5 hover:bg-primary-600 rounded-2xl border border-white/5 transition-all text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white"
                                >
                                  {item}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-10 border-l border-white/5 pl-10 hidden md:block">
                        {suggestions.recent.length > 0 && (
                          <div>
                            <div className="flex items-center gap-3 mb-6">
                              <History size={18} className="text-primary-500" />
                              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Recently Viewed</h3>
                            </div>
                            <div className="space-y-2">
                              {suggestions.recent.map((item) => (
                                <button
                                  key={typeof item === 'string' ? item : item._id}
                                  onClick={() => handleSearchSelect(item)}
                                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all text-left group"
                                >
                                  <Clock size={14} className="text-white/20 group-hover:text-primary-500 transition-colors" />
                                  <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors">{typeof item === 'string' ? item : item.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-3 mb-6">
                            <Sparkles size={18} className="text-purple-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">AI Recommended</h3>
                          </div>
                          <div className="space-y-2">
                            {suggestions.aiRecommended.map((item) => (
                              <button
                                key={item}
                                onClick={() => handleSearchSelect(item)}
                                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-purple-500/5 hover:bg-purple-500/20 border border-purple-500/10 transition-all text-left group"
                              >
                                <Zap size={12} className="text-purple-500 animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-tighter text-purple-200/60 group-hover:text-purple-100 transition-colors">{item}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <kbd className="px-2 py-1 bg-white/5 rounded text-[9px] font-black text-white/20 border border-white/10">ESC</kbd>
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">to close</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className="px-2 py-1 bg-white/5 rounded text-[9px] font-black text-white/20 border border-white/10">↵</kbd>
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">to select</span>
                        </div>
                      </div>
                      <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Cpu size={12} /> Neural Search Active
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
