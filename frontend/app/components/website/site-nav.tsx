import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { cn } from "~/lib/utils";

export function SiteNav({
  logo,
  links,
  actions,
  cta,
  mobileContent,
  className,
}: {
  logo: React.ReactNode;
  links?: React.ReactNode;
  actions?: React.ReactNode;
  cta?: React.ReactNode;
  mobileContent?: React.ReactNode;
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
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-3">
          {actions}
          {cta}
        </div>
        {mobileContent && (
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2" aria-label="Open menu">
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6 pt-12">
              {mobileContent}
            </SheetContent>
          </Sheet>
        )}
      </div>
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
        "relative text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-secondary-foreground after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full",
        className,
      )}
    >
      {children}
    </a>
  );
}
