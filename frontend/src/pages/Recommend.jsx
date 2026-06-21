import React, { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, BrainCircuit, Heart, Zap, Leaf, DollarSign, RotateCcw, Plus, Loader2, Star, ArrowRight, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../store/useCartStore'
import { FoodContext } from '../context/FoodContext'
import { RecommendPageSkeleton } from '../components/Skeleton'
import LogoIcon from '../components/LogoIcon'

const MOODS = [
  { id: 'adventurous', label: 'Adventurous', icon: <Sparkles />, color: 'from-purple-500/30 to-blue-500/30', activeColor: 'bg-purple-600', tag: 'Spicy / Exotic' },
  { id: 'comfort', label: 'Comfort', icon: <Heart />, color: 'from-primary-500/30 to-red-500/30', activeColor: 'bg-primary-600', tag: 'Warm / Filling' },
  { id: 'healthy', label: 'Healthy', icon: <Leaf />, color: 'from-emerald-500/30 to-cyan-500/30', activeColor: 'bg-emerald-600', tag: 'Fresh / Light' },
  { id: 'energetic', label: 'High Energy', icon: <Zap />, color: 'from-yellow-400/30 to-primary-400/30', activeColor: 'bg-primary-500', tag: 'Protein / Fast' },
]

const BUDGETS = [
  { id: 'low', label: 'Budget-Friendly', icon: <DollarSign size={16} /> },
  { id: 'mid', label: 'Mid-Range', icon: <><DollarSign size={14} /><DollarSign size={14} /></> },
  { id: 'high', label: 'Gourmet Treat', icon: <><DollarSign size={14} /><DollarSign size={14} /><DollarSign size={14} /></> },
]

const Recommend = () => {
  const [step, setStep] = useState(1)
  const [selections, setSelections] = useState({ mood: null, budget: null })
  const [isThinking, setIsThinking] = useState(false)
  const [result, setResult] = useState(null)
  
  const { menuItems, isLoading: isLoadingMenu } = useContext(FoodContext)
  
  const navigate = useNavigate()
  const addToCart = useCartStore((state) => state.addToCart)

  const handleRecommendation = () => {
    setIsThinking(true)
    const moodMap = {
      adventurous: ['main course', 'soups', 'burgers'],
      comfort: ['burgers', 'desserts', 'beverages', 'main course'],
      healthy: ['salads', 'soups'],
      energetic: ['main course', 'burgers']
    }

    const moodMatches = (menuItems || []).filter(item => {
      if (!item.isAvailable) return false;
      const itemCat = item.category?.toLowerCase();
      return moodMap[selections.mood]?.includes(itemCat);
    });
    let budgetMatches = moodMatches
    if (selections.budget === 'low') budgetMatches = moodMatches.filter(i => i.price < 12)
    else if (selections.budget === 'mid') budgetMatches = moodMatches.filter(i => i.price >= 12 && i.price < 20)
    else if (selections.budget === 'high') budgetMatches = moodMatches.filter(i => i.price >= 20)

    const finalSelection = budgetMatches.length > 0 ? budgetMatches[Math.floor(Math.random() * budgetMatches.length)] 
                         : moodMatches.length > 0 ? moodMatches[Math.floor(Math.random() * moodMatches.length)] 
                         : (menuItems && menuItems.length > 0 ? menuItems[0] : null)

    setTimeout(() => {
      if (finalSelection) {
        setResult(finalSelection)
        setStep(3)
      } else {
        alert("No suitable items found. Please try a different mood!")
      }
      setIsThinking(false)
    }, 1200)
  }

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-dark-900 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {(isLoadingMenu || isThinking) && <RecommendPageSkeleton />}
      </AnimatePresence>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className="text-center">
              <div className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 relative">
                <LogoIcon size={80} />
              </div>
              <h1 className="text-6xl font-black mb-6 tracking-tighter leading-none">Find Your <span className="gradient-text">Mood</span> Food</h1>
              <p className="text-white/40 text-xl font-medium mb-16">How are you feeling right now?</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {MOODS.map((m) => (
                  <button key={m.id} onClick={() => { setSelections({ ...selections, mood: m.id }); setStep(2); }} className="glass-card h-72 rounded-[3.5rem] flex flex-col items-center justify-center gap-6 group hover:border-primary-500/40 relative overflow-hidden">
                     <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-125 transition-transform duration-700 relative z-10 ${m.activeColor} bg-white/5`}>{m.icon}</div>
                     <span className="text-xl font-black relative z-10 tracking-tight">{m.label}</span>
                     <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-white/30 relative z-10">{m.tag}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center">
              <button onClick={() => setStep(1)} className="text-white/30 hover:text-white mb-12 flex items-center gap-3 mx-auto font-black uppercase text-[10px] tracking-[0.2em] transition-colors"><RotateCcw size={14}/> Change Mood</button>
              <h2 className="text-6xl font-black mb-16 tracking-tighter">Choose Your <span className="gradient-text">Budget</span></h2>
              <div className="flex flex-col gap-5 max-w-sm mx-auto">
                {BUDGETS.map((b) => (
                  <button key={b.id} onClick={() => { setSelections({ ...selections, budget: b.id }); handleRecommendation(); }} className="glass-card w-full p-10 rounded-[2.5rem] flex items-center justify-between hover:border-primary-500/40 transition-all font-black group">
                    <span className="text-2xl">{b.label}</span>
                    <div className="text-primary-500 bg-primary-500/10 p-5 rounded-3xl group-hover:scale-110 transition-transform">{b.icon}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {isThinking && (
            <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-dark-900/95 backdrop-blur-[100px] z-50 flex flex-col items-center justify-center text-center">
                <div className="relative mb-12">
                  <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }} className="w-40 h-40 border-[3px] border-primary-500/10 border-t-primary-500 rounded-[3rem] shadow-[0_0_80px_rgba(var(--primary-rgb),0.2)]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <LogoIcon size={70} />
                  </div>
                </div>
               <h3 className="text-4xl font-black mb-4 tracking-tight">AI is picking your food...</h3>
               <p className="text-white/30 font-medium tracking-widest uppercase text-[10px]">Looking for the best options</p>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                 <div className="inline-block bg-primary-500/20 text-primary-500 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.25em] mb-6 uppercase">Special Match Found</div>
                 <h1 className="text-6xl font-black tracking-tighter">Your <span className="gradient-text">Result</span></h1>
              </div>
              
              <div className="glass-card rounded-[4rem] overflow-hidden p-6 border-white/10 group">
                <div className="h-[450px] relative rounded-[3rem] overflow-hidden">
                  <img src={result.image} alt={result.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-8 right-8 glass backdrop-blur-2xl px-6 py-3 rounded-3xl border-white/20 flex items-center gap-3 shadow-2xl">
                    <Star size={20} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-black tabular-nums">{result.rating || '4.9'}</span>
                  </div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <span className="text-primary-500 font-black uppercase text-[10px] tracking-[0.4em] mb-3 block">Top Recommendation</span>
                    <h2 className="text-5xl font-black tracking-tighter mb-4">{result.name}</h2>
                    <p className="text-white/60 text-lg font-medium leading-relaxed max-w-lg italic line-clamp-2">"{result.description}"</p>
                  </div>
                </div>

                <div className="p-8 pt-10 flex flex-col gap-6">
                  <div className="flex justify-between items-center px-4">
                     <span className="text-white/40 uppercase font-black text-[10px] tracking-widest">Price</span>
                     <span className="text-5xl font-black gradient-text">₹{result.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-4 mt-4">
                    <button onClick={() => { addToCart(result); navigate('/cart'); }} className="flex-1 bg-primary-600 hover:bg-primary-700 py-6 rounded-[2rem] font-black flex items-center justify-center gap-4 transition-all shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] active:scale-95 text-lg group/cart">
                       <ShoppingBag size={24} className="group-hover:rotate-12 transition-transform" /> Add to Order
                    </button>
                    <button onClick={setStep.bind(null, 1)} className="glass-card p-6 rounded-[2rem] hover:text-primary-500 transition-all border border-white/5 active:scale-95 group/reset">
                       <RotateCcw size={28} className="group-hover/reset:-rotate-90 transition-transform duration-500" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

export default Recommend
