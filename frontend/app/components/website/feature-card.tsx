import { cn } from "~/lib/utils";

export function FeatureCard({
  icon,
  title,
  description,
  className,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[20px] border border-border/60 bg-card p-7 shadow-feature transition-all duration-300 hover:-translate-y-0.5 hover:shadow-feature-hover",
        className,
      )}
    >
      {icon}
      <h3 className="text-lg font-semibold tracking-[-0.01em] text-secondary-foreground">
        {title}
      </h3>
      <p className="text-sm leading-[1.65] text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
