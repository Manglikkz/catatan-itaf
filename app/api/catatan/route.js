import { db } from "@/lib/db";
import { catatan, users, likes, comments } from "@/lib/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "terbaru";
    const mapel = searchParams.get("mapel") || "";
    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;

    // Build base query dengan join
    let query = db
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
      .leftJoin(users, eq(catatan.userId, users.id));

    // Filter by mapel
    if (mapel) {
      query = query.where(eq(catatan.mapel, mapel));
    }

    // Execute query
    let results = await query.limit(limit).offset(offset);

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

    // Sort results
    let sortedResults = [...resultsWithCounts];
    if (sort === "terbaru") {
      sortedResults.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "terlama") {
      sortedResults.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sort === "populer") {
      sortedResults.sort((a, b) => b._count.likes - a._count.likes);
    }

    return NextResponse.json({ data: sortedResults });
  } catch (error) {
    console.error("Get catatan error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
