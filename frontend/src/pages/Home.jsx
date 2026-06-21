import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { 
  ArrowRight, Sparkles, Clock, ShieldCheck, BrainCircuit, Star, 
  MapPin, Phone, Instagram, Facebook, Play, CheckCircle2,
  Utensils, Pizza, Coffee, Dessert, Soup, Zap, ShoppingBag, Plus
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { FoodContext } from '../context/FoodContext'
import useCartStore from '../store/useCartStore'
import { FoodCardSkeleton, CategorySkeleton, HomePageSkeleton } from '../components/Skeleton'
import Logo from '../components/Logo'
import LogoIcon from '../components/LogoIcon'

// Icon mapping helper for dynamic categories
const getCategoryIcon = (name) => {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes('burger')) return <Utensils />;
  if (normalizedName.includes('pizza')) return <Pizza />;
  if (normalizedName.includes('coffee') || normalizedName.includes('drink')) return <Coffee />;
  if (normalizedName.includes('dessert') || normalizedName.includes('sweet')) return <Dessert />;
  if (normalizedName.includes('soup') || normalizedName.includes('dal')) return <Soup />;
  if (normalizedName.includes('rice')) return <ShoppingBag />;
  if (normalizedName.includes('bread')) return <Pizza />;
  return <Zap />; // Fallback icon
};

