"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  BookOpen,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/itaf-nobg.png"
              alt="Logo"
              width={45}
              height={24}
              className="rounded-xl"
            />
            <span className="font-bold text-lg text-gray-900 hidden sm:block">
              Catatan <span className="text-primary-500">ITAF</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/catatan"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              Catatan
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <Button variant="secondary" size="sm" type="submit">
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-200",
            isOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/"
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/catatan"
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Catatan
            </Link>

            <hr className="my-2" />

            {user ? (
              <>
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Keluar
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
