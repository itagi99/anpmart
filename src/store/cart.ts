'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
  unitConversion: number;
  secondaryUnit: string;
  mrp: number;
  hasDisc: boolean;
  tiers: any[];
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  setQuantity: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
  getItem: (productId: number) => CartItem | undefined;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),
      updateQuantity: (productId, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity: qty } : i
            ),
          };
        }),
      setQuantity: (productId, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity: qty } : i
            ),
          };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getItem: (productId) => get().items.find((i) => i.productId === productId),
    }),
    { name: 'anpmart-cart', skipHydration: true }
  )
);