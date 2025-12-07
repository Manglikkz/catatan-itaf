import { cn } from "@/lib/utils";

export function Avatar({ name, size = "md", className }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-primary-100 text-primary-700 font-semibold",
        "flex items-center justify-center",
        sizes[size],
        className
      )}
    >
      {initial}
    </div>
  );
}
