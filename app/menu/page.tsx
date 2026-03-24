"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { MenuHeader } from "@/components/MenuHeader";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailDrawer } from "@/components/ProductDetailDrawer";
import { CartDrawer } from "@/components/CartDrawer";
import { OrderHistoryDrawer } from "@/components/OrderHistoryDrawer";
import { AISuggestionInput } from "@/components/AISuggestionInput";
import { SuggestionsModal } from "@/components/SuggestionsModal";
import { PaymentModal } from "@/components/PaymentModal";
import { ComboModal } from "@/components/ComboModal";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AnimatePresence, motion } from "framer-motion";

import { useCart } from "@/hooks/useCart";
import { useMenu } from "@/hooks/useMenu";
import { authFetch, getAuthHeader } from "@/utils/auth";
import { Dish } from "@/types";

interface AIRecommendation {
  name: string;
  description: string;
  price: number;
  id_item: number;
  id_category: number;
}

const SUGERIDOS = "Sugeridos";

const CATEGORY_IMAGE: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop",
  2: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
  3: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop",
  4: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop",
};
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop";

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function mapRecommendationToDish(r: AIRecommendation): Dish {
  return {
    id: String(r.id_item),
    name: r.name,
    description: r.description,
    price: r.price,
    image: `/images/dishes/${nameToSlug(r.name)}.jpg`,
    fallbackImage: CATEGORY_IMAGE[r.id_category] ?? FALLBACK_IMAGE,
    category: SUGERIDOS,
  };
}

