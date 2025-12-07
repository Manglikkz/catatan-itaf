import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { db } from "@/lib/db";
import { catatan, users, likes, comments } from "@/lib/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";
import { AdminDeleteCatatanButton } from "@/components/admin/delete-catatan-button";

async function getAllCatatan() {
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
    .orderBy(desc(catatan.createdAt));

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
        .from(comments)
        .where(eq(comments.catatanId, item.id));

      return {
        ...item,
        _count: {
          likes: Number(likeCount.count),
          dislikes: Number(dislikeCount.count),
          comments: Number(commentCount.count),
        },
      };
    })
  );

  return resultsWithCounts;
}

export default async function AdminCatatanPage() {
  const catatanList = await getAllCatatan();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-500" />
          Kelola Catatan
        </h1>
        <p className="text-gray-500">Total {catatanList.length} catatan</p>
      </div>

      {/* Catatan List */}
      <Card>
        <CardContent className="p-0">
          {catatanList.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Belum ada catatan</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {catatanList.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-gray-50"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-24 h-20 sm:h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.fotoUrl}
                      alt={item.judul}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Badge className="mb-1">{item.mapel}</Badge>
                        <h3 className="font-medium text-gray-900 line-clamp-1">
                          {item.judul}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar
                            name={item.user?.name}
                            size="sm"
                            className="w-5 h-5 text-xs"
                          />
                          <span className="text-sm text-gray-500">
                            {item.user?.name || "Unknown"}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {item._count.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsDown className="w-4 h-4" />
                          {item._count.dislikes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {item._count.comments}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/catatan/${item.id}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <AdminDeleteCatatanButton
                          catatanId={item.id}
                          catatanTitle={item.judul}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
