export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  prepTime: number;
  calories: number;
  ingredients: string[];
  image: string;
  category: string;
  featured?: boolean;
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface CartItem {
  food: Food;
  quantity: number;
}

export interface Coupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder: number;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}