export default function MenuPage() {
  const router = useRouter();
  const [aiDishes, setAiDishes] = useState<Dish[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isAIInputOpen, setIsAIInputOpen] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    orderId: number;
    qrPath: string;
    totalPrice: number;
  } | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [aiInputFocus, setAiInputFocus] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [comboData, setComboData] = useState<{
    items: any[];
    message: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");
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

  const fetchCombo = async (dishName: string) => {
    try {
      const res = await authFetch(`/api/combo/${encodeURIComponent(dishName)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.items && data.items.length > 0) return data;
      return null;
    } catch {
      return null;
    }
  };

  const checkComboBeforeCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      // pega o item de maior valor do carrinho para sugerir combo com base nele
      const mainItem = cart.reduce((prev, current) => 
        (prev.dish.price > current.dish.price) ? prev : current
      );
      
      const combo = await fetchCombo(mainItem.dish.name);
      if (combo) {
        setComboData(combo);
        setIsCheckingOut(false);
      } else {
        await handleCheckout();
      }
    } catch {
      await handleCheckout();
    }
  };

  const handleCheckout = async (extraDish?: Dish) => {
    setIsCheckingOut(true);
    try {
      setComboData(null);
      let totalPrice = cart.reduce(
        (acc, item) => acc + item.dish.price * item.quantity,
        0,
      );

      if (extraDish) {
        totalPrice += extraDish.price;
        addToCart(extraDish, 1);
      }

      const response = await authFetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ total_price: totalPrice }),
      });
      
      if (!response.ok) throw new Error("Erro ao realizar pedido");
      
      const orderData = await response.json();
      setIsCartOpen(false);
      
      setPaymentData({
        orderId: orderData.order.id_order,
        qrPath: orderData.qr_path,
        totalPrice: totalPrice,
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Sugestão por texto (IA)
  const handleAISuggest = async (text: string) => {
    try {
      setIsAiLoading(true);
      setAiError(false);
      setAiDishes([]);
      setActiveCategory(SUGERIDOS);
      setIsAIInputOpen(false);

      const res = await fetch(
        `/api/ai/suggest?user_text=${encodeURIComponent(text)}`,
        { headers: getAuthHeader() },
      );
      if (!res.ok) {
        setAiError(true);
        return;
      }

      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      const recommendations: AIRecommendation[] = parsed.recommendations ?? [];
      setAiDishes(recommendations.map(mapRecommendationToDish));
    } catch (error) {
      console.error(error);
      setAiError(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Sugestão por preferência do perfil
  const handleProfileSuggest = async () => {
    try {
      setIsLoadingProfile(true);
      setAiError(false);
      setAiDishes([]);
      setActiveCategory(SUGERIDOS);
      setIsSuggestionsOpen(false);
      setAiInputFocus(false);

      const res = await authFetch("/api/suggest");
      if (!res.ok) {
        setAiError(true);
        return;
      }

      const data: AIRecommendation[] = await res.json();
      setAiDishes(data.map(mapRecommendationToDish));
    } catch (error) {
      console.error(error);
      setAiError(true);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Sugestão por clima
  const handleWeatherSuggest = async () => {
    try {
      setIsLoadingWeather(true);
      setAiError(false);
      setAiDishes([]);
      setActiveCategory(SUGERIDOS);
      setIsSuggestionsOpen(false);
      setAiInputFocus(false);

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject),
      );

      const res = await fetch("/api/weather-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      });
      if (!res.ok) {
        setAiError(true);
        return;
      }

      const data = await res.json();
      const dishes: AIRecommendation[] = data.dishes ?? [];
      setAiDishes(dishes.map(mapRecommendationToDish));
    } catch (error) {
      console.error(error);
      setAiError(true);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const displayDishes =
    activeCategory === SUGERIDOS ? aiDishes : filteredDishes;

  if (isLoading && categories.length === 0) {
    return <LoadingScreen />;
  }

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
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          setIsAIInputOpen(false);
        }}
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
          <p className="text-zinc-500 text-center py-10">
            Buscando sugestões...
          </p>
        )}
        {!isAiLoading && activeCategory === SUGERIDOS && aiError && (
          <div className="text-center py-16 space-y-2">
            <p className="text-zinc-400 text-lg">
              Não foi possível buscar sugestões
            </p>
            <p className="text-zinc-600 text-sm">
              Tente novamente em alguns instantes
            </p>
          </div>
        )}
        {!isAiLoading &&
          !aiError &&
          activeCategory === SUGERIDOS &&
          aiDishes.length === 0 && (
            <div className="text-center py-16 space-y-2">
              <p className="text-zinc-400 text-lg">Nenhuma sugestão ainda</p>
              <p className="text-zinc-600 text-sm">
                Toque em ✨ para receber sugestões personalizadas
              </p>
            </div>
          )}
        {!isLoading &&
          !error &&
          !(isAiLoading && activeCategory === SUGERIDOS) &&
          displayDishes.map((dish) => (
            <ProductCard
              key={dish.id}
              dish={dish}
              onClick={() => setSelectedDish(dish)}
            />
          ))}
      </div>

      {/* Bottom bar — input IA na aba Sugeridos, botão nas outras */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#111317] via-[#111317]/90 to-transparent z-10">
        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {activeCategory === SUGERIDOS ? (
              /* Aba Sugeridos — mostra input da IA */
              <motion.div
                key="ai-input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <AISuggestionInput
                  onSuggest={handleAISuggest}
                />
              </motion.div>
            ) : (
              /* Outras abas — mostra botão de sugestões */
              <motion.button
                key="suggest-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => setIsSuggestionsOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                <Sparkles className="w-5 h-5" />
                Sugestões para mim
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de sugestões */}
      <AnimatePresence>
        {isSuggestionsOpen && (
          <SuggestionsModal
            onClose={() => setIsSuggestionsOpen(false)}
            onWeather={handleWeatherSuggest}
            onProfile={handleProfileSuggest}
            onAI={() => {
              setIsSuggestionsOpen(false);
              setActiveCategory(SUGERIDOS);
              setAiInputFocus(true);
            }}
            isLoadingWeather={isLoadingWeather}
            isLoadingProfile={isLoadingProfile}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
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
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            items={cart}
            onUpdateQuantity={updateCartQuantity}
            onCheckout={checkComboBeforeCheckout}
            onClose={() => setIsCartOpen(false)}
            isCheckoutDisabled={!!paymentData}
            isCheckingOut={isCheckingOut}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHistoryOpen && (
          <OrderHistoryDrawer onClose={() => setIsHistoryOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {comboData && (
          <ComboModal
            items={comboData.items}
            message={comboData.message}
            onAdd={(dish) => handleCheckout(dish)}
            onClose={() => handleCheckout()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {paymentData && (
          <PaymentModal
            orderId={paymentData.orderId}
            qrPath={paymentData.qrPath}
            totalPrice={paymentData.totalPrice}
            onClose={() => setPaymentData(null)}
            onConfirmed={() => clearCart()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
