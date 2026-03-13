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
    sm: "w-8 h-8 rounded-[10px]",
    md: "w-[52px] h-[52px] rounded-[14px]",
    lg: "w-14 h-14 rounded-[16px]",
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
