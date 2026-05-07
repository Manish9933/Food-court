import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, Search, Filter, ChevronRight, 
  Download, Star, Clock, CheckCircle2, 
  X, Receipt, MapPin, Truck
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { OrderHistorySkeleton } from '../components/Skeleton'

const OrderHistory = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders')
      setOrders(data)
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const customId = order.customId || '';
    const matchesSearch = customId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.items && order.items.some(item => (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())))
    
    // Normalize filter status for comparison
    const currentStatus = order.status || 'Pending';
    const matchesFilter = filterStatus === 'All' || currentStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      case 'Cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
      case 'Preparing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      case 'Out for Delivery': return 'text-primary-500 bg-primary-500/10 border-primary-500/20'
      default: return 'text-white/40 bg-white/5 border-white/10'
    }
  }

  const handleDownloadBill = (order) => {
    // Basic logic for bill download - In real app use jsPDF
    const billContent = `
      FOODGENIE - INVOICE
      Order ID: ${order.customId}
      Date: ${new Date(order.createdAt).toLocaleDateString()}
      Customer: ${order.user?.name || 'Customer'}
      Items:
      ${order.items.map(item => `- ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      TOTAL: $${order.totalAmount.toFixed(2)}
      Address: ${order.shippingAddress?.street}, ${order.shippingAddress?.city}
    `
    const blob = new Blob([billContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Invoice-${order.customId}.txt`
    a.click()
  }

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-[#0a0a0c]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black heading-premium tracking-tighter mb-4 text-white">
              ORDER<span className="primary-gradient-text px-2">CHRONICLES</span>
            </h1>
            <p className="text-white/40 text-sm font-medium tracking-wide italic">"Every bite tells a story. Here's yours."</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Scan Order ID..." 
                  className="bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none transition-all w-[300px] text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="relative group" id="status-filter">
                <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-sm outline-none transition-all text-white flex items-center justify-between min-w-[180px] hover:bg-white/10"
                  >
                    <span className="font-bold uppercase tracking-widest text-[10px]">{filterStatus === 'All' ? 'All Status' : filterStatus}</span>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-90' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[50]"
                      >
                        {['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered'].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setFilterStatus(status);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/5 ${
                              filterStatus === status ? 'text-primary-500 bg-primary-500/5' : 'text-white/40 hover:text-white'
                            }`}
                          >
                            {status === 'All' ? 'Complete Fleet' : status}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
             </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
           <AnimatePresence mode='popLayout'>
             {isLoading ? (
               <OrderHistorySkeleton />
             ) : filteredOrders.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20 glass rounded-[3rem] border border-white/5"
                >
                   <Package size={64} className="mx-auto text-white/10 mb-6" />
                   <h3 className="text-xl font-black text-white/40 uppercase tracking-widest">No Transmissions Found</h3>
                   <p className="text-white/20 mt-2">Your culinary journey is just beginning.</p>
                </motion.div>
             ) : (
               filteredOrders.map((order, idx) => (
                 <motion.div 
                   key={order._id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className="group relative"
                 >
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-primary-500/30 transition-all flex flex-col md:flex-row items-center justify-between gap-8 group-hover:bg-white/[0.04]">
                       <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-xl font-black shadow-2xl ${getStatusColor(order.status)}`}>
                             {order.status === 'Delivered' ? <CheckCircle2 /> : <Clock />}
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-1">
                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40 font-black">#{order.customId}</span>
                                <span className="text-white/20 text-[10px] font-bold tracking-widest uppercase italic">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                             </div>
                             <h3 className="text-lg font-black text-white/80 uppercase tracking-tight line-clamp-1">
                                {order.items[0].name} {order.items.length > 1 && `+ ${order.items.length - 1} more`}
                             </h3>
                             <p className="text-xs font-black primary-gradient-text italic tracking-wider">${order.totalAmount.toFixed(2)} • {order.paymentStatus}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleDownloadBill(order)}
                            className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-all text-white/40 hover:text-white group/btn"
                            title="Download Invoice"
                          >
                             <Download size={20} className="group-hover/btn:translate-y-0.5 transition-transform" />
                          </button>
                          
                          {order.status === 'Delivered' ? (
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl shadow-emerald-900/20 hover:scale-105 active:scale-95"
                            >
                               View Mission Report
                            </button>
                          ) : (
                            <button 
                              onClick={() => navigate(`/track-order/${order._id}`)}
                              className="px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl shadow-primary-900/20 hover:scale-105 active:scale-95"
                            >
                               Track Payload
                            </button>
                          )}
                       </div>
                    </div>
                 </motion.div>
               ))
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
         {selectedOrder && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
             onClick={() => setSelectedOrder(null)}
           >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-[#0f0f12] w-full max-w-2xl rounded-[3rem] p-10 border border-white/10 shadow-[0_0_100px_rgba(var(--primary-rgb),0.1)] relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                 <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                    <X size={24} />
                 </button>

                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary-600/20 flex items-center justify-center text-primary-500">
                       <Receipt size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black uppercase text-white leading-none mb-1">Mission Report</h2>
                       <p className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase italic">Node ID: {selectedOrder.customId}</p>
                    </div>
                 </div>

                 <div className="space-y-6 mb-10">
                    <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">Payload Summary</p>
                       <div className="space-y-4">
                          {selectedOrder.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                               <div className="flex items-center gap-3">
                                  <span className="w-6 h-6 flex items-center justify-center bg-white/5 rounded-lg text-[10px] font-black text-white/40">x{item.quantity}</span>
                                  <span className="text-white/80 font-bold text-sm">{item.name}</span>
                               </div>
                               <span className="text-sm font-black text-white/40">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                       </div>
                       <div className="h-[1px] bg-white/5 my-6" />
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-primary-500 uppercase tracking-widest">Total Integrity</span>
                          <span className="text-xl font-black text-white">${selectedOrder.totalAmount.toFixed(2)}</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                          <MapPin size={20} className="text-indigo-500" />
                          <div>
                             <p className="text-[8px] text-white/20 uppercase font-black">Destination</p>
                             <p className="text-xs font-bold text-white/60 line-clamp-1">{selectedOrder.shippingAddress?.street || 'Central Command'}</p>
                          </div>
                       </div>
                       <div className={`bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center gap-4`}>
                          <Truck size={20} className="text-amber-500" />
                          <div>
                             <p className="text-[8px] text-white/20 uppercase font-black">Mission Status</p>
                             <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">{selectedOrder.status}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={() => navigate(`/track-order/${selectedOrder._id}`)}
                   className="w-full py-6 bg-primary-600 rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] text-white hover:bg-primary-500 transition-all shadow-3xl shadow-primary-900/40"
                 >
                    Establish Live Link
                 </button>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>

    </div>
  )
}

export default OrderHistory
