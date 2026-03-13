import { cn } from "~/lib/utils";

export function SiteNav({
  logo,
  links,
  cta,
  className,
}: {
  logo: React.ReactNode;
  links?: React.ReactNode;
  cta?: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 flex items-center justify-between px-6 py-3 md:px-10 backdrop-blur-md backdrop-saturate-150",
        className,
      )}
    >
      {logo}
      {links && (
        <div className="hidden md:flex items-center gap-8">{links}</div>
      )}
      {cta}
    </nav>
  );
}

export function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "relative text-sm font-medium text-[#6B7280] transition-colors duration-200 hover:text-[#1E3A5F] after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 after:bg-[#3B82C4] after:transition-all after:duration-200 hover:after:w-full",
        className,
      )}
    >
      {children}
    </a>
  );
}
