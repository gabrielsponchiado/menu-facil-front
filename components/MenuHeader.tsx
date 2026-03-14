"use client";

import { ShoppingCart } from "lucide-react";
import { Power } from "lucide-react";

interface MenuHeaderProps {
  totalItems: number;
  onOpenCart: () => void;
}

export function MenuHeader({ totalItems, onOpenCart }: MenuHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-6 flex items-center justify-between glass-morphism bg-[#111317]/80 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center relative">
            <Power className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight leading-none flex flex-col uppercase">
            RS
            <span className="text-[10px] tracking-widest text-[#a1a1aa] font-medium leading-none mt-1">Solutions</span>
          </span>
        </div>
      </div>
      <button 
        onClick={onOpenCart}
        className="relative p-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ShoppingCart className="w-6 h-6 text-white" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-in zoom-in duration-300">
            {totalItems}
          </span>
        )}
      </button>
    </header>
  );
}
