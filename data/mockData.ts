import { Dish } from "@/types";

export const dishes: Dish[] = [
  {
    id: "1",
    name: "Coca-Cola",
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 8.00,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop",
    category: "Bebidas"
  },
  {
    id: "2",
    name: "Suco de Laranja",
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1607690506833-498e04ab3ffa?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Bebidas"
  }
];

export const categories = ["Bebidas", "Pratos", "Outros", "Sugeridos"];
