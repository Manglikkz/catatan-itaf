"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/loading";
import { formatTimeAgo } from "@/lib/utils";

export function CommentSection({
  catatanId,
  comments: initialComments,
  count,
}) {
  const [comments, setComments] = useState(initialComments || []);
  const [formData, setFormData] = useState({ nama: "", isi: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.isi.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          catatanId,
          nama: formData.nama.trim() || "Anonymous",
          isi: formData.isi.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // Add new comment to list
      setComments([data.data, ...comments]);
      setFormData({ nama: "", isi: "" });
    } catch (err) {
      setError("Gagal mengirim komentar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary-500" />
        Komentar ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Nama (opsional)"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          disabled={loading}
        />
        <Textarea
          placeholder="Tulis komentar..."
          rows={3}
          value={formData.isi}
          onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
          disabled={loading}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button
          type="submit"
          size="sm"
          disabled={loading || !formData.isi.trim()}
        >
          {loading ? (
            <Spinner size="sm" className="mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Kirim
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar name={comment.nama} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm text-gray-900">
                    {comment.nama}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5 break-words">
                  {comment.isi}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
