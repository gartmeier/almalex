import { ArrowRight, Github } from "lucide-react";
import { Outlet, useLocation } from "react-router";
import { LanguageSelector } from "~/components/layout/language-selector";
import { FooterDivider, FooterLinks, SiteFooter } from "~/components/website/site-footer";
import { NavLink, SiteNav } from "~/components/website/site-nav";

function useLangPrefix() {
  let location = useLocation();
  let parts = location.pathname.split("/").filter(Boolean);
  let lang = ["de", "fr", "en"].includes(parts[0]) ? parts[0] : "de";
  return `/${lang}`;
}

export default function LandingLayout() {
  let prefix = useLangPrefix();

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
            <NavLink href={`${prefix}#so-funktionierts`}>So funktioniert's</NavLink>
            <NavLink href={`${prefix}#datenquellen`}>Datenquellen</NavLink>
            <NavLink href={`${prefix}#datenschutz`}>Datenschutz</NavLink>
            <NavLink href={`${prefix}#faq`}>FAQ</NavLink>
          </>
        }
        actions={<LanguageSelector />}
        cta={
          <a
            href="/chat"
            className="flex items-center gap-2 rounded-[10px] bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/85 transition-colors"
          >
            Ausprobieren
            <ArrowRight className="w-4 h-4" />
          </a>
        }
      />

      <Outlet />

      <SiteFooter className="bg-gradient-to-b from-[#1A324D] to-[#0F1F33]">
        <div className="flex flex-col items-center gap-6 max-w-[700px]">
          <h2 className="text-2xl md:text-[32px] font-extrabold text-white text-center tracking-tight">
            Bereit für deine nächste Rechtsfrage?
          </h2>
          <p className="text-[17px] text-[#8AABC8] text-center">
            Egal ob Obligationenrecht, Mietrecht oder Strafrecht: frag
            die Rechts-KI einfach. Kostenlos und ohne Anmeldung.
          </p>
          <a
            href="/chat"
            className="flex items-center gap-2.5 rounded-[12px] bg-gradient-to-r from-[#3B82C4] to-[#2E6FA8] px-8 py-4 text-base font-semibold text-white shadow-[0_4px_20px_#3B82C440] hover:from-[#2E6FA8] hover:to-[#245A8A] transition-colors"
          >
            Jetzt loslegen
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
          <div className="flex items-center gap-7">
            <a href="https://github.com/gartmeier/almalex" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#8AABC8] hover:text-white transition-colors">GitHub</a>
            <a href={`${prefix}#faq`} className="text-sm font-medium text-[#8AABC8] hover:text-white transition-colors">FAQ</a>
            <a href={`${prefix}/policies`} className="text-sm font-medium text-[#8AABC8] hover:text-white transition-colors">Datenschutz</a>
            <a href={`${prefix}/policies`} className="text-sm font-medium text-[#8AABC8] hover:text-white transition-colors">Impressum</a>
          </div>
        </FooterLinks>

        <div className="flex flex-col items-center gap-1.5">
          <p className="text-xs text-[#4A6A85] text-center">
            © 2026 Alma Lex
          </p>
          <p className="text-xs text-[#4A6A85] text-center">
            Alma Lex bietet keine Rechtsberatung. Bei konkreten Fällen eine Fachperson beiziehen.
          </p>
        </div>
      </SiteFooter>
    </div>
  );
}
