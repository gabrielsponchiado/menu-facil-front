"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Dish } from "@/types";

interface ProductDetailDrawerProps {
  dish: Dish;
  onAdd: (quantity: number) => void;
  onClose: () => void;
}

export function ProductDetailDrawer({ dish, onAdd, onClose }: ProductDetailDrawerProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#111317] rounded-t-[2.5rem] flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300">
        <button 
          onClick={onClose}
          className="w-16 h-1.5 bg-zinc-800 rounded-full mx-auto mt-4 mb-6 shrink-0 cursor-pointer hover:bg-zinc-700 transition-colors"
        />
        
        <div className="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar">
          <div className="w-full h-80 relative rounded-3xl overflow-hidden mb-8">
            <Image src={dish.image} alt={dish.name} fill className="object-cover" />
          </div>

          <div className="flex justify-between items-start mb-4">
            <h2 className="text-4xl font-bold uppercase tracking-tighter leading-none">{dish.name}</h2>
            <div className="flex items-center gap-4 border border-zinc-800 rounded-2xl px-4 py-2">
               <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                 <Minus className="w-5 h-5 text-zinc-600" />
               </button>
               <span className="text-2xl font-bold w-6 text-center">{quantity}</span>
               <button onClick={() => setQuantity(quantity + 1)}>
                 <Plus className="w-5 h-5 text-white" />
               </button>
            </div>
          </div>

          <p className="text-zinc-500 text-lg font-light leading-relaxed mb-8">
            {dish.description}
          </p>
        </div>

        <div className="p-8 pb-10 bg-gradient-to-t from-[#111317] via-[#111317] to-transparent absolute bottom-0 left-0 right-0">
          <button 
            onClick={() => onAdd(quantity)}
            className="w-full bg-blue-600 text-white text-xl font-bold py-5 rounded-2xl active:scale-[0.98] transition-all"
          >
            Adicionar (R$ {(dish.price * quantity).toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
}
