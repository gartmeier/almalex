import { cn } from "~/lib/utils";

export function PageSection({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "flex scroll-mt-14 flex-col items-center gap-14 px-6 py-24 md:px-[120px]",
        className,
      )}
    >
      {children}
    </section>
  );
}
