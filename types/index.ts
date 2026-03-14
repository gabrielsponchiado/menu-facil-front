export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  recommended?: boolean;
}

export interface AISuggestion {
  category: string;
  exclusions: string[];
  preferences: string[];
  explanation: string;
}

export interface OrderItem {
  dishId: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface UserPreferences {
  name: string;
  lastOrders: string[];
  restrictions: string[];
  favoriteCategories: string[];
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}