import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, Phone, Mail, MapPin, 
  ChevronRight, ArrowLeft, Send, Sparkles, 
  HelpCircle, ShoppingBag, Truck, CreditCard,
  User, Bot, CheckCircle2, Star, Clock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import api from '../api/api'
import { ContactPageSkeleton } from '../components/Skeleton'

const HELP_CATEGORIES = [
  { id: 'order', label: 'Order Status', icon: <Truck />, color: 'from-blue-500/20 to-cyan-500/20', text: 'Where is my food?' },
  { id: 'payment', label: 'Payments & Refunds', icon: <CreditCard />, color: 'from-emerald-500/20 to-teal-500/20', text: 'Transaction help' },
  { id: 'account', label: 'Account Settings', icon: <User />, color: 'from-purple-500/20 to-indigo-500/20', text: 'Profile & Security' },
  { id: 'general', label: 'General Help', icon: <HelpCircle />, color: 'from-orange-500/20 to-red-500/20', text: 'App features' }
]

const Contact = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('chat')
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState([
    { role: 'bot', text: "Hello! I'm your FoodGenie Concierge. How can I assist you today?", time: 'Just now' }
  ])
  const [latestOrder, setLatestOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data } = await api.get('/orders/myorders')
        if (data && data.length > 0) setLatestOrder(data[0])
      } catch (e) { console.error(e) }
      finally { setIsLoading(false) }
    }
    fetchLatest()
  }, [])

  const handleSendMessage = () => {
    if (!message.trim()) return
    const newLog = [...chatLog, { role: 'user', text: message, time: 'Just now' }]
    setChatLog(newLog)
    setMessage('')
    
    // Simulate bot response
    setTimeout(() => {
      setChatLog(prev => [...prev, { 
        role: 'bot', 
        text: "Analyzing your request... One of our agents will be with you shortly. In the meantime, would you like to track your current order?", 
        time: 'Just now' 
      }])
    }, 1500)
  }

  return (
    <PageTransition>
      <div className="pt-16 pb-20 px-6 min-h-[calc(100vh-110px)] bg-[#070709] overflow-hidden relative selection:bg-primary-500/30">
        {isLoading ? (
          <ContactPageSkeleton />
        ) : (
        <>
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left Side: Categories & Info */}
            <div className="lg:col-span-1 flex-1">
               <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-[10px] font-black tracking-[0.3em] text-primary-500 uppercase">Support Protocol</span>
                  </div>
                  <h1 className="text-6xl font-black tracking-tighter mb-6 italic uppercase leading-none">
                    How can we <span className="gradient-text">Help?</span>
                  </h1>
                  <p className="text-white/40 text-lg max-w-md font-medium leading-relaxed">
                    Our concierge team is available 24/7 to ensure your dining experience is seamless and premium.
                  </p>
               </div>

               {/* Current Order Context Card */}
               {latestOrder && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="glass p-8 rounded-[3rem] border border-white/5 mb-12 group hover:border-primary-500/20 transition-all cursor-pointer"
                   onClick={() => navigate('/track-order')}
                 >
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-2">Active Mission</p>
                          <h3 className="text-2xl font-black tracking-tight italic">ORDER #{latestOrder._id.slice(-6).toUpperCase()}</h3>
                       </div>
                       <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                          {latestOrder.status}
                       </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/30 text-xs font-bold font-mono">
                       <Clock size={14} /> Est. Arrival: 15 MIN
                       <span className="w-1 h-1 bg-white/10 rounded-full" />
                       <span className="text-primary-500/60 uppercase">Tap to Track</span>
                    </div>
                 </motion.div>
               )}

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {HELP_CATEGORIES.map((cat) => (
                    <motion.button 
                      key={cat.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`glass p-6 rounded-[2.5rem] border border-white/5 text-left group hover:bg-white/5 transition-all relative overflow-hidden`}
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-all group-hover:text-white text-primary-500/60">
                        {cat.icon}
                      </div>
                      <h4 className="text-base font-black tracking-tight mb-1">{cat.label}</h4>
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{cat.text}</p>
                    </motion.button>
                  ))}
               </div>

               <div className="mt-12 flex flex-col gap-6">
                  <div className="flex items-center gap-6 group cursor-pointer">
                     <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <Phone size={20} className="text-white/40" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Global Hotline</p>
                        <p className="text-lg font-black">+1 (800) GENIE-01</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6 group cursor-pointer">
                     <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <Mail size={20} className="text-white/40" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Digital Dispatch</p>
                        <p className="text-lg font-black">support@foodgenie.ai</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Side: Visual Chat Interface */}
            <div className="lg:w-[500px]">
               <div className="glass min-h-[600px] h-full rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col shadow-2xl">
                  {/* Chat Header */}
                  <div className="p-8 border-b border-white/5 bg-white/[0.02] backdrop-blur-3xl flex items-center gap-6">
                     <div className="relative">
                        <div className="absolute inset-0 bg-primary-500 blur-xl opacity-30 animate-pulse" />
                        <div className="relative w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center border border-primary-400">
                           <Bot size={28} className="text-white" />
                        </div>
                     </div>
                     <div>
                        <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none mb-1">AI Concierge</h3>
                        <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Always Online</span>
                        </div>
                     </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 p-8 overflow-y-auto space-y-8 scrollbar-hide">
                     {chatLog.map((chat, i) => (
                       <motion.div 
                         initial={{ opacity: 0, x: chat.role === 'user' ? 20 : -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         key={i} 
                         className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                       >
                         <div className={`max-w-[80%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed ${
                           chat.role === 'user' 
                           ? 'bg-primary-600 text-white rounded-br-none shadow-xl shadow-primary-900/40' 
                           : 'bg-white/5 text-white/80 border border-white/10 rounded-bl-none'
                         }`}>
                           {chat.text}
                           <p className={`text-[8px] mt-3 uppercase tracking-widest font-black opacity-30 ${chat.role === 'user' ? 'text-right' : 'text-left'}`}>
                              {chat.time}
                           </p>
                         </div>
                       </motion.div>
                     ))}
                  </div>

                  {/* Quick Replies */}
                  <div className="p-6 flex gap-3 overflow-x-auto no-scrollbar">
                     <button onClick={() => setMessage("I haven't received my order")} className="whitespace-nowrap px-6 py-3 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/10 transition-all border border-white/5">Order Status</button>
                     <button onClick={() => setMessage("Issue with my payment")} className="whitespace-nowrap px-6 py-3 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/10 transition-all border border-white/5">Refund</button>
                     <button onClick={() => setMessage("How to delete my account?")} className="whitespace-nowrap px-6 py-3 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/10 transition-all border border-white/5">Security</button>
                  </div>

                  {/* Input Area */}
                  <div className="p-8 bg-white/[0.01] border-t border-white/5">
                     <div className="relative group">
                        <input 
                          type="text" 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..." 
                          className="w-full bg-white/5 border border-white/10 rounded-3xl px-10 py-6 pr-20 outline-none focus:border-primary-500/50 transition-all font-bold placeholder:text-white/20"
                        />
                        <button 
                          onClick={handleSendMessage}
                          className="absolute right-3 top-3 bottom-3 bg-primary-600 hover:bg-primary-500 px-6 rounded-2xl transition-all shadow-glow active:scale-90 flex items-center justify-center text-white"
                        >
                           <Send size={18} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </PageTransition>
  )
}

export default Contact
