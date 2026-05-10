import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-md",
        "bg-gradient-to-r from-muted/40 via-muted/70 to-muted/40",
        "bg-[length:200%_100%]",
        "animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
