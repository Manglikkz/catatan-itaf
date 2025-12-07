import { db } from "@/lib/db";
import { catatan } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { MAPEL_LIST } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { judul, deskripsi, mapel, fotoUrl } = await request.json();

    // Validation
    if (!judul || !mapel || !fotoUrl) {
      return NextResponse.json(
        { error: "Judul, mata pelajaran, dan foto harus diisi" },
        { status: 400 }
      );
    }

    if (judul.length < 5) {
      return NextResponse.json(
        { error: "Judul minimal 5 karakter" },
        { status: 400 }
      );
    }

    if (judul.length > 255) {
      return NextResponse.json(
        { error: "Judul maksimal 255 karakter" },
        { status: 400 }
      );
    }

    if (!MAPEL_LIST.includes(mapel)) {
      return NextResponse.json(
        { error: "Mata pelajaran tidak valid" },
        { status: 400 }
      );
    }

    // Create catatan
    const newCatatan = await db
      .insert(catatan)
      .values({
        judul: judul.trim(),
        deskripsi: deskripsi?.trim() || null,
        mapel,
        fotoUrl,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newCatatan[0],
    });
  } catch (error) {
    console.error("Create catatan error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
