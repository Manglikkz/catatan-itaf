"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Terjadi Kesalahan
        </h1>
        <p className="text-gray-500 mb-6">
          Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
          <Link href="/">
            <Button variant="secondary">
              <Home className="w-4 h-4 mr-2" />
              Ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
