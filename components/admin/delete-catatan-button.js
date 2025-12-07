"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loading";

export function AdminDeleteCatatanButton({ catatanId, catatanTitle }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/catatan/${catatanId}/delete`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Hapus"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={loading}
        >
          Batal
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
