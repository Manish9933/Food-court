import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/api'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({ user: data, loading: false })
          return true
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false })
          return false
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null })
        try {
          const { data } = await api.post('/auth/register', { name, email, password })
          set({ user: data, loading: false })
          return true
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false })
          return false
        }
      },

      updateProfile: async (userData) => {
        set({ loading: true, error: null })
        try {
          const { data } = await api.put('/auth/profile', userData)
          set({ user: data, loading: false })
          return true
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false })
          return false
        }
      },

      logout: () => set({ user: null, error: null }),
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
          error: null
        }))
      },
    }),
    { 
      name: 'foodgenie-auth'
    }
  )
)

export default useAuthStore
