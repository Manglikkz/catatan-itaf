import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "Belum ada catatan",
  description = "Jadilah yang pertama upload catatan!",
  showAction = true,
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {showAction && (
        <Link href="/dashboard/buat">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Upload Catatan
          </Button>
        </Link>
      )}
    </div>
  );
}
