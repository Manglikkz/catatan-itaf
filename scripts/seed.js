import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../lib/schema.js";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function seed() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await db.insert(users).values({
    name: "Admin",
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin created: Admin / admin123");
}

seed().catch(console.error);
