import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, ChefHat, Truck, RotateCcw, Zap, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey there! 👋 I'm your FoodGenie assistant. Ask me anything — menu recommendations, order tracking, or help with your account.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim()) return
    const text = input.trim()
    const userMsg = { role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const { data } = await api.post('/chat', { prompt: text })
      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Oops, something went wrong on my end. Try again in a moment!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const quickAction = (text) => {
    setInput(text)
    setTimeout(() => handleSend(), 50)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-[88px] right-0 w-[390px] max-w-[calc(100vw-2rem)] h-[580px] rounded-[1.75rem] overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(160deg, #141416 0%, #0a0a0b 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(var(--primary-rgb),0.1)'
            }}
          >
            {/* ── Header ── */}
            <div className="relative px-7 py-6 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 4px 20px rgba(var(--primary-rgb),0.3)' }}>
                  <ChefHat size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">FoodGenie AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="text-[10px] text-white/30 font-medium">Always online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Neural Load Bar ── */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-0.5 w-full shrink-0 relative overflow-hidden bg-white/5"
                >
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Messages ── */}
            <div ref={scrollRef} className="flex-1 px-6 py-5 overflow-y-auto space-y-5 scrollbar-hide relative">
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0 mr-2.5 mt-1">
                      <ChefHat size={14} className="text-primary-500" />
                    </div>
                  )}
                  <div className={`max-w-[78%] px-5 py-3.5 text-[13px] leading-relaxed ${msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-2xl rounded-br-sm font-medium'
                      : 'bg-white/[0.04] text-white/75 rounded-2xl rounded-bl-sm border border-white/[0.06] font-normal'
                    }`}>
                    {msg.text}
                    <div className={`text-[9px] mt-2 opacity-30 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0 mt-1">
                    <ChefHat size={14} className="text-primary-500" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.06] px-5 py-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.15 }} className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Quick Actions ── */}
            <div className="px-5 pb-2 pt-1 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              <button onClick={() => quickAction("Suggest me something tasty")} className="whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-semibold text-white/40 bg-white/[0.04] border border-white/[0.06] hover:border-primary-500/30 hover:text-primary-400 transition-all flex items-center gap-1.5">
                <ChefHat size={11} /> Recommend
              </button>
              <button onClick={() => quickAction("Where is my order?")} className="whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-semibold text-white/40 bg-white/[0.04] border border-white/[0.06] hover:border-primary-500/30 hover:text-primary-400 transition-all flex items-center gap-1.5">
                <Truck size={11} /> Track Order
              </button>
              <button onClick={() => quickAction("I want to cancel my order")} className="whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-semibold text-white/40 bg-white/[0.04] border border-white/[0.06] hover:border-red-500/30 hover:text-red-400 transition-all flex items-center gap-1.5">
                <RotateCcw size={11} /> Cancel
              </button>
            </div>

            {/* ── Input ── */}
            <div className="px-5 pb-5 pt-3 shrink-0">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask FoodGenie anything..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-5 pr-14 py-4 text-sm font-medium text-white placeholder:text-white/15 outline-none focus:border-primary-500/40 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-1.5 w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-30 disabled:hover:bg-primary-600 flex items-center justify-center text-white transition-all active:scale-90"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-center text-[9px] text-white/15 mt-2.5 font-medium">Powered by FoodGenie AI · Menu-aware responses</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ── Floating Trigger: Spinning Chowmein Plate ── */}
      <div className="relative">
        {/* Outer glow pulse */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-primary-500"
            style={{ filter: 'blur(14px)' }}
          />
        )}

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center overflow-visible transition-shadow duration-300"
          style={{
            boxShadow: isOpen
              ? '0 8px 30px rgba(0,0,0,0.5), 0 0 0 2px rgba(var(--primary-rgb),0.25)'
              : '0 12px 40px rgba(0,0,0,0.55), 0 0 0 2px rgba(var(--primary-rgb),0.2), 0 0 30px rgba(var(--primary-rgb),0.15)'
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              /* Close X button */
              <motion.div
                key="close"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center"
              >
                <X size={26} className="text-white" />
              </motion.div>
            ) : (
              /* Spinning chowmein plate */
              <motion.div
                key="plate"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 360 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{
                  scale: { duration: 0.3 },
                  opacity: { duration: 0.3 },
                  rotate: { repeat: Infinity, duration: 8, ease: 'linear' }
                }}
                className="w-full h-full rounded-full overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200&h=200&fit=crop&crop=center&q=80"
                  alt="Chat"
                  className="w-full h-full object-cover"
                  style={{ pointerEvents: 'none' }}
                />
                {/* Dark overlay for depth */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/10 via-transparent to-black/20" />
                {/* Rim highlight */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat badge */}
          {!isOpen && (
            <div className="absolute -bottom-1 -right-1 z-30 w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center border-2 border-[#0a0a0a]"
              style={{ boxShadow: '0 2px 8px rgba(var(--primary-rgb), 0.4)' }}
            >
              <MessageCircle size={14} className="text-white" />
            </div>
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default ChatBot

