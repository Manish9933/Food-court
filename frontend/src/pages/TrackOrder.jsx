import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Package, Truck, UtensilsCrossed, 
  CheckCircle2, Clock, MapPin, Phone, MessageSquare,
  Navigation, Share2, Sparkles, ChefHat, Loader2, Star
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api'
import { TrackOrderSkeleton } from '../components/Skeleton'

const TrackOrder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState(null)
  
  // Rating states
  const [restaurantRating, setRestaurantRating] = useState(0)
  const [deliveryRating, setDeliveryRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchOrderData = async () => {
    try {
      if (id) {
        // Fetch specific order
        const { data } = await api.get(`/orders/${id}`)
        setOrder(data)
      } else {
        // Fetch latest order
        const { data } = await api.get('/orders/myorders')
        if (data && data.length > 0) {
          setOrder(data[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch order tracking info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderData()
    const interval = setInterval(fetchOrderData, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [id])

  const getActiveStep = (status) => {
    switch (status) {
      case 'Pending': return 0
      case 'Preparing': return 1
      case 'Out for Delivery': return 2
      case 'Delivered': return 3
      default: return 0
    }
  }

  const activeStep = order ? getActiveStep(order.status) : 0

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleShare = () => {
    showNotification("Secure tracking link copied to clipboard!")
  }

  const handleAIPredict = () => {
    showNotification("AI Analysis: Rapid dispatch confirmed. Expected arrival 15-20m.")
  }

  const handleContact = (type) => {
    const courierName = order?.deliveryBoy?.name || "Courier"
    const courierPhone = order?.deliveryBoy?.phone || "+1 (555) 012-3456"
    showNotification(type === 'phone' ? `Dialing ${courierName}: ${courierPhone}` : `Opening Encrypted Chat with ${courierName}`)
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(order?._id)
    showNotification("Precise Node ID copied to neural link!")
  }

  const handleSubmitReview = async () => {
    if (restaurantRating === 0 || deliveryRating === 0) {
      showNotification("Mission incomplete: Please provide all ratings.")
      return
    }
    setIsSubmitting(true)
    try {
      await api.post(`/orders/${order._id}/review`, {
        restaurant: restaurantRating,
        delivery: deliveryRating,
        feedback
      })
      showNotification("Review synchronized. Loyalty points awarded.")
      fetchOrderData()
    } catch (error) {
      showNotification("Sync failed. Check connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { title: 'Order Received', icon: <Package size={20} />, time: order ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---' },
    { title: 'In the Kitchen', icon: <ChefHat size={20} />, time: order?.status === 'Preparing' ? 'Just now' : (activeStep > 1 ? 'Completed' : 'Pending') },
    { title: 'Out for Dispatch', icon: <Truck size={20} />, time: (activeStep >= 2 ? 'In Progress' : 'Pending') },
    { title: 'Delivered', icon: <CheckCircle2 size={20} />, time: (activeStep === 3 ? 'Completed' : 'Pending') }
  ]

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-[#060608] overflow-hidden relative">
      <AnimatePresence mode="wait">
        {isLoading && <TrackOrderSkeleton />}

        {!isLoading && !order && (
          <motion.div 
            key="no-order"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center pt-20 px-6"
          >
            <div className="text-center glass p-16 rounded-[4rem] border border-white/5 backdrop-blur-3xl">
              <UtensilsCrossed className="mx-auto text-white/10 mb-6" size={64} />
              <h2 className="text-3xl font-black mb-6 text-white/40 uppercase tracking-tighter">No Active Order Found</h2>
              <p className="text-white/20 mb-10 font-medium tracking-wide">Looks like the kitchen is quiet. Start your feast today.</p>
              <button onClick={() => navigate('/menu')} className="bg-primary-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary-900/40">
                Browse Flavors
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-700 ${isLoading || !order ? 'opacity-0 scale-95 blur-xl' : 'opacity-100 scale-100 blur-0'}`}>
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-primary-500/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/4 select-none pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-purple-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/4 select-none pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header - Mission Status */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/')} className="bg-white/5 p-5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white shadow-2xl group">
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
               <div className="flex items-center gap-3 mb-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                 <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] heading-premium tracking-[-0.04em] leading-none mb-4">
                    MISSION<span className="primary-gradient-text px-2">TRACKER</span>
                 </h1>
               </div>
               <div className="flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                 <span onClick={handleCopyId} className="text-primary-500/80 cursor-pointer hover:text-primary-400 transition-colors flex items-center gap-2">
                   ID #GENIE-{order?._id?.slice(-6).toUpperCase()}
                   <span className="bg-white/5 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><ArrowLeft size={8} className="rotate-180" /></span>
                 </span>
                 <div className="w-1 h-1 bg-white/10 rounded-full" />
                 <span className="flex items-center gap-2"><Clock size={12} /> EST ARRIVAL: {activeStep < 3 ? '18 MIN' : 'ARRIVED'}</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={handleShare} className="glass px-8 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-white/40 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3">
                <Share2 size={14} className="text-primary-500" /> Share Access
             </button>
             <button onClick={handleAIPredict} className="bg-primary-600 px-8 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.25em] hover:bg-primary-500 transition-all shadow-3xl shadow-primary-900/40 flex items-center gap-3 border border-white/10">
                <Sparkles size={14} className="animate-spin-slow" /> AI Prediction
             </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Timeline & Delivery Partner (LHS) */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Timeline Card */}
             <div className="glass-card p-10 rounded-[4rem] border-white/5 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                   <Clock size={120} />
                </div>

                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">Dispatch Protocol</h3>
                   <span className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-lg text-[8px] font-black text-primary-500 uppercase tracking-widest leading-none">Real-time</span>
                </div>

                <div className="space-y-12 relative">
                   <div className="absolute left-6 top-3 bottom-3 w-[1px] bg-white/5" />
                   {steps.map((step, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="flex items-start gap-8 relative"
                      >
                         <div className={`z-10 w-12 h-12 rounded-[1.25rem] flex items-center justify-center border transition-all duration-700 shadow-2xl ${
                           idx <= activeStep 
                           ? 'bg-primary-600 border-primary-400 text-white shadow-primary-500/20' 
                           : 'bg-dark-900 border-white/5 text-white/10'
                         }`}>
                           {idx < activeStep ? <CheckCircle2 size={20} /> : step.icon}
                         </div>
                         <div className="flex-1">
                            <h4 className={`font-black text-xs uppercase tracking-[0.2em] mb-1.5 transition-colors duration-500 ${idx <= activeStep ? 'text-white' : 'text-white/10'}`}>
                              {step.title}
                            </h4>
                            <p className="text-[10px] text-white/30 font-bold italic">"{step.time}"</p>
                         </div>
                         {idx === activeStep && (
                           <motion.div 
                            animate={{ opacity: [1, 0.4, 1] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg text-[8px] font-black tracking-widest text-emerald-500"
                           >
                             EXECUTING
                           </motion.div>
                         )}
                      </motion.div>
                   ))}
                </div>
             </div>

             {/* Courier Intelligence */}
             <div className="glass p-8 rounded-[3rem] border-white/5 flex flex-col gap-8 relative overflow-hidden group shadow-2xl">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {/* Animated Green Glow Rings (Blinkit Style) */}
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.15, 1],
                        opacity: [0.2, 0.4, 0.2] 
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-[-10px] bg-emerald-500/20 blur-2xl rounded-full" 
                    />
                    <motion.div 
                      animate={{ 
                        y: [0, -6, 0],
                      }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-24 h-24 rounded-[2.5rem] overflow-hidden border-2 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.25)] bg-[#121214]"
                    >
                       <img 
                        src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=256&auto=format&fit=crop" 
                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Courier&background=10b981&color=fff" }}
                        className="w-full h-full object-cover brightness-105" 
                        alt="Delivery Partner" 
                       />
                       {/* Subtle Green Scanline */}
                       <motion.div 
                        animate={{ top: ['-100%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[3px] bg-emerald-400/30 blur-[1px] z-10"
                       />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.4em] block mb-1.5">Authorized Agent</span>
                    <h5 className="font-black text-2xl tracking-tighter italic uppercase text-white/90">{order?.deliveryBoy?.name || 'Assigned Courier'}</h5>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => <Star key={i} size={8} className="fill-emerald-500 text-emerald-500" />)}
                       </div>
                       <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Master Courier IV</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => handleContact('phone')} className="flex items-center justify-center gap-3 py-5 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-primary-600 hover:text-white transition-all border border-white/5 active:scale-95">
                      <Phone size={14} /> Voice Call
                   </button>
                   <button onClick={() => navigate('/contact')} className="flex items-center justify-center gap-3 py-5 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-indigo-600 hover:text-white transition-all border border-white/5 active:scale-95">
                      <MessageSquare size={14} /> Support Chat
                   </button>
                </div>
             </div>

             {/* Customer Insight */}
             <div className="glass p-8 rounded-[3rem] border-white/5 flex items-center gap-6 relative overflow-hidden group shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white/20">
                   <MapPin size={24} />
                </div>
                <div>
                   <span className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.4em] block mb-1">Target Recipient</span>
                   <h5 className="font-black text-xl tracking-tighter uppercase text-white/80">{order?.user?.name || 'Authorized Buyer'}</h5>
                </div>
             </div>
          </div>

          {/* Tactical Map & Order View (RHS) */}
          <div className="lg:col-span-8 space-y-8">
             
             {/* Visualizer Card */}
             <div className="glass-card rounded-[4rem] border-white/5 shadow-3xl relative overflow-hidden flex flex-col h-[520px]">
                
                {/* Visualizer UI Layer */}
                <div className="absolute inset-0 z-0 bg-[#08080a]">
                   {/* Scanning Grid Patterns */}
                   <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                   
                   {/* Radar Circles */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/[0.05] rounded-full" />
                   
                   <svg className="absolute inset-0 w-full h-full">
                      {/* Delivery Path */}
                      <motion.path 
                        initial={{ pathLength: 0 }} 
                        animate={{ pathLength: 1 }} 
                        transition={{ duration: 2.5, ease: "easeInOut" }} 
                        d="M150 400 Q 350 250 550 350 T 850 150" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.02)" 
                        strokeWidth="120" 
                        strokeLinecap="round" 
                      />
                      {/* Active Path Trace */}
                      <motion.path 
                        initial={{ pathLength: 0 }} 
                        animate={{ pathLength: (activeStep + 1) * 0.25 }} 
                        transition={{ duration: 4, ease: "circOut" }} 
                        d="M150 400 Q 350 250 550 350 T 850 150" 
                        fill="none" 
                        stroke="rgba(var(--primary-rgb), 0.3)" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeDasharray="1 15"
                      />
                   </svg>

                   {/* Origin Node (Restaurant) */}
                   <div className="absolute bottom-[20%] left-[12%] group">
                      <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-10 animate-pulse" />
                        <div className="relative bg-emerald-500/10 p-5 rounded-[2rem] border border-emerald-500/20 backdrop-blur-xl text-emerald-500 transition-all hover:scale-110 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                          <ChefHat size={28} />
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/60 transition-all group-hover:text-emerald-500">Restaurant</div>
                        </div>
                      </div>
                   </div>

                   {/* Delivery Partner (Courier) - Dynamic Position */}
                   <motion.div 
                      initial={false}
                      animate={{ 
                        left: activeStep === 0 || activeStep === 1 ? '12%' : (activeStep === 2 ? '45%' : '80%'),
                        top: activeStep === 0 || activeStep === 1 ? '70%' : (activeStep === 2 ? '40%' : '18%'),
                      }} 
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                    >
                       <motion.div
                         animate={{ 
                           y: [0, -10, 0],
                           rotate: activeStep === 2 ? [0, 5, -5, 0] : 0
                         }}
                         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                         className="relative group cursor-crosshair"
                       >
                          {/* Motion Trail / Speed Lines */}
                          {activeStep === 2 && (
                            <div className="absolute top-1/2 right-full -translate-y-1/2 pr-4 flex flex-col gap-2">
                               {[1,2,3].map(i => (
                                 <motion.div 
                                   key={i}
                                   initial={{ width: 0, opacity: 0 }}
                                   animate={{ width: [0, 40, 0], opacity: [0, 0.5, 0] }}
                                   transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                                   className="h-[2px] bg-primary-500 rounded-full"
                                 />
                               ))}
                            </div>
                          )}

                          <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-40 animate-pulse" />
                          <div className="relative bg-primary-600 p-6 rounded-[2.5rem] shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)] text-white border border-primary-300 ring-4 ring-primary-500/20 transition-all hover:scale-110">
                             <Truck size={32} />
                             <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-dark-900 border border-primary-500/50 px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.1em] whitespace-nowrap shadow-2xl">
                               {activeStep === 3 ? 'ARRIVED' : `COURIER: ${order?.deliveryBoy?.name?.split(' ')[0]?.toUpperCase() || 'AGENT'}`}
                             </div>
                          </div>
                          
                          {/* Pulse Effect for Active Status */}
                          {activeStep === 2 && (
                            <div className="absolute -inset-4 border-2 border-primary-500/30 rounded-[3rem] animate-ping opacity-20" />
                          )}
                       </motion.div>
                   </motion.div>

                   {/* Destination Point (User House) */}
                   <div className="absolute top-[18%] right-[15%] group">
                      <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20" />
                        <div className="relative bg-indigo-600 p-6 rounded-[2.5rem] shadow-3xl border border-indigo-400 text-white hover:scale-110 mb-2 transition-transform shadow-[0_0_40px_rgba(79,70,229,0.3)]">
                          <MapPin size={32} />
                        </div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Your Home</div>
                      </div>
                   </div>
                </div>

                 {/* Tracking Data Overlay */}
                 <div className="absolute top-10 left-10 flex flex-col gap-4 hidden md:flex">
                    <div className="p-6 glass rounded-3xl border border-white/5 backdrop-blur-2xl">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Live Telemetry</p>
                        <div className="flex gap-8">
                           <div>
                              <p className="text-[7px] text-white/40 uppercase mb-1">LATITUDE</p>
                              <p className="text-sm font-black italic">51.5074° N</p>
                           </div>
                           <div>
                              <p className="text-[7px] text-white/40 uppercase mb-1">LONGITUDE</p>
                              <p className="text-sm font-black italic">0.1278° W</p>
                           </div>
                           <div>
                              <p className="text-[7px] text-white/40 uppercase mb-1">VELOCITY</p>
                              <p className="text-sm font-black text-emerald-500">22 km/h</p>
                           </div>
                        </div>
                    </div>

                    {/* Simple Legend */}
                    <div className="p-4 glass rounded-2xl border border-white/5 backdrop-blur-xl flex flex-col gap-3">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Restaurant</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary-500" />
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Courier ({order?.deliveryBoy?.name || 'Assigned Agent'})</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Your Home</span>
                       </div>
                    </div>
                 </div>

                {/* Bottom Status Bar */}
                <div className="absolute bottom-8 left-8 right-8 z-20">
                   <div className="glass p-6 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-3xl bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full border-2 border-white/5 flex items-center justify-center text-white/20 animate-spin-slow"><Navigation size={14}/></div>
                           <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em]">Satellite Lock: Active_GNR-092 • Secured Protocol Enabled</span>
                        </div>
                        <div className="flex gap-3 text-primary-500/40 text-[10px] font-black uppercase tracking-[0.2em] italic">
                           <span>SCANNING...</span>
                           <span>SYNCING VIBES...</span>
                        </div>
                   </div>
                </div>
             </div>

             {/* Order Content Summary */}
             <div className="glass rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Cargo Integrity</h3>
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-black gradient-text">${order?.totalAmount?.toFixed(2)}</span>
                   </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {order?.items?.map((item, i) => (
                     <div key={i} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-black border border-white/5">x{item.quantity}</div>
                        <div>
                           <p className="text-xs font-black uppercase tracking-tight text-white/80 line-clamp-1">{item.name || item.foodItem?.name || 'Item'}</p>
                           <p className="text-[9px] text-primary-500/60 font-black uppercase tracking-widest">{order?.paymentStatus}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

              {/* Mission De-brief: Review System */}
              {activeStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-[3rem] p-10 border border-primary-500/20 shadow-[0_0_50px_rgba(var(--primary-rgb),0.05)] relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/80">Mission Debriefing</h3>
                    <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">Feedback Channel Open</div>
                  </div>

                  {order?.ratings?.restaurant ? (
                    <div className="text-center py-10 space-y-6">
                       <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-glow">
                          <CheckCircle2 size={40} />
                       </div>
                       <h4 className="font-black text-xl text-white/90 tracking-tight">MISSION SUCCESSFUL</h4>
                       <p className="text-white/40 text-xs font-medium">Your feedback has been encrypted and synchronized with our servers. Thank you for optimizing the FoodGenie network.</p>
                       
                       <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                             <p className="text-[8px] text-white/20 uppercase mb-2">Restaurant</p>
                             <div className="flex justify-center gap-1">
                                {[1,2,3,4,5].map(s => <Star key={s} size={10} className={order.ratings.restaurant >= s ? 'fill-emerald-400 text-emerald-400' : 'text-white/10'} />)}
                             </div>
                          </div>
                          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                             <p className="text-[8px] text-white/20 uppercase mb-2">Delivery</p>
                             <div className="flex justify-center gap-1">
                                {[1,2,3,4,5].map(s => <Star key={s} size={10} className={order.ratings.delivery >= s ? 'fill-primary-400 text-primary-400' : 'text-white/10'} />)}
                             </div>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      <div className="grid md:grid-cols-2 gap-10">
                         {/* Restaurant Rating */}
                         <div className="space-y-4">
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Aesthetic & Flavor (Restaurant)</span>
                            <div className="flex gap-3">
                               {[1,2,3,4,5].map(star => (
                                 <button key={star} onClick={() => setRestaurantRating(star)} className={`p-4 rounded-2xl border transition-all ${restaurantRating >= star ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/5 text-white/10 hover:text-white/30'}`}>
                                    <Star size={20} className={restaurantRating >= star ? 'fill-emerald-400' : ''} />
                                 </button>
                               ))}
                            </div>
                         </div>
                         {/* Delivery Rating */}
                         <div className="space-y-4">
                            <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest">Velocity & Precision (Courier)</span>
                            <div className="flex gap-3">
                               {[1,2,3,4,5].map(star => (
                                 <button key={star} onClick={() => setDeliveryRating(star)} className={`p-4 rounded-2xl border transition-all ${deliveryRating >= star ? 'bg-primary-500/20 border-primary-500 text-primary-400 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]' : 'bg-white/5 border-white/5 text-white/10 hover:text-white/30'}`}>
                                    <Star size={20} className={deliveryRating >= star ? 'fill-primary-400' : ''} />
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Additional Intelligence (Feedback)</span>
                         <textarea 
                           className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 text-sm font-medium text-white/80 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all placeholder:text-white/10 min-h-[150px]"
                           placeholder="Signal your experience here..."
                           value={feedback}
                           onChange={(e) => setFeedback(e.target.value)}
                         />
                      </div>

                      <button 
                        onClick={handleSubmitReview}
                        disabled={isSubmitting}
                        className="w-full py-6 bg-primary-600 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] text-white hover:bg-primary-500 transition-all shadow-3xl shadow-primary-900/40 active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Syncing Neural Feedback...' : 'Transmit Report'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] glass px-12 py-5 rounded-[3rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl border border-primary-500/40 flex items-center gap-4 text-white">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-glow"><CheckCircle2 size={16} /></div>
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}

export default TrackOrder
