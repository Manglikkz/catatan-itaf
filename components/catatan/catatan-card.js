import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, MessageCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";

export function CatatanCard({ catatan }) {
  const { id, judul, mapel, fotoUrl, user, createdAt, _count } = catatan;

  return (
    <Link href={`/catatan/${id}`}>
      <Card hover className="overflow-hidden h-full flex flex-col group">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={fotoUrl}
            alt={judul}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWESEyIxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaQm/wDZ//Z"
          />
          <div className="absolute top-3 left-3">
            <Badge>{mapel}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-primary-600 transition-colors">
            {judul}
          </h3>

          {/* Author & Date */}
          <div className="flex items-center gap-2 mb-3 mt-auto">
            <Avatar name={user?.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatTimeAgo(createdAt)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <ThumbsUp className="w-4 h-4" />
              {_count?.likes || 0}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <ThumbsDown className="w-4 h-4" />
              {_count?.dislikes || 0}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <MessageCircle className="w-4 h-4" />
              {_count?.comments || 0}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
