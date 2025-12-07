"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loading";

export function AdminDeleteUserButton({ userId, userName }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        router.refresh();
      } else {
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
        <span className="text-xs text-red-600 hidden sm:inline">
          Hapus {userName}?
        </span>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Ya"}
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
