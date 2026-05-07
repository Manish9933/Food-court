import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Globe, Shield, CreditCard, Save, Smartphone, Palette, Code, Key, Database, Mail, ChevronRight, CheckCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';

const Settings = () => {
  const { user, updateProfile, loading } = useAuthStore();
  const [activeTab, setActiveTab] = useState('General Info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    const success = await updateProfile({
      name: formData.name,
      email: formData.email,
      ...(formData.password && { password: formData.password })
    });
    if (success) {
      window.alert('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  const tabs = [
    { label: 'General Info', icon: <User size={18} /> },
    { label: 'Security', icon: <Lock size={18} /> },
    { label: 'Notifications', icon: <Bell size={18} /> },
    { label: 'Billing', icon: <CreditCard size={18} /> },
    { label: 'System Logic', icon: <Code size={18} /> },
    { label: 'Integrations', icon: <Globe size={18} /> },
    { label: 'Advanced', icon: <Database size={18} /> },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">System Settings</h1>
          <p className="text-zinc-500 font-medium tracking-wide">Configure your FoodGenie admin workspace</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-10 py-4 bg-orange-500 hover:bg-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest text-black flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
             <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-2">
           {tabs.map((item, i) => (
             <button 
                key={i}
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === item.label ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'text-zinc-500 hover:bg-white/5 hover:text-white border border-transparent'}`}
             >
               {item.icon}
               <span className="text-sm">{item.label}</span>
             </button>
           ))}
        </div>

        <div className="lg:col-span-3 space-y-8 min-h-[600px]">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3, ease: 'easeOut' }}
               className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl"
             >
               {activeTab === 'General Info' && (
                 <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <User size={20} className="text-orange-500" />
                        Profile Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-2">Display Name</label>
                            <input 
                              type="text" 
                              value={formData.name} 
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm font-medium text-white focus:outline-none focus:border-orange-500/50 transition-all" 
                            />
                         </div>
                         <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-2">Admin Email</label>
                            <input 
                              type="email" 
                              value={formData.email} 
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm font-medium text-white focus:outline-none focus:border-orange-500/50 transition-all" 
                            />
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <Palette size={20} className="text-indigo-500" />
                        Appearance settings
                      </h3>
                        <div className="flex gap-4">
                           <button className="flex-1 p-6 rounded-3xl bg-white/5 border-2 border-orange-500 text-center flex flex-col items-center gap-4 group">
                              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-black shadow-[0_0_15px_#f97316]">
                                 <Shield size={24} />
                              </div>
                              <span className="font-bold text-white">Dark Mode (Default)</span>
                           </button>
                           <button className="flex-1 p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center flex flex-col items-center gap-4 hover:bg-white/5 transition-all text-zinc-500 hover:text-white">
                              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                 <Smartphone size={24} />
                              </div>
                              <span className="font-bold">System Theme</span>
                           </button>
                        </div>
                    </div>
                 </div>
               )}

               {activeTab === 'Security' && (
                 <div className="space-y-12">
                   <div className="space-y-6">
                      <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <Key size={20} className="text-emerald-500" />
                        Access & Security
                      </h3>
                      <div className="space-y-4">
                         <div className="flex flex-col gap-2 mb-6">
                            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-2">New Security Key (Password)</label>
                            <input 
                              type="password" 
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              placeholder="Leave blank to keep current"
                              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm font-medium text-white focus:outline-none focus:border-orange-500/50 transition-all shadow-xl" 
                            />
                         </div>
                         <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-emerald-500/20 transition-all">
                            <div className="flex items-center gap-6">
                               <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                                  <Shield size={20} />
                               </div>
                               <div>
                                  <h4 className="font-black text-white">Two-Factor Authentication</h4>
                                  <p className="text-xs text-zinc-500 font-medium">Add an extra layer of security to your admin account.</p>
                               </div>
                            </div>
                            <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer active:scale-95 transition-transform">
                               <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-lg" />
                            </div>
                         </div>
                         <button className="w-full p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-6">
                               <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-orange-500/20 transition-all">
                                  <Lock size={20} />
                               </div>
                               <div className="text-left">
                                  <h4 className="font-black text-white">Change Security Protocols</h4>
                                  <p className="text-xs text-zinc-500 font-medium">Configure advanced encryption standard</p>
                               </div>
                            </div>
                            <ChevronRight size={18} className="text-zinc-500 transition-all" />
                         </button>
                      </div>
                   </div>
                 </div>
               )}

               {activeTab === 'Notifications' && (
                 <div className="space-y-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                      <Mail size={20} className="text-sky-500" />
                      Alert Preferences
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         { title: 'Email Alerts', desc: 'Get updates on sales and system status', active: true },
                         { title: 'Push Notifications', desc: 'Real-time alerts in your browser', active: true },
                         { title: 'SMS Updates', desc: 'Weekly summaries via text message', active: false },
                         { title: 'Customer Feedback', desc: 'Alerts for 1-star and 2-star reviews', active: true },
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group">
                            <div>
                               <span className="text-sm font-bold text-white block mb-1">{item.title}</span>
                               <span className="text-xs text-zinc-500 font-medium">{item.desc}</span>
                            </div>
                            <div className={`w-10 h-5 ${item.active ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-white/10'} rounded-full relative cursor-pointer border border-white/10 transition-all`}>
                               <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'right-0.5' : 'left-0.5'}`} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               {activeTab === 'Billing' && (
                  <div className="space-y-8">
                     <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <CreditCard size={20} className="text-rose-500" />
                        Subscription Plan
                     </h3>
                     <div className="p-8 bg-gradient-to-br from-orange-500 to-rose-600 rounded-[2rem] text-black shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-20 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform">
                           <Zap size={200} />
                        </div>
                        <div className="relative z-10 flex justify-between items-start">
                           <div>
                              <span className="text-xs font-black uppercase tracking-[3px] opacity-80">Current Plan</span>
                              <h4 className="text-4xl font-black mt-2 mb-6 tracking-tighter">Enterprise Elite</h4>
                              <div className="flex gap-4">
                                 <div className="px-4 py-2 bg-black/10 rounded-xl flex items-center gap-2">
                                    <CheckCircle size={14} />
                                    <span className="text-xs font-bold">Priority Support</span>
                                 </div>
                                 <div className="px-4 py-2 bg-black/10 rounded-xl flex items-center gap-2">
                                    <CheckCircle size={14} />
                                    <span className="text-xs font-bold">Unlimited Users</span>
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="text-4xl font-black">$499</span>
                              <span className="text-sm font-bold block">/month</span>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'System Logic' && (
                  <div className="space-y-8">
                     <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <Code size={20} className="text-sky-400" />
                        Developer Controls
                     </h3>
                     <div className="space-y-6">
                        <div className="p-6 bg-black rounded-3xl border border-white/5 space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">API Endpoint Key</span>
                              <span className="text-[10px] font-bold text-orange-500 uppercase cursor-pointer hover:underline">Regenerate</span>
                           </div>
                           <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
                              <span className="font-mono text-xs text-zinc-400 truncate">sk_live_51M7A...xxxxxxxxxxxx</span>
                              <button className="ml-auto p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                                 <Save size={14} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

                {activeTab === 'Integrations' && (
                  <div className="space-y-8">
                     <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <Globe size={20} className="text-emerald-400" />
                        Third-Party Connections
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { name: 'Stripe', status: 'Connected', desc: 'Secure payments & payouts' },
                          { name: 'AWS S3', status: 'Connected', desc: 'Cloud asset storage' },
                          { name: 'SendGrid', status: 'Inactive', desc: 'Transactional email system' },
                          { name: 'Google Maps', status: 'Connected', desc: 'Geofencing & tracking' },
                        ].map((app, i) => (
                           <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col gap-4 group hover:bg-white/[0.04] transition-all">
                              <div className="flex justify-between items-center">
                                 <span className="font-black text-white">{app.name}</span>
                                 <span className={`text-[10px] font-black uppercase tracking-widest ${app.status === 'Connected' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                                    {app.status}
                                 </span>
                              </div>
                              <p className="text-xs text-zinc-500 font-medium">{app.desc}</p>
                              <button className="w-full py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-white/10 transition-all border border-white/5">
                                 Configure
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'Advanced' && (
                  <div className="space-y-8">
                     <h3 className="text-xl font-black text-white flex items-center gap-3">
                        <Database size={20} className="text-rose-500" />
                        System Maintenance
                     </h3>
                     <div className="space-y-4">
                        <div className="p-6 border border-rose-500/20 bg-rose-500/5 rounded-3xl">
                           <h4 className="font-black text-rose-500 mb-1">Danger Zone</h4>
                           <p className="text-xs text-zinc-500 font-medium mb-6">Irreversible actions that affect the entire database.</p>
                           <button className="px-6 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-rose-600/20 active:scale-95 transition-all">
                              Reset System Database
                           </button>
                        </div>
                     </div>
                  </div>
               )}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;
