import { cn } from "@/lib/utils";

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-sm",
        hover &&
          "hover:shadow-md hover:border-primary-100 transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div
      className={cn(
        "px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={cn("px-4 py-3 sm:px-6 sm:py-4", className)}>{children}</div>
  );
}

export function CardFooter({ children, className }) {
  return (
    <div
      className={cn(
        "px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
}
