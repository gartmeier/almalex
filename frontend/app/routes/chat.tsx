import { useTranslation } from "react-i18next";

export default function Component() {
  const { t } = useTranslation();

  return <div className="p-4">{/* Chat interface will go here */}</div>;
}
