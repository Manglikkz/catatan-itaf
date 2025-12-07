import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-gray-400" />
        </div>

        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 mb-6">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Ke Beranda
            </Button>
          </Link>
          <Link href="/catatan">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Lihat Catatan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
