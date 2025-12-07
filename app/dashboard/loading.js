import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Welcome Skeleton */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6">
        <div className="h-7 w-48 bg-white/20 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-white/10 rounded animate-pulse mb-4"></div>
        <div className="h-10 w-36 bg-white/20 rounded-lg animate-pulse"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
