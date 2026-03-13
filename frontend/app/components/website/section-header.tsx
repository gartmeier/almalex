import { cn } from "~/lib/utils";

export function SectionHeader({
  badge,
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: {
  badge?: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      {badge}
      <h2
        className={cn(
          "text-3xl md:text-[40px] font-extrabold text-center leading-[1.15] tracking-[-0.02em]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-base text-center leading-relaxed max-w-[600px]",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