const Home = () => {
  const { menuItems, categories, isLoading } = useContext(FoodContext)
  const addToCart = useCartStore((state) => state.addToCart)
  const navigate = useNavigate()

  const [reviews, setReviews] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  // Hero Slideshow Logic
  useEffect(() => {
    if (menuItems.length > 0) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % menuItems.length);
      }, 3000); // Decreased speed to 3 seconds for better visibility
      return () => clearInterval(interval);
    }
  }, [menuItems]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/orders/public-reviews');
        if (data.length > 0) setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  const defaultTestimonials = [
    { name: "Alex Rivet", role: "Food Critic", text: "The AI recommendation matched my mood perfectly. I was skeptical but the saffron paella was a spiritual experience.", avatar: "https://i.pravatar.cc/150?u=1" },
    { name: "Sarah Chen", role: "Tech Lead", text: "Zero friction. The checkout is the fastest I've seen in the industry. Highly recommend the truffle burgers.", avatar: "https://i.pravatar.cc/150?u=2" },
    { name: "Marcus Thorne", role: "Athlete", text: "Bio-intelligent food suggestions that actually respect my macros. This is the future of performance eating.", avatar: "https://i.pravatar.cc/150?u=3" }
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultTestimonials;

  // Get Top 4 Rated Items Dynamically (Only those in stock)
  const popularItems = [...menuItems]
    .filter(item => item.isAvailable !== false)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen relative z-10"
      >
      {isLoading ? (
        <HomePageSkeleton />
      ) : (
      <div className="opacity-100 transition-opacity duration-700">
        {/* 🚀 🔥 HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-20 relative">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-500 px-5 py-2.5 rounded-full text-[10px] font-black mb-8 tracking-[0.2em] border border-primary-500/20 uppercase mx-auto lg:mx-0">
              <Sparkles size={14} className="animate-pulse" /> The Future of Dining is Here
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl heading-premium mb-8">
              Your Personal <br />
              <span className="primary-gradient-text">Dining Assistant.</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium italic border-l-2 border-primary-500/30 pl-6 text-left">
              "Your cravings, analyzed. Our AI predicts your perfect meal based on mood, health, and taste within seconds."
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
              <Link to="/menu" className="bg-primary-600 hover:bg-primary-700 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black flex items-center gap-3 transition-all shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:translate-y-[-4px] active:scale-95 group text-sm md:text-base">
                Explore Menu <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/recommend" className="glass px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black flex items-center gap-3 border-white/5 hover:border-primary-500/30 transition-all hover:bg-primary-500/5 group text-white text-sm md:text-base relative overflow-hidden">
                <LogoIcon size={24} className="group-hover:scale-110 transition-transform" /> AI Suggest
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary-500/30 blur-[140px] rounded-full animate-pulse" />
            <div className="relative z-10 glass rounded-[4rem] p-4 border-white/10 group overflow-hidden">
               <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 z-20 flex items-center gap-3 animate-bounce">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">350+ Chefs Online</span>
               </div>

               <AnimatePresence mode="wait">
                 <motion.div
                   key={heroIndex}
                   initial={{ opacity: 0, scale: 1.1, rotate: 1 }}
                   animate={{ opacity: 1, scale: 1, rotate: 0 }}
                   exit={{ opacity: 0, scale: 0.9, rotate: -1 }}
                   transition={{ duration: 0.5, ease: "easeInOut" }}
                   className="relative h-[400px] md:h-[600px] w-full"
                 >
                   <img 
                     src={menuItems[heroIndex]?.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000"} 
                     alt={menuItems[heroIndex]?.name || "Delicious Food"} 
                     className="w-full h-full object-cover rounded-[3.5rem] shadow-2xl"
                   />
                   <div className="absolute bottom-10 left-10 right-10 z-20">
                     <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="glass px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-2xl inline-block"
                     >
                       <span className="text-primary-500 font-black uppercase tracking-[0.3em] text-[8px] mb-1 block">Live Showcase</span>
                       <h4 className="text-white font-black text-xl tracking-tighter italic">{menuItems[heroIndex]?.name}</h4>
                     </motion.div>
                   </div>
                 </motion.div>
               </AnimatePresence>
            </div>
          </motion.div>
        </section>

        {/* 🍽️ FEATURED CATEGORIES */}
        <section className="py-24 bg-dark-800/50 backdrop-blur-xl border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <span className="text-primary-500 font-black tracking-[0.4em] text-[10px] uppercase mb-4 block">Our Categories</span>
               <h2 className="text-5xl heading-premium">Explore <span className="primary-gradient-text">Our Menu</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {categories.length > 0 ? categories.slice(0, 6).map((cat, i) => (
                <motion.button 
                  whileHover={{ y: -8 }}
                  key={i} 
                  onClick={() => navigate('/menu')}
                  className="glass-card flex flex-col items-center justify-center p-10 rounded-[3rem] group hover:border-primary-500/40"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all text-white/30 duration-500">
                    {React.cloneElement(getCategoryIcon(cat.name), { size: 28 })}
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                </motion.button>
              )) : (
                <div className="col-span-full">
                  <CategorySkeleton />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 🤖 AI RECOMMENDATION SECTION */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-primary-500/10 blur-[180px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-20">
             <div className="lg:w-1/2">
                <h2 className="text-6xl heading-premium mb-8">Can't decide? <br /><span className="primary-gradient-text">Let AI choose.</span></h2>
                <p className="text-white/40 text-xl mb-12 max-w-md leading-relaxed">Our recommendation engine analyzes flavor profiles to find what you'll love right now.</p>
                <Link to="/recommend" className="inline-flex items-center gap-4 bg-white text-dark-900 px-12 py-6 rounded-2xl font-black hover:bg-primary-500 hover:text-white transition-all transform active:scale-95 group">
                  GET AI SUGGESTION <Sparkles className="group-hover:animate-spin" />
                </Link>
             </div>
             <div className="lg:w-1/2 grid grid-cols-2 gap-6 scale-90 lg:scale-100">
                <div className="space-y-6 pt-12">
                   <div className="glass-card p-8 rounded-[2.5rem] border-primary-500/20 bg-primary-500/5">
                      <Heart className="text-primary-500 mb-4" size={32} />
                      <h4 className="font-black mb-2">Comfort Fix?</h4>
                      <span className="text-[10px] text-white/30 uppercase font-black uppercase tracking-widest">Mental Refresh</span>
                   </div>
                   <div className="glass-card p-8 rounded-[2.5rem]">
                      <Zap className="text-yellow-500 mb-4" size={32} />
                      <h4 className="font-black mb-2">High Energy</h4>
                      <span className="text-[10px] text-white/30 uppercase font-black uppercase tracking-widest">Power Load</span>
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="glass-card p-8 rounded-[2.5rem]">
                      <Utensils className="text-blue-500 mb-4" size={32} />
                      <h4 className="font-black mb-2">Adventure</h4>
                      <span className="text-[10px] text-white/30 uppercase font-black uppercase tracking-widest">Global Tastes</span>
                   </div>
                   <div className="glass-card p-8 rounded-[2.5rem] bg-emerald-500/5 border-emerald-500/20">
                      <CheckCircle2 className="text-emerald-500 mb-4" size={32} />
                      <h4 className="font-black mb-2">Strict Clean</h4>
                      <span className="text-[10px] text-white/30 uppercase font-black uppercase tracking-widest">Nutrient Pure</span>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* ⭐ POPULAR / TRENDING ITEMS */}
        <section className="py-24 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6">
             <div className="flex justify-between items-end mb-16">
                <div>
                   <span className="text-primary-500 font-black tracking-[0.4em] text-[10px] uppercase mb-4 block">Fan Favorites</span>
                   <h2 className="text-5xl heading-premium">Popular <span className="primary-gradient-text">This Week</span></h2>
                </div>
                <Link to="/menu" className="text-white/40 hover:text-white transition-colors font-black uppercase text-[10px] tracking-widest pb-2">View Full Menu &rarr;</Link>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {popularItems.length > 0 ? popularItems.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: i * 0.1 }}
                    key={item._id || i} 
                    className="glass-card rounded-[3.5rem] overflow-hidden group shadow-2xl flex flex-col h-full"
                  >
                    <div className="h-64 overflow-hidden relative">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                          <Star size={12} className="fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-black">{item.rating || '4.5'}</span>
                       </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                       <h4 className="text-xl font-bold mb-2 tracking-tight line-clamp-1 text-white/90">{item.name}</h4>
                       <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest mb-4">{item.category}</p>
                       <div className="flex justify-between items-center mt-auto pt-6">
                          <span className="text-2xl font-black heading-premium">${item.price.toFixed(2)}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="bg-white/5 p-4 rounded-2xl hover:bg-primary-600 transition-colors group/btn"
                          >
                             <Plus size={20} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                )) : (
                  [1,2,3,4].map(i => (
                    <FoodCardSkeleton key={i} />
                  ))
                )}
             </div>
          </div>
        </section>

        {/* 🎯 WHY CHOOSE US */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20 text-blue-500">
                 <Clock size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4">Super Fast Delivery</h3>
              <p className="text-white/40 leading-relaxed font-medium">We deliver your food in under 30 minutes. Fresh and hot, every single time.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-primary-500/10 flex items-center justify-center mb-8 border border-primary-500/20 text-primary-500">
                 <BrainCircuit size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4">Smart Recommendations</h3>
              <p className="text-white/40 leading-relaxed font-medium">Our AI doesn't just guess; it understands your preferences and seasonal availability.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20 text-emerald-500">
                 <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4">Hyper-Hygiene Standards</h3>
              <p className="text-white/40 leading-relaxed font-medium">All partner kitchens undergo weekly quality audits and real-time sanitization monitoring.</p>
            </div>
          </div>
        </section>

        {/* 📱 HOW IT WORKS */}
        <section className="py-32 bg-dark-800/80">
           <div className="max-w-7xl mx-auto px-6 text-center">
              <span className="text-primary-500 font-black tracking-[0.4em] text-[10px] uppercase mb-4 block">How to Order</span>
              <h2 className="text-5xl font-black mb-24 tracking-tighter">Simple <span className="gradient-text">3-Step Process</span></h2>
              <div className="grid md:grid-cols-4 gap-12 relative">
                 <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 hidden lg:block" />
                 {[
                   { step: '01', title: 'Pick Your Mood', desc: 'Consult the AI assistant based on your current vibe.' },
                   { step: '02', title: 'Confirm Choice', desc: 'Choose from AI suggestions or browse our full menu.' },
                   { step: '03', title: 'Secure Checkout', desc: 'Add items and apply the best available coupons.' },
                   { step: '04', title: 'Real-time Tracking', desc: 'Track your order in real-time until it arrives.' }
                 ].map((s, i) => (
                   <div key={i} className="relative z-10 flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full glass border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative">
                         <span className="text-xl font-black gradient-text">{s.step}</span>
                      </div>
                      <h4 className="text-xl font-black mb-3">{s.title}</h4>
                      <p className="text-white/30 text-sm font-medium italic">"{s.desc}"</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 💬 CUSTOMER REVIEWS / TESTIMONIALS */}
        <section className="py-32">
           <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                 <span className="text-primary-500 font-black tracking-[0.4em] text-[10px] uppercase mb-4 block">Testimonials</span>
                 <h2 className="text-5xl font-black tracking-tighter">What <span className="gradient-text">Customers Say</span></h2>
              </div>
              <div className="grid md:grid-cols-3 gap-10">
                 {displayReviews.map((t, i) => (
                   <div key={i} className="glass-card p-10 rounded-[3rem] relative">
                      <div className="absolute top-0 right-10 -translate-y-1/2 w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center shadow-xl">
                         <span className="text-4xl font-serif text-white opacity-50">"</span>
                      </div>
                      <p className="text-white/40 text-lg mb-10 leading-relaxed font-medium italic">"{t.text}"</p>
                      <div className="flex items-center gap-4">
                         <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full grayscale" />
                         <div>
                            <h4 className="font-black text-sm">{t.name}</h4>
                            <p className="text-[10px] uppercase font-bold text-primary-500 tracking-widest">{t.role}</p>
                         </div>
                      </div>
                      {t.rating && (
                         <div className="mt-6 flex items-center gap-1">
                            {[...Array(5)].map((_, idx) => (
                               <Star key={idx} size={12} className={idx < t.rating ? "text-yellow-500 fill-yellow-500" : "text-white/10"} />
                            ))}
                         </div>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 🎁 OFFERS / DISCOUNTS SECTION */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
             <div className="grid md:grid-cols-2 gap-10">
                <div className="glass-card p-12 rounded-[4rem] border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-transparent relative overflow-hidden group">
                   <div className="relative z-10">
                      <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest mb-6 inline-block">EXCLUSIVE</span>
                      <h3 className="text-4xl font-black mb-4 tracking-tighter">50% OFF YOUR <br />FIRST ORDER</h3>
                      <p className="text-white/40 mb-8 font-medium italic">Use code: <span className="text-white font-black">SAVE50</span></p>
                      <button className="text-primary-500 font-black uppercase text-[10px] tracking-widest hover:translate-x-2 transition-transform inline-flex items-center gap-2">Get This Offer <ArrowRight size={14} /></button>
                   </div>
                   <Zap className="absolute top-1/2 right-0 -translate-y-1/2 text-white/5 -rotate-12 group-hover:scale-125 transition-transform" size={240} />
                </div>
                <div className="glass-card p-12 rounded-[4rem] border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent relative overflow-hidden group">
                   <div className="relative z-10">
                      <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest mb-6 inline-block">LIMITED WEEKEND</span>
                      <h3 className="text-4xl font-black mb-4 tracking-tighter">FREE LOGISTICS <br />FOR ALL GOURMETS</h3>
                      <p className="text-white/40 mb-8 font-medium italic">Applied automatically on orders $40+</p>
                      <button className="text-purple-500 font-black uppercase text-[10px] tracking-widest hover:translate-x-2 transition-transform inline-flex items-center gap-2">Get Delivery <ArrowRight size={14} /></button>
                   </div>
                   <ShoppingBag className="absolute top-1/2 right-0 -translate-y-1/2 text-white/5 -rotate-12 group-hover:scale-125 transition-transform" size={240} />
                </div>
             </div>
          </div>
        </section>

        {/* 📍 DELIVERY INFO / LOCATION */}
        <section className="py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
             <div className="glass-card rounded-[4rem] p-16 flex flex-col lg:flex-row justify-between items-center gap-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                   <div className="inline-flex items-center gap-3 text-emerald-500 bg-emerald-500/10 px-6 py-2.5 rounded-full text-xs font-black tracking-widest border border-emerald-500/20 mb-8 uppercase">
                      <MapPin size={16} /> Global Operations
                   </div>
                   <h2 className="text-6xl font-black mb-8 tracking-tighter max-w-lg leading-tight">We're delivering <br /> to your <span className="gradient-text">City.</span></h2>
                   <p className="text-white/40 text-xl font-medium">Instant coverage in 15+ major metropolitan clusters. Check your exact eligibility below.</p>
                </div>
                <button className="bg-white text-dark-900 px-16 py-8 rounded-[2.5rem] font-black text-xl hover:bg-primary-500 hover:text-white transition-all shadow-2xl">
                   Verify My Location
                </button>
             </div>
          </div>
        </section>

        {/* 📲 APP DOWNLOAD / CTA */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
             <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-[120px] rounded-full" />
                <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800" alt="Mobile App" className="w-[400px] h-auto rounded-[3.5rem] shadow-2xl border border-white/10 relative z-10 mx-auto" />
             </div>
             <div>
                <h2 className="text-5xl font-black mb-8 tracking-tighter">Carry Cuisine <br /><span className="gradient-text">In Your Pocket.</span></h2>
                <p className="text-white/40 text-lg mb-12 max-w-md">Unlock exclusive app-only menu items and faster checkout with our native mobile experience.</p>
                <div className="flex flex-col sm:flex-row gap-6">
                   <button className="bg-dark-800 border border-white/10 px-8 py-5 rounded-[2rem] flex items-center gap-5 hover:bg-white/5 transition-all group min-w-[240px]">
                      <Apple size={32} className="group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                         <p className="text-[9px] uppercase font-black tracking-widest text-white/30 leading-none mb-1">Download on</p>
                         <p className="text-xl font-black leading-none">App Store</p>
                      </div>
                   </button>
                   <button className="bg-dark-800 border border-white/10 px-8 py-5 rounded-[2rem] flex items-center gap-5 hover:bg-white/5 transition-all group min-w-[240px]">
                      <Play size={28} className="fill-white group-hover:scale-110 transition-transform ml-1" />
                      <div className="text-left">
                         <p className="text-[9px] uppercase font-black tracking-widest text-white/30 leading-none mb-1">Get it on</p>
                         <p className="text-xl font-black leading-none">Google Play</p>
                      </div>
                   </button>
                </div>
             </div>
          </div>
        </section>

        {/* 🔚 FOOTER */}
        <footer className="pt-32 pb-16 bg-dark-900 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
             <div className="grid md:grid-cols-4 gap-20 mb-24">
                <div className="col-span-1 md:col-span-2">
                    <Link to="/" className="inline-block mb-10 hover:opacity-90 transition-opacity">
                       <Logo />
                    </Link>
                   <p className="text-white/30 max-w-sm text-lg italic mb-10 leading-relaxed font-medium border-l-2 border-white/5 pl-8">
                     "Redefining modern dining through intelligent suggestions and seamless logistics."
                   </p>
                   <div className="flex gap-6">
                      {[Instagram, XIcon, Facebook].map((Icon, i) => (
                        <button key={i} className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center hover:bg-primary-600 transition-all text-white/40 hover:text-white">
                           <Icon size={24} />
                        </button>
                      ))}
                   </div>
                </div>
                <div className="md:col-span-1">
                   <h4 className="font-black mb-10 text-white tracking-[0.2em] uppercase text-xs">Quick Links</h4>
                   <ul className="space-y-6">
                      {['Browse Menu', 'AI Recommendations', 'Partnerships', 'Our Story', 'Careers'].map(l => (
                        <li key={l}><Link to="#" className="text-white/40 hover:text-primary-500 transition-colors font-bold tracking-tight">{l}</Link></li>
                      ))}
                   </ul>
                </div>
                <div className="md:col-span-1">
                   <h4 className="font-black mb-10 text-white tracking-[0.2em] uppercase text-xs">Support & Legal</h4>
                   <ul className="space-y-6">
                      {['Privacy Policy', 'Delivery Terms', 'Investor Relations', 'Food Safety', 'Sitemap'].map(l => (
                        <li key={l}><Link to="#" className="text-white/40 hover:text-primary-500 transition-colors font-bold tracking-tight">{l}</Link></li>
                      ))}
                   </ul>
                </div>
             </div>
             
             <div className="pt-16 border-t border-white/5 flex flex-col md:row justify-between items-center gap-8">
                <p className="text-white/20 text-xs font-black tracking-widest uppercase">© 2026 FoodGenie Systems inc. / Owner: Manish Kangra</p>
                <div className="flex items-center gap-12 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                   <span className="flex items-center gap-2"><Phone size={14} className="text-primary-500" /> +91 8708975500</span>
                   <span className="flex items-center gap-2"><MapPin size={14} className="text-primary-500" /> Jind, Haryana</span>
                </div>
             </div>
          </div>
        </footer>
      </div>
      )}
      </motion.div>
    </>
  )
}

// Simple Helper Components for Icons not in Lucide
const Apple = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.27-2.02 1.4-3.5-3 .12-3.6 2.31-3.4 3.5 1 .1 1.7-.5 2-.8z" />
  </svg>
)

const XIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
)

const Heart = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

export default Home
