"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { MenuHeader } from "@/components/MenuHeader";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailDrawer } from "@/components/ProductDetailDrawer";
import { CartDrawer } from "@/components/CartDrawer";
import { OrderHistoryDrawer } from "@/components/OrderHistoryDrawer";
import { AISuggestionInput } from "@/components/AISuggestionInput";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { useMenu } from "@/hooks/useMenu";
import { Dish } from "@/types";

interface AIRecommendation {
  name: string;
  description: string;
  price: number;
  id_item: number;
  id_category: number;
  category?: { name: string; description: string };
}

const SUGERIDOS = "Sugeridos";

const CATEGORY_IMAGE: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop",
  2: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
  3: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop",
  4: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop",
};
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop";

export default function MenuPage() {
  const router = useRouter();
  const [aiDishes, setAiDishes] = useState<Dish[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // redireciona para a página inicial se não estiver logado
  useEffect(() => {
    const customer = localStorage.getItem("customer");
    if (!customer) {
      router.push("/");
    }
  }, []);

  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartQuantity,
    clearCart,
    totalCartItems,
  } = useCart();

  const {
    selectedDish,
    setSelectedDish,
    filteredDishes,
    categories,
    isLoading,
    error,
  } = useMenu(activeCategory, setActiveCategory);

  const allCategories = [...categories, SUGERIDOS];

  const handleCheckout = async () => {
    try {
      const customerData = localStorage.getItem("customer");
      if (!customerData) {
        alert("Usuário não identificado. Por favor, volte à página inicial.");
        return;
      }
      const customer = JSON.parse(customerData);
      const totalPrice = cart.reduce(
        (acc, item) => acc + item.dish.price * item.quantity,
        0
      );
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: customer.id_user, total_price: totalPrice }),
      });
      if (!response.ok) throw new Error("Erro ao realizar pedido");

      clearCart();
      setIsCartOpen(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar pedido. Tente novamente.");
    }
  };

  const handleAISuggest = async (text: string) => {
    try {
      setIsAiLoading(true);
      setAiError(false);
      setAiDishes([]);
      setActiveCategory(SUGERIDOS);

      const customerData = localStorage.getItem("customer");
      let userId = "anonymous";
      if (customerData) {
        const customer = JSON.parse(customerData);
        userId = customer.id_user;
      }

      const res = await fetch(
        `/api/ai/suggest?user_text=${encodeURIComponent(text)}&user_id=${encodeURIComponent(userId)}`
      );

      if (!res.ok) {
        setAiDishes([]);
        setAiError(true);
        return;
      }

      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      const recommendations: AIRecommendation[] = parsed.recommendations ?? [];

      const dishes: Dish[] = recommendations.map((r) => ({
        id: String(r.id_item),
        name: r.name,
        description: r.description,
        price: r.price,
        image: CATEGORY_IMAGE[r.id_category] ?? FALLBACK_IMAGE,
        category: SUGERIDOS,
      }));

      setAiDishes(dishes);
    } catch (error) {
      console.error(error);
      setAiDishes([]);
      setAiError(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  const displayDishes = activeCategory === SUGERIDOS ? aiDishes : filteredDishes;

  return (
    <div className="min-h-screen bg-[#111317] text-white flex flex-col font-sans pb-32 pt-20 overflow-x-hidden">
      <MenuHeader
        totalItems={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <div className="w-full h-64 relative shrink-0">
        <Image
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1600&auto=format&fit=crop"
          alt="Featured"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent opacity-80" />
      </div>

      <CategoryFilters
        categories={allCategories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="px-6 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{activeCategory}</h2>
      </div>

      <div className="px-6 space-y-4">
        {isLoading && activeCategory !== SUGERIDOS && (
          <p className="text-zinc-500 text-center py-10">Carregando menu...</p>
        )}
        {error && activeCategory !== SUGERIDOS && (
          <p className="text-red-400 text-center py-10">{error}</p>
        )}
        {isAiLoading && activeCategory === SUGERIDOS && (
          <p className="text-zinc-500 text-center py-10">A IA está pensando...</p>
        )}
        {!isAiLoading && activeCategory === SUGERIDOS && aiError && (
          <div className="text-center py-16 space-y-2">
            <p className="text-zinc-400 text-lg">Não foi possível buscar sugestões</p>
            <p className="text-zinc-600 text-sm">Tente novamente em alguns instantes</p>
          </div>
        )}
        {!isAiLoading && !aiError && activeCategory === SUGERIDOS && aiDishes.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <p className="text-zinc-400 text-lg">Nenhuma sugestão ainda</p>
            <p className="text-zinc-600 text-sm">Use o campo abaixo para pedir uma recomendação à IA</p>
          </div>
        )}
        {!isLoading && !error && !(isAiLoading && activeCategory === SUGERIDOS) && displayDishes.map((dish) => (
          <ProductCard key={dish.id} dish={dish} onClick={() => setSelectedDish(dish)} />
        ))}
      </div>

      <AISuggestionInput onSuggest={handleAISuggest} />

      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="bg-[#1c1c1e] rounded-3xl p-10 flex flex-col items-center text-center max-w-sm w-full shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Pedido enviado!</h2>
              <p className="text-zinc-400 text-sm">
                Seu pedido foi recebido e está sendo preparado.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDish && (
          <ProductDetailDrawer
            dish={selectedDish}
            onAdd={(quantity) => { addToCart(selectedDish, quantity); setSelectedDish(null); }}
            onClose={() => setSelectedDish(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            items={cart}
            onUpdateQuantity={updateCartQuantity}
            onCheckout={handleCheckout}
            onClose={() => setIsCartOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHistoryOpen && (
          <OrderHistoryDrawer onClose={() => setIsHistoryOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}