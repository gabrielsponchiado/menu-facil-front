"use client";

import { motion } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useEffect, useState } from "react";
import { authFetch } from "@/utils/auth";

interface Order {
  id_order: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface OrderHistoryDrawerProps {
  onClose: () => void;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderHistoryDrawer({ onClose }: OrderHistoryDrawerProps) {
  useScrollLock(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await authFetch("/api/order/history");
        if (!res.ok) throw new Error();
        const data: Order[] = await res.json();
        const validStatuses = ["pago", "paid", "confirmado", "confirmed"];
        const confirmedOrders = data.filter(order => 
          validStatuses.includes(order.status?.toLowerCase() || "")
        );
        
        setOrders(
          confirmedOrders.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          ),
        );
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

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
        className="relative w-full max-w-2xl bg-[#111317] rounded-t-[2.5rem] max-h-[90vh] flex flex-col shadow-2xl z-10 touch-none"
      >
        <div className="w-16 h-1.5 bg-zinc-800 rounded-full mx-auto mt-4 mb-6 shrink-0" />
        <div className="px-8 pb-6 border-b border-white/5">
          <h2 className="text-2xl font-bold mb-2">Meus Pedidos</h2>
          <p className="text-zinc-500 font-light">
            Histórico dos seus pedidos anteriores
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-4 no-scrollbar">
          {isLoading && (
            <p className="text-zinc-500 text-center py-10">
              Carregando pedidos...
            </p>
          )}
          {error && (
            <p className="text-red-400 text-center py-10">
              Não foi possível carregar os pedidos.
            </p>
          )}
          {!isLoading && !error && orders.length === 0 && (
            <div className="text-center py-16 space-y-2">
              <p className="text-zinc-400 text-lg">Nenhum pedido ainda</p>
              <p className="text-zinc-600 text-sm">
                Seus pedidos aparecerão aqui
              </p>
            </div>
          )}
          {orders.map((order) => (
            <div
              key={order.id_order}
              className="bg-[#1c1c1e] rounded-2xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-bold">Pedido #{order.id_order}</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-blue-400 font-bold text-lg">
                  R$ {order.total_price.toFixed(2)}
                </p>
                <div 
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    ["pago", "paid", "confirmado", "confirmed"].includes(order.status?.toLowerCase() || "")
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-zinc-800/50 text-zinc-500 border-white/5"
                  }`}
                >
                  {["pago", "paid", "confirmado", "confirmed"].includes(order.status?.toLowerCase() || "") ? "Confirmado" : "Pendente"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
