"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";

export function PopupPromo({
  imageUrl = "/images/hadiah.jpeg", // Gambar default
  title = "Selamat Datang!",
  description = "Hadiah spesial untuk bulan ini kepada 5 penulis dengan like terbanyak!",
  linkUrl = "",
  linkText = "Selengkapnya",
  storageKey = "popup-promo-seen",
  showOnce = true,
  delayMs = 1000,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Cek apakah sudah pernah lihat
    if (showOnce) {
      const hasSeenPopup = localStorage.getItem(storageKey);
      if (hasSeenPopup) {
        console.log("Popup already seen, skipping...");
        return;
      }
    }

    console.log("Popup will show in", delayMs, "ms");

    // Delay sebelum tampilkan popup
    const timer = setTimeout(() => {
      console.log("Showing popup now!");
      setIsOpen(true);
      // Trigger animation after mount
      setTimeout(() => setIsVisible(true), 50);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [storageKey, showOnce, delayMs]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      if (showOnce) {
        localStorage.setItem(storageKey, "true");
      }
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/60" : "bg-black/0"
      }`}
      onClick={handleBackdropClick}
      style={{ backdropFilter: isVisible ? "blur(4px)" : "none" }}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="relative aspect-[4/5] bg-gradient-to-br from-primary-400 to-primary-600">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                console.log("Image failed to load, showing fallback");
                e.target.style.display = "none";
              }}
            />
          ) : null}

          {/* Fallback gradient dengan text jika image gagal */}
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <div className="text-6xl mb-2">📚</div>
              <div className="text-xl font-bold">StudyShare</div>
            </div>
          </div> */}
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
              className="w-full py-2.5 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Nanti saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
