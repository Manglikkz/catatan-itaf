import { db } from "@/lib/db";
import { likes } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { catatanId, type, visitorId } = await request.json();

    if (!catatanId || !type || !visitorId) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (!["like", "dislike"].includes(type)) {
      return NextResponse.json({ error: "Type tidak valid" }, { status: 400 });
    }

    // Check existing vote
    const existing = await db
      .select()
      .from(likes)
      .where(
        and(eq(likes.catatanId, catatanId), eq(likes.visitorId, visitorId))
      )
      .limit(1);

    let userVote = null;

    if (existing[0]) {
      if (existing[0].type === type) {
        // Same vote - remove it (toggle off)
        await db.delete(likes).where(eq(likes.id, existing[0].id));
        userVote = null;
      } else {
        // Different vote - update it
        await db
          .update(likes)
          .set({ type })
          .where(eq(likes.id, existing[0].id));
        userVote = type;
      }
    } else {
      // New vote
      await db.insert(likes).values({
        catatanId,
        type,
        visitorId,
      });
      userVote = type;
    }

    // Get updated counts
    const [likeCount] = await db
      .select({ count: sql`count(*)` })
      .from(likes)
      .where(sql`${likes.catatanId} = ${catatanId} AND ${likes.type} = 'like'`);

    const [dislikeCount] = await db
      .select({ count: sql`count(*)` })
      .from(likes)
      .where(
        sql`${likes.catatanId} = ${catatanId} AND ${likes.type} = 'dislike'`
      );

    return NextResponse.json({
      likes: Number(likeCount.count),
      dislikes: Number(dislikeCount.count),
      userVote,
    });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
