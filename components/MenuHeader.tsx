"use client";

import { ShoppingCart, ClipboardList, LogOut } from "lucide-react";
import { Power } from "lucide-react";
import { useState } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

interface MenuHeaderProps {
  totalItems: number;
  onOpenCart: () => void;
  onOpenHistory: () => void;
}

export function MenuHeader({
  totalItems,
  onOpenCart,
  onOpenHistory,
}: MenuHeaderProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  useScrollLock(isLogoutModalOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-6 flex items-center justify-between glass-morphism bg-[#111317]/80 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center relative">
          <Power className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight leading-none flex flex-col uppercase">
          RS
          <span className="text-[10px] tracking-widest text-[#a1a1aa] font-medium leading-none mt-1">
            Solutions
          </span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenHistory}
          className="relative p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ClipboardList className="w-6 h-6 text-white" />
        </button>

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

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="relative p-2 text-red-400 transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md px-6">
          <div className="bg-[#1c1c1e] rounded-3xl p-10 flex flex-col items-center text-center max-w-sm w-full shadow-2xl border border-white/5 mx-auto">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <LogOut className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">Até logo!</h2>
            <p className="text-zinc-400 text-sm mb-8">
              Tem certeza que deseja sair da sua conta?
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors active:scale-95"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
