import React from "react";
import { useAdminStore } from '../../store/useAdminStore';
import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, ShoppingBag, ArrowUpRight, ArrowDownRight, Clock, MapPin, Search, PlusCircle, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { AdminDashboardSkeleton } from "../../components/Skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, orders: 240 },
  { name: 'Tue', revenue: 3000, orders: 139 },
  { name: 'Wed', revenue: 2000, orders: 980 },
  { name: 'Thu', revenue: 2780, orders: 390 },
  { name: 'Fri', revenue: 1890, orders: 480 },
  { name: 'Sat', revenue: 2390, orders: 380 },
  { name: 'Sun', revenue: 3490, orders: 430 },
];

const StatCard = ({ icon, label, value, trend, trendValue, color }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-[#111114] border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-100 opacity-60`} />
    
    <div className="flex items-start justify-between relative z-10">
      <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 flex items-center justify-center border border-${color}-500/20 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trendValue}%
      </div>
    </div>
    
    <div className="mt-8 relative z-10">
      <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-1 group-hover:text-zinc-400 transition-colors">{label}</h3>
      <p className="text-3xl font-black tracking-tight">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { foods, orders, users, fetchFoods, fetchOrders, fetchUsers, stats, fetchStats, isLoading } = useAdminStore();

  React.useEffect(() => {
    fetchFoods();
    fetchOrders();
    fetchUsers();
    fetchStats();
  }, []);

  const totalRevenue = stats?.totalRevenue || 0;
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  
  // Format revenue data for chart
  const chartData = stats?.revenueByMonth?.map(m => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m._id - 1],
    revenue: m.revenue
  })) || [];

  return (
    <div className="space-y-10 pb-20">
      {isLoading ? (
        <AdminDashboardSkeleton />
      ) : (
      <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Eagle View Dashboard</h1>
          <p className="text-zinc-500 font-medium tracking-wide">Real-time snapshots of FoodGenie's pulse</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<DollarSign className="text-emerald-400" />} 
          label="Total Revenue" 
          value={`$${totalRevenue.toFixed(2)}`} 
          trend="up" 
          trendValue="12.4"
          color="emerald"
        />
        <StatCard 
          icon={<ShoppingBag className="text-sky-400" />} 
          label="Active Orders" 
          value={activeOrders} 
          trend="up" 
          trendValue="8.2"
          color="sky"
        />
        <StatCard 
          icon={<Users className="text-orange-400" />} 
          label="Total Users" 
          value={stats?.activeUsers || users.length} 
          trend="up" 
          trendValue="2.1"
          color="orange"
        />
        <StatCard 
          icon={<TrendingUp className="text-rose-400" />} 
          label="Menu Items" 
          value={stats?.totalFoodItems || foods.length} 
          trend="up" 
          trendValue="4.5"
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-rose-500 opacity-50" />
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-1">Revenue Analytics</h2>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Yearly Performance</span>
            </div>
          </div>
          <div className="h-[400px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#52525b" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} dy={10} />
                  <YAxis stroke="#52525b" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff' }}
                    itemStyle={{ color: '#f97316' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest">No revenue data yet</div>
            )}
          </div>
        </div>

        <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black tracking-tight">Recent Orders</h2>
            <button className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:text-orange-400">View All</button>
          </div>
          
          <div className="space-y-6 flex-1">
            {stats?.recentOrders?.map((order) => (
              <div key={order._id} className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.href='/admin/orders'}>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-orange-500/20 transition-all">
                  <ShoppingBag size={20} className="text-zinc-500 group-hover:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold tracking-tight">Order #{order._id.slice(-4).toUpperCase()}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate">{order.items.length} items • ${order.totalAmount} • {order.user?.name}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                }`}>
                  {order.status}
                </div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <p className="text-center text-zinc-500 text-xs font-bold uppercase py-10">No recent orders</p>
            )}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};


export default Dashboard;
