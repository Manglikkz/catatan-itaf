import {
  pgTable,
  text,
  timestamp,
  integer,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";

// Daftar mata pelajaran
export const MAPEL_LIST = [
  "B. Arab",
  "Nahwu",
  "Shorof",
  "Tahfidz",
  "Aqidah",
  "Fiqih",
  "Hadits",
  "Adab & Akhlaq",
  "B. Inggris",
  "MTK",
  "Bootcamp",
];

// Table Users
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).default("murid").notNull(), // 'admin' atau 'murid'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table Catatan
export const catatan = pgTable("catatan", {
  id: uuid("id").defaultRandom().primaryKey(),
  judul: varchar("judul", { length: 255 }).notNull(),
  deskripsi: text("deskripsi"), // NEW - nullable, opsional
  mapel: varchar("mapel", { length: 50 }).notNull(),
  fotoUrl: text("foto_url").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table Likes (visitor bisa like/dislike tanpa login)
export const likes = pgTable("likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  catatanId: uuid("catatan_id")
    .references(() => catatan.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 10 }).notNull(), // 'like' atau 'dislike'
  visitorId: varchar("visitor_id", { length: 100 }).notNull(), // dari localStorage
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table Comments
export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  catatanId: uuid("catatan_id")
    .references(() => catatan.id, { onDelete: "cascade" })
    .notNull(),
  nama: varchar("nama", { length: 100 }).default("Anonymous").notNull(),
  isi: text("isi").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }), // nullable, null = anonymous
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
