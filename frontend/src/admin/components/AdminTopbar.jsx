import React, { useState } from "react";
import { Search, Bell, Moon, Sun, MessageCircle, AlertCircle, ChevronDown, UserCircle2, LogOut, Settings, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { useAdminStore } from "../../store/useAdminStore";

const AdminTopbar = ({ sidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const { notifications, fetchNotifications, markAsRead, clearAllNotifications } = useAdminStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  React.useEffect(() => {
    fetchNotifications();
    // Refresh every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 right-0 h-24 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5 z-[9999] flex items-center justify-between px-10 transition-all duration-300 ${
        sidebarOpen ? "left-72" : "left-20"
      }`}
    >
      <div className="flex-1 max-w-xl group relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2">
          <Search size={20} className="text-zinc-600 transition-colors group-hover:text-primary-500" />
        </div>
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111114] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500/50 transition-all ring-0 focus:ring-4 focus:ring-primary-500/5"
        />
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all hover:bg-white/10 relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary-500 border-2 border-[#111114] rounded-full" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-16 right-0 w-80 bg-[#111114] border border-white/5 p-4 rounded-2xl shadow-2xl z-[1000]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <button 
                    onClick={clearAllNotifications}
                    className="text-xs font-bold text-primary-500 hover:text-primary-400 transition-colors uppercase tracking-widest">
                    Mark All Read
                  </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                       <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">All Clear!</p>
                    </div>
                  ) : notifications.map((notif) => {
                    let Icon = Bell;
                    let color = "text-blue-400";
                    if (notif.type === 'system') { Icon = AlertCircle; color = "text-primary-400"; }
                    if (notif.type === 'review') { Icon = MessageCircle; color = "text-green-400"; }

                    return (
                      <div 
                        key={notif._id} 
                        onClick={() => markAsRead(notif._id)}
                        className={`flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group relative ${!notif.isRead ? 'bg-white/[0.02]' : 'opacity-60'}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary-500/20 transition-all">
                          <Icon size={18} className={color} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-200 line-clamp-2">{notif.message}</p>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {!notif.isRead && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-10 w-px bg-white/5 mx-2" />

        <div className="relative">
          <div 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 px-4 py-2.5 rounded-xl border border-transparent hover:border-white/5 transition-all"
          >
            <div className="text-right">
              <h4 className="text-sm font-bold tracking-tight">{user?.name || 'Admin'}</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user?.role || 'Admin'}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 p-0.5 shadow-xl transition-transform group-hover:scale-105 active:scale-95">
              <div className="w-full h-full rounded-[10px] bg-[#111114] flex items-center justify-center">
                <UserCircle2 size={24} className="text-sky-400" />
              </div>
            </div>
            <ChevronDown size={14} className={`text-zinc-600 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-20 right-0 w-64 bg-[#0a0a0b]/98 backdrop-blur-3xl p-2 rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[1000] overflow-hidden"
              >
                <div className="px-6 py-6 border-b border-white/5 mb-3 bg-white/[0.01]">
                   <p className="text-[10px] text-primary-500 uppercase tracking-[0.25em] font-black mb-1.5 opacity-80">System Operator</p>
                   <p className="text-sm font-black truncate tracking-tight text-white">{user?.name || 'Admin Account'}</p>
                </div>
                
                <div className="px-1.5 space-y-1 pb-1">
                  <Link 
                    to="/admin/settings" 
                    onClick={() => setShowProfile(false)} 
                    className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white group/sets"
                  >
                     <Settings size={16} className="group-hover/sets:rotate-90 transition-transform" /> Workspace Settings
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-4 mt-2 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-[0.25em] group/logout shadow-2xl shadow-rose-950/20"
                  >
                    <LogOut size={16} className="group-hover/logout:-translate-x-1 transition-transform" /> Logout System
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
