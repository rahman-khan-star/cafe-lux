import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().url("Valid image URL is required"),
  prepTime: z.number().int().min(0).default(0),
  calories: z.number().int().min(0).default(0),
  ingredients: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5).default(0),
  featured: z.boolean().default(false),
  badge: z.string().optional(),
  available: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
  description: z.string().default(""),
  sortOrder: z.number().int().default(0),
});

export const orderSchema = z.object({
  items: z.array(z.object({
    menuItemId: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().positive(),
    image: z.string(),
  })).min(1, "At least one item is required"),
  subtotal: z.number().positive(),
  discount: z.number().min(0).default(0),
  delivery: z.number().min(0).default(0),
  tax: z.number().min(0),
  total: z.number().positive(),
  deliveryMethod: z.enum(["delivery", "pickup"]),
  paymentMethod: z.enum(["cod", "stripe"]),
  addressId: z.string().optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const reservationSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().min(1, "Phone is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  guests: z.number().int().min(1, "At least 1 guest").max(20, "Max 20 guests"),
  notes: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(1, "Code is required").toUpperCase(),
  discount: z.number().positive("Discount must be positive"),
  type: z.enum(["percentage", "fixed"]),
  minOrder: z.number().min(0).default(0),
  active: z.boolean().default(true),
  usageLimit: z.number().int().positive().optional(),
  expiresAt: z.string().optional(),
});

export const reviewSchema = z.object({
  menuItemId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3, "Comment must be at least 3 characters"),
});

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP is required"),
  isDefault: z.boolean().default(false),
});
