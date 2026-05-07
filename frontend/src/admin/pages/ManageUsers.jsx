import React, { useEffect } from 'react';
import { Search, Filter, Shield, MoreVertical, Trash2, Edit2, UserCircle2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../store/useAdminStore';
import { AdminTableSkeleton } from '../../components/Skeleton';

const ManageUsers = () => {
  const { users, fetchUsers, deleteUser, isLoading, error } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Terminate this user access protocol?')) {
      await deleteUser(id);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {isLoading && users.length === 0 ? (
        <AdminTableSkeleton cols={4} rows={6} />
      ) : (
      <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">User Management</h1>
          <p className="text-zinc-500 font-medium tracking-wide">Control system permissions and customer accounts</p>
        </div>
        <button className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 active:scale-95 text-black">
          <Shield size={16} />
          <span>Assign New Role</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-500 font-bold mb-6 text-sm flex items-center justify-between">
             <span>⚠️ {error}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[300px] relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search users by name, email or role..." 
            className="w-full bg-[#111114] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all text-white"
          />
        </div>
        <button className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-bold flex items-center gap-3 transition-all text-white">
          <Filter size={16} />
          <span>Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">User Profile</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Role</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Joined Date</th>
                <th className="px-8 py-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-0.5 shadow-xl transition-transform group-hover:scale-105 active:scale-95">
                        <div className="w-full h-full rounded-[10px] bg-[#111114] flex items-center justify-center">
                          <UserCircle2 size={24} className="text-sky-400" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{user.name}</span>
                        <span className="text-xs text-zinc-500 font-medium">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-2 font-bold text-sm ${user.role === 'admin' ? 'text-orange-500' : 'text-zinc-400'}`}>
                      {user.role === 'admin' && <Shield size={14} />}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-semibold text-zinc-400">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-500/10 text-zinc-400 hover:text-indigo-400 transition-all border border-white/5">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-all border border-white/5"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all border border-white/5">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default ManageUsers;
