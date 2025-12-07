import { db } from "@/lib/db";
import { catatan } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if catatan exists and belongs to user (or user is admin)
    const existing = await db
      .select()
      .from(catatan)
      .where(eq(catatan.id, id))
      .limit(1);

    if (!existing[0]) {
      return NextResponse.json(
        { error: "Catatan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check ownership or admin
    if (
      existing[0].userId !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Tidak memiliki akses" },
        { status: 403 }
      );
    }

    // Delete catatan
    await db.delete(catatan).where(eq(catatan.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete catatan error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
