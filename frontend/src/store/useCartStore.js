import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (product) => {
        set((state) => {
          // Identify the unique property for the product
          const targetId = product._id || product.id;

          // Check if item already exists without matching on 'undefined'
          const existingItemIndex = state.cart.findIndex((item) => {
            const itemId = item._id || item.id;
            return itemId && itemId === targetId;
          });

          if (existingItemIndex > -1) {
            // Correctly update quantity if it exists
            const updatedCart = [...state.cart];
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: updatedCart[existingItemIndex].quantity + 1
            };
            return { cart: updatedCart };
          }

          // Otherwise, add as a new item entry
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => (item._id || item.id) !== productId)
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          cart: state.cart.map((item) =>
            (item._id || item.id) === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),
      
      getTotalPrice: () => get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
      
      getItemCount: () => get().cart.reduce((total, item) => total + item.quantity, 0),
    }),
    { 
      name: 'foodgenie-cart',
      version: 2, // Upgraded from 0/1 to 2 for ID migration
      migrate: (persistedState, version) => {
        if (version < 2 && persistedState && persistedState.cart) {
          const ID_MAP = {
            'roti': '65c276f2d2b51c1d1e1f1111',
            'butter-naan': '65c276f2d2b51c1d1e1f2222',
            'garlic-naan': '65c276f2d2b51c1d1e1f3333',
            'paratha': '65c276f2d2b51c1d1e1f4444',
            'cheese-bread': '65c276f2d2b51c1d1e1f5555',
            'paneer-butter-masala': '65c276f2d2b51c1d1e1f6666',
            'dal-makhani': '65c276f2d2b51c1d1e1f7777',
            'chole': '65c276f2d2b51c1d1e1f8888',
            'mix-veg': '65c276f2d2b51c1d1e1f9999',
            'jeera-rice': '65c276f2d2b51c1d1e1faaaa',
            'plain-rice': '65c276f2d2b51c1d1e1fbbbb',
            'biryani': '65c276f2d2b51c1d1e1fcccc',
            'salad': '65c276f2d2b51c1d1e1fdddd',
            'pickle': '65c276f2d2b51c1d1e1feeee',
            'raita': '65c276f2d2b51c1d1e1fffff'
          };

          persistedState.cart = persistedState.cart.map(item => {
            const oldId = item._id || item.id;
            if (ID_MAP[oldId]) {
              return { ...item, _id: ID_MAP[oldId], id: ID_MAP[oldId] };
            }
            return item;
          });
        }
        return persistedState;
      },
      getStorage: () => localStorage 
    }
  )
)

export default useCartStore
