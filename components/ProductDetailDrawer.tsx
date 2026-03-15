"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Dish } from "@/types";
import { useScrollLock } from "@/hooks/useScrollLock";

interface ProductDetailDrawerProps {
  dish: Dish;
  onAdd: (quantity: number) => void;
  onClose: () => void;
}

export function ProductDetailDrawer({ dish, onAdd, onClose }: ProductDetailDrawerProps) {
  useScrollLock(true);
  const [quantity, setQuantity] = useState(1);

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
        className="relative w-full max-w-xl bg-[#111317] rounded-t-4xl border-t border-white/5 flex flex-col max-h-[85vh] shadow-2xl z-10 touch-none"
      >
        <div 
          className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mt-3 mb-4 shrink-0"
        />
        
        <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
          <div className="w-full h-52 relative rounded-2xl overflow-hidden mb-5 shadow-lg">
            <Image src={dish.image} alt={dish.name} fill className="object-cover" />
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold uppercase tracking-tight leading-tight flex-1 mr-4">{dish.name}</h2>
            <div className="flex items-center gap-3 border border-white/10 bg-white/5 rounded-xl px-3 py-1.5 shrink-0">
               <button 
                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
                 className="p-1 hover:bg-white/5 rounded-lg transition-colors"
               >
                 <Minus className="w-4 h-4 text-zinc-500" />
               </button>
               <span className="text-lg font-bold w-5 text-center">{quantity}</span>
               <button 
                 onClick={() => setQuantity(quantity + 1)}
                 className="p-1 hover:bg-white/5 rounded-lg transition-colors"
               >
                 <Plus className="w-4 h-4 text-white" />
               </button>
            </div>
          </div>

          <p className="text-zinc-500 text-sm font-light leading-relaxed mb-6">
            {dish.description}
          </p>
        </div>

        <div className="p-6 pt-4 bg-linear-to-t from-[#111317] via-[#111317] to-transparent absolute bottom-0 left-0 right-0">
          <button 
            onClick={() => onAdd(quantity)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold py-4 rounded-xl active:scale-[0.98] transition-all shadow-lg"
          >
            Adicionar (R$ {(dish.price * quantity).toFixed(2)})
          </button>
        </div>
      </motion.div>
    </div>
  );
}
