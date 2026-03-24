"use client";

import { useState, useEffect } from "react";
import { Dish } from "@/types";

const CART_KEY = "cart";

export function useCart() {
  const [cart, setCart] = useState<{ dish: Dish; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      localStorage.removeItem(CART_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish: Dish | null, quantity: number) => {
    if (!dish) return;

    setCart((prev) => {
      const existingItem = prev.find((item) => item.dish.id === dish.id);
      if (existingItem) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { dish, quantity }];
    });

    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.dish.id === id) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  };

  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  return {
    cart,
    setCart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartQuantity,
    clearCart,
    totalCartItems,
  };
}