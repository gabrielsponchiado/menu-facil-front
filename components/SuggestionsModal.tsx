"use client";

import { motion } from "framer-motion";
import { Cloud, User, Bot } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

interface SuggestionsModalProps {
  onClose: () => void;
  onWeather: () => void;
  onProfile: () => void;
  onAI: () => void;
  isLoadingWeather: boolean;
  isLoadingProfile: boolean;
}

export function SuggestionsModal({
  onClose,
  onWeather,
  onProfile,
  onAI,
  isLoadingWeather,
  isLoadingProfile,
}: SuggestionsModalProps) {
  useScrollLock(true);

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
        <div className="w-16 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />

        <h2 className="text-2xl font-bold mb-6">Sugestões</h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={onWeather}
            disabled={isLoadingWeather}
            className="flex items-center gap-4 bg-[#1c1c1e] rounded-2xl p-4 active:scale-[0.98] transition-all disabled:opacity-50 border border-white/5"
          >
            <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
              {isLoadingWeather ? (
                <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Cloud className="w-6 h-6 text-sky-400" />
              )}
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Pelo clima</p>
              <p className="text-zinc-500 text-sm">Baseado no tempo agora</p>
            </div>
          </button>

          <button
            onClick={onProfile}
            disabled={isLoadingProfile}
            className="flex items-center gap-4 bg-[#1c1c1e] rounded-2xl p-4 active:scale-[0.98] transition-all disabled:opacity-50 border border-white/5"
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
              {isLoadingProfile ? (
                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <User className="w-6 h-6 text-purple-400" />
              )}
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Para mim</p>
              <p className="text-zinc-500 text-sm">Baseado no seu histórico</p>
            </div>
          </button>

          <button
            onClick={onAI}
            className="flex items-center gap-4 bg-[#1c1c1e] rounded-2xl p-4 active:scale-[0.98] transition-all border border-white/5"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Perguntar à IA</p>
              <p className="text-zinc-500 text-sm">Digite o que você quer</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}