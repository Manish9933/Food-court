import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, Upload, Sparkles, Loader2, ChefHat, RotateCcw } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { AdminTableSkeleton } from '../../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const ManageMenu = () => {
  const { foods, fetchFoods, deleteFood, addFood, updateFood, toggleAvailability, categories, fetchCategories, isLoading, error } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', description: '', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200',
    isPlateComponent: false, plateCategory: 'none'
  });
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showCustomPhaseModal, setShowCustomPhaseModal] = useState(false);
  const [customPhaseName, setCustomPhaseName] = useState('');

  // Curated high-quality food image database from Unsplash
  const FOOD_IMAGE_DB = {
    indian: [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&h=600&fit=crop',
    ],
    burger: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&fit=crop',
    ],
    pizza: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&h=600&fit=crop',
    ],
    pasta: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop',
    ],
    dessert: [
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
    ],
    salad: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1543339308-d595c4e8b5b9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?w=800&h=600&fit=crop',
    ],
    drink: [
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    ],
    chinese: [
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&h=600&fit=crop',
    ],
    default: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop',
    ],
  };

  // Keywords → category mapping
  const KEYWORD_MAP = {
    indian: ['paneer', 'tikki', 'tikka', 'bhalla', 'dahi', 'kofta', 'shahi', 'biryani', 'naan', 'roti', 'dal', 'curry', 'masala', 'tandoori', 'samosa', 'chaat', 'thali', 'korma', 'vindaloo', 'dosa', 'idli', 'vada', 'kulfi', 'gulab', 'raita', 'paratha', 'chole', 'rajma', 'aloo', 'gobhi', 'malai', 'pulao', 'kheer'],
    burger: ['burger', 'hamburger', 'cheeseburger', 'patty', 'bun'],
    pizza: ['pizza', 'margherita', 'pepperoni', 'calzone'],
    pasta: ['pasta', 'spaghetti', 'penne', 'lasagna', 'macaroni', 'fettuccine', 'ravioli', 'noodle'],
    dessert: ['cake', 'brownie', 'ice cream', 'pudding', 'cookie', 'donut', 'pastry', 'pie', 'mousse', 'cheesecake', 'muffin', 'cupcake', 'waffle', 'pancake', 'chocolate', 'sweet', 'dessert', 'halwa', 'jalebi', 'ladoo', 'barfi'],
    salad: ['salad', 'bowl', 'quinoa', 'avocado', 'greens', 'healthy'],
    drink: ['juice', 'smoothie', 'coffee', 'tea', 'latte', 'shake', 'mocktail', 'cocktail', 'lassi', 'chaas', 'lemonade', 'soda', 'drink', 'beverage'],
    chinese: ['noodles', 'manchurian', 'fried rice', 'spring roll', 'momos', 'dumpling', 'wonton', 'chow', 'schezwan', 'hakka', 'chilli chicken', 'dim sum', 'sushi', 'ramen'],
  };

  // Utility to shuffle arrays
  const shuffle = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || ''; // Use your .env file

  const handleAISuggest = async () => {
    if (!formData.name) return alert('Enter dish name first!');
    setIsSuggesting(true);
    
    const query = `${formData.name.trim()} professional food photography`;
    const fallbackImages = shuffle([...FOOD_IMAGE_DB.default]).slice(0, 6);

    try {
      if (!PEXELS_API_KEY) {
        console.warn('PEXELS_API_KEY is missing in .env. Falling back to curated database.');
        throw new Error('MISSING_KEY');
      }

      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`, {
        headers: { Authorization: PEXELS_API_KEY }
      });

      if (!response.ok) throw new Error('API_FETCH_FAILED');

      const data = await response.json();
      
      // Filter for horizontal/square-ish images if possible, and grab just the 'large' or 'medium' URLs
      let results = data.photos.map(photo => photo.src.large);
      
      if (results.length === 0) throw new Error('NO_RESULTS');

      // Shuffle and pick 6
      results = shuffle(results).slice(0, 6);
      
      setTimeout(() => {
        setSuggestions(results);
        setIsSuggesting(false);
        setShowPicker(true);
      }, 600);

    } catch (err) {
      console.error('Vision Picker Error:', err);
      
      // FALLBACK LOGIC: If API fails, use high-quality matching from our existing DB
      const name = formData.name.toLowerCase();
      let matchedCategory = 'default';
      for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
        if (keywords.some(kw => name.includes(kw))) {
          matchedCategory = category;
          break;
        }
      }
      
      const categoryImages = [...FOOD_IMAGE_DB[matchedCategory]];
      const finalFallback = shuffle([...categoryImages, ...FOOD_IMAGE_DB.default]).slice(0, 6);
      
      setTimeout(() => {
        setSuggestions(finalFallback);
        setIsSuggesting(false);
        setShowPicker(true);
      }, 800);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description || '',
      image: item.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200',
      isPlateComponent: item.isPlateComponent || false,
      plateCategory: item.plateCategory || 'none'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateFood(editingId, formData);
    } else {
      await addFood(formData);
    }
    setEditingId(null);
    setShowModal(false);
    setFormData({ name: '', price: '', category: 'Burgers', description: '', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200', isPlateComponent: false, plateCategory: 'none' });
  };

  const handleToggle = (item) => {
    toggleAvailability(item._id, item.isAvailable);
  };

  return (
    <div className="space-y-8 pb-20">
      {isLoading ? (
        <AdminTableSkeleton cols={5} rows={10} />
      ) : (
      <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Menu Management</h1>
          <p className="text-zinc-500 font-medium tracking-wide">Manage your food items and categories</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', price: '', category: 'Burgers', description: '', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200', isPlateComponent: false, plateCategory: 'none' });
            setShowModal(true);
          }}
          className="px-6 py-3.5 bg-primary-500 hover:bg-primary-600 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-primary-500/20 active:scale-95 text-black"
        >
          <Plus size={16} />
          <span>Add New Dish</span>
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search menu items..." 
            className="w-full bg-[#111114] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary-500/50 transition-all text-white"
          />
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4 text-rose-500 font-bold uppercase tracking-widest text-[10px]">
            <X size={16} />
            <span>Deployment Error: {error}</span>
          </div>
          <button onClick={() => useAdminStore.setState({ error: null })} className="text-rose-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </motion.div>
      )}

      <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Item</th>
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Category</th>
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Price</th>
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Availability</th>
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading && foods.length === 0 ? <tr><td colSpan="5" className="p-10 text-center animate-pulse text-zinc-500 font-bold uppercase tracking-widest">Kitchen is busy...</td></tr> : 
              foods.map((item) => (
              <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {item.image ? (
                       <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-white/5" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center font-black text-primary-500">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate max-w-[150px]">ID: {item._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-semibold text-zinc-400 capitalize">{item.category}</td>
                <td className="px-8 py-6 font-bold text-white">${item.price}</td>
                <td className="px-8 py-6">
                   <button 
                    disabled={isLoading}
                    onClick={() => handleToggle(item)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${item.isAvailable ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'}`}>
                    {item.isAvailable ? 'Available' : 'Sold Out'}
                  </button>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button onClick={() => handleEdit(item)} className="p-2 hover:bg-primary-500/10 hover:text-primary-500 rounded-lg transition-colors text-zinc-500">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => window.confirm('Delete this dish?') && deleteFood(item._id)} className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-colors text-zinc-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              className="bg-[#111114] border border-white/5 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-white">{editingId ? 'Edit Dish' : 'Add New Dish'}</h2>
                    <p className="text-zinc-500 font-medium">Configure your menu item details</p>
                  </div>
                  <button onClick={() => {setShowModal(false); setEditingId(null);}} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Dish Name</label>
                      <input 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        type="text" 
                        placeholder="e.g. Inferno Burger" 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-6 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all text-white"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Price ($)</label>
                        <input 
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          type="number" 
                          placeholder="0.00" 
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-6 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all text-white"
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Category</label>
                    <div className="flex gap-4">
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-3.5 px-6 text-sm font-medium focus:outline-none focus:border-primary-500/50 transition-all text-white appearance-none"
                      >
                        <option value="" disabled className="bg-[#111114]">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name} className="bg-[#111114]">{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                          <ChefHat size={18} className="text-primary-500" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-white">Custom Plate Protocol</p>
                          <p className="text-[10px] text-zinc-500 font-medium">Enable this dish for the "Build Your Plate" system</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, isPlateComponent: !formData.isPlateComponent })}
                        className={`w-14 h-8 rounded-full transition-all relative ${formData.isPlateComponent ? 'bg-primary-600' : 'bg-white/10'}`}
                      >
                        <motion.div 
                          animate={{ x: formData.isPlateComponent ? 24 : 4 }}
                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                        />
                      </button>
                    </div>

                    {formData.isPlateComponent && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-4 border-t border-white/5"
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary-500/60 ml-1">Plate Component Type</label>
                          <div className="flex gap-2">
                            <select 
                              value={formData.plateCategory}
                              onChange={(e) => setFormData({...formData, plateCategory: e.target.value})}
                              className="flex-1 bg-white/5 border border-primary-500/20 rounded-2xl py-3.5 px-6 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-all text-white appearance-none"
                            >
                              <option value="none" className="bg-[#111114]">Select Component Phase</option>
                              <option value="breads" className="bg-[#111114]">Phase 01: Breads & Bases</option>
                              <option value="curries" className="bg-[#111114]">Phase 02: Core Curries</option>
                              <option value="rice" className="bg-[#111114]">Phase 03: Grains & Rice</option>
                              <option value="extras" className="bg-[#111114]">Phase 04: Tactical Sides (Extras)</option>
                              <option value="beverages" className="bg-[#111114]">Phase 05: Drinks & Beverages</option>
                              <option value="sweets" className="bg-[#111114]">Phase 06: Sweets & Desserts</option>
                              <option value="fusion" className="bg-[#111114]">Phase 07: Fusion Bites</option>
                              {formData.plateCategory && !['none','breads','curries','rice','extras','beverages','sweets','fusion'].includes(formData.plateCategory) && (
                                <option value={formData.plateCategory} className="bg-primary-500/20 text-primary-400">{formData.plateCategory}</option>
                              )}
                            </select>
                            <button 
                              type="button"
                              onClick={() => setShowCustomPhaseModal(true)}
                              className="p-4 rounded-2xl bg-white/5 text-zinc-400 border border-white/5 hover:border-primary-500/50 transition-all flex items-center justify-center"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Dish Image URL</label>
                       <div className="flex gap-4">
                        <div className="flex-1 relative group">
                          <input 
                            type="text" 
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                            placeholder="Paste image URL here..." 
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-6 text-sm font-medium focus:outline-none focus:border-primary-500/50 transition-all text-white"
                          />
                          <button 
                            type="button"
                            onClick={handleAISuggest}
                            disabled={isSuggesting}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-500 hover:bg-primary-600 text-black rounded-xl transition-all shadow-lg active:scale-90 disabled:opacity-50"
                          >
                             {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                          </button>
                        </div>
                          <div 
                            onClick={() => document.getElementById('dish-upload').click()}
                            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 overflow-hidden flex-shrink-0 group relative cursor-pointer active:scale-95 transition-transform"
                          >
                             <input 
                               id="dish-upload"
                               type="file" 
                               accept="image/*"
                               onChange={handleFileUpload}
                               className="hidden" 
                             />
                             {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                   <Upload size={20} />
                                </div>
                             )}
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Upload size={14} className="text-white" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Tell more about this dish..." 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-6 text-sm font-medium focus:outline-none focus:border-primary-500/50 transition-all text-white h-24 resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      type="button" 
                      onClick={() => {setShowModal(false); setEditingId(null);}}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={isLoading}
                      type="submit" 
                      className="flex-2 px-12 py-4 bg-primary-500 hover:bg-primary-600 rounded-2xl font-bold transition-all shadow-xl shadow-primary-500/20 text-black active:scale-95 disabled:opacity-50"
                    >
                      {editingId ? 'Update Dish' : 'Save Dish'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPicker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0a0b]/90 backdrop-blur-xl z-[300] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111114] border border-white/10 w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-3xl"
            >
              <div className="p-10">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <h3 className="text-2xl font-black tracking-tight text-white uppercase italic">AI <span className="text-primary-500">Vision Picker</span></h3>
                       <p className="text-zinc-500 text-sm font-medium">Select the best match for "{formData.name}"</p>
                    </div>
                    <button onClick={() => setShowPicker(false)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-white">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                    {suggestions.map((url, idx) => (
                       <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary-500 group shadow-2xl"
                        onClick={() => {
                          setFormData({ ...formData, image: url });
                          setShowPicker(false);
                        }}
                       >
                          <img src={url} alt={`Option ${idx+1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Option {idx+1}</p>
                             <p className="text-white font-bold text-xs">Tap to Select</p>
                          </div>
                          
                          {/* Selected Overlay if it matches current */}
                          {formData.image === url && (
                            <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center backdrop-blur-sm">
                               <div className="bg-primary-500 text-black p-2 rounded-full shadow-2xl"><Sparkles size={16} /></div>
                            </div>
                          )}
                       </motion.div>
                    ))}
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Images sourced from AI Vision Stream • Professional Grade Only</p>
                    <button 
                      disabled={isSuggesting}
                      onClick={handleAISuggest}
                      className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                       {isSuggesting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-primary-500" />}
                       {isSuggesting ? 'Analyzing Vision...' : 'Regenerate Samples'}
                    </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCustomPhaseModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0a0b]/90 backdrop-blur-xl z-[400] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111114] border border-white/5 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white uppercase italic">NEW <span className="text-primary-500">PLATE PHASE</span></h3>
                  <p className="text-zinc-500 text-xs font-medium">Create a custom builder stage</p>
                </div>
                <button onClick={() => setShowCustomPhaseModal(false)} className="p-2 bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Phase Entry Detail</label>
                    <input 
                      type="text" 
                      value={customPhaseName}
                      onChange={(e) => setCustomPhaseName(e.target.value)}
                      placeholder="e.g. Phase 08: Sweets" 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 px-6 text-sm font-black tracking-widest focus:outline-none focus:border-primary-500 transition-all text-white"
                    />
                 </div>

                 <button 
                  onClick={() => {
                    if (customPhaseName.trim()) {
                      setFormData({ ...formData, plateCategory: customPhaseName });
                      setCustomPhaseName('');
                      setShowCustomPhaseModal(false);
                    }
                  }}
                  className="w-full py-4 bg-primary-500 hover:bg-primary-600 rounded-2xl text-black font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary-500/20 active:scale-95"
                 >
                   Inject Phase Detail
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}
    </div>
  );
};

export default ManageMenu;
