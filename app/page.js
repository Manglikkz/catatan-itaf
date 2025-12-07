import Link from "next/link";
import { BookOpen, Users, FileText, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { users, catatan, likes } from "@/lib/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatatanCard } from "@/components/catatan/catatan-card";
import Image from "next/image";

async function getStats() {
  try {
    // 1. Ambil jumlah catatan
    const [catatanRes] = await db
      .select({
        // Menggunakan mapWith(Number) agar tidak perlu konversi manual nantinya
        count: sql`count(*)`.mapWith(Number),
      })
      .from(catatan);

    // 2. Ambil jumlah murid
    const [muridRes] = await db
      .select({
        count: sql`count(*)`.mapWith(Number),
      })
      .from(users)
      .where(eq(users.role, "murid"));

    // 3. Return dengan fallback value (0) jika hasil undefined
    return {
      catatan: catatanRes?.count || 0,
      murid: muridRes?.count || 0,
    };
  } catch (error) {
    console.error("Gagal mengambil statistik:", error);
    // Return 0 agar halaman Home tidak crash total jika DB bermasalah
    return {
      catatan: 0,
      murid: 0,
    };
  }
}

async function getRecentCatatan() {
  const results = await db
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
    .leftJoin(users, eq(catatan.userId, users.id))
    .orderBy(desc(catatan.createdAt))
    .limit(6);

  // Get counts
  const resultsWithCounts = await Promise.all(
    results.map(async (item) => {
      const [likeCount] = await db
        .select({ count: sql`count(*)` })
        .from(likes)
        .where(sql`${likes.catatanId} = ${item.id} AND ${likes.type} = 'like'`);

      const [dislikeCount] = await db
        .select({ count: sql`count(*)` })
        .from(likes)
        .where(
          sql`${likes.catatanId} = ${item.id} AND ${likes.type} = 'dislike'`
        );

      const [commentCount] = await db
        .select({ count: sql`count(*)` })
        .from(likes)
        .where(eq(likes.catatanId, item.id));

      return {
        ...item,
        _count: {
          likes: Number(likeCount.count),
          dislikes: Number(dislikeCount.count),
          comments: 0,
        },
      };
    })
  );

  return resultsWithCounts;
}

export default async function Home() {
  const stats = await getStats();
  const recentCatatan = await getRecentCatatan();

  return (
    <div className="container-custom py-8 md:py-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">

        <Image
          src="/images/itaf-nobg.png"
          alt="Logo"
          width={300}
          height={100}
          className="mx-auto"
        />

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Dokumentasi Catatan
          <span className="text-primary-500"> Pembelajaran ITAF</span>
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Tempat berbagi dan melihat catatan pembelajaran dari berbagai mata
          pelajaran. Belajar bersama, berkembang bersama.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/catatan">
            <Button size="lg">
              Lihat Catatan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Mulai Berkontribusi
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        {[
          { icon: FileText, label: "Total Catatan", value: stats.catatan },
          { icon: Users, label: "Kontributor", value: stats.murid },
          { icon: BookOpen, label: "Mata Pelajaran", value: "11" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Catatan Terbaru */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Catatan Terbaru</h2>
          <Link
            href="/catatan"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Lihat Semua →
          </Link>
        </div>

        {recentCatatan.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Belum ada catatan</p>
              <Link
                href="/register"
                className="text-primary-600 text-sm font-medium hover:underline"
              >
                Jadilah yang pertama upload!
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {recentCatatan.map((item) => (
              <CatatanCard key={item.id} catatan={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
