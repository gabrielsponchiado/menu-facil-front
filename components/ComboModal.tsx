"use client";

import { motion } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Sparkles } from "lucide-react";
import { Dish } from "@/types";

interface ComboItem {
  id_item: number;
  name: string;
  description: string;
  price: number;
  id_category: number;
  is_available: boolean;
}

interface ComboModalProps {
  items: ComboItem[];
  message: string;
  onAdd: (dish: Dish) => void;
  onClose: () => void;
}

const CATEGORY_IMAGE: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop",
  2: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
  3: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop",
  4: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop",
};
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop";

function nameToSlug(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function ComboModal({ items, message, onAdd, onClose }: ComboModalProps) {
  useScrollLock(true);

  if (items.length === 0) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0, bottom: 0.2 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) onClose();
        }}
        className="relative w-full max-w-2xl bg-[#111317] rounded-t-[2.5rem] shadow-2xl z-10 p-8 pb-10 touch-none"
      >
        <div className="w-16 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold">Que tal complementar?</h2>
        </div>

        <p className="text-zinc-500 text-sm mb-6">{message}</p>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id_item} className="flex items-center gap-4 bg-[#1c1c1e] rounded-2xl p-4 border border-white/5">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img
                  src={`/images/dishes/${nameToSlug(item.name)}.jpg`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = CATEGORY_IMAGE[item.id_category] ?? FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{item.name}</p>
                <p className="text-zinc-500 text-xs line-clamp-1">{item.description}</p>
                <p className="text-blue-400 font-bold text-sm mt-1">R$ {item.price?.toFixed(2)}</p>
              </div>
              <button
                onClick={() => {
                  onAdd({
                    id: String(item.id_item),
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: `/images/dishes/${nameToSlug(item.name)}.jpg`,
                    fallbackImage: CATEGORY_IMAGE[item.id_category] ?? FALLBACK_IMAGE,
                    category: "",
                  });
                  onClose();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shrink-0"
              >
                Adicionar
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
        >
          Não, obrigado
        </button>
      </motion.div>
    </div>
  );
}