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
        "flex flex-col gap-4 rounded-[18px] border border-border/60 bg-card p-7 shadow-[0_1px_3px_#1E3A5F08,0_8px_24px_-4px_#1E3A5F0A] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_3px_#1E3A5F08,0_12px_32px_-4px_#1E3A5F14]",
        className,
      )}
    >
      {icon}
      <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-secondary-foreground">
        {title}
      </h3>
      <p className="text-sm leading-[1.65] text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
