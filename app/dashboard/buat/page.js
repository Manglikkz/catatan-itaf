"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Send, ImagePlus } from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/loading";
import { MAPEL_LIST } from "@/lib/schema";

export default function BuatCatatanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    mapel: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.judul) {
      setError("Judul harus diisi");
      return;
    }

    if (!formData.mapel) {
      setError("Mata pelajaran harus dipilih");
      return;
    }

    if (!imageUrl) {
      setError("Upload gambar terlebih dahulu");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/catatan/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fotoUrl: imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push(`/catatan/${data.data.id}`);
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
  };

  const isFormValid = formData.judul && formData.mapel && imageUrl;

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">Upload Catatan</h1>
          <p className="text-sm text-gray-500">
            Bagikan catatan pembelajaran kamu
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Upload Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Catatan <span className="text-red-500">*</span>
              </label>

              {imageUrl ? (
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src={imageUrl}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Berhasil diupload
                    </div>
                  </div>
                  <p className="text-sm text-green-600 text-center">
                    ✓ Gambar siap digunakan
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImagePlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Upload foto catatan kamu
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    JPG, PNG, WebP (Max 4MB)
                  </p>

                  <UploadButton
                    endpoint="catatanImage"
                    onUploadBegin={() => {
                      setUploading(true);
                      setError("");
                    }}
                    onClientUploadComplete={(res) => {
                      console.log("Upload complete:", res);
                      setUploading(false);
                      if (res?.[0]) {
                        // Gunakan ufsUrl atau url
                        const url = res[0].ufsUrl || res[0].url;
                        console.log("Image URL:", url);
                        setImageUrl(url);
                      }
                    }}
                    onUploadError={(err) => {
                      console.error("Upload error:", err);
                      setUploading(false);
                      setError(`Upload gagal: ${err.message}`);
                    }}
                    appearance={{
                      button: `
                        bg-primary-500 hover:bg-primary-600 text-white 
                        px-4 py-2 rounded-lg text-sm font-medium
                        transition-colors
                        ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                      `,
                      allowedContent: "text-xs text-gray-400 mt-2",
                    }}
                    content={{
                      button({ ready, isUploading }) {
                        if (isUploading) return "Mengupload...";
                        if (ready) return "Pilih Gambar";
                        return "Memuat...";
                      },
                      allowedContent: "Gambar (max 4MB)",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Judul */}
            <Input
              label="Judul Catatan"
              placeholder="Contoh: Ringkasan Nahwu Bab 3"
              value={formData.judul}
              onChange={(e) =>
                setFormData({ ...formData, judul: e.target.value })
              }
              disabled={loading}
              required
            />

            {/* Deskripsi */}
            <Textarea
              label="Deskripsi (Opsional)"
              placeholder="Tulis deskripsi atau catatan tambahan..."
              rows={4}
              value={formData.deskripsi}
              onChange={(e) =>
                setFormData({ ...formData, deskripsi: e.target.value })
              }
              disabled={loading}
            />

            {/* Mapel */}
            <Select
              label="Mata Pelajaran"
              value={formData.mapel}
              onChange={(e) =>
                setFormData({ ...formData, mapel: e.target.value })
              }
              disabled={loading}
              required
            >
              <option value="">Pilih Mata Pelajaran</option>
              {MAPEL_LIST.map((mapel) => (
                <option key={mapel} value={mapel}>
                  {mapel}
                </option>
              ))}
            </Select>

            {/* Debug info - bisa dihapus nanti */}
            <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded space-y-1">
              <p>Debug Info:</p>
              <p>• ImageURL: {imageUrl ? "✓ ada" : "✗ kosong"}</p>
              <p>• Judul: {formData.judul ? "✓" : "✗"}</p>
              <p>• Mapel: {formData.mapel ? "✓" : "✗"}</p>
              <p>• Form Valid: {isFormValid ? "✓ READY" : "✗ belum lengkap"}</p>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading || uploading || !isFormValid}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Upload Catatan
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={loading || uploading}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
