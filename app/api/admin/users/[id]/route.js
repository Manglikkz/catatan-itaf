import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prevent deleting self
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Tidak bisa menghapus akun sendiri" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existing[0]) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Prevent deleting other admin
    if (existing[0].role === "admin") {
      return NextResponse.json(
        { error: "Tidak bisa menghapus admin lain" },
        { status: 400 }
      );
    }

    // Delete user (catatan will be deleted by cascade)
    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
