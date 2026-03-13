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
        "flex flex-col items-center gap-14 px-6 py-24 md:px-[120px] scroll-mt-14",
        className,
      )}
    >
      {children}
    </section>
  );
}
