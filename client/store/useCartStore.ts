import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '@/lib/apiClient';

interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  fetchCart: () => Promise<void>;
  setItems: (items: CartItem[]) => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to cart
      addItem: async (product) => {
        try {
          const response = await apiClient.post('/cart/add', product);
          // The API now returns the entire cart, so we can just set it.
          // We need to map productId to id for client-side consistency.
          const cartItems = response.data.items.map((item: any) => ({ ...item, id: item.productId }));
          set({ items: cartItems });
        } catch (error) {
          console.error("Failed to add item to cart", error);
          // Optionally, show an error to the user
        }
      },
      
      // Remove item from cart
      removeItem: (productId) => {
        // TODO: Implement API call to remove item
        set({ items: get().items.filter(item => item.id !== productId) });
      },
      
      // Update item quantity
      updateQuantity: (productId, quantity) => {
        // TODO: Implement API call to update quantity
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({ items: get().items.map(item => item.id === productId ? { ...item, quantity } : item) });
      },
      
      // Clear cart
      // TODO: Implement API call to clear cart
      clearCart: () => set({ items: [] }),
      
      // Get total items count
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      // Get total price
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),

      // Fetch cart from server
      fetchCart: async () => {
        try {
          const response = await apiClient.get('/cart');
          const cartItems = response.data.items.map((item: any) => ({ ...item, id: item.productId }));
          set({ items: cartItems });
        } catch (error) {
          console.error("Failed to fetch cart", error);
          set({ items: [] }); // Clear cart on error
        }
      },

      // Directly set items, useful for initialization
      setItems: (items) => set({ items }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
)

export default useCartStore