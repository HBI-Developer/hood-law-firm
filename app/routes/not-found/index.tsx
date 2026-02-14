import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "react-aria-components";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import type { Locale } from "~/constants";

interface Props {
  loaderData?: {
    locale: Locale;
  };
}

export default function NotFound(data: Props) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = data.loaderData?.locale
      ? i18n.t("404.title", { lng: data.loaderData.locale })
      : "Page Not Found";
  }, []);

  return (
    <div className="h-screen flex flex-col bg-primary items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <Icon
          icon="mdi:gavel"
          width="120"
          className="text-side-2/20 absolute -top-10 -left-10 rotate-12"
        />
        <h1 className="text-6xl font-primary font-bold text-secondary tracking-tighter relative z-10">
          404
        </h1>
      </div>

      <h2 className="text-3xl font-secondary font-bold text-side-1 mb-4">
        {t("404.heading")}
      </h2>

      <p className="max-w-md text-secondary/70 font-secondary text-lg mb-10">
        {t("404.describe")}
      </p>

      <Link to={`/${i18n.language}`}>
        <Button className="flex items-center gap-2 bg-side-1 text-primary px-8 py-3 rounded-md font-secondary text-lg hover:bg-side-3 transition-colors shadow-lg group outline-none focus:ring-2 focus:ring-side-2">
          <Icon
            icon={
              i18n.language === "ar"
                ? "lucide:arrow-right"
                : "lucide:arrow-left"
            }
            className="group-hover:-translate-x-1 transition-transform"
          />
          {t("404.back_home")}
        </Button>
      </Link>
    </div>
  );
}
