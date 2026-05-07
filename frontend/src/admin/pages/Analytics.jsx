import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Zap, ArrowUpRight, ArrowDownRight, Globe, Share2, Layers } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';
import { useAdminStore } from '../../store/useAdminStore';

const data = [
  { name: 'Mon', active: 4000, new: 2400 },
  { name: 'Tue', active: 3000, new: 1398 },
  { name: 'Wed', active: 2000, new: 9800 },
  { name: 'Thu', active: 2780, new: 3908 },
  { name: 'Fri', active: 1890, new: 4800 },
  { name: 'Sat', active: 2390, new: 3800 },
  { name: 'Sun', active: 3490, new: 4300 },
];

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4'];

const Analytics = () => {
  const { foods, categories, users, fetchFoods, fetchCategories, fetchUsers } = useAdminStore();

  useEffect(() => {
    fetchFoods();
    fetchCategories();
    fetchUsers();
  }, []);

  const pieData = categories.map(cat => ({
    name: cat.name || 'Uncategorized',
    value: foods.filter(f => f.category === cat.name).length
  })).filter(d => d.value > 0);

  // Fallback if no data
  const finalPieData = pieData.length > 0 ? pieData : [
    { name: 'No Data', value: 1 }
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white text-white">Advanced Analytics</h1>
          <p className="text-zinc-500 font-medium tracking-wide">Deep dive into FoodGenie's growth metrics</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-bold flex items-center gap-3 transition-all text-white">
            <Share2 size={16} />
            <span>Export CSV</span>
          </button>
           <button className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 active:scale-95 text-black">
            <Zap size={16} />
            <span>Upgrade Plan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-1 text-white">User Growth trends</h2>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global active users vs New signups</span>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Users size={20} />
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                   <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis stroke="#52525b" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff' }}
                   itemStyle={{ fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="active" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorActive)" />
                <Area type="monotone" dataKey="new" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorNew)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center">
          <h2 className="text-2xl font-black tracking-tight mb-8 text-white">Popular Categories</h2>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {finalPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[2px] block">Global</span>
              <span className="text-3xl font-black text-white">Top {finalPieData.length}</span>
            </div>
          </div>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Site Performance', value: '98.5%', icon: <Zap className="text-yellow-400" />, trend: '+2.1%', trendColor: 'text-green-500' },
          { label: 'Global Traffic', value: `${(users.length * 1.2).toFixed(1)}K`, icon: <Globe className="text-sky-400" />, trend: '+12.4%', trendColor: 'text-green-500' },
          { label: 'Campaign Hits', value: '1.2M', icon: <Layers className="text-indigo-400" />, trend: '-3.2%', trendColor: 'text-rose-500' },
          { label: 'Goal Retention', value: '72.8%', icon: <Target className="text-emerald-400" />, trend: '+5.7%', trendColor: 'text-green-500' },
        ].map((item, i) => (
          <div key={i} className="bg-[#111114] border border-white/5 rounded-3xl p-6 shadow-xl group hover:border-orange-500/20 transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
                <span className={`text-[10px] font-black ${item.trendColor} uppercase tracking-widest bg-white/[0.02] px-3 py-1.5 rounded-full`}>
                  {item.trend}
                </span>
             </div>
             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{item.label}</p>
             <h3 className="text-2xl font-black text-white">{item.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
