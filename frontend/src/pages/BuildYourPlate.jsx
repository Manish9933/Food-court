import React, { useState, useCallback, useRef, useContext, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChefHat, X, RotateCcw } from 'lucide-react'
import FoodSidebar from '../components/BuildYourPlate/FoodSidebar'
import PlateCanvas from '../components/BuildYourPlate/PlateCanvas'
import OrderSummary from '../components/BuildYourPlate/OrderSummary'
import { FoodContext } from '../context/FoodContext'
import { BuildPlateSkeleton } from '../components/Skeleton'

/* ─────────────────────────────────────────────
   Toast – supports an optional "Undo" action
 ───────────────────────────────────────────── */
const Toast = ({ message, emoji, onDismiss, onUndo }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.92 }}
    animate={{ opacity: 1, y: 0,  scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.92 }}
    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
    className="flex items-center gap-3 px-5 py-3.5
               bg-[#1c1c1e]/95 backdrop-blur-xl
               border border-white/10 rounded-2xl shadow-2xl
               max-w-[360px] w-[calc(100vw-2rem)]"
  >
    <span className="text-xl leading-none flex-shrink-0">{emoji}</span>
    <span className="text-[13px] font-bold text-white/80 flex-1 leading-snug">{message}</span>

    {onUndo && (
      <button
        onClick={onUndo}
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl
                   bg-primary-500/15 hover:bg-primary-500/25
                   border border-primary-500/25
                   text-primary-400 hover:text-primary-300
                   text-[11px] font-black uppercase tracking-wider
                   transition-all flex-shrink-0"
      >
        <RotateCcw size={11} />
        Undo
      </button>
    )}

    <button
      onClick={onDismiss}
      className="flex-shrink-0 text-white/20 hover:text-white/60 transition-colors ml-1"
      aria-label="Dismiss"
    >
      <X size={14} />
    </button>
  </motion.div>
)

const PHASE_CONFIG = {
  breads:    { name: 'Breads',    icon: '🫓', color: 'from-amber-500/20 to-yellow-500/10',    borderColor: 'border-amber-500/30' },
  curries:   { name: 'Curries',   icon: '🍛', color: 'from-orange-500/20 to-red-500/10',     borderColor: 'border-orange-500/30' },
  rice:      { name: 'Rice',      icon: '🍚', color: 'from-yellow-500/20 to-amber-500/10',    borderColor: 'border-yellow-500/30' },
  extras:    { name: 'Extras',    icon: '🥗', color: 'from-green-500/20 to-emerald-500/10',  borderColor: 'border-green-500/30' },
  beverages: { name: 'Drinks',    icon: '🥤', color: 'from-blue-500/20 to-cyan-500/10',      borderColor: 'border-blue-500/30' },
  sweets:    { name: 'Sweets',    icon: '🍪', color: 'from-pink-500/20 to-rose-500/10',      borderColor: 'border-pink-500/30' },
  fusion:    { name: 'Fusion',    icon: '🍕', color: 'from-orange-500/20 to-yellow-500/10',  borderColor: 'border-orange-500/30' }
};

const DEFAULT_PHASES = ['breads', 'curries', 'rice', 'extras', 'beverages', 'sweets', 'fusion'];

