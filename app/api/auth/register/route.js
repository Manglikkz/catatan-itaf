import { register } from "@/lib/auth";
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

    if (name.length < 3) {
      return NextResponse.json(
        { error: "Nama minimal 3 karakter" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Check for spaces in name (username style)
    // if (name.includes(" ")) {
    //   return NextResponse.json(
    //     { error: "Nama tidak boleh mengandung spasi" },
    //     { status: 400 }
    //   );
    // }

    const result = await register(name, password);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
