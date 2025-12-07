"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loading";

export function DeleteButton({ catatanId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000); // Reset after 3s
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/catatan/${catatanId}/delete`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  return (
    <Button
      variant={confirm ? "danger" : "ghost"}
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <>
          <Trash2 className="w-4 h-4" />
          {confirm && <span className="ml-1">Yakin?</span>}
        </>
      )}
    </Button>
  );
}
