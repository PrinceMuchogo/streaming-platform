import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import { Product } from "@/types/product";

interface CartState {
    cart: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    updateQuantity: (productId: string, quantity: number) => void; // New function for updating quantity
}

// Custom localStorage wrapper to conform to PersistStorage<CartState>
const localStoragePersist: PersistStorage<CartState> = {
    getItem: (name) => {
        const value = localStorage.getItem(name);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    },
    setItem: (name, value) => {
        localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
        localStorage.removeItem(name);
    },
};

const useCartStore = create<CartState>()(
    persist<CartState>(
        (set) => ({
            cart: [],

            addToCart: (product) =>
                set((state) => {
                    const existingItem = state.cart.find((item) => item.id === product.id);
                    if (existingItem) {
                        // Increase quantity if item already exists
                        return {
                            cart: state.cart.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity! + 1 }
                                    : item
                            ),
                        };
                    } else {
                        // Add new item to cart
                        return { cart: [...state.cart, { ...product, quantity: 1 }] };
                    }
                }),

            removeFromCart: (productId) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== productId),
                })),

            clearCart: () => set({ cart: [] }),

            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                })),
        }),
        {
            name: "cart", // Name of the localStorage key
            storage: localStoragePersist,
        }
    )
);

export default useCartStore;
