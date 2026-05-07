import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, User, MapPin, CreditCard, 
  Calendar, Clock, CheckCircle, Truck, XCircle,
  FileText, DollarSign, Tag, Hash
} from 'lucide-react';
import api from '../../api/api';
import { motion } from 'framer-motion';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order:', error);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[600px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    if (!order) return <div className="p-10 text-center text-zinc-500">Mission Data Not Found.</div>;

    return (
        <div className="space-y-8 pb-20 max-w-5xl">
            <div className="flex items-center gap-6">
                <button 
                  onClick={() => navigate(-1)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-1">Order Details</h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Reference: #{order.customId || order._id}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Side: Items & Pricing */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                                <Package size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Culinary Payload</h3>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5 group hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-orange-500/5 border border-white/5 flex items-center justify-center overflow-hidden">
                                           {item.foodItem?.image ? (
                                              <img src={item.foodItem.image} className="w-full h-full object-cover" alt="" />
                                           ) : (
                                              <Hash className="text-zinc-700" />
                                           )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">{item.name}</p>
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-loose">Qty: {item.quantity} • Unit: ${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                            <div className="flex justify-between items-center px-6 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[11px]">
                                <span>Subtotal</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center px-6 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[11px]">
                                <span>Delivery Fee</span>
                                <span className="text-emerald-500">COMPLIMENTARY</span>
                            </div>
                            <div className="flex justify-between items-center p-8 bg-orange-500/5 border border-orange-500/10 rounded-3xl mt-6">
                                <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-sm">Amount Due</span>
                                <span className="text-4xl font-black text-white tracking-tighter">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Side: Meta Info */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <section className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 px-2">Order Status</h4>
                        <div className="flex flex-col gap-4">
                           <div className={`p-5 rounded-2xl flex items-center gap-4 border ${
                                order.status === 'Pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                                order.status === 'Delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                'bg-blue-500/10 border-blue-500/20 text-blue-400'
                           }`}>
                                {order.status === 'Pending' ? <Clock size={20}/> : order.status === 'Delivered' ? <CheckCircle size={20}/> : <Truck size={20}/>}
                                <span className="font-black uppercase tracking-widest text-xs">{order.status}</span>
                           </div>
                           <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                                <CreditCard size={18} className="text-zinc-500" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Payment Status</span>
                                    <span className={`text-xs font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>{order.paymentStatus}</span>
                                </div>
                           </div>
                        </div>
                    </section>

                    {/* Customer Card */}
                    <section className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 px-2">Authorized Recipient</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-white mb-0.5">{order.user?.name}</p>
                                    <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">{order.user?.email}</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex gap-4">
                                <MapPin size={18} className="text-zinc-500 mt-1 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1.5">Destination</p>
                                    <p className="text-sm font-semibold text-zinc-400 leading-relaxed">{order.shippingAddress?.street}</p>
                                    <p className="text-sm font-semibold text-zinc-400">{order.shippingAddress?.city}</p>
                                    <p className="text-zinc-500 font-mono text-xs mt-2">{order.shippingAddress?.phone}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
