"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  posterId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (posterId: string, size: string) => void;
  updateQuantity: (posterId: string, size: string, quantity: number) => void;
  increaseQuantity: (posterId: string, size: string) => void;
  decreaseQuantity: (posterId: string, size: string) => void;
  clearCart: () => void;
  getItemQuantity: (posterId: string, size: string) => number;
  getTotalItems: () => number;
  getSubtotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "poster-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((current) => {
      const existing = current.find(
        (i) => i.posterId === item.posterId && i.size === item.size,
      );

      if (existing) {
        return current.map((i) =>
          i.posterId === item.posterId && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }

      return [...current, item];
    });
  };

  const removeFromCart = (posterId: string, size: string) => {
    setItems((current) =>
      current.filter(
        (item) => !(item.posterId === posterId && item.size === size),
      ),
    );
  };

  const updateQuantity = (posterId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(posterId, size);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.posterId === posterId && item.size === size
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const increaseQuantity = (posterId: string, size: string) => {
    setItems((current) =>
      current.map((item) =>
        item.posterId === posterId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (posterId: string, size: string) => {
    setItems((current) =>
      current
        .map((item) =>
          item.posterId === posterId && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (posterId: string, size: string) => {
    return (
      items.find((item) => item.posterId === posterId && item.size === size)
        ?.quantity ?? 0
    );
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getItemQuantity,
        getTotalItems,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
