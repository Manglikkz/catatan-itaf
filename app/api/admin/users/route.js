import { db } from "@/lib/db";
import { users, catatan } from "@/lib/schema";
import { eq, sql, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await db
      .select({
        id: users.id,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    // Get catatan count for each user
    const resultsWithCount = await Promise.all(
      results.map(async (user) => {
        const [count] = await db
          .select({ count: sql`count(*)` })
          .from(catatan)
          .where(eq(catatan.userId, user.id));

        return {
          ...user,
          _count: {
            catatan: Number(count.count),
          },
        };
      })
    );

    return NextResponse.json({ data: resultsWithCount });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
