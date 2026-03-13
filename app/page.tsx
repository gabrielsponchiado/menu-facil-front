"use client";

import React, { useState } from "react";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterTabletPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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

    if (!name.trim() || !email.trim() || !phone.trim()) return;

    if (!isValidEmail(email)) {
      alert("Digite um e-mail válido.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    const customer = {
      name,
      email,
      phone: cleanPhone,
    };

    localStorage.setItem("customer", JSON.stringify(customer));

    router.push("/menu");
  };

  return (
    <div className="h-screen bg-[#111317] text-white flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden">
      <header className="flex items-center justify-between px-6 py-5 bg-[#111317]">
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 border-[2px] border-white rounded-full flex items-center justify-center relative">
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
        <form onSubmit={handleSubmit} className="w-full space-y-6">

          <div className="space-y-4 w-full">

            <div>
              <label htmlFor="name" className="sr-only">
                Nome
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
                autoComplete="name"
                required
                className="w-full bg-transparent border border-[#272a30] rounded-xl px-4 py-5 text-xl text-white placeholder:text-[#6b7280] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                autoComplete="email"
                required
                className="w-full bg-transparent border border-[#272a30] rounded-xl px-4 py-5 text-xl text-white placeholder:text-[#6b7280] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Telefone
              </label>

              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="Telefone"
                autoComplete="tel"
                required
                className="w-full bg-transparent border border-[#272a30] rounded-xl px-4 py-5 text-xl text-white placeholder:text-[#6b7280] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={!name.trim() || !email.trim() || !phone.trim()}
            className="w-full bg-blue-500 text-white font-medium text-xl py-5 rounded-xl disabled:opacity-50 transition-opacity"
          >
            Cadastrar
          </button>

        </form>
      </main>
    </div>
  );
}