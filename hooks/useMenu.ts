import { useState } from "react";
import { Dish } from "@/types";
import { dishes } from "@/data/mockData";

export function useMenu() {
  const [activeCategory, setActiveCategory] = useState("Bebidas");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const filteredDishes = dishes.filter(p => p.category === activeCategory);

  return {
    activeCategory,
    setActiveCategory,
    selectedDish,
    setSelectedDish,
    filteredDishes
  };
}
