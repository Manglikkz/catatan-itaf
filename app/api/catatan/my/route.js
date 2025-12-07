import { db } from "@/lib/db";
import { catatan, likes, comments } from "@/lib/schema";
import { eq, sql, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's catatan
    const results = await db
      .select()
      .from(catatan)
      .where(eq(catatan.userId, session.user.id))
      .orderBy(desc(catatan.createdAt));

    // Get counts for each catatan
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
    console.error("Get my catatan error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
