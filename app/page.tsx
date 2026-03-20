"use client";

import React, { useState } from "react";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormErrors } from "@/types";

export default function RegisterTabletPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!isValidEmail(email)) {
      newErrors.email = "E-mail inválido";
    }
    if (!phone.trim()) newErrors.phone = "Telefone é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length > 10)
      return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    if (numbers.length > 6)
      return numbers.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    if (numbers.length > 2) return numbers.replace(/^(\d{2})(\d+)/, "($1) $2");
    if (numbers.length > 0) return numbers.replace(/^(\d+)/, "($1");
    return "";
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const cleanPhone = phone.replace(/\D/g, "");

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: cleanPhone }),
      });

      if (!res.ok) {
        const loginRes = await fetch(
          `/api/user/login?email=${encodeURIComponent(email)}`
        );
        if (!loginRes.ok) throw new Error("Não foi possível autenticar o usuário.");
        const loginData = await loginRes.json();
        localStorage.setItem("customer", JSON.stringify(loginData));
        router.push("/menu");
        return;
      }

      const data = await res.json();
      localStorage.setItem("customer", JSON.stringify(data));
      router.push("/menu");
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      alert("Erro ao cadastrar. Tente novamente.");
    }
  };

  const clearError = (field: keyof FormErrors) => {
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
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
            <Power className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight leading-none flex flex-col uppercase">
            RS
            <span className="text-[10px] tracking-widest text-[#a1a1aa] font-medium leading-none mt-1">
              Solutions
            </span>
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-[600px] mx-auto">
        <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">

          {/* Nome */}
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError("name"); }}
              placeholder=" "
              autoComplete="name"
              className="peer w-full bg-transparent border border-[#272a30] rounded-xl px-4 pt-6 pb-2 text-xl text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors"
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-4 text-[#6b7280] text-base transition-all duration-200
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#6b7280]
                peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-400
                peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#6b7280]"
            >
              Nome
            </label>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 px-1">{errors.name}</p>
            )}
          </div>

          {/* E-mail */}
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
              placeholder=" "
              autoComplete="email"
              className="peer w-full bg-transparent border border-[#272a30] rounded-xl px-4 pt-6 pb-2 text-xl text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-4 text-[#6b7280] text-base transition-all duration-200
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#6b7280]
                peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-400
                peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#6b7280]"
            >
              E-mail
            </label>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 px-1">{errors.email}</p>
            )}
          </div>

          {/* Telefone */}
          <div className="relative">
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={phone}
              onChange={(e) => { setPhone(formatPhone(e.target.value)); clearError("phone"); }}
              placeholder=" "
              autoComplete="tel"
              className="peer w-full bg-transparent border border-[#272a30] rounded-xl px-4 pt-6 pb-2 text-xl text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors"
            />
            <label
              htmlFor="phone"
              className="absolute left-4 top-4 text-[#6b7280] text-base transition-all duration-200
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#6b7280]
                peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-400
                peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[#6b7280]"
            >
              Telefone
            </label>
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1 px-1">{errors.phone}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium text-xl py-5 rounded-xl disabled:opacity-50 transition-opacity mt-2"
          >
            Entrar
          </button>
        </form>
      </main>
    </div>
  );
}