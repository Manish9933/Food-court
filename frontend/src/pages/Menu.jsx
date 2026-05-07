import React, { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Star, Loader2, UtensilsCrossed } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import useCartStore from '../store/useCartStore'
import { FoodContext } from '../context/FoodContext'
import { FoodCardSkeleton, CategorySkeleton, MenuPageSkeleton } from '../components/Skeleton'

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const { menuItems, categories, isLoading, refreshData } = useContext(FoodContext)
  const addToCart = useCartStore((state) => state.addToCart)
  const location = useLocation()

  React.useEffect(() => {
    refreshData()
    if (location.state?.search) {
      setSearchTerm(location.state.search)
    }
  }, [location.state])

  const CATEGORIES = ['All', ...categories.map(c => c.name)]

  const filteredItems = menuItems.filter(item => {
    if (!item.category) return false;
    
    // Normalize both for comparison
    const targetCat = activeCategory.toLowerCase();
    const itemCat = item.category.toLowerCase();
    
    const matchesCategory = targetCat === 'all' || itemCat === targetCat;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative pt-40 pb-20 px-6 min-h-screen bg-dark-900 selection:bg-primary-500/30"
    >
      {isLoading && categories.length === 0 ? (
        <MenuPageSkeleton />
      ) : (
      <div className={`max-w-7xl mx-auto transition-all duration-700 opacity-100`}>
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-primary-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Fresh & Hot</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl heading-premium mb-6">
                Our <span className="primary-gradient-text">Food</span> Menu
              </h1>
              <p className="text-white/40 text-lg md:text-xl font-medium max-w-lg mb-8 lg:mb-0">
                Fresh and delicious food made by top chefs just for you.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 bg-white/[0.03] p-2.5 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl"
          >
            {isLoading ? (
               <CategorySkeleton />
            ) : (
              CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-colors duration-500 ${
                      isActive ? 'text-white' : 'text-white/20 hover:text-white/50'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-primary-600 rounded-2xl shadow-[0_15px_40px_rgba(var(--primary-rgb),0.4)]"
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    {cat}
                  </button>
                )
              })
            )}
          </motion.div>
        </div>

        {/* Search & Statistics */}
        <div className="flex flex-col md:flex-row gap-8 mb-20 items-center">
          <div className="relative flex-1 group w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary-500 transition-all duration-500 z-10" size={20} />
            <input 
              type="text" 
              placeholder="Search dishes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] backdrop-blur-3xl border border-white/5 py-6 md:py-8 pl-16 md:pl-20 pr-8 md:pr-10 rounded-[2.5rem] md:rounded-[3rem] outline-none focus:border-primary-500/40 transition-all font-black text-lg md:text-2xl placeholder:text-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] focus:shadow-[0_40px_120px_rgba(var(--primary-rgb),0.1)] relative z-0"
            />
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[2.5rem] border border-white/5">
             <div className="px-6 py-2 text-center">
                <span className="block text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">Found</span>
                <span className="text-2xl font-black gradient-text">{isLoading ? '...' : filteredItems.length} Items</span>
             </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <FoodCardSkeleton key={i} />)}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-40 text-center glass-card rounded-[4rem] border-dashed border-white/10">
            <UtensilsCrossed className="mx-auto text-white/10 mb-6" size={64} />
            <h3 className="text-3xl font-black text-white/20">No matching flavors found</h3>
            <button onClick={() => {setActiveCategory('All'); setSearchTerm('')}} className="mt-6 text-primary-500 font-bold hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id || item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`glass-card rounded-[3.5rem] overflow-hidden group border-white/5 flex flex-col h-full ${!item.isAvailable ? 'grayscale' : ''}`}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
                    
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <span className="px-6 py-2 bg-rose-600 text-white font-black uppercase tracking-[0.3em] text-xs skew-x-[-12deg] shadow-2xl">
                          Sold Out
                        </span>
                      </div>
                    )}

                    <div className="absolute top-6 right-6 glass px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-2xl">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-black">{item.rating || '4.8'}</span>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em]">{item.category}</span>
                      <span className="text-xl font-black gradient-text">${item.price.toFixed(2)}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight leading-tight text-white/90">{item.name}</h3>
                    <p className="text-white/30 text-sm leading-relaxed mb-10 line-clamp-2 font-medium">{item.description}</p>
                    
                    <button
                      disabled={!item.isAvailable}
                      onClick={() => addToCart(item)}
                      className={`mt-auto w-full py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all border border-white/5 shadow-2xl group/btn ${
                        item.isAvailable 
                          ? 'bg-white/5 hover:bg-primary-600 hover:translate-y-[-4px] active:scale-95' 
                          : 'bg-white/5 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <Plus size={22} className={`text-white/20 ${item.isAvailable ? 'group-hover/btn:text-white' : ''}`} />
                      <span className={`text-white/30 uppercase tracking-[0.2em] text-[10px] ${item.isAvailable ? 'group-hover/btn:text-white' : ''}`}>
                        {item.isAvailable ? 'Add to Order' : 'Sold Out'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      )}
    </motion.div>
  )
}

export default Menu
