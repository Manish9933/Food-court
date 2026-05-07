import { create } from 'zustand';
import api from '../api/api';

export const useAdminStore = create((set, get) => ({
  foods: [],
  orders: [],
  users: [],
  categories: [],
  deliveryBoys: [],
  isLoading: false,
  error: null,

  // Delivery Boy Actions
  fetchDeliveryBoys: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/delivery-boys');
      set({ deliveryBoys: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  assignCourier: async (orderId, courierId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.put(`/orders/${orderId}/assign`, { courierId });
      set(state => ({
        orders: state.orders.map(o => o._id === orderId ? data : o),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // Menu Actions
  fetchFoods: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/menu');
      set({ foods: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addFood: async (foodData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/menu', foodData);
      set(state => ({ foods: [...state.foods, data], isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  updateFood: async (id, foodData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.put(`/menu/${id}`, foodData);
      set(state => ({
        foods: state.foods.map(f => f._id === id ? data : f),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  toggleAvailability: async (id, currentStatus) => {
    return get().updateFood(id, { isAvailable: !currentStatus });
  },

  deleteFood: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/menu/${id}`);
      set(state => ({
        foods: state.foods.filter(f => f._id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Order Actions
  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/orders');
      set({ orders: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      const { data } = await api.put(`/orders/${id}`, { status });
      set(state => ({
        orders: state.orders.map(o => o._id === id ? data : o),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Category Actions
  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/categories');
      set({ categories: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/categories', categoryData);
      set(state => ({ categories: [...state.categories, data], isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/categories/${id}`);
      set(state => ({ categories: state.categories.filter(c => c._id !== id), isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  // User Actions
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/users');
      set({ users: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/users/${id}`);
      set(state => ({
        users: state.users.filter(u => u._id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  notifications: [],
  stats: null,

  // Stats Actions
  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/dashboard/stats');
      set({ stats: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Notification Actions

  fetchNotifications: async () => {
    try {
      const { data } = await api.get('/notifications');
      set({ notifications: data });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },

  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}`);
      set(state => ({
        notifications: state.notifications.map(n => n._id === id ? { ...n, isRead: true } : n)
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  clearAllNotifications: async () => {
    try {
      await api.delete('/notifications');
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
      }));
    } catch (error) {
       console.error('Failed to clear notifications:', error);
    }
  }
}));
