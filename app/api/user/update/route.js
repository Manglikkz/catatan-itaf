import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, currentPassword, newPassword } = await request.json();

    // Get current user data
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!currentUser[0]) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData = {};

    // Update name if provided
    if (name && name !== currentUser[0].name) {
      // Validate name
      if (name.length < 3) {
        return NextResponse.json(
          { error: "Nama minimal 3 karakter" },
          { status: 400 }
        );
      }

      if (name.includes(" ")) {
        return NextResponse.json(
          { error: "Nama tidak boleh mengandung spasi" },
          { status: 400 }
        );
      }

      // Check if name already taken
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.name, name))
        .limit(1);

      if (existingUser[0] && existingUser[0].id !== session.user.id) {
        return NextResponse.json(
          { error: "Nama sudah digunakan" },
          { status: 400 }
        );
      }

      updateData.name = name;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Password lama harus diisi" },
          { status: 400 }
        );
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        currentUser[0].password
      );

      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Password lama salah" },
          { status: 400 }
        );
      }

      // Validate new password
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password baru minimal 6 karakter" },
          { status: 400 }
        );
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Tidak ada perubahan" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning({
        id: users.id,
        name: users.name,
        role: users.role,
      });

    // Update session if name changed
    if (updateData.name) {
      session.user.name = updateData.name;
      await session.save();
    }

    return NextResponse.json({
      success: true,
      user: updatedUser[0],
      message: "Profil berhasil diupdate",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
