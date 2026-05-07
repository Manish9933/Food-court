import React from 'react';
import { Star, MessageSquare, ThumbsUp, Trash2, Filter, Search, MoreVertical, Calendar, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '../../store/useAdminStore';

const CustomerReviews = () => {
  const { orders, fetchOrders, isLoading } = useAdminStore();
  const [filter, setFilter] = React.useState(0);

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const reviews = orders
    .filter(order => order.ratings?.restaurant)
    .filter(order => filter === 0 || order.ratings.restaurant === filter)
    .map(order => ({
      id: order._id,
      user: order.user?.name || 'Authorized Buyer',
      rating: order.ratings.restaurant,
      deliveryRating: order.ratings.delivery,
      date: new Date(order.updatedAt).toLocaleDateString(),
      comment: order.ratings.feedback,
      orderId: order.customId,
      avatar: (order.user?.name || 'AB').slice(0, 2).toUpperCase()
    }));

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Customer Feedback</h1>
          <p className="text-zinc-500 font-medium tracking-wide">Monitor and respond to customer reviews</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#111114] border border-white/5 rounded-2xl p-4 flex items-center gap-6 px-10">
              <div className="flex flex-col text-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Average Signal</span>
                <div className="flex items-center gap-1">
                   <Star size={18} className="text-orange-500 fill-orange-500" />
                   <span className="text-2xl font-black text-white">4.8</span>
                </div>
              </div>
              <div className="w-px h-10 bg-white/5" />
              <div className="flex flex-col text-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Processed Reports</span>
                <span className="text-2xl font-black text-emerald-500">{reviews.length}</span>
              </div>
           </div>
        </div>
      </div>

       <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[300px] relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Scan feedback transmissions..." 
            className="w-full bg-[#111114] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all text-zinc-200"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <select 
            className="bg-[#111114] border border-white/5 rounded-2xl py-3.5 pl-12 pr-10 text-sm font-bold text-white focus:outline-none appearance-none cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(Number(e.target.value))}
          >
            <option value="0">All Ratings</option>
            <option value="5">Excellent (5★)</option>
            <option value="4">Good (4★)</option>
            <option value="3">Average (3★)</option>
            <option value="2">Poor (2★)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {isLoading ? (
             [1,2].map(i => <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse" />)
          ) : reviews.length === 0 ? (
             <div className="col-span-full py-20 text-center glass rounded-[3rem] border border-white/5">
                <MessageSquare size={48} className="mx-auto text-white/10 mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No feedback transmissions matching your criteria</p>
             </div>
          ) : (
            reviews.map((review, i) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group hover:border-orange-500/20 transition-all"
              >
                 <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-white/5 font-black text-white flex items-center justify-center border border-white/10 text-lg">
                          {review.avatar}
                       </div>
                       <div>
                          <h4 className="font-black text-white text-lg tracking-tight mb-0.5">{review.user}</h4>
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[2px]">{review.date}</span>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                          <Star size={14} className="text-orange-500 fill-orange-500" />
                          <span className="text-[10px] font-black text-orange-500">{review.rating} Restaurant</span>
                       </div>
                       <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <Truck size={14} className="text-blue-500" />
                          <span className="text-[10px] font-black text-blue-500">{review.deliveryRating} Delivery</span>
                       </div>
                    </div>
                 </div>

                 <p className="text-zinc-400 font-medium leading-relaxed italic mb-8">"{review.comment || 'No report attached.'}"</p>

                 <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Target Mission</span>
                      <span className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-300 w-fit">
                        #{review.orderId}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-orange-500 transition-all">
                         <ThumbsUp size={16} />
                      </button>
                      <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-rose-500 transition-all">
                         <Trash2 size={16} />
                      </button>
                    </div>
                 </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerReviews;
