"use client";

import { motion } from "framer-motion";
import { Power } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#111317] flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-8"
      >
        {/* Logo animado */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center space-x-3"
        >
          <div className="w-14 h-14 border-2 border-white rounded-full flex items-center justify-center">
            <Power className="w-7 h-7 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight leading-none flex flex-col uppercase">
            RS
            <span className="text-[10px] tracking-widest text-[#a1a1aa] font-medium leading-none mt-1">
              Solutions
            </span>
          </span>
        </motion.div>

        {/* Spinner */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-500"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>

        <p className="text-zinc-500 text-sm">Carregando cardápio...</p>
      </motion.div>
    </div>
  );
}