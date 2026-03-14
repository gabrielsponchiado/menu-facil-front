"use client";

import Image from "next/image";
import { categories } from "@/data/mockData";

// Components
import { MenuHeader } from "@/components/MenuHeader";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailDrawer } from "@/components/ProductDetailDrawer";
import { CartDrawer } from "@/components/CartDrawer";
import { AISuggestionInput } from "@/components/AISuggestionInput";

// Hooks
import { useCart } from "@/hooks/useCart";
import { useMenu } from "@/hooks/useMenu";
import { useEffect } from "react";

export default function MenuPage() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    updateCartQuantity, 
    clearCart, 
    totalCartItems 
  } = useCart();

  const {
    activeCategory,
    setActiveCategory,
    selectedDish,
    setSelectedDish,
    filteredDishes
  } = useMenu();

  // Bloquear scroll quando um drawer estiver aberto
  useEffect(() => {
    if (selectedDish || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedDish, isCartOpen]);

  const handleCheckout = () => {
    alert("Pedido enviado!");
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#111317] text-white flex flex-col font-sans pb-32 pt-20 overflow-x-hidden">
      <MenuHeader 
        totalItems={totalCartItems} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      <div className="w-full h-64 relative shrink-0">
        <Image src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1600&auto=format&fit=crop" alt="Featured" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent opacity-80" />
      </div>

      <CategoryFilters 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      <div className="px-6 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{activeCategory}</h2>
      </div>

      <div className="px-6 space-y-4">
        {filteredDishes.map((dish) => (
          <ProductCard 
            key={dish.id} 
            dish={dish} 
            onClick={() => setSelectedDish(dish)} 
          />
        ))}
      </div>

      <AISuggestionInput onSuggest={(text) => console.log("AI Suggestion:", text)} />

      {selectedDish && (
        <ProductDetailDrawer 
          dish={selectedDish} 
          onAdd={(quantity) => {
            addToCart(selectedDish, quantity);
            setSelectedDish(null);
          }} 
          onClose={() => setSelectedDish(null)} 
        />
      )}

      {isCartOpen && (
        <CartDrawer 
          items={cart} 
          onUpdateQuantity={updateCartQuantity} 
          onCheckout={handleCheckout} 
          onClose={() => setIsCartOpen(false)} 
        />
      )}
    </div>
  );
}
