import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, CreditCard, Banknote, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAdminStore } from '../../store/useAdminStore';

const COLORS = ['#6366f1', '#3b82f6', '#f97316'];

const Revenue = () => {
  const { orders, fetchOrders } = useAdminStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";
  const netProfit = (totalRevenue * 0.22).toFixed(2);
  const currentBalance = (totalRevenue * 0.15).toFixed(2); // Mocked balance

  // Group by month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = monthNames.map(name => ({ name, revenue: 0, profit: 0 }));

  orders.forEach(o => {
    const date = new Date(o.createdAt);
    const monthIndex = date.getMonth();
    if (monthlyData[monthIndex]) {
        monthlyData[monthIndex].revenue += o.totalAmount;
        monthlyData[monthIndex].profit += (o.totalAmount * 0.22);
    }
  });

  const finalChartData = monthlyData.filter(d => d.revenue > 0);
  const chartToDisplay = finalChartData.length > 3 ? finalChartData : [
    { name: 'Jan', revenue: 4500, profit: 1200 },
    { name: 'Feb', revenue: 5200, profit: 1500 },
    { name: 'Mar', revenue: 4800, profit: 1300 },
    { name: 'Apr', revenue: 6100, profit: 2100 },
  ];

  const payTypeData = [
    { name: 'Stripe', value: 65, color: '#6366f1' },
    { name: 'PayPal', value: 25, color: '#3b82f6' },
    { name: 'Cash', value: 10, color: '#f97316' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Revenue Overview</h1>
          <p className="text-zinc-500 font-medium tracking-wide">Manage your finances and payout history</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-[#111114] border border-white/5 rounded-2xl p-3 flex items-center gap-6 px-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Current Balance</span>
                <span className="text-lg font-black text-white text-white">${currentBalance}</span>
              </div>
              <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl font-black text-[10px] uppercase tracking-widest text-black transition-all">
                Withdraw
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Net Profit', value: `$${netProfit}`, trend: '+12%', color: 'emerald', icon: <TrendingUp className="text-emerald-400" /> },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, trend: '+8%', color: 'sky', icon: <DollarSign className="text-sky-400" /> },
          { label: 'Avg Order Value', value: `$${avgOrder}`, trend: '-2%', color: 'rose', icon: <Wallet className="text-rose-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111114] border border-white/5 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] -translate-y-1/2 translate-x-1/2 rounded-full" />
             <div className="flex items-center justify-between relative z-10 mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-orange-500/20 transition-all`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-black ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-rose-500'} bg-white/5 px-3 py-1.5 rounded-full border border-white/5`}>
                  {stat.trend}
                </span>
             </div>
             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-3xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
             <div>
                <h2 className="text-2xl font-black tracking-tight text-white mb-1">Market Dominance</h2>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[2px]">Monthly Revenue vs Profit Growth</p>
             </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Revenue</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Profit</span>
               </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartToDisplay}>
                <defs>
                   <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700 }} 
                  dy={10} 
                />
                <YAxis 
                  stroke="#52525b" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700 }} 
                />
                <Tooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                   contentStyle={{ backgroundColor: '#111114', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                   itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[10, 10, 0, 0]} barSize={32} />
                <Bar dataKey="profit" fill="url(#profitGradient)" radius={[10, 10, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl flex flex-col">
          <h2 className="text-2xl font-black tracking-tight mb-10 text-white">Transaction Logic</h2>
          <div className="space-y-6 flex-1">
            {payTypeData.map((type, i) => (
              <div key={i} className="flex flex-col gap-2 group">
                 <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-orange-500/20 transition-all text-zinc-400 group-hover:text-white">
                         {type.name === 'Stripe' ? <CreditCard size={16} /> : type.name === 'PayPal' ? <Banknote size={16} /> : <Calendar size={16} />}
                       </div>
                       <span className="text-sm font-bold text-white">{type.name} Payment</span>
                    </div>
                    <span className="text-xs font-black text-white">{type.value}%</span>
                 </div>
                 <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${type.value}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full rounded-full" 
                      style={{ backgroundColor: type.color }} 
                    />
                 </div>
              </div>
            ))}
          </div>
           <div className="mt-10 p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Payouts</p>
                <h4 className="text-xl font-black text-white text-white">${(totalRevenue * 0.8).toLocaleString()}</h4>
              </div>
              <button className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all border border-white/5">
                <BarChart3 size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
