import { Suspense } from "react";
import { BookOpen } from "lucide-react";
import { CatatanCard } from "@/components/catatan/catatan-card";
import { CatatanFilter } from "@/components/catatan/catatan-filter";
import { EmptyState } from "@/components/catatan/empty-state";
import { PageLoader } from "@/components/ui/loading";

export const metadata = {
  title: "Catatan",
  description: "Jelajahi catatan pembelajaran dari berbagai mata pelajaran.",
};

async function getCatatanList(searchParams) {
  const params = new URLSearchParams();
  if (searchParams.sort) params.set("sort", searchParams.sort);
  if (searchParams.mapel) params.set("mapel", searchParams.mapel);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/catatan?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function CatatanList({ searchParams }) {
  const catatanList = await getCatatanList(searchParams);

  if (catatanList.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {catatanList.map((item) => (
        <CatatanCard key={item.id} catatan={item} />
      ))}
    </div>
  );
}

export default async function CatatanPage({ searchParams }) {
  const params = await searchParams;

  return (
    <div className="container-custom py-6 md:py-10">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-primary-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Catatan
          </h1>
        </div>
        <p className="text-gray-500">
          Jelajahi catatan dari berbagai mata pelajaran
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Suspense
          fallback={
            <div className="h-20 bg-gray-100 animate-pulse rounded-lg" />
          }
        >
          <CatatanFilter />
        </Suspense>
      </div>

      {/* List */}
      <Suspense fallback={<PageLoader />}>
        <CatatanList searchParams={params} />
      </Suspense>
    </div>
  );
}
