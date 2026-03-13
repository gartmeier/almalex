import { cn } from "~/lib/utils";

export function SectionBadge({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase",
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}
