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
        "flex items-start gap-5 rounded-[18px] border border-[#E2E8F0]/60 p-7 shadow-[0_1px_3px_#1E3A5F08]",
        className,
      )}
    >
      {icon}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[17px] font-semibold tracking-[-0.01em]">
          {title}
        </h3>
        <p className="text-[15px] leading-[1.65]">{description}</p>
      </div>
    </div>
  );
}
