import { Card } from "@/components/ui/card";

export default function CatatanLoading() {
  return (
    <div className="container-custom py-6 md:py-10">
      {/* Header Skeleton */}
      <div className="mb-6 md:mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse"></div>
      </div>

      {/* Filter Skeleton */}
      <div className="mb-6 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-9 w-24 bg-gray-100 rounded-full animate-pulse"
          ></div>
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
