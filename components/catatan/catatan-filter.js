"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, TrendingUp, Clock, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAPEL_LIST } from "@/lib/schema";

export function CatatanFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "terbaru";
  const currentMapel = searchParams.get("mapel") || "";

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/catatan?${params.toString()}`);
  };

  const sortOptions = [
    { value: "terbaru", label: "Terbaru", icon: Clock },
    { value: "terlama", label: "Terlama", icon: History },
    { value: "populer", label: "Populer", icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      {/* Sort Options */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <Filter className="w-4 h-4" />
          Urutkan:
        </span>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilter("sort", option.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all",
                currentSort === option.value
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300"
              )}
            >
              <option.icon className="w-3.5 h-3.5" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mapel Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">Mapel:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("mapel", "")}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full transition-all",
              !currentMapel
                ? "bg-primary-500 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300"
            )}
          >
            Semua
          </button>
          {MAPEL_LIST.map((mapel) => (
            <button
              key={mapel}
              onClick={() => updateFilter("mapel", mapel)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full transition-all",
                currentMapel === mapel
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300"
              )}
            >
              {mapel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
