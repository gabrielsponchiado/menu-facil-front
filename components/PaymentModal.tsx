"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { authFetch } from "@/utils/auth";
import { toast } from "sonner";
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
      toast.error("Erro ao confirmar pagamento. Tente novamente.");
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
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-[#18181b] border border-white/5 rounded-4xl p-8 flex flex-col items-center text-center max-w-sm w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-blue-500/5 to-transparent pointer-events-none" />
        
        {isPaid ? (
          <>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6 relative"
            >
              <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping opacity-20" />
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
            <h2 className="text-2xl text-white font-semibold tracking-tight mb-2">Pagamento confirmado!</h2>
            <p className="text-zinc-400 text-sm">Seu pedido está sendo preparado.</p>
          </>
        ) : (
          <div className="w-full flex flex-col items-center relative z-10">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Pix</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Escaneie o QR code pelo app do seu banco
            </p>

            <div className="mb-8 flex justify-center w-full">
              <p className="text-blue-400 font-bold text-4xl tracking-tight">
                R$ {totalPrice.toFixed(2)}
              </p>
            </div>

            <div className="relative w-56 h-56 bg-white p-3 rounded-3xl mb-8 flex items-center justify-center">
              <img
                src={qrPath.startsWith("http") ? qrPath : `/api/proxy?path=${encodeURIComponent(qrPath.startsWith("/") ? qrPath.slice(1) : qrPath)}`}
                alt="QR Code Pix"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-center gap-2 mb-8 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/10">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-blue-400 text-xs font-semibold">
                Aguardando pagamento...
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
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
              className="mt-3 py-3 w-full rounded-xl text-zinc-500 font-medium text-sm hover:text-zinc-300 hover:bg-white/5 transition-colors"
            >
              Cancelar pedido
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}