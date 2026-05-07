import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, CheckCircle, Clock, Truck, MoreVertical, MapPin, Package, Calendar, X, ChevronRight, DollarSign } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { AdminTableSkeleton } from '../../components/Skeleton';

const ManageOrders = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, updateOrderStatus, deliveryBoys, fetchDeliveryBoys, assignCourier, isLoading } = useAdminStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('All');
  const [selectedForCourier, setSelectedForCourier] = React.useState(null);

  React.useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.customId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.shippingAddress?.phone || '').includes(searchTerm);
    const matchesFilter = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAssign = (courierId) => {
    assignCourier(selectedForCourier._id, courierId);
    setSelectedForCourier(null);
  };

  return (
    <div className="space-y-8 pb-20">
      {isLoading ? (
        <AdminTableSkeleton cols={6} rows={8} />
      ) : (
      <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Orders Management</h1>
          <p className="text-zinc-500 font-medium tracking-wide">Track and manage customer deliveries</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#111114] border border-white/5 rounded-2xl p-3 flex items-center gap-6 px-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Live Orders</span>
                <span className="text-lg font-black text-orange-500">{orders.length}</span>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Total Revenue</span>
                <span className="text-lg font-black text-emerald-500">${orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[300px] relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer, or Phone..." 
            className="w-full bg-[#111114] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <select 
            className="bg-[#111114] border border-white/5 rounded-2xl py-3.5 pl-12 pr-10 text-sm font-bold text-white focus:outline-none appearance-none cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Order ID</th>
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Customer</th>
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Dish Details</th>
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Total Amount</th>
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Status</th>
              <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] text-zinc-400 group-hover:text-orange-500 transition-all border border-white/5 group-hover:border-orange-500/30">
                        <Package size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white tracking-[0.1em] text-[13px]">#{order.customId || 'N/A'}</span>
                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                          <Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm tracking-tight">{order.user?.name || 'Guest User'}</span>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate max-w-[120px]">
                         {order.shippingAddress?.street || 'No Protocol'}
                       </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-2.5">
                     <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-[#1a1a1e] hover:bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 transition-all group/badge cursor-default">
                             <div className="w-5 h-5 rounded-md bg-orange-500/10 flex items-center justify-center">
                                <span className="text-[9px] font-black text-orange-500">{item.quantity}</span>
                             </div>
                             <span className="text-[10px] font-bold text-zinc-400 group-hover/badge:text-white transition-colors capitalize">{item.name}</span>
                          </div>
                        ))}
                     </div>
                     {order.deliveryBoy && (
                        <div className="flex items-center gap-3 mt-1.5 p-2 px-3 bg-blue-500/[0.03] border border-blue-500/10 rounded-2xl w-fit">
                           <div className="relative">
                              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Truck size={14} />
                              </div>
                              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111114] rounded-full" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500/60 leading-none mb-1 text-left">Active Courier</span>
                              <span className="text-[11px] font-black text-white/80 tracking-tight text-left">{order.deliveryBoy.name}</span>
                           </div>
                        </div>
                     )}
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className={`p-4 rounded-[1.5rem] border transition-all ${order.totalAmount > 1000 ? 'bg-orange-500/5 border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'bg-white/[0.02] border-white/5'}`}>
                    <div className="flex items-center gap-2 mb-1">
                       <DollarSign size={12} className={order.totalAmount > 1000 ? 'text-orange-500' : 'text-zinc-500'} />
                       <span className={`text-lg font-black tracking-tighter ${order.totalAmount > 1000 ? 'text-orange-500' : 'text-white'}`}>
                         {order.totalAmount.toFixed(2)}
                       </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <div className={`w-1 h-1 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                       <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${order.paymentStatus === 'Paid' ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
                         {order.paymentStatus}
                       </span>
                    </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 w-fit ${
                      order.status === 'Pending' ? 'text-orange-400 border-orange-500/20 bg-orange-500/5' : 
                      order.status === 'Delivered' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 
                      order.status === 'Cancelled' ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' : 'text-blue-400 border-blue-500/20 bg-blue-500/5'
                    }`}>
                      {order.status}
                    </span>
                    {order.status === 'Delivered' && (
                       <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">
                          <CheckCircle size={10} /> Completed {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {order.status === 'Pending' && (
                       <div className="flex gap-2">
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Preparing')}
                          title="Accept & Prepare" 
                          className="p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-black transition-all border border-orange-500/20"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => window.confirm('Reject this order?') && updateOrderStatus(order._id, 'Cancelled')}
                          title="Reject Order" 
                          className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all border border-rose-500/20"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    {order.status === 'Preparing' && (
                       <button 
                         onClick={() => setSelectedForCourier(order)}
                         className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white transition-all border border-blue-500/20"
                         title="Assign Delivery Boy"
                       >
                         <Truck size={16} />
                       </button>
                    )}
                    {order.status === 'Out for Delivery' && (
                       <button 
                         onClick={() => updateOrderStatus(order._id, 'Delivered')}
                         className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black transition-all border border-emerald-500/20"
                         title="Mark Delivered"
                       >
                         <CheckCircle size={16} />
                       </button>
                    )}
                    <button onClick={() => navigate(`/admin/orders/${order._id}`)} title="View Detail" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all border border-white/5">
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Courier Assignment Modal */}
      {selectedForCourier && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
           <div className="bg-[#0f0f12] w-full max-w-lg rounded-[2.5rem] p-10 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black uppercase text-white tracking-tight">Deploy Courier</h3>
                 <button onClick={() => setSelectedForCourier(null)}><X className="text-white/20"/></button>
              </div>
              <div className="space-y-4">
                 {deliveryBoys.map(boy => (
                   <button 
                     key={boy._id}
                     onClick={() => handleAssign(boy._id)}
                     className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-white/10 transition-all text-left group"
                   >
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-black transition-all">
                            <Truck size={20} />
                         </div>
                         <div>
                            <p className="font-bold text-white">{boy.name}</p>
                            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">{boy.status} • 4.98 Rating</p>
                         </div>
                      </div>
                      <ChevronRight size={18} className="text-zinc-500" />
                   </button>
                 ))}
                 {deliveryBoys.length === 0 && <p className="text-center text-zinc-500 uppercase font-black text-xs py-10">No Agents Available</p>}
              </div>
           </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default ManageOrders;
