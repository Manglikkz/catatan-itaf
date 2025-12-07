import { db } from "@/lib/db";
import { catatan, users, likes, comments } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Get catatan with user
    const result = await db
      .select({
        id: catatan.id,
        judul: catatan.judul,
        deskripsi: catatan.deskripsi,
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
      .where(eq(catatan.id, id))
      .limit(1);

    if (!result[0]) {
      return NextResponse.json(
        { error: "Catatan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get counts
    const [likeCount] = await db
      .select({ count: sql`count(*)` })
      .from(likes)
      .where(sql`${likes.catatanId} = ${id} AND ${likes.type} = 'like'`);

    const [dislikeCount] = await db
      .select({ count: sql`count(*)` })
      .from(likes)
      .where(sql`${likes.catatanId} = ${id} AND ${likes.type} = 'dislike'`);

    const [commentCount] = await db
      .select({ count: sql`count(*)` })
      .from(comments)
      .where(eq(comments.catatanId, id));

    // Get comments
    const commentList = await db
      .select({
        id: comments.id,
        nama: comments.nama,
        isi: comments.isi,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .where(eq(comments.catatanId, id))
      .orderBy(sql`${comments.createdAt} DESC`);

    return NextResponse.json({
      data: {
        ...result[0],
        _count: {
          likes: Number(likeCount.count),
          dislikes: Number(dislikeCount.count),
          comments: Number(commentCount.count),
        },
        comments: commentList,
      },
    });
  } catch (error) {
    console.error("Get catatan detail error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
