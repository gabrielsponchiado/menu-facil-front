"use client";

import React, { useState } from "react";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!email.trim()) newErrors.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "E-mail inválido";
    if (!password.trim()) newErrors.password = "Senha é obrigatória";
    else if (password.length < 6) newErrors.password = "Mínimo de 6 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar.");
      const data = await res.json();
      const token = data.access_token ?? data;
      localStorage.setItem("token", token);
      router.push("/menu");
    } catch (error) {
      alert("Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field: string) => {
    if (errors[field])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
  };

  return (
    <div className="min-h-svh bg-[#111317] text-white flex flex-col font-sans selection:bg-blue-500/30">
      <header className="flex items-center px-6 py-5">
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

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-[600px] mx-auto py-10">
        <div className="w-full mb-8">
          <h1 className="text-3xl font-bold">Criar conta</h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              placeholder=" "
              autoComplete="name"
              className="peer w-full bg-transparent border border-[#272a30] rounded-xl px-4 pt-6 pb-2 text-base text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors"
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-3 text-[#6b7280] text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Nome
            </label>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1 px-1">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              placeholder=" "
              autoComplete="email"
              className="peer w-full bg-transparent border border-[#272a30] rounded-xl px-4 pt-6 pb-2 text-base text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-3 text-[#6b7280] text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              E-mail
            </label>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 px-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
              }}
              placeholder=" "
              autoComplete="new-password"
              className="peer w-full bg-transparent border border-[#272a30] rounded-xl px-4 pt-6 pb-2 text-base text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-3 text-[#6b7280] text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
            >
              Senha
            </label>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 px-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-medium text-xl py-5 rounded-xl disabled:opacity-50 transition-opacity mt-2"
          >
            {isLoading ? "Aguarde..." : "Cadastrar"}
          </button>

          <p className="text-zinc-500 text-sm text-center">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-blue-400 hover:underline"
            >
              Entrar
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}
