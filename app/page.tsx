"use client";

import React, { useState } from "react";
import { Power } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";

export default function RegisterTabletPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!isValidEmail(email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const router = useRouter();

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length > 10) {
      return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }

    if (numbers.length > 6) {
      return numbers.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    }

    if (numbers.length > 2) {
      return numbers.replace(/^(\d{2})(\d+)/, "($1) $2");
    }

    if (numbers.length > 0) {
      return numbers.replace(/^(\d+)/, "($1");
    }

    return "";
  };

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const cleanPhone = phone.replace(/\D/g, "");

    const customer = {
      name,
      email,
      phone: cleanPhone,
    };

    localStorage.setItem("customer", JSON.stringify(customer));

    router.push("/menu");
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#111317] text-white flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden overscroll-none">
      <header className="flex items-center justify-between px-6 py-5 bg-[#111317]">
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
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
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-[600px] mx-auto">
        <form onSubmit={handleSubmit} noValidate className="w-full space-y-6">
          <div className="space-y-4 w-full">
            <div>
              <label htmlFor="name" className="sr-only">
                Nome
              </label>

              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => clearError("name")}
                placeholder="Nome"
                autoComplete="name"
                error={errors.name}
                className="w-full bg-transparent border border-[#272a30] rounded-xl px-4 py-5 text-xl text-white placeholder:text-[#6b7280] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                E-mail
              </label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => clearError("email")}
                placeholder="E-mail"
                autoComplete="email"
                error={errors.email}
                className="w-full bg-transparent border border-[#272a30] rounded-xl px-4 py-5 text-xl text-white placeholder:text-[#6b7280] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Telefone
              </label>

              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                onFocus={() => clearError("phone")}
                placeholder="Telefone"
                autoComplete="tel"
                error={errors.phone}
                className="w-full bg-transparent border border-[#272a30] rounded-xl px-4 py-5 text-xl text-white placeholder:text-[#6b7280] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium text-xl py-5 rounded-xl disabled:opacity-50 transition-opacity"
          >
            Cadastrar
          </button>
        </form>
      </main>
    </div>
  );
}
