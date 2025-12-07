import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { catatan, likes, comments } from "@/lib/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/utils";
import { DeleteButton } from "@/components/catatan/delete-button";

async function getMyCatatan(userId) {
  const results = await db
    .select()
    .from(catatan)
    .where(eq(catatan.userId, userId))
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

export default async function CatatanSayaPage() {
  const user = await getCurrentUser();
  const catatanList = await getMyCatatan(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Catatan Saya</h1>
          <p className="text-sm text-gray-500">{catatanList.length} catatan</p>
        </div>
        <Link href="/dashboard/buat">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </Link>
      </div>

      {catatanList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">Belum ada catatan</p>
            <Link href="/dashboard/buat">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Upload Catatan Pertama
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {catatanList.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="relative w-full sm:w-40 h-32 sm:h-auto bg-gray-100 shrink-0">
                  <Image
                    src={item.fotoUrl}
                    alt={item.judul}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>

                {/* Content */}
                <CardContent className="flex-1 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Badge className="mb-2">{item.mapel}</Badge>
                      <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                        {item.judul}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatTimeAgo(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
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
                      <Link href={`/catatan/${item.id}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DeleteButton catatanId={item.id} />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
