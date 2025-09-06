import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "../ui/button";

export function Navigation() {
  let { t, i18n } = useTranslation();
  let language = i18n.language;

  const items = [
    { to: `/${language}/faq`, text: t("navigation.faq") },
    { to: `/${language}/terms`, text: t("navigation.terms") },
    { to: `/${language}/privacy`, text: t("navigation.privacy") },
  ];

  return (
    <nav className="flex gap-6">
      {items.map((item) => (
        <Button key={item.to} variant="ghost" asChild>
          <Link to={item.to}>{item.text}</Link>
        </Button>
      ))}
    </nav>
  );
}
