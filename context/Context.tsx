"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  poster_img: string;
  size: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  increaseQuantity: (id: string, size: string) => void;
  decreaseQuantity: (id: string, size: string) => void;
  clearCart: () => void;
  getItemQuantity: (id: string, size: string) => number;
  getTotalItems: () => number;
  getSubtotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "poster-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch (error) {
          console.log("local error", error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addToCart = (item: CartItem) => {
    setItems((current) => {
      const existing = current.find(
        (i) => i.id === item.id && i.size === item.size,
      );

      if (existing) {
        return current.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }

      return [...current, item];
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setItems((current) =>
      current.filter((item) => !(item.id === id && item.size === size)),
    );
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item,
      ),
    );
  };

  const increaseQuantity = (id: string, size: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (id: string, size: string) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (id: string, size: string) => {
    return (
      items.find((item) => item.id === id && item.size === size)?.quantity ?? 0
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
