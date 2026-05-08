import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart3,
  MessageSquare,
  Bell,
  Wallet,
  Layers,
  Truck
} from "lucide-react";

import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../../components/LogoIcon";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { title: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { title: "Menu Management", path: "/admin/menu", icon: <Utensils size={20} /> },
    { title: "Orders Management", path: "/admin/orders", icon: <ClipboardList size={20} /> },
    { title: "User Management", path: "/admin/users", icon: <Users size={20} /> },
    { title: "Analytics", path: "/admin/analytics", icon: <BarChart3 size={20} /> },
    { title: "Revenue", path: "/admin/revenue", icon: <Wallet size={20} /> },
    { title: "Manage Categories", path: "/admin/categories", icon: <Layers size={20} /> },
    { title: "Delivery Agents", path: "/admin/delivery-boys", icon: <Truck size={20} /> },
    { title: "Customer Reviews", path: "/admin/reviews", icon: <MessageSquare size={20} /> },
  ];

  return (
    <motion.aside
      className={`fixed top-0 left-0 h-screen bg-[#111114] border-r border-white/5 flex flex-col z-[100] transition-all duration-300 ${
        isOpen ? "w-72" : "w-20"
      }`}
      initial={false}
    >
      <div className="p-6 flex items-center justify-between pb-10">
        <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && "hidden"}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <LogoIcon size={40} className="relative z-10" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white/90">FoodGenie</h1>
            <p className="text-[9px] text-primary-500/60 font-black uppercase tracking-[2px]">Admin Portal</p>
          </div>
        </div>
        {!isOpen && (
          <div className="relative group">
            <div className="absolute inset-0 bg-primary-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <LogoIcon size={36} className="relative z-10" />
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors border border-white/5 ml-auto"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl group transition-all duration-300 relative ${
                  ? "bg-gradient-to-r from-primary-500/10 to-transparent text-primary-500"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-8 bg-primary-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`transition-colors duration-300 ${isActive ? "text-primary-500" : "group-hover:text-zinc-200"}`}>
                {link.icon}
              </div>
              <span className={`font-semibold tracking-tight whitespace-nowrap transition-all duration-300 ${!isOpen && "opacity-0 invisible w-0"}`}>
                {link.title}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto space-y-1.5">
        <Link
          to="/admin/settings"
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all group"
        >
          <Settings size={20} className="group-hover:rotate-45 transition-transform" />
          <span className={`font-semibold transition-all duration-300 ${!isOpen && "opacity-0 invisible w-0"}`}>Settings</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className={`font-semibold transition-all duration-300 ${!isOpen && "opacity-0 invisible w-0"}`}>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
