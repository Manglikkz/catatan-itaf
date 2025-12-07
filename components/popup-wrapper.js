"use client";

import { PopupPromo } from "@/components/ui/popup-promo";

export function PopupWrapper() {
  return (
    <PopupPromo
      imageUrl = "/images/hadiah.jpeg"
      title = "Selamat Datang di StudyShare!"
      description = "Hadiah spesial untuk 5 penulis dengan like terbanyak! khusus bulan ini!"
      linkUrl="/register"
      linkText="Daftar Sekarang"
      showOnce={true}
      delayMs={1500}
      storageKey="studyshare-popup-v1"
    />
  );
}
