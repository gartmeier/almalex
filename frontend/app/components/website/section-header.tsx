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
          "text-center text-3xl leading-[1.15] font-extrabold tracking-[-0.02em] md:text-[40px]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-[600px] text-center text-base leading-relaxed",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