const BuildYourPlate = () => {
  const { menuItems, isLoading } = useContext(FoodContext)
  const [plateItems, setPlateItems] = useState([])
  const [toasts, setToasts]         = useState([])

  // Deriving dynamic food categories from database
  const dynamicPlateData = useMemo(() => {
    const componentItems = menuItems.filter(item => item.isPlateComponent);
    
    // 1. Get all unique categories that actually have items
    const activeCategories = [...new Set(componentItems.map(item => item.plateCategory))].filter(c => c && c !== 'none');
    
    // 2. Combine default phases + any custom phases found in DB
    const allCategories = [...new Set([...DEFAULT_PHASES, ...activeCategories])];
    
    return allCategories.map(catKey => {
      const config = PHASE_CONFIG[catKey] || {
        name: catKey.includes(':') ? catKey.split(':')[1].trim() : catKey,
        icon: '✨', 
        color: 'from-primary-500/20 to-purple-500/10',  
        borderColor: 'border-primary-500/30'
      };
      
      return {
        id: catKey,
        ...config,
        items: componentItems
                .filter(i => i.plateCategory === catKey)
                .map(i => ({...i, id: i._id, emoji: i.emoji || config.icon}))
      };
    });
  }, [menuItems]);

  const allPlateItems = useMemo(() => dynamicPlateData.flatMap(cat => cat.items), [dynamicPlateData]);

  // Ref to keep latest plateItems accessible inside setTimeout callbacks
  const plateItemsRef = useRef(plateItems)
  plateItemsRef.current = plateItems

  /* ── Toast helpers ── */
  const addToast = useCallback(({ message, emoji = '✅', onUndo = null }) => {
    const id = Date.now() + Math.random()
    const timer = setTimeout(
      () => setToasts((p) => p.filter((t) => t.id !== id)),
      4000
    )
    setToasts((prev) => [...prev, { id, message, emoji, onUndo, timer }])
    return id
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => {
      const t = prev.find((t) => t.id === id)
      if (t?.timer) clearTimeout(t.timer)
      return prev.filter((t) => t.id !== id)
    })
  }, [])

  /* ── Core plate state mutators ── */
  const addInstance = useCallback((item) => {
    const instance = { ...item, instanceId: `${item.id}-${Date.now()}-${Math.random()}` }
    setPlateItems((p) => [...p, instance])
    return instance
  }, [])

  const removeOneInstance = useCallback((itemId) => {
    let removed = null
    setPlateItems((prev) => {
      const revIdx = [...prev].reverse().findIndex((i) => i.id === itemId)
      if (revIdx === -1) return prev
      const realIdx = prev.length - 1 - revIdx
      removed = prev[realIdx]
      return prev.filter((_, i) => i !== realIdx)
    })
    return removed
  }, [])

  const clearAllOfType = useCallback((itemId) => {
    let removed = []
    setPlateItems((prev) => {
      removed = prev.filter((i) => i.id === itemId)
      return prev.filter((i) => i.id !== itemId)
    })
    return removed
  }, [])

  const handleAddItem = useCallback((item) => {
    addInstance(item)
    addToast({ message: `${item.name} added to plate`, emoji: item.emoji || '✅' })
  }, [addInstance, addToast])

  const handleRemoveOneById = useCallback((itemId) => {
    const snapBefore = [...plateItemsRef.current]
    setPlateItems((prev) => {
      const revIdx = [...prev].reverse().findIndex((i) => i.id === itemId)
      if (revIdx === -1) return prev
      const realIdx = prev.length - 1 - revIdx
      return prev.filter((_, i) => i !== realIdx)
    })

    const item = allPlateItems.find((f) => f.id === itemId)
    const toastId = addToast({
      message: `${item?.name ?? 'Item'} removed`,
      emoji: '🗑️',
      onUndo: () => {
        setPlateItems(snapBefore)
        dismissToast(toastId)
        addToast({ message: `${item?.name ?? 'Item'} restored!`, emoji: '↩️' })
      },
    })
  }, [addToast, dismissToast, allPlateItems])

  const handleAddOneById = useCallback((item) => {
    addInstance(item)
  }, [addInstance])

  const handleClearTypeById = useCallback((itemId) => {
    const snapBefore = [...plateItemsRef.current]
    const removed    = clearAllOfType(itemId)
    if (!removed.length) return

    const item = allPlateItems.find((f) => f.id === itemId)
    const toastId = addToast({
      message: `All ${item?.name ?? 'items'} removed (×${removed.length})`,
      emoji: '🗑️',
      onUndo: () => {
        setPlateItems(snapBefore)
        dismissToast(toastId)
        addToast({ message: `${item?.name ?? 'Items'} restored!`, emoji: '↩️' })
      },
    })
  }, [clearAllOfType, addToast, dismissToast, allPlateItems])

  const handleOrderSummaryRemove = useCallback((itemId, itemToAdd = null) => {
    if (itemToAdd) {
      handleAddOneById(itemToAdd)
    } else {
      handleRemoveOneById(itemId)
    }
  }, [handleAddOneById, handleRemoveOneById])

  const handleClearPlate = useCallback(() => {
    const snap = [...plateItemsRef.current]
    setPlateItems([])
    const toastId = addToast({
      message: 'Plate cleared',
      emoji: '🗑️',
      onUndo: () => {
        setPlateItems(snap)
        dismissToast(toastId)
        addToast({ message: 'Plate restored!', emoji: '↩️' })
      },
    })
  }, [addToast, dismissToast])

  const handleAddCombo = useCallback((comboName) => {
    // 1. Snapshot for undo
    const snapBefore = [...plateItemsRef.current]
    
    // 2. Define combo blueprints (item names)
    const combos = {
      'Classic Thali': [
        { name: 'Roti', qty: 2 },
        { name: 'Dal Makhani', qty: 1 },
        { name: 'Jeera Rice', qty: 1 },
        { name: 'Garden Salad', qty: 1 }
      ],
      'Paneer Feast': [
        { name: 'Butter Naan', qty: 2 },
        { name: 'Paneer Butter Masala', qty: 1 },
        { name: 'Boondi Raita', qty: 1 }
      ],
      'Biryani Combo': [
        { name: 'Veg Biryani', qty: 1 },
        { name: 'Boondi Raita', qty: 1 },
        { name: 'Garden Salad', qty: 1 }
      ],
      'Chef\'s Special': [
        { name: 'Garlic Naan', qty: 2 },
        { name: 'Paneer Butter Masala', qty: 1 },
        { name: 'Mix Veg', qty: 1 },
        { name: 'Boondi Raita', qty: 1 }
      ],
      'Light Lunch': [
        { name: 'Roti', qty: 1 },
        { name: 'Dal Makhani', qty: 1 },
        { name: 'Mixed Pickle', qty: 1 }
      ],
      'Royal Feast': [
        { name: 'Butter Naan', qty: 2 },
        { name: 'Paneer Butter Masala', qty: 1 },
        { name: 'Veg Biryani', qty: 1 },
        { name: 'Garden Salad', qty: 1 }
      ]
    }

    const blueprint = combos[comboName]
    if (!blueprint) return

    // 3. Construct new plate items
    let newItems = []
    blueprint.forEach(blueprintItem => {
      const menuRef = allPlateItems.find(i => i.name === blueprintItem.name)
      if (menuRef) {
        for (let i = 0; i < blueprintItem.qty; i++) {
          newItems.push({
            ...menuRef,
            instanceId: `${menuRef.id}-${Date.now()}-${Math.random()}`
          })
        }
      }
    })

    if (newItems.length > 0) {
      setPlateItems(newItems)
      const toastId = addToast({
        message: `${comboName} activated!`,
        emoji: '🍱',
        onUndo: () => {
          setPlateItems(snapBefore)
          dismissToast(toastId)
          addToast({ message: 'Previous plate restored!', emoji: '↩️' })
        }
      })
    } else {
      addToast({ message: 'Combo items not available in current menu', emoji: '⚠️' })
    }
  }, [allPlateItems, addToast, dismissToast])

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0b]">
      {isLoading ? (
        <BuildPlateSkeleton />
      ) : (
      <>

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-amber-500/3 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Page Header */}
      <div className="relative z-10 px-4 sm:px-8 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1400px] mx-auto"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                  <ChefHat size={16} className="text-primary-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary-500/70">
                  Customise
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl heading-premium">
                Build Your <span className="primary-gradient-text">Plate</span>
              </h1>
              <p className="text-[12px] text-white/30 mt-1 font-medium">
                Pick your favourites and craft your perfect Indian meal
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="relative z-10 px-4 sm:px-6 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] gap-6 py-20">
               {[1,2,3].map(i => <div key={i} className="h-[500px] glass rounded-[2rem] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] xl:grid-cols-[360px_1fr_320px] gap-4">

              {/* LEFT – Food Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden"
                style={{ height: 'calc(100vh - 200px)', position: 'sticky', top: '120px' }}
              >
                <FoodSidebar plateItems={plateItems} onAddItem={handleAddItem} foodCategories={dynamicPlateData} />
              </motion.div>

              {/* CENTER – Plate Canvas */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden min-h-[500px]"
                style={{ position: 'sticky', top: '120px', height: 'calc(100vh - 200px)' }}
              >
                <PlateCanvas
                  plateItems={plateItems}
                  onRemoveOneById={handleRemoveOneById}
                  onAddOneById={handleAddOneById}
                  onClearTypeById={handleClearTypeById}
                />
              </motion.div>

              {/* RIGHT – Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden"
                style={{ height: 'calc(100vh - 200px)', position: 'sticky', top: '120px' }}
              >
                <OrderSummary
                  plateItems={plateItems}
                  onRemoveItem={handleOrderSummaryRemove}
                  onClearPlate={handleClearPlate}
                  onAddCombo={handleAddCombo} 
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Stack */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]
                      flex flex-col-reverse gap-2 items-center">
        <AnimatePresence>
          {toasts.slice(-3).map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              emoji={toast.emoji}
              onUndo={toast.onUndo}
              onDismiss={() => dismissToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      </>
      )}
    </div>
  )
}

export default BuildYourPlate
