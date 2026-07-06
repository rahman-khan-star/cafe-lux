import { pgTable, text, timestamp, integer, decimal, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["customer", "admin"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending", "confirmed", "preparing", "ready", "out-for-delivery", "delivered", "cancelled",
]);
export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending", "confirmed", "seated", "completed", "cancelled",
]);
export const deliveryMethodEnum = pgEnum("delivery_method", ["delivery", "pickup"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cod", "stripe"]);
export const couponTypeEnum = pgEnum("coupon_type", ["percentage", "fixed"]);

// ── Users ──────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  phone: text("phone").default(""),
  avatar: text("avatar"),
  role: roleEnum("role").default("customer").notNull(),
  hashedPassword: text("hashed_password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Sessions (Better Auth) ─────────────────────────────
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Accounts (Better Auth OAuth) ───────────────────────
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Verification Tokens ────────────────────────────────
export const verificationTokens = pgTable("verification_tokens", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Addresses ──────────────────────────────────────────
export const addresses = pgTable("addresses", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Categories ─────────────────────────────────────────
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description").default(""),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Menu Items ─────────────────────────────────────────
export const menuItems = pgTable("menu_items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  prepTime: integer("prep_time").default(0),
  calories: integer("calories").default(0),
  ingredients: text("ingredients").array().default([]),
  image: text("image").notNull(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  featured: boolean("featured").default(false),
  badge: text("badge"),
  available: boolean("available").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Orders ─────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: orderStatusEnum("status").default("pending").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  delivery: decimal("delivery", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  deliveryMethod: deliveryMethodEnum("delivery_method").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  addressId: text("address_id").references(() => addresses.id),
  couponCode: text("coupon_code"),
  notes: text("notes"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  estimatedDelivery: timestamp("estimated_delivery"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Order Items ────────────────────────────────────────
export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: text("menu_item_id")
    .notNull()
    .references(() => menuItems.id),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  image: text("image").notNull(),
});

// ── Reservations ───────────────────────────────────────
export const reservations = pgTable("reservations", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  status: reservationStatusEnum("status").default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Coupons ────────────────────────────────────────────
export const coupons = pgTable("coupons", {
  code: text("code").primaryKey(),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull(),
  type: couponTypeEnum("type").notNull(),
  minOrder: decimal("min_order", { precision: 10, scale: 2 }).default("0"),
  active: boolean("active").default(true),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Reviews ────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  menuItemId: text("menu_item_id")
    .notNull()
    .references(() => menuItems.id),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Newsletter Subscribers ─────────────────────────────
export const subscribers = pgTable("subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
