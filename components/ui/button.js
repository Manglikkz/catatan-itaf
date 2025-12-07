import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";

  const variants = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <Comp
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </Comp>
  );
}
