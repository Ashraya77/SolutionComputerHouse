import { create } from 'zustand'
import apiClient from '@/lib/apiClient';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  mergeAndSetCart: (serverItems: CartItem[]) => void;
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
      clearCart: async () => {
        set({ items: [] });
        // Optional: Call an API endpoint to clear the cart on the server as well.
        // try { await apiClient.post('/cart/clear'); } catch (e) { console.error(e); }
      },
      
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

      // Merge local cart with server cart
      mergeAndSetCart: (serverItems) => {
        const localItems = get().items;
        const merged = [...serverItems];

        localItems.forEach(localItem => {
          const existing = merged.find(serverItem => serverItem.id === localItem.id);
          if (existing) {
            // If item exists on server, use the greater quantity
            existing.quantity = Math.max(existing.quantity, localItem.quantity);
          } else {
            // If item only exists locally, add it to the merged cart
            merged.push(localItem);
          }
        });

        set({ items: merged });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist the items array
    }
  )
)

export default useCartStore