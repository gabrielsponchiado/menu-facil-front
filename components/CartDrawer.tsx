"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Dish } from "@/types";
import { motion } from "framer-motion";

interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CartDrawerProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
  onClose: () => void;
}

export function CartDrawer({
  items,
  onUpdateQuantity,
  onCheckout,
  onClose,
}: CartDrawerProps) {
  const total = items.reduce(
    (acc, item) => acc + item.dish.price * item.quantity,
    0,
  );

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
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
          }
        }}
        className="relative w-full max-w-2xl bg-[#111317] rounded-t-[2.5rem] max-h-[90vh] flex flex-col shadow-2xl z-10 touch-none"
      >
        <div
          className="w-16 h-1.5 bg-zinc-800 rounded-full mx-auto mt-4 mb-6 shrink-0"
        />

        <div className="px-8 pb-6 border-b border-white/5">
          <h2 className="text-2xl font-bold mb-2">Carrinho</h2>
          <p className="text-zinc-500 font-light">
            Confira seus itens selecionados
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 no-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-20 text-zinc-600">
              Seu carrinho está vazio.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.dish.id} className="flex gap-4 items-center">
                <div className="w-24 h-24 relative rounded-2xl overflow-hidden shrink-0">
                  <Image
                    src={item.dish.image}
                    alt={item.dish.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg uppercase leading-tight">
                    {item.dish.name}
                  </h3>
                  <p className="text-blue-500 font-bold text-lg">
                    R$ {item.dish.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-4 border border-zinc-800 rounded-xl px-3 py-2">
                  <button onClick={() => onUpdateQuantity(item.dish.id, -1)}>
                    <Minus className="w-4 h-4 text-zinc-600" />
                  </button>
                  <span className="font-bold text-sm w-3 text-center">
                    {item.quantity}
                  </span>
                  <button onClick={() => onUpdateQuantity(item.dish.id, 1)}>
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 border-t border-white/5">
          <button
            onClick={onCheckout}
            className="w-full bg-blue-600 text-white text-xl font-bold py-5 rounded-2xl active:opacity-90 disabled:opacity-50 transition-opacity"
            disabled={items.length === 0}
          >
            Finalizar pedido (R$ {total.toFixed(2)})
          </button>
        </div>
      </motion.div>
    </div>
  );
}
