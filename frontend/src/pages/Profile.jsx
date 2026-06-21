import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Camera, Mail, Shield, Zap, Sparkles, Heart, Globe, Trash2, Edit3, Award, Star, ShoppingCart, Loader2, X } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import { useTheme } from '../context/ThemeContext'
import { ProfilePageSkeleton } from '../components/Skeleton'

const TASTE_MOODS = [
  { id: 'adventurous', label: 'Adventurous', color: 'from-purple-500 to-blue-500', glow: 'shadow-purple-500/20' },
  { id: 'comfort', label: 'Comfort', color: 'from-orange-500 to-red-500', glow: 'shadow-orange-500/20' },
  { id: 'healthy', label: 'Healthy', icon: <Heart />, color: 'from-emerald-500 to-cyan-500', glow: 'shadow-emerald-500/20' },
  { id: 'energetic', label: 'High Energy', color: 'from-yellow-400 to-orange-400', glow: 'shadow-yellow-500/20' },
]

const BADGES = [
  { id: 1, title: 'Gastronaut', icon: <Globe />, desc: 'Ordered from 5+ different cuisines.', unlocked: true },
  { id: 2, title: 'First Mission', icon: <Zap />, desc: 'Completed your very first order.', unlocked: true },
  { id: 3, title: 'Elite Critic', icon: <Star />, desc: 'Left 10+ high-quality reviews.', unlocked: false },
  { id: 4, title: 'Aura Master', icon: <Sparkles />, desc: 'Synced your taste aura 20 times.', unlocked: true },
  { id: 5, title: 'Night Owl', icon: <Award />, desc: 'Placed an order after midnight.', unlocked: false },
]

const Profile = () => {
  const { user, updateProfile, loading } = useAuthStore()
  const { applyTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [showBadges, setShowBadges] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [activeMood, setActiveMood] = useState(user?.tasteMood || 'adventurous')
  const fileInputRef = useRef(null)

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        await updateProfile({ avatar: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    const success = await updateProfile(formData)
    if (success) {
      setIsEditing(false)
    }
  }

  const selectedMood = TASTE_MOODS.find(m => m.id === activeMood) || TASTE_MOODS[0]

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen transition-colors duration-1000 relative overflow-hidden">
      {/* Dynamic Aura Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [-20, 20, -20]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r ${selectedMood.color} rounded-full blur-[120px]`} 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [20, -20, 20]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className={`absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-l ${selectedMood.color} rounded-full blur-[140px] opacity-60`} 
        />
      </div>
      
      {loading ? (
        <ProfilePageSkeleton />
      ) : (
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Identity Card (Left) */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 rounded-[3rem] text-center relative border-white/5 shadow-2xl backdrop-blur-3xl overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${selectedMood.color}`} />
              
              {/* Holographic Avatar Container */}
              <div className="relative w-40 h-40 mx-auto mb-8 group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className={`absolute -inset-2 bg-gradient-to-tr ${selectedMood.color} rounded-full blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500`} />
                <div className={`absolute -inset-4 border border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite] group-hover:scale-110 transition-transform`} />
                
                <div className="relative w-full h-full rounded-full border-2 border-white/10 p-2 glass overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                      <User size={48} className="text-white/20" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
              </div>

              <h2 className="text-3xl font-black mb-2 tracking-tighter leading-none">{user?.name}</h2>
              <p className="text-white/40 text-sm font-medium mb-6 uppercase tracking-[0.2em]">{user?.email}</p>
              
              <div className="bg-white/5 rounded-2xl p-4 flex justify-around items-center border border-white/5">
                <div className="text-center">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-1">Rank</p>
                  <p className="font-black text-primary-500">{user?.rank || 'Rookie'}</p>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-1">XP</p>
                  <p className="font-black">{(user?.xp / 1000).toFixed(1)}K</p>
                </div>
              </div>
            </motion.div>

            {/* Aura Taste Mood */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 rounded-[2.5rem] border-white/5"
            >
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 px-2 flex items-center gap-2">
                <Zap size={14} className="text-primary-500" /> Taste Aura Sync
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {TASTE_MOODS.map(mood => (
                  <button
                    key={mood.id}
                    onClick={async () => {
                      setActiveMood(mood.id)
                      // Map mood to global theme
                      const themeMap = {
                        adventurous: 'purple',
                        comfort: 'orange',
                        healthy: 'green',
                        energetic: 'blue'
                      }
                      applyTheme(themeMap[mood.id])
                      await updateProfile({ tasteMood: mood.id })
                    }}
                    className={`p-3 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                      activeMood === mood.id 
                      ? `bg-white/10 border-white/20 shadow-lg ${mood.glow}` 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`absolute -right-4 -top-4 w-12 h-12 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                    <p className={`text-[10px] font-black uppercase tracking-widest leading-none ${activeMood === mood.id ? 'text-white' : 'text-white/40'}`}>
                      {mood.label}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Details & Settings (Right) */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-10 rounded-[3rem] border-white/5 min-h-[500px]"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black tracking-tighter">Account <span className="gradient-text">Settings</span></h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl glass hover:bg-white/10 transition-all font-black text-xs uppercase tracking-widest"
                >
                  {isEditing ? 'Cancel Edit' : <><Edit3 size={14} /> Refine Profile</>}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-4">Full Name</label>
                    <input 
                      type="text" 
                      readOnly={!isEditing}
                      value={isEditing ? formData.name : user?.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-primary-500/40 transition-all font-semibold ${!isEditing ? 'cursor-not-allowed text-white/60' : 'border-primary-500/20 bg-primary-500/5'}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-4">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input 
                        type="email" 
                        readOnly={!isEditing}
                        value={isEditing ? formData.email : user?.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full bg-white/5 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-primary-500/40 transition-all font-semibold ${!isEditing ? 'cursor-not-allowed text-white/60' : 'border-primary-500/20 bg-primary-500/5'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-4">Account Security</label>
                    <div className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/5 group hover:border-primary-500/20 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="bg-emerald-500/10 p-2 rounded-xl">
                            <Shield size={18} className="text-emerald-500" />
                         </div>
                         <div>
                            <p className="text-xs font-black leading-none">2FA Protection</p>
                            <p className="text-[10px] text-emerald-500 font-bold tracking-widest mt-1 uppercase">Active</p>
                         </div>
                      </div>
                      <button className="text-[10px] text-white/20 hover:text-white uppercase font-black transition-colors">Configure</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black ml-4">Loyalty Program</label>
                    <div className="bg-gradient-to-br from-primary-600/20 to-orange-600/20 p-6 rounded-[2rem] border border-primary-500/20 relative overflow-hidden group hover:shadow-2xl shadow-primary-900/10 transition-all">
                      <Sparkles className="absolute -right-4 -top-4 text-primary-500/10 w-24 h-24 group-hover:scale-125 transition-transform" />
                      <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                        <Award size={18} className="text-primary-500" /> FoodGenie Pro
                      </h4>
                      <p className="text-xs text-white/40 leading-relaxed font-semibold">You've unlocked 15% discount on all weekend orders. Keep seasoning!</p>
                      <button 
                        onClick={() => setShowBadges(true)}
                        className="mt-6 w-full bg-primary-600 hover:bg-primary-700 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-900/40 transition-all active:scale-95"
                      >
                        View Badges
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 flex justify-end gap-4 border-t border-white/5 pt-8">
                  <button onClick={() => {setIsEditing(false); setFormData({name: user?.name, email: user?.email})}} className="px-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 font-black text-xs uppercase tracking-widest transition-all">Discard Changes</button>
                  <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="px-10 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-900/40 transition-all active:scale-95 flex items-center gap-2"
                  >
                    {loading ? <><Loader2 size={14} className="animate-spin" /> Syncing...</> : 'Save Profile'}
                  </button>
                </motion.div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Orders Completed', val: user?.ordersCompleted || 0, icon: <ShoppingCart className="text-purple-500" /> },
                { label: 'Favorites', val: user?.favoritesCount || 0, icon: <Heart className="text-red-500" /> },
                { label: 'Taste Level', val: user?.rank === 'Rookie' ? 'Beginner' : 'Elite', icon: <Star className="text-yellow-500" /> },
              ].map((stat, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  key={idx}
                  className="glass p-6 rounded-[2rem] flex items-center gap-4 hover:bg-white/[0.04] transition-colors border-white/5"
                >
                  <div className="bg-white/5 p-3 rounded-2xl">{stat.icon}</div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black leading-none mb-1">{stat.label}</p>
                    <p className="text-xl font-black">{stat.val}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
      {/* Badges Modal */}
      <AnimatePresence>
        {showBadges && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBadges(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass p-8 md:p-12 rounded-[3.5rem] md:rounded-[4.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${selectedMood.color}`} />
              
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tighter italic">Culinary <span className="gradient-text">Achievements</span></h3>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-2">Level Up your Gastronomic Journey</p>
                </div>
                <button 
                  onClick={() => setShowBadges(false)}
                  className="p-3 bg-white/5 hover:bg-rose-500 hover:text-white rounded-2xl transition-all text-white/40 group active:scale-90"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BADGES.map(badge => (
                  <div 
                    key={badge.id}
                    className={`p-6 rounded-[2.5rem] border transition-all flex items-center gap-5 group ${
                      badge.unlocked 
                      ? 'bg-white/5 border-white/10 hover:border-primary-500/30' 
                      : 'bg-black/20 border-white/5 opacity-40 grayscale'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 ${
                      badge.unlocked ? 'bg-primary-600 text-white' : 'bg-white/5 text-white/20'
                    }`}>
                      {badge.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight">{badge.title}</h4>
                      <p className="text-[10px] text-white/30 font-medium leading-tight mt-1">{badge.desc}</p>
                    </div>
                    {badge.unlocked && (
                      <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-primary-500/10 rounded-[2rem] border border-primary-500/20 text-center">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500">Next Milestone: Critique Legend</p>
                 <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-primary-500 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
                    />
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile
