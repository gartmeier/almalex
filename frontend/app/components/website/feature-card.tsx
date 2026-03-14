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
        "border-border/60 bg-card shadow-feature hover:shadow-feature-hover flex flex-col gap-4 rounded-[20px] border p-7 transition-all duration-300 hover:-translate-y-0.5",
        className,
      )}
    >
      {icon}
      <h3 className="text-secondary-foreground text-lg font-semibold tracking-[-0.01em]">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-[1.65]">
        {description}
      </p>
      {children}
    </div>
  );
}
