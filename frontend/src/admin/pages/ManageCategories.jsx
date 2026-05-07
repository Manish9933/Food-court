import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Layers, Image as ImageIcon } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import Skeleton from '../../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const ManageCategories = () => {
  const { categories, fetchCategories, addCategory, deleteCategory, isLoading, error } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      const success = await addCategory(formData);
      if (success === false) {
          setLocalError("Failed to save. Ensure unique category name.");
      } else {
          setShowModal(false);
          setFormData({ name: '', description: '', image: '' });
          fetchCategories(); // Forces refresh from DB
      }
    } catch (err) {
      setLocalError("Action failed. Try again.");
    }
  };

  return (
    <div className="space-y-8 pb-20 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Categories</h1>
          <p className="text-zinc-500 font-medium tracking-wide">Organize your menu classifications</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={16} />
          <span>New Category</span>
        </button>
      </div>

      {(error || localError) && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-500 font-bold mb-6 text-sm flex items-center justify-between">
               <span>⚠️ {error || localError}</span>
               <button onClick={() => setLocalError(null)}><X size={16} /></button>
          </div>
      )}

      {categories.length === 0 && !isLoading ? (
          <div className="bg-[#111114] border border-dashed border-white/10 rounded-[3rem] p-20 text-center">
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-600">
                    <Layers size={32} />
               </div>
               <h3 className="text-xl font-bold text-zinc-500 uppercase tracking-widest mb-2">No Classifications Found</h3>
               <p className="text-zinc-600 text-sm">Your categories will appear here once created.</p>
          </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && categories.length === 0 ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-[#111114] border border-white/5 rounded-3xl p-6 space-y-4">
              <Skeleton height="48px" width="48px" borderRadius="1rem" />
              <Skeleton height="24px" width="60%" />
              <Skeleton height="40px" width="100%" />
              <div className="pt-4 border-t border-white/5 flex justify-between">
                <Skeleton height="10px" width="30%" />
                <Skeleton height="10px" width="20%" />
              </div>
            </div>
          ))
        ) : (
          categories.map((cat) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={cat._id} 
              className="bg-[#111114] border border-white/5 rounded-3xl p-6 group hover:border-indigo-500/30 transition-all shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Layers size={24} />
                </div>
                <button 
                  onClick={() => window.confirm('Delete this category?') && deleteCategory(cat._id)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
              <p className="text-sm text-zinc-500 font-medium line-clamp-2 mb-4">{cat.description || 'No description provided.'}</p>
              
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Active Category</span>
                <span className="text-[10px] text-zinc-600 font-bold uppercase">ID: {cat._id.slice(-6)}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0a0b]/80 backdrop-blur-md z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#111114] border border-white/5 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-black text-white">Create Category</h2>
                  <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Category Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-indigo-500/50 transition-all" 
                      placeholder="e.g. Signature Burgers"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-indigo-500/50 transition-all h-32 resize-none" 
                      placeholder="What makes this category special?"
                    />
                  </div>
                  <button 
                    disabled={isLoading}
                    type="submit" 
                    className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Confirm Creation"}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCategories;
