"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Save, Eye, EyeOff, Check, Shield } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loading";

export default function AdminProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPasswords, setShowPasswords] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setFormData((prev) => ({ ...prev, name: data.user.name }));
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate confirm password
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("Password baru tidak cocok");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess(data.message);
        setUser(data.user);
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary-500" />
          Profil Admin
        </h1>
        <p className="text-gray-500">Kelola informasi akun administrator</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.name}
              </h2>
              <p className="text-sm text-primary-600 font-medium">
                Administrator
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Edit Profil</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4" />
                {success}
              </div>
            )}

            {/* Edit Name */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Ubah Nama
              </h3>
              <Input
                placeholder="Nama baru"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={saving}
              />
              <p className="text-xs text-gray-400">
                Minimal 3 karakter, tanpa spasi
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* Edit Password */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Ubah Password
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  {showPasswords ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  {showPasswords ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>

              <Input
                type={showPasswords ? "text" : "password"}
                placeholder="Password lama"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                disabled={saving}
              />

              <Input
                type={showPasswords ? "text" : "password"}
                placeholder="Password baru"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                disabled={saving}
              />

              <Input
                type={showPasswords ? "text" : "password"}
                placeholder="Konfirmasi password baru"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                disabled={saving}
              />

              <p className="text-xs text-gray-400">
                Kosongkan jika tidak ingin mengubah password. Password minimal 6
                karakter.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
