"use client";

import { PopupPromo } from "@/components/ui/popup-promo";
import { popupConfig } from "@/lib/popup-config";

export function PopupWrapper() {
  if (!popupConfig.enabled) return null;

  return (
    <PopupPromo
      imageUrl={popupConfig.imageUrl}
      title={popupConfig.title}
      description={popupConfig.description}
      linkUrl={popupConfig.linkUrl}
      linkText={popupConfig.linkText}
      showOnce={popupConfig.showOnce}
      delayMs={popupConfig.delayMs}
      storageKey={popupConfig.storageKey}
    />
  );
}
