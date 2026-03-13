import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router";
import { LanguageSelector } from "~/components/layout/language-selector";
import { ThemeToggle } from "~/components/layout/theme-toggle";
import { SheetClose } from "~/components/ui/sheet";
import {
  FooterDivider,
  FooterLinks,
  SiteFooter,
} from "~/components/website/site-footer";
import { NavLink, SiteNav } from "~/components/website/site-nav";

let t = {
  de: {
    nav: [
      { href: "#so-funktionierts", label: "So funktioniert's" },
      { href: "#datenquellen", label: "Datenquellen" },
      { href: "#datenschutz", label: "Datenschutz" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: "Ausprobieren",
    footerHeading: "Bereit für deine nächste Rechtsfrage?",
    footerBody:
      "Egal ob Obligationenrecht, Mietrecht oder Strafrecht: frag die Rechts-KI einfach. Kostenlos und ohne Anmeldung.",
    footerCta: "Jetzt loslegen",
    privacy: "Datenschutz",
    privacyPath: "datenschutz",
    imprint: "Nutzungsbedingungen",
    imprintPath: "nutzungsbedingungen",
    disclaimer:
      "Alma Lex bietet keine Rechtsberatung. Bei konkreten Fällen eine Fachperson beiziehen.",
  },
  en: {
    nav: [
      { href: "#how-it-works", label: "How It Works" },
      { href: "#data-sources", label: "Data Sources" },
      { href: "#privacy", label: "Privacy" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: "Try It Now",
    footerHeading: "Ready for your next legal question?",
    footerBody:
      "Whether it's contract law, tenancy law, or criminal law: just ask the legal AI. Free and without registration.",
    footerCta: "Get Started",
    privacy: "Privacy",
    privacyPath: "privacy",
    imprint: "Terms of Use",
    imprintPath: "terms",
    disclaimer:
      "Alma Lex does not provide legal advice. For specific cases, consult a qualified professional.",
  },
  fr: {
    nav: [
      { href: "#comment-ca-marche", label: "Comment ça marche" },
      { href: "#sources-de-donnees", label: "Sources de données" },
      { href: "#protection-des-donnees", label: "Protection des données" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: "Essayer",
    footerHeading: "Prêt pour votre prochaine question juridique ?",
    footerBody:
      "Que ce soit le droit des obligations, le droit du bail ou le droit pénal : posez simplement la question à l'IA juridique. Gratuit et sans inscription.",
    footerCta: "Commencer",
    privacy: "Protection des données",
    privacyPath: "protection-des-donnees",
    imprint: "Conditions d'utilisation",
    imprintPath: "conditions-utilisation",
    disclaimer:
      "Alma Lex ne fournit pas de conseil juridique. Pour des cas concrets, consultez un ou une spécialiste.",
  },
} as const;

type Lang = keyof typeof t;

function useLang() {
  let location = useLocation();
  let parts = location.pathname.split("/").filter(Boolean);
  let lang = (["de", "fr", "en"].includes(parts[0]) ? parts[0] : "de") as Lang;
  return { lang, prefix: `/${lang}`, strings: t[lang] };
}

export default function LandingLayout() {
  let { lang, prefix, strings: s } = useLang();
  let { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang, i18n]);

  return (
    <div className="bg-background min-h-screen font-['Inter_Variable',sans-serif]">
      <SiteNav
        className="bg-card/[0.93] border-border border-b"
        logo={
          <a href={prefix} className="flex items-center gap-2">
            <img
              src="/logo-color.webp"
              alt="Alma Lex"
              className="h-[22px] w-[22px]"
            />
            <span className="text-secondary-foreground text-xl font-bold">
              Alma Lex
            </span>
          </a>
        }
        links={
          <>
            {s.nav.map((link) => (
              <NavLink key={link.href} href={`${prefix}${link.href}`}>
                {link.label}
              </NavLink>
            ))}
          </>
        }
        actions={<><ThemeToggle /><LanguageSelector /></>}
        cta={
          <a
            href="/chat"
            className="bg-primary text-primary-foreground hover:bg-primary/85 flex items-center gap-2 rounded-[10px] px-6 py-2.5 text-sm font-semibold transition-colors"
          >
            {s.cta}
            <ArrowRight className="h-4 w-4" />
          </a>
        }
        mobileContent={
          <nav className="flex flex-col gap-0">
            {s.nav.map((link) => (
              <SheetClose asChild key={link.href}>
                <a
                  href={`${prefix}${link.href}`}
                  className="border-border text-secondary-foreground border-b py-3 text-lg font-medium"
                >
                  {link.label}
                </a>
              </SheetClose>
            ))}
            <div className="mt-4 flex items-center gap-2">
              <ThemeToggle />
              <LanguageSelector />
            </div>
            <SheetClose asChild>
              <a
                href="/chat"
                className="bg-primary text-primary-foreground hover:bg-primary/85 mt-4 flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-base font-semibold transition-colors"
              >
                {s.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </SheetClose>
          </nav>
        }
      />

      <Outlet />

      <SiteFooter className="bg-gradient-to-b from-[#1A324D] to-[#0F1F33]">
        <div className="flex max-w-[700px] flex-col items-center gap-6">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-white md:text-[32px]">
            {s.footerHeading}
          </h2>
          <p className="text-center text-[17px] text-[#9ABBD8]">
            {s.footerBody}
          </p>
          <a
            href="/chat"
            className="flex items-center gap-2.5 rounded-[12px] bg-gradient-to-r from-[#3B82C4] to-[#2E6FA8] px-8 py-4 text-base font-semibold text-white shadow-[0_4px_20px_#3B82C440] transition-colors hover:from-[#2E6FA8] hover:to-[#245A8A]"
          >
            {s.footerCta}
            <ArrowRight className="h-[18px] w-[18px]" />
          </a>
        </div>

        <FooterDivider />

        <FooterLinks>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/logo-white.webp" alt="" className="h-5 w-5" />
              <span className="text-[17px] font-bold text-white">Alma Lex</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-7">
            <a
              href="https://github.com/gartmeier/almalex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#8AABC8] transition-colors hover:text-white"
            >
              GitHub
            </a>
            <a
              href={`${prefix}#faq`}
              className="text-sm font-medium text-[#8AABC8] transition-colors hover:text-white"
            >
              FAQ
            </a>
            <a
              href={`${prefix}/${s.privacyPath}`}
              className="text-sm font-medium text-[#8AABC8] transition-colors hover:text-white"
            >
              {s.privacy}
            </a>
            <a
              href={`${prefix}/${s.imprintPath}`}
              className="text-sm font-medium text-[#8AABC8] transition-colors hover:text-white"
            >
              {s.imprint}
            </a>
          </div>
        </FooterLinks>

        <div className="flex flex-col items-center gap-1.5">
          <p className="text-center text-xs text-[#7A9AB5]">© 2026 Alma Lex</p>
          <p className="text-center text-xs text-[#7A9AB5]">{s.disclaimer}</p>
        </div>
      </SiteFooter>
    </div>
  );
}
