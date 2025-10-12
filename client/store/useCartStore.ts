import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import apiClient from "@/lib/apiClient";

interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
}

interface AddToCartPayload {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: AddToCartPayload) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
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
          const payload = {
            productId: product.id,
            quantity: product.quantity || 1,
          };
          console.log("Sending payload:", payload);
          const response = await apiClient.post("/cart/add", payload);
          console.log("Added to cart:", response.data);

          const cartItems = response.data.cart.items.map((item: any) => ({
            id: item.productId._id || item.productId,
            productId: item.productId._id || item.productId,
            name: item.name,
            price: item.price,
            img: item.img,
            quantity: item.quantity,
          }));

          set({ items: cartItems });
        } catch (error: any) {
          console.error("Add to cart full error:", error);
          console.error(
            "Add to cart error:",
            error.response?.data || error.message || error
          );
        }
      },

      removeItem: async (productId) => {
        try {
          const response = await apiClient.post("/cart/remove", { productId });
          const cartItems = response.data.cart.items.map((item: any) => ({
            id: item.productId._id || item.productId,
            name: item.name,
            price: item.price,
            img: item.img,
            quantity: item.quantity,
          }));
          set({ items: cartItems });
        } catch (error) {
          console.error("Failed to remove item from cart", error);
          set({ items: get().items.filter((item) => item.id !== productId) });
        }
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }
        const originalItems = get().items;
        const updatedItems = originalItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });

        try {
          await apiClient.post("/cart/update", { productId, quantity });
        } catch (error) {
          console.error("Failed to update quantity", error);
          set({ items: originalItems });
        }
      },

      clearCart: async () => {
        const originalItems = get().items;
        set({ items: [] });
        try {
          await apiClient.post("/cart/clear");
        } catch (error) {
          console.error("Failed to clear cart on server", error);
          set({ items: originalItems });
        }
      },

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),

      fetchCart: async () => {
        try {
          const response = await apiClient.get("/cart");
          const cartItems = response.data.items.map((item: any) => ({
            id: item.productId._id || item.productId,
            name: item.name,
            price: item.price,
            img: item.img,
            quantity: item.quantity,
          }));
          set({ items: cartItems });
        } catch (error) {
          console.error("Failed to fetch cart", error);
          set({ items: [] });
        }
      },

      setItems: (items) => set({ items }),

      mergeAndSetCart: (serverItems) => {
        const localItems = get().items;
        const merged = [...serverItems];

        localItems.forEach((localItem) => {
          const existing = merged.find(
            (serverItem) => serverItem.id === localItem.id
          );
          if (existing) {
            existing.quantity = Math.max(
              existing.quantity,
              localItem.quantity
            );
          } else {
            merged.push(localItem);
          }
        });

        set({ items: merged });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;