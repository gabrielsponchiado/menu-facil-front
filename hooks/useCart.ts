import { useState } from "react";
import { Dish } from "@/types";

export function useCart() {
  const [cart, setCart] = useState<{ dish: Dish, quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (dish: Dish | null, quantity: number) => {
    if (!dish) return;
    
    setCart(prev => {
      const existingItem = prev.find(item => item.dish.id === dish.id);
      if (existingItem) {
        return prev.map(item => 
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
    setCart(prev => prev.map(item => {
      if (item.dish.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  return {
    cart,
    setCart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartQuantity,
    clearCart,
    totalCartItems
  };
}
