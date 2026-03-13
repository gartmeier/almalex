import { ArrowRight, Github } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router";
import { LanguageSelector } from "~/components/layout/language-selector";
import { FooterDivider, FooterLinks, SiteFooter } from "~/components/website/site-footer";
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
    footerBody: "Egal ob Obligationenrecht, Mietrecht oder Strafrecht: frag die Rechts-KI einfach. Kostenlos und ohne Anmeldung.",
    footerCta: "Jetzt loslegen",
    privacy: "Datenschutz",
    imprint: "Impressum",
    disclaimer: "Alma Lex bietet keine Rechtsberatung. Bei konkreten Fällen eine Fachperson beiziehen.",
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
    footerBody: "Whether it's contract law, tenancy law, or criminal law: just ask the legal AI. Free and without registration.",
    footerCta: "Get Started",
    privacy: "Privacy",
    imprint: "Imprint",
    disclaimer: "Alma Lex does not provide legal advice. For specific cases, consult a qualified professional.",
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
    footerBody: "Que ce soit le droit des obligations, le droit du bail ou le droit pénal : posez simplement la question à l'IA juridique. Gratuit et sans inscription.",
    footerCta: "Commencer",
    privacy: "Protection des données",
    imprint: "Mentions légales",
    disclaimer: "Alma Lex ne fournit pas de conseil juridique. Pour des cas concrets, consultez un ou une spécialiste.",
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
    <div className="min-h-screen font-['Inter_Variable',sans-serif] bg-background">
      <SiteNav
        className="bg-card/[0.93] border-b border-border"
        logo={
          <a href={prefix} className="flex items-center gap-2">
            <img src="/logo-color.webp" alt="Alma Lex" className="w-[22px] h-[22px]" />
            <span className="text-xl font-bold text-secondary-foreground">Alma Lex</span>
          </a>
        }
        links={
          <>
            {s.nav.map((link) => (
              <NavLink key={link.href} href={`${prefix}${link.href}`}>{link.label}</NavLink>
            ))}
          </>
        }
        actions={<LanguageSelector />}
        cta={
          <a
            href="/chat"
            className="flex items-center gap-2 rounded-[10px] bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/85 transition-colors"
          >
            {s.cta}
            <ArrowRight className="w-4 h-4" />
          </a>
        }
      />

      <Outlet />

      <SiteFooter className="bg-gradient-to-b from-[#1A324D] to-[#0F1F33]">
        <div className="flex flex-col items-center gap-6 max-w-[700px]">
          <h2 className="text-2xl md:text-[32px] font-extrabold text-white text-center tracking-tight">
            {s.footerHeading}
          </h2>
          <p className="text-[17px] text-[#9ABBD8] text-center">
            {s.footerBody}
          </p>
          <a
            href="/chat"
            className="flex items-center gap-2.5 rounded-[12px] bg-gradient-to-r from-[#3B82C4] to-[#2E6FA8] px-8 py-4 text-base font-semibold text-white shadow-[0_4px_20px_#3B82C440] hover:from-[#2E6FA8] hover:to-[#245A8A] transition-colors"
          >
            {s.footerCta}
            <ArrowRight className="w-[18px] h-[18px]" />
          </a>
        </div>

        <FooterDivider />

        <FooterLinks>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/logo-white.webp" alt="" className="w-5 h-5" />
              <span className="text-[17px] font-bold text-white">Alma Lex</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-7">
            <a href="https://github.com/gartmeier/almalex" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#8AABC8] hover:text-white transition-colors">GitHub</a>
            <a href={`${prefix}#faq`} className="text-sm font-medium text-[#8AABC8] hover:text-white transition-colors">FAQ</a>
            <a href={`${prefix}/policies#privacy`} className="text-sm font-medium text-[#8AABC8] hover:text-white transition-colors">{s.privacy}</a>
            <a href={`${prefix}/policies#terms`} className="text-sm font-medium text-[#8AABC8] hover:text-white transition-colors">{s.imprint}</a>
          </div>
        </FooterLinks>

        <div className="flex flex-col items-center gap-1.5">
          <p className="text-xs text-[#7A9AB5] text-center">
            © 2026 Alma Lex
          </p>
          <p className="text-xs text-[#7A9AB5] text-center">
            {s.disclaimer}
          </p>
        </div>
      </SiteFooter>
    </div>
  );
}
