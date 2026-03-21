"use client";

import { useState, useEffect } from "react";
import { Dish } from "@/types";
import { authFetch } from "@/utils/auth";

interface MenuItemAPI {
  id_item: number;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  profit_margin: number | null;
  id_category: number | null;
  is_available: boolean;
  created_at: string;
}

const CATEGORY_MAP: Record<number, string> = {
  1: "Massas",
  2: "Lanches",
  3: "Bebidas",
  4: "Sobremesas",
};

const CATEGORY_IMAGE: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop",
  2: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
  3: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800&auto=format&fit=crop",
  4: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop";

// Converte nome do prato para slug
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Tenta usar imagem local, senão usa fallback da categoria
function getImage(name: string, id_category: number | null): string {
  const slug = nameToSlug(name);
  // Fallback para imagens não encontradas tratadas pelo onError no componente
  return `/images/dishes/${slug}.jpg`;
}

function mapAPIToDish(item: MenuItemAPI): Dish {
  const category = item.id_category
    ? (CATEGORY_MAP[item.id_category] ?? "Outros")
    : "Outros";

  return {
    id: String(item.id_item),
    name: item.name,
    description: item.description ?? "",
    price: item.price,
    image: getImage(item.name, item.id_category),
    category,
    fallbackImage: item.id_category
      ? (CATEGORY_IMAGE[item.id_category] ?? FALLBACK_IMAGE)
      : FALLBACK_IMAGE,
  } as Dish & { fallbackImage: string };
}

export function useMenu(
  activeCategory: string,
  setActiveCategory: (cat: string) => void,
) {
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setIsLoading(true);
        const res = await authFetch("/api/menu");
        if (!res.ok) throw new Error("Erro ao buscar menu");

        const data: MenuItemAPI[] = await res.json();
        const available = data.filter((item) => item.is_available);
        const mapped = available.map(mapAPIToDish);

        const uniqueCategories = Array.from(
          new Set(mapped.map((d) => d.category)),
        );
        setAllDishes(mapped);
        setCategories(uniqueCategories);

        if (uniqueCategories.length > 0 && !activeCategory) {
          setActiveCategory(uniqueCategories[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o menu.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const filteredDishes = allDishes.filter((d) => d.category === activeCategory);

  return {
    selectedDish,
    setSelectedDish,
    filteredDishes,
    categories,
    isLoading,
    error,
  };
}
