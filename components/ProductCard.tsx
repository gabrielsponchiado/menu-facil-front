"use client";

import Image from "next/image";
import { Dish } from "@/types";

interface ProductCardProps {
  dish: Dish;
  onClick: () => void;
}

export function ProductCard({ dish, onClick }: ProductCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#1c1c1e] rounded-3xl p-4 flex gap-4 cursor-pointer active:scale-95 transition-all"
    >
      <div className="flex-1">
        <h3 className="text-xl font-bold uppercase leading-tight mb-1">{dish.name}</h3>
        <p className="text-zinc-500 text-sm font-light line-clamp-2 mb-3">
          {dish.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-blue-500 font-bold text-lg">R$ {dish.price.toFixed(2)}</span>
        </div>
      </div>
      <div className="w-36 h-36 relative rounded-2xl overflow-hidden shadow-xl shrink-0">
        <Image src={dish.image} alt={dish.name} fill className="object-cover" />
      </div>
    </div>
  );
}
