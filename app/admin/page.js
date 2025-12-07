import Link from "next/link";
import {
  Users,
  BookOpen,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { db } from "@/lib/db";
import { users, catatan, likes, comments } from "@/lib/schema";
import { sql, desc, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";

async function getAdminStats() {
  const [userCount] = await db
    .select({ count: sql`count(*)` })
    .from(users)
    .where(eq(users.role, "murid"));

  const [catatanCount] = await db
    .select({ count: sql`count(*)` })
    .from(catatan);

  const [likeCount] = await db
    .select({ count: sql`count(*)` })
    .from(likes)
    .where(eq(likes.type, "like"));

  const [commentCount] = await db
    .select({ count: sql`count(*)` })
    .from(comments);

  return {
    murid: Number(userCount.count),
    catatan: Number(catatanCount.count),
    likes: Number(likeCount.count),
    comments: Number(commentCount.count),
  };
}

async function getRecentCatatan() {
  const results = await db
    .select({
      id: catatan.id,
      judul: catatan.judul,
      mapel: catatan.mapel,
      createdAt: catatan.createdAt,
      user: {
        id: users.id,
        name: users.name,
      },
    })
    .from(catatan)
    .leftJoin(users, eq(catatan.userId, users.id))
    .orderBy(desc(catatan.createdAt))
    .limit(5);

  return results;
}

async function getRecentMurid() {
  const results = await db
    .select({
      id: users.id,
      name: users.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.role, "murid"))
    .orderBy(desc(users.createdAt))
    .limit(5);

  return results;
}

export default async function AdminPage() {
  const stats = await getAdminStats();
  const recentCatatan = await getRecentCatatan();
  const recentMurid = await getRecentMurid();

  const statCards = [
    {
      label: "Total Murid",
      value: stats.murid,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Catatan",
      value: stats.catatan,
      icon: BookOpen,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Likes",
      value: stats.likes,
      icon: ThumbsUp,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Total Komentar",
      value: stats.comments,
      icon: MessageCircle,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-500">Overview keseluruhan website</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardContent className="py-5">
              <div
                className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Catatan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-gray-900">Catatan Terbaru</h2>
            <Link href="/admin/catatan">
              <Button variant="ghost" size="sm">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {recentCatatan.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Belum ada catatan
              </p>
            ) : (
              <div className="space-y-3">
                {recentCatatan.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Avatar name={item.user?.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.judul}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs">{item.mapel}</Badge>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Murid */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-gray-900">Murid Terbaru</h2>
            <Link href="/admin/murid">
              <Button variant="ghost" size="sm">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {recentMurid.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Belum ada murid
              </p>
            ) : (
              <div className="space-y-3">
                {recentMurid.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Avatar name={item.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Bergabung {formatTimeAgo(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
