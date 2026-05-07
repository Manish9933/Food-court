import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, CreditCard } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../store/useCartStore'
import { FoodContext } from '../context/FoodContext'
import { CartPageSkeleton } from '../components/Skeleton'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const { menuItems, isLoading } = React.useContext(FoodContext)
  const subtotal = getTotalPrice()
  const shipping = 0 // Free shipping for now
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax
  const navigate = useNavigate()

  // Cross-reference cart items with live menu data for availability
  const cartWithAvailability = cart.map(item => {
    const liveItem = menuItems.find(m => (m._id || m.id) === (item._id || item.id))
    return { ...item, isAvailable: liveItem ? liveItem.isAvailable : true }
  })

  const hasSoldOutItems = cartWithAvailability.some(item => !item.isAvailable)

  const handleCheckout = () => {
    if (cart.length === 0 || hasSoldOutItems) return;
    navigate('/checkout', {
      state: {
        cartItems: cart,
        subtotal: subtotal,
        tax: subtotal * 0.1,
        total: subtotal + (subtotal * 0.1)
      }
    })
  }

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-dark-900 overflow-hidden relative">
      {isLoading ? (
        <CartPageSkeleton />
      ) : (
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {cart.length === 0 && (
            <motion.div 
              key="empty-cart"
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center bg-white/[0.02] p-16 rounded-[4rem] border border-white/5 backdrop-blur-3xl absolute inset-x-6 top-60 z-10"
            >
              <div className="bg-primary-500/10 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary-500/20 shadow-2xl shadow-primary-900/10">
                <ShoppingBag size={48} className="text-primary-500" />
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tighter">Your Basket is <span className="gradient-text">Empty</span></h2>
              <p className="text-white/40 mb-10 max-w-xs mx-auto font-medium">Add something delicious from our menu to start your order.</p>
              <Link to="/menu" className="inline-flex items-center gap-3 bg-primary-600 hover:bg-primary-700 px-10 py-5 rounded-[1.5rem] font-black transition-all shadow-2xl shadow-primary-900/40 active:scale-95 group">
                <ArrowLeft size={18} className="group-hover:translate-x-[-4px] transition-transform" /> Browse Cuisine
              </Link>
            </motion.div>
          )}
          
          <motion.div 
            key="cart-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`transition-all duration-700 ${cart.length === 0 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          >
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Order Queue */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-end mb-10 pl-2">
                <div>
                  <h1 className="text-5xl font-black tracking-tighter mb-2">Order <span className="gradient-text">Basket</span></h1>
                  <p className="text-white/40 font-medium">{cart.length} unique items selected</p>
                </div>
                <button 
                  onClick={clearCart}
                  className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 hover:text-red-500 transition-colors pb-1"
                >
                  Clear Entire Order
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <AnimatePresence mode="popLayout">
                  {cartWithAvailability.map((item) => (
                    <motion.div
                      layout
                      key={item._id || item.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`glass-card p-6 rounded-[2.5rem] flex items-center gap-8 group ${!item.isAvailable ? 'border-rose-500/20 bg-rose-500/5' : ''}`}
                    >
                      <div className="relative w-32 h-32 rounded-[1.75rem] overflow-hidden border border-white/5">
                        <img src={item.image} alt={item.name} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${!item.isAvailable ? 'grayscale opacity-50' : ''}`} />
                        {!item.isAvailable && (
                          <div className="absolute inset-0 bg-rose-600/40 flex items-center justify-center">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Locked</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.2em] block mb-1">{item.category}</span>
                            <h3 className="text-2xl font-black tracking-tight">{item.name}</h3>
                            {!item.isAvailable && (
                              <span className="text-rose-500 font-black uppercase text-[10px] mt-1 block animate-pulse">
                                This item just went out of stock!
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => removeFromCart(item._id || item.id)}
                            className="bg-white/5 p-3 rounded-2xl text-white/30 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-end mt-6">
                          <span className="text-3xl font-black gradient-text">${(item.price * item.quantity).toFixed(2)}</span>
                          
                          <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-[1.25rem] p-1.5 backdrop-blur-xl">
                            <button 
                               disabled={!item.isAvailable}
                              onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all disabled:opacity-20"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-4 text-center font-black text-lg">{item.quantity}</span>
                            <button 
                               disabled={!item.isAvailable}
                              onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all shadow-glow disabled:opacity-20"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Checkout Summary */}
            <div className="w-full lg:w-[420px]">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 rounded-[3rem] border border-white/5 sticky top-32 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <CreditCard size={120} className="rotate-12" />
                </div>
                
                <h2 className="text-3xl font-bold tracking-tight text-white/90 mb-10">Order Summary</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                    <span className="text-xl font-black">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Service & Tax (10%)</span>
                    <span className="text-xl font-black">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Delivery</span>
                    <span className="text-emerald-500 font-black text-xs uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg">Complimentary</span>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-white/5 mb-10" />

                <div className="flex justify-between items-end mb-12">
                  <span className="text-white/40 font-bold uppercase tracking-widest text-[10px] pb-1">Total Bill</span>
                  <span className="text-5xl font-black gradient-text">${total.toFixed(2)}</span>
                </div>

                {hasSoldOutItems && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl mb-8">
                     <p className="text-rose-500 font-black text-[10px] uppercase tracking-widest text-center">
                       Remove out of stock items <br /> before checking out
                     </p>
                  </div>
                )}

                <button 
                  onClick={handleCheckout}
                  disabled={hasSoldOutItems}
                  className={`w-full py-6 rounded-[1.75rem] font-black flex items-center justify-center gap-4 transition-all active:scale-95 group text-lg relative overflow-hidden ${
                    hasSoldOutItems 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5' 
                      : 'bg-primary-600 hover:bg-primary-700 shadow-[0_20px_60px_rgba(var(--primary-rgb),0.35)] hover:shadow-[0_25px_80px_rgba(var(--primary-rgb),0.5)]'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {hasSoldOutItems ? 'Checkout Blocked' : 'Proceed to Secure Checkout'} 
                  <ArrowRight size={22} className={hasSoldOutItems ? 'opacity-20' : 'group-hover:translate-x-2 transition-transform duration-500'} />
                </button>

                <div className="mt-10 flex items-center justify-center gap-4 text-white/20 text-xs">
                  <p>Protected by SSL</p>
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  <p>MasterCard / Visa / Crypto</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        </AnimatePresence>
      </div>
      )}
    </div>
  )
}

export default Cart
