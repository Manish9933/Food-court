import React, { useState, useEffect } from 'react';
import { 
  Truck, Plus, Search, MoreVertical, 
  Trash2, Edit, Phone, ShieldCheck, 
  Clock, CheckCircle, XCircle, MapPin, X, ChevronRight
} from 'lucide-react';
import api from '../../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const ManageDeliveryBoys = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        vehicleNumber: '',
        status: 'Available'
    });
    const [editingId, setEditingId] = useState(null);

    const fetchAgents = async () => {
        try {
            const res = await api.get('/delivery-boys');
            setAgents(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching agents:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/delivery-boys/${editingId}`, formData);
            } else {
                await api.post('/delivery-boys', formData);
            }
            fetchAgents();
            setIsModalOpen(false);
            setFormData({ name: '', phone: '', email: '', vehicleNumber: '', status: 'Available' });
            setEditingId(null);
        } catch (err) {
            alert('Operation failed. Please check your data.');
        }
    };

    const deleteAgent = async (id) => {
        if (!window.confirm('Terminate this agent record?')) return;
        try {
            await api.delete(`/delivery-boys/${id}`);
            fetchAgents();
        } catch (err) {
            alert('Deletion failed.');
        }
    };

    const filteredAgents = agents.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">Delivery Agents</h1>
                    <p className="text-zinc-500 font-medium italic">Manage your logistics fleet and courier personnel</p>
                </div>
                <button 
                  onClick={() => { setEditingId(null); setFormData({name: '', phone: '', email: '', vehicleNumber: '', status: 'Available'}); setIsModalOpen(true); }}
                  className="bg-orange-500 hover:bg-orange-600 text-black px-8 py-4 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] flex items-center gap-3 transition-all shadow-[0_10px_30px_rgba(249,115,22,0.2)]"
                >
                    <Plus size={18} /> Recruit Agent
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by name or contact number..." 
                        className="w-full bg-[#111114] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <div className="col-span-full py-20 text-center animate-pulse text-zinc-500 uppercase font-black tracking-widest">Scanning logistics signatures...</div> :
                filteredAgents.map((agent) => (
                    <motion.div 
                        layout
                        key={agent._id}
                        className="bg-[#111114] border border-white/5 p-8 rounded-[2.5rem] hover:border-orange-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors" />
                        
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-orange-500 border border-white/5 shadow-xl transition-all">
                                    <Truck size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">{agent.name}</h3>
                                    <p className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mt-1">Agent Signature Detected</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingId(agent._id); setFormData(agent); setIsModalOpen(true); }} className="p-2.5 rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-all"><Edit size={14} /></button>
                                <button onClick={() => deleteAgent(agent._id)} className="p-2.5 rounded-xl bg-rose-500/5 text-rose-500/50 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 relative z-10">
                            <div className="flex items-center gap-4 text-zinc-400">
                                <Phone size={14} className="text-zinc-600" />
                                <span className="text-sm font-semibold">{agent.phone}</span>
                            </div>
                            <div className="flex items-center gap-4 text-zinc-400">
                                <ShieldCheck size={14} className="text-zinc-600" />
                                <span className="text-sm font-semibold uppercase tracking-widest">{agent.vehicleNumber || 'No Tactical Vehicle'}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                           <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                agent.status === 'Available' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 
                                agent.status === 'Busy' ? 'bg-orange-500/5 border-orange-500/20 text-orange-500' : 
                                'bg-zinc-500/5 border-zinc-500/20 text-zinc-500'
                           }`}>
                                {agent.status}
                           </div>
                           <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Signal Active</span>
                           </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0f0f12] w-full max-w-xl rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-rose-500" />
                            <div className="flex items-center justify-between mb-12 shrink-0">
                                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">{editingId ? 'Modify Agent' : 'Recruit Agent'}</h1>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all"><X size={20}/></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-4 no-scrollbar">
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Full Agent Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Enter legal name..." 
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 focus:outline-none focus:border-orange-500/50 transition-all text-white font-bold"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Contact Signature</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Phone number..." 
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 focus:outline-none focus:border-orange-500/50 transition-all text-white font-bold"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Email Address (Required)</label>
                                        <input 
                                            required
                                            type="email" 
                                            placeholder="agent@foodgenie.com" 
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 focus:outline-none focus:border-orange-500/50 transition-all text-white font-bold"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Tactical Vehicle Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="Vehicle ID..." 
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 focus:outline-none focus:border-orange-500/50 transition-all text-white font-bold"
                                            value={formData.vehicleNumber}
                                            onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Deployment Status</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { id: 'Available', label: 'Ready for Dispatch', color: 'emerald' },
                                                { id: 'Busy', label: 'On Active Mission', color: 'orange' },
                                                { id: 'Offline', label: 'Agent Offline', color: 'zinc' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, status: opt.id})}
                                                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                                        formData.status === opt.id 
                                                        ? `bg-${opt.color}-500/10 border-${opt.color}-500/50 text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]` 
                                                        : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            opt.id === 'Available' ? 'bg-emerald-500' : 
                                                            opt.id === 'Busy' ? 'bg-orange-500' : 'bg-zinc-500'
                                                        } ${formData.status === opt.id && 'animate-pulse'}`} />
                                                        <span className="font-bold text-sm">{opt.label}</span>
                                                    </div>
                                                    {formData.status === opt.id && <CheckCircle size={16} className={`text-${opt.color}-500`} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-white text-black py-7 rounded-[2rem] font-black text-xl uppercase tracking-tighter hover:bg-orange-500 hover:text-white transition-all shadow-3xl mt-6 group shrink-0"
                                >
                                    {editingId ? 'UPDATE COMMISSION' : 'INITIALIZE RECRUITMENT'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageDeliveryBoys;
