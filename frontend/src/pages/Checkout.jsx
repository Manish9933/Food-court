import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, CreditCard, MapPin, ShieldCheck, 
  ChevronRight, Smartphone, Banknote, CheckCircle2,
  Lock, Sparkles, Loader2
} from 'lucide-react'
import useCartStore from '../store/useCartStore'
import useAuthStore from '../store/useAuthStore'
import api from '../api/api'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const clearCart = useCartStore((state) => state.clearCart)
  const { user } = useAuthStore()
  
  const cartItems = location.state?.cartItems || []
  const subtotal = location.state?.subtotal || 0
  const tax = location.state?.tax || 0
  const total = location.state?.total || 0

  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [address, setAddress] = useState({
    street: '221B Baker St. Suite 404',
    city: 'London',
    phone: user?.phone || '9999911111'
  })

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to place an order')
      navigate('/login')
      return
    }

    setIsProcessing(true)
    
    try {
      // 🛡️ Filter out any items that don't have a valid 24-char hex ObjectId
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      const validItems = cartItems.filter(item => 
        item._id && objectIdRegex.test(item._id)
      );

      if (cartItems.length > 0 && validItems.length === 0) {
        alert('Your cart contains items with an outdated format. Please refresh the page or clear your cart to sync with the latest menu.');
        setIsProcessing(false);
        return;
      }

      // 💳 Razorpay Integration (Test Mode)
      if (paymentMethod !== 'cash') {
        const res = await loadRazorpayScript();
        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          setIsProcessing(false);
          return;
        }

        // Create Order on Backend
        const { data: order } = await api.post('/payments/orders', { amount: total });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Replace with your Key ID
          amount: order.amount,
          currency: order.currency,
          name: "FoodGenie AI",
          description: "Gourmet Gastronomy Payment",
          image: "https://i.ibb.co/3W6qWqX/logo.png", // Replace with your logo
          order_id: order.id,
          handler: async function (response) {
            try {
              // Verify Payment on Backend
              const verifyRes = await api.post('/payments/verify', response);
              if (verifyRes.data.message === "Payment verified successfully") {
                finalizeOrder('Paid');
              }
            } catch (err) {
              alert("Payment verification failed!");
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: address.phone
          },
          theme: {
            color: "#6366f1",
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        // Cash on Delivery
        finalizeOrder('Pending');
      }
    } catch (error) {
      console.error('Order placement failed:', error)
      alert(error.response?.data?.message || 'Order failed to reach the kitchen. Please check your connection.')
      setIsProcessing(false)
    }
  }

  const finalizeOrder = async (paymentStatus) => {
    try {
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      const validItems = cartItems.filter(item => 
        item._id && objectIdRegex.test(item._id)
      );

      const orderData = {
        items: validItems.map(item => ({
          foodItem: item._id, 
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: address,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        status: 'Pending'
      }

      await api.post('/orders', orderData)
      setIsProcessing(false)
      setIsSuccess(true)
      clearCart()
    } catch (err) {
      console.error('Finalization failed:', err);
      alert('Order finalization failed. Please contact support.');
      setIsProcessing(false);
    }
  }


  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6 bg-dark-900">
        <div className="text-center glass p-16 rounded-[4rem] border-white/5">
          <h2 className="text-3xl font-black mb-6">No Checkout Data Found</h2>
          <Link to="/menu" className="text-primary-500 font-black flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Back to Dining Room
          </Link>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6 bg-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-500/5 blur-[150px] animate-pulse" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10 glass p-16 rounded-[4rem] border-primary-500/20 max-w-lg w-full"
        >
          <div className="w-24 h-24 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/20 border border-emerald-500/20">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tighter">Order <span className="text-emerald-500">Confirmed.</span></h1>
          <p className="text-white/40 text-lg mb-12 font-medium">Your gastronomic experience has been scheduled. Prepare your palate.</p>
          <button 
            onClick={() => navigate('/orders')}
            className="w-full bg-white text-dark-900 py-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-primary-500 hover:text-white transition-all shadow-2xl group"
          >
            Go to Order History <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-dark-900 overflow-x-hidden relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => navigate(-1)} className="glass p-4 rounded-2xl border-white/5 hover:bg-white/5 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-4xl font-black tracking-tighter italic">Secure <span className="gradient-text">Checkout / Payment</span></h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* Main Info (LHS) */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* 📍 DELIVERY ADDRESS */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-10 rounded-[3rem] border-white/5 relative group"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500">
                  <MapPin size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-white/80">Delivery Address</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <input 
                  type="text" 
                  placeholder="Street Name & Building"
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full focus:outline-none focus:border-primary-500/50 transition-all text-white/80 font-medium"
                  value={address.street}
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City" className="bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-primary-500/50 transition-all text-white/80" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
                  <input type="text" placeholder="Phone Number" className="bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-primary-500/50 transition-all text-white/80" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} />
                </div>
              </div>
            </motion.section>

            {/* 💳 PAYMENT METHODS */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-10 rounded-[3rem] border-white/5"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-white/80">Payment Method</h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  { id: 'card', name: 'Card', icon: <CreditCard /> },
                  { id: 'upi', name: 'UPI', icon: <Smartphone /> },
                  { id: 'cash', name: 'Wallet', icon: <Banknote /> }
                ].map((type) => (
                  <button 
                    key={type.id}
                    onClick={() => setPaymentMethod(type.id)}
                    className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all gap-3 ${
                      paymentMethod === type.id 
                      ? 'bg-primary-500/10 border-primary-500/40 text-primary-500' 
                      : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10'
                    }`}
                  >
                    {type.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest">{type.name}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <input type="text" placeholder="Cardholder Name" className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full focus:outline-none" defaultValue={user?.name || ''} />
                  <input type="text" placeholder="Card Number" className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full focus:outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Exp Date" className="bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none" />
                    <input type="text" placeholder="CVV" className="bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none" />
                  </div>
                </div>
              )}
            </motion.section>

            {/* 🧾 ORDER SUMMARY (Mobile View only show items) */}
            <div className="lg:hidden glass p-10 rounded-[3rem] border-white/5">
                <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-white/80">Mini Summary</h3>
                <p className="text-white/40">{cartItems.length} items to be delivered.</p>
            </div>

          </div>

          {/* Checkout Totals (RHS) */}
          <div className="lg:col-span-2 space-y-8 sticky top-36">
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-10 rounded-[3.5rem] border-white/10 shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-10 right-10 rotate-12 opacity-5 scale-150">
                  <ShieldCheck size={80} />
               </div>

               <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-4">Receipt Details</h3>
               
               <div className="space-y-6 mb-10">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <p className="text-white/60 font-bold max-w-[180px] line-clamp-1">{item.quantity}x {item.name}</p>
                      <p className="font-black text-white/80">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="h-[1px] bg-white/5" />
                  <div className="flex justify-between items-center">
                    <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                    <span className="text-white/80 font-black">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">Taxes</span>
                    <span className="text-white/80 font-black">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-primary-500 text-xs font-black uppercase tracking-widest">Final Bill</span>
                    <span className="text-4xl font-black gradient-text">₹{total.toFixed(2)}</span>
                  </div>
               </div>

               <div className="bg-primary-500/10 border border-primary-500/20 p-5 rounded-3xl mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Lock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-0.5">End-to-End Secure</p>
                    <p className="text-[9px] font-medium text-white/40 italic">Biometric identification required next.</p>
                  </div>
               </div>

               <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-white text-dark-900 py-7 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-primary-500 hover:text-white transition-all shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
               >
                 {isProcessing ? (
                   <>
                    <Loader2 size={24} className="animate-spin" /> AUTHORIZING...
                   </>
                 ) : (
                   <>
                    PLACE ORDER <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                   </>
                 )}
               </button>

               <div className="mt-8 flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center gap-2 opacity-20">
                    <ShieldCheck size={14} />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">PCI-DSS Compliant Infrastructure</span>
                  </div>
                  <div className="mt-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">Test Mode OTP: 123456</p>
                  </div>
               </div>
            </motion.div>

            {/* Bonus: Trust Elements */}
            <div className="flex items-center justify-center gap-6 opacity-30 px-6">
              <Sparkles size={24} />
              <div className="h-10 w-[1px] bg-white/10" />
              <ShieldCheck size={24} />
              <div className="h-10 w-[1px] bg-white/10" />
              <Lock size={24} />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
