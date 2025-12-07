import Link from "next/link";
import { Plus, BookOpen, ThumbsUp, MessageCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { catatan, likes, comments } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getStats(userId) {
  // Total catatan
  const [catatanCount] = await db
    .select({ count: sql`count(*)` })
    .from(catatan)
    .where(eq(catatan.userId, userId));

  // Total likes received
  const userCatatan = await db
    .select({ id: catatan.id })
    .from(catatan)
    .where(eq(catatan.userId, userId));

  let totalLikes = 0;
  let totalComments = 0;

  for (const c of userCatatan) {
    const [likeCount] = await db
      .select({ count: sql`count(*)` })
      .from(likes)
      .where(sql`${likes.catatanId} = ${c.id} AND ${likes.type} = 'like'`);

    const [commentCount] = await db
      .select({ count: sql`count(*)` })
      .from(comments)
      .where(eq(comments.catatanId, c.id));

    totalLikes += Number(likeCount.count);
    totalComments += Number(commentCount.count);
  }

  return {
    catatan: Number(catatanCount.count),
    likes: totalLikes,
    comments: totalComments,
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const stats = await getStats(user.id);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Halo, {user.name}! 👋</h1>
        <p className="text-primary-100">
          Selamat datang di dashboard. Yuk upload catatan baru!
        </p>
        <Link href="/dashboard/buat" className="inline-block mt-4">
          <Button
            variant="secondary"
            className="bg-white text-primary-600 hover:bg-primary-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Catatan
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.catatan}
              </p>
              <p className="text-sm text-gray-500">Catatan</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.likes}</p>
              <p className="text-sm text-gray-500">Total Likes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.comments}
              </p>
              <p className="text-sm text-gray-500">Komentar</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="py-5">
          <h2 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/buat">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Upload Catatan
              </Button>
            </Link>
            <Link href="/dashboard/catatan">
              <Button variant="secondary" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Lihat Catatan Saya
              </Button>
            </Link>
            <Link href="/catatan">
              <Button variant="ghost" size="sm">
                Jelajahi Catatan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
