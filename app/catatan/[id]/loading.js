import { Card } from "@/components/ui/card";

export default function CatatanDetailLoading() {
  return (
    <div className="container-custom py-6 md:py-10">
      {/* Back Button Skeleton */}
      <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse mb-6"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Skeleton */}
          <div className="aspect-[16/10] bg-gray-200 rounded-xl animate-pulse"></div>

          {/* Title Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-4">
            <div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          </Card>
          <Card className="p-4">
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
