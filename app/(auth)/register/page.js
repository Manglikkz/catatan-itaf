"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Eye, EyeOff, BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/loading";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  };

  const validations = [
    { label: "Minimal 3 karakter", valid: formData.name.length >= 3 },
    // {
    //   label: "Tanpa spasi",
    //   valid: !formData.name.includes(" ") && formData.name.length > 0,
    // },
  ];

  const passwordValidations = [
    { label: "Minimal 6 karakter", valid: formData.password.length >= 6 },
    {
      label: "Password cocok",
      valid:
        formData.password === formData.confirmPassword &&
        formData.confirmPassword.length > 0,
    },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-0">

          <Image
            src="/images/itaf-nobg.png"
            alt="Logo"
            width={250}
            height={100}
            className="mx-auto"
          />

          <h1 className="text-2xl font-bold text-gray-900">Daftar</h1>
          <p className="text-gray-500 text-sm mt-1">
            Buat akun untuk mulai upload catatan
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <Input
                label="Nama"
                placeholder="Masukkan nama"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={loading}
                required
              />
              {formData.name && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {validations.map((v, i) => (
                    <span
                      key={i}
                      className={`text-xs flex items-center gap-1 ${
                        v.valid ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      {v.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div>
              <Input
                label="Konfirmasi Password"
                type={showPassword ? "text" : "password"}
                placeholder="Ulangi password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                disabled={loading}
                required
              />
              {formData.password && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {passwordValidations.map((v, i) => (
                    <span
                      key={i}
                      className={`text-xs flex items-center gap-1 ${
                        v.valid ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      {v.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Daftar
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-primary-600 font-medium hover:underline"
            >
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
