import { cn } from "@/lib/utils";

const colorMap = {
  "B. Arab": "bg-emerald-100 text-emerald-700",
  Nahwu: "bg-blue-100 text-blue-700",
  Shorof: "bg-purple-100 text-purple-700",
  Tahfidz: "bg-amber-100 text-amber-700",
  Aqidah: "bg-rose-100 text-rose-700",
  Fiqih: "bg-indigo-100 text-indigo-700",
  Hadits: "bg-teal-100 text-teal-700",
  "Adab & Akhlaq": "bg-pink-100 text-pink-700",
  "B. Inggris": "bg-cyan-100 text-cyan-700",
  MTK: "bg-orange-100 text-orange-700",
  Bootcamp: "bg-gray-100 text-gray-700",
};

export function Badge({ children, variant = "default", className }) {
  const color = colorMap[children] || "bg-primary-100 text-primary-700";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variant === "default" ? color : "",
        variant === "outline" &&
          "border border-gray-300 bg-white text-gray-700",
        className
      )}
    >
      {children}
    </span>
  );
}
