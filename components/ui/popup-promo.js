"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function PopupPromo({
  imageUrl = "/images/haidah.jpeg", // Gambar default
  title = "Selamat Datang!",
  description = "",
  linkUrl = "",
  linkText = "Selengkapnya",
  storageKey = "popup-promo-seen",
  showOnce = true, // Hanya tampil sekali per session/selamanya
  delayMs = 1000, // Delay sebelum muncul
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Cek apakah sudah pernah lihat
    if (showOnce) {
      const hasSeenPopup = localStorage.getItem(storageKey);
      if (hasSeenPopup) return;
    }

    // Delay sebelum tampilkan popup
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [storageKey, showOnce, delayMs]);

  const handleClose = () => {
    setIsOpen(false);

    if (dontShowAgain || showOnce) {
      localStorage.setItem(storageKey, "true");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-5">
          {title && (
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          )}

          {description && (
            <p className="text-gray-600 text-sm mb-4">{description}</p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {linkUrl && (
              <Link
                href={linkUrl}
                target={linkUrl.startsWith("http") ? "_blank" : "_self"}
                rel={linkUrl.startsWith("http") ? "noopener noreferrer" : ""}
                onClick={handleClose}
                className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl text-center transition-colors flex items-center justify-center gap-2"
              >
                {linkText}
                {linkUrl.startsWith("http") && (
                  <ExternalLink className="w-4 h-4" />
                )}
              </Link>
            )}

            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Tutup
            </button>
          </div>

          {/* Don't show again checkbox */}
          {!showOnce && (
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
              />
              <span className="text-xs text-gray-500">
                Jangan tampilkan lagi
              </span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
