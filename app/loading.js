import { Spinner } from "@/components/ui/loading";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-gray-500">Memuat...</p>
      </div>
    </div>
  );
}
