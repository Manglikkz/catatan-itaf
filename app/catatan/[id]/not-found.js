import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-custom py-20 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <FileQuestion className="w-10 h-10 text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Catatan Tidak Ditemukan
      </h1>
      <p className="text-gray-500 mb-6">
        Catatan yang kamu cari tidak ada atau sudah dihapus.
      </p>
      <Link href="/catatan">
        <Button>Kembali ke Daftar Catatan</Button>
      </Link>
    </div>
  );
}
