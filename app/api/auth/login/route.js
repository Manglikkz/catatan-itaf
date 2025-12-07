import { login } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, password } = await request.json();

    // Validation
    if (!name || !password) {
      return NextResponse.json(
        { error: "Nama dan password harus diisi" },
        { status: 400 }
      );
    }

    const result = await login(name, password);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
