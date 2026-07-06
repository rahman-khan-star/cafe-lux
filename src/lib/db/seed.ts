import { db, schema } from "./index";
import { foods, categories, coupons } from "../../data/foods";

async function seed() {
  console.log("Seeding database...");

  for (const cat of categories) {
    await db.insert(schema.categories).values({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      description: cat.description,
    }).onConflictDoNothing();
  }
  console.log(`Seeded ${categories.length} categories`);

  for (const food of foods) {
    await db.insert(schema.menuItems).values({
      id: food.id,
      name: food.name,
      description: food.description,
      price: String(food.price),
      originalPrice: food.originalPrice ? String(food.originalPrice) : null,
      rating: String(food.rating),
      reviewCount: food.reviewCount,
      prepTime: food.prepTime,
      calories: food.calories,
      ingredients: food.ingredients,
      image: food.image,
      categoryId: food.category,
      featured: food.featured || false,
      badge: food.badge || null,
    }).onConflictDoNothing();
  }
  console.log(`Seeded ${foods.length} menu items`);

  for (const coupon of coupons) {
    await db.insert(schema.coupons).values({
      code: coupon.code,
      discount: String(coupon.discount),
      type: coupon.type,
      minOrder: String(coupon.minOrder),
    }).onConflictDoNothing();
  }
  console.log(`Seeded ${coupons.length} coupons`);

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
