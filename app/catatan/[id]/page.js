import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { LikeButtons } from "@/components/catatan/like-buttons";
import { CommentSection } from "@/components/catatan/comment-section";

async function getCatatan(id) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/catatan/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const catatan = await getCatatan(id);

  if (!catatan) {
    return { title: "Catatan tidak ditemukan" };
  }

  return {
    title: `${catatan.judul} - Catatan Sekolah`,
    description:
      catatan.deskripsi ||
      `Catatan ${catatan.mapel} oleh ${catatan.user?.name}`,
  };
}

export default async function CatatanDetailPage({ params }) {
  const { id } = await params;
  const catatan = await getCatatan(id);

  if (!catatan) {
    notFound();
  }

  return (
    <div className="container-custom py-6 md:py-10">
      {/* Back Button */}
      <Link href="/catatan" className="inline-block mb-6">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={catatan.fotoUrl}
              alt={catatan.judul}
              fill
              className="object-contain bg-gray-50"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>

          {/* Title & Meta */}
          <div>
            <Badge className="mb-3">{catatan.mapel}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {catatan.judul}
            </h1>

            {/* Author Info */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <Avatar name={catatan.user?.name} size="lg" />
              <div>
                <p className="font-medium text-gray-900">
                  {catatan.user?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(catatan.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          {catatan.deskripsi && (
            <Card>
              <CardContent className="py-4">
                <h2 className="font-semibold text-gray-900 mb-2">Deskripsi</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {catatan.deskripsi}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Comments - Mobile */}
          <div className="lg:hidden">
            <CommentSection
              catatanId={catatan.id}
              comments={catatan.comments}
              count={catatan._count.comments}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Like/Dislike */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <LikeButtons
              catatanId={catatan.id}
              initialLikes={catatan._count.likes}
              initialDislikes={catatan._count.dislikes}
            />
          </div>

          {/* Comments - Desktop */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-100 p-4">
            <CommentSection
              catatanId={catatan.id}
              comments={catatan.comments}
              count={catatan._count.comments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
