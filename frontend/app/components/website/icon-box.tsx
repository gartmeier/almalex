import { cn } from "~/lib/utils";

export function IconBox({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  let sizes = {
    sm: "w-8 h-8 rounded-xl",
    md: "w-[52px] h-[52px] rounded-2xl",
    lg: "w-14 h-14 rounded-2xl",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0 transition-transform duration-200",
        sizes[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
