"use client";

import * as React from "react";
import type { MenuItemRecord } from "@/data/menu";

export type CartLine = {
  itemId: string;
  name: string;
  price: string;
  qty: number;
  /** Optional — used for cart preview thumbnails */
  image?: string;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (item: MenuItemRecord) => void;
  removeLine: (itemId: string) => void;
  setQty: (itemId: string, qty: number) => void;
  clear: () => void;
  totalItemCount: number;
};

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);

  const addItem = React.useCallback((item: MenuItemRecord) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.itemId === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = {
          ...next[i],
          qty: next[i].qty + 1,
          image: next[i].image ?? item.image,
        };
        return next;
      }
      return [
        ...prev,
        {
          itemId: item.id,
          name: item.name,
          price: item.price,
          qty: 1,
          ...(item.image ? { image: item.image } : {}),
        },
      ];
    });
  }, []);

  const removeLine = React.useCallback((itemId: string) => {
    setLines((prev) => prev.filter((l) => l.itemId !== itemId));
  }, []);

  const setQty = React.useCallback(
    (itemId: string, qty: number) => {
      if (qty < 1) {
        removeLine(itemId);
        return;
      }
      setLines((prev) =>
        prev.map((l) => (l.itemId === itemId ? { ...l, qty } : l)),
      );
    },
    [removeLine],
  );

  const clear = React.useCallback(() => setLines([]), []);

  const totalItemCount = lines.reduce((s, l) => s + l.qty, 0);

  const value = React.useMemo(
    (): CartContextValue => ({
      lines,
      addItem,
      removeLine,
      setQty,
      clear,
      totalItemCount,
    }),
    [lines, addItem, removeLine, setQty, clear, totalItemCount],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
