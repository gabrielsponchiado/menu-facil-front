"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { authFetch } from "@/utils/auth";
import { useScrollLock } from "@/hooks/useScrollLock";

interface PaymentModalProps {
  orderId: number;
  qrPath: string;
  totalPrice: number;
  onClose: () => void;
  onConfirmed: () => void;
}

export function PaymentModal({ orderId, qrPath, totalPrice, onClose, onConfirmed }: PaymentModalProps) {
  useScrollLock(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      const res = await authFetch(`/api/order/${orderId}/confirm`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      setIsPaid(true);
      onConfirmed();
      setTimeout(() => onClose(), 2500);
    } catch {
      alert("Erro ao confirmar pagamento. Tente novamente.");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="bg-[#1c1c1e] rounded-3xl p-8 flex flex-col items-center text-center max-w-sm w-full shadow-2xl"
      >
        {isPaid ? (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pagamento confirmado!</h2>
            <p className="text-zinc-400 text-sm">Seu pedido está sendo preparado.</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-1">Pague com Pix</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Escaneie o QR code abaixo
            </p>

            <p className="text-blue-400 font-bold text-2xl mb-5">
              R$ {totalPrice.toFixed(2)}
            </p>

            <div className="w-52 h-52 rounded-2xl overflow-hidden bg-white p-2 mb-6 flex items-center justify-center">
              <img
                src={qrPath.startsWith("http") ? qrPath : `/api/proxy?path=${encodeURIComponent(qrPath.startsWith("/") ? qrPath.slice(1) : qrPath)}`}
                alt="QR Code Pix"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-zinc-500 text-xs mb-6">
              Pedido #{orderId} — Após pagar, clique no botão abaixo
            </p>

            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Confirmando...
                </>
              ) : (
                "Já paguei"
              )}
            </button>

            <button
              onClick={onClose}
              className="mt-3 text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
            >
              Cancelar pedido
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}