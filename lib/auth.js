import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "catatan-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  // 1. Await cookies() to get the actual cookie store
  const cookieStore = await cookies();

  // 2. Pass the resolved cookieStore to getIronSession
  const session = await getIronSession(cookieStore, sessionOptions);
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.user) return null;

  // Fetch fresh user data
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return user[0] || null;
}

export async function login(name, password) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.name, name))
    .limit(1);

  if (!user[0]) {
    return { error: "Nama tidak ditemukan" };
  }

  const isValid = await bcrypt.compare(password, user[0].password);
  if (!isValid) {
    return { error: "Password salah" };
  }

  const session = await getSession();
  session.user = {
    id: user[0].id,
    name: user[0].name,
    role: user[0].role,
  };
  await session.save();

  return { success: true, user: session.user };
}

export async function register(name, password) {
  // Check if name exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.name, name))
    .limit(1);

  if (existing[0]) {
    return { error: "Nama sudah digunakan" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await db
    .insert(users)
    .values({
      name,
      password: hashedPassword,
      role: "murid",
    })
    .returning({
      id: users.id,
      name: users.name,
      role: users.role,
    });

  // Auto login after register
  const session = await getSession();
  session.user = {
    id: newUser[0].id,
    name: newUser[0].name,
    role: newUser[0].role,
  };
  await session.save();

  return { success: true, user: session.user };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}
