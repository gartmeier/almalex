import { cn } from "~/lib/utils";

export function SiteFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <footer
      className={cn(
        "flex flex-col items-center gap-12 px-8 py-[72px] pb-10 md:px-[120px]",
        className,
      )}
    >
      {children}
    </footer>
  );
}

export function FooterDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-[1200px] h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent",
        className,
      )}
    />
  );
}

export function FooterLinks({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-between w-full max-w-[1200px] gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
