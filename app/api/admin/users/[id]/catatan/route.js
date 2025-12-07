import { db } from "@/lib/db";
import { catatan, users, likes, comments } from "@/lib/schema";
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
        id: catatan.id,
        judul: catatan.judul,
        mapel: catatan.mapel,
        fotoUrl: catatan.fotoUrl,
        createdAt: catatan.createdAt,
        user: {
          id: users.id,
          name: users.name,
        },
      })
      .from(catatan)
      .leftJoin(users, eq(catatan.userId, users.id))
      .orderBy(desc(catatan.createdAt));

    // Get counts
    const resultsWithCounts = await Promise.all(
      results.map(async (item) => {
        const [likeCount] = await db
          .select({ count: sql`count(*)` })
          .from(likes)
          .where(
            sql`${likes.catatanId} = ${item.id} AND ${likes.type} = 'like'`
          );

        const [dislikeCount] = await db
          .select({ count: sql`count(*)` })
          .from(likes)
          .where(
            sql`${likes.catatanId} = ${item.id} AND ${likes.type} = 'dislike'`
          );

        const [commentCount] = await db
          .select({ count: sql`count(*)` })
          .from(comments)
          .where(eq(comments.catatanId, item.id));

        return {
          ...item,
          _count: {
            likes: Number(likeCount.count),
            dislikes: Number(dislikeCount.count),
            comments: Number(commentCount.count),
          },
        };
      })
    );

    return NextResponse.json({ data: resultsWithCounts });
  } catch (error) {
    console.error("Get catatan error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
