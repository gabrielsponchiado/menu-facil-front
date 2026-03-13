import { Dish } from "@/types";

export const dishes: Dish[] = [
  {
    id: "6",
    name: "Coca-Cola Original",
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 8.00,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop",
    category: "Bebidas"
  },
  {
    id: "7",
    name: "Suco de Laranja",
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=800&auto=format&fit=crop",
    category: "Bebidas"
  }
];

export const categories = ["Bebidas", "Pratos", "Outros", "Sugeridos"];
