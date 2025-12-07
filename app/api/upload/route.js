import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

// Inisialisasi dengan secret
const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_SECRET,
});

export async function POST(request) {
  console.log("=== Upload API Called ===");

  try {
    // Check auth
    const session = await getSession();
    console.log(
      "Session:",
      session?.user ? "logged in as " + session.user.name : "not logged in"
    );

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - silakan login dulu" },
        { status: 401 }
      );
    }

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get("file");

    console.log(
      "File received:",
      file ? `${file.name} (${file.size} bytes)` : "no file"
    );

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF",
        },
        { status: 400 }
      );
    }

    // Validate file size (4MB)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 4MB" },
        { status: 400 }
      );
    }

    console.log("File valid, uploading to UploadThing...");
    console.log("Secret exists:", !!process.env.UPLOADTHING_SECRET);

    // Upload to UploadThing
    const response = await utapi.uploadFiles(file);

    console.log("UploadThing response:", JSON.stringify(response, null, 2));

    // Handle response
    if (response.error) {
      console.error("UploadThing error:", response.error);
      return NextResponse.json(
        { error: `Upload gagal: ${response.error.message || "Unknown error"}` },
        { status: 500 }
      );
    }

    if (!response.data?.url) {
      console.error("No URL in response");
      return NextResponse.json(
        { error: "URL tidak ditemukan di response" },
        { status: 500 }
      );
    }

    console.log("✅ Upload success! URL:", response.data.url);

    return NextResponse.json({
      success: true,
      url: response.data.url,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
