import { cn } from "~/lib/utils";

export function AlertBanner({
  icon,
  title,
  description,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-5 rounded-[20px] border border-[#E2E8F0]/60 p-7 shadow-sm",
        className,
      )}
    >
      {icon}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold tracking-[-0.01em]">{title}</h3>
        <p className="text-base leading-[1.65]">{description}</p>
      </div>
    </div>
  );
}
