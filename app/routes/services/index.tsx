import { getFixedT } from "~/i18n/server";
import { data, type LoaderFunctionArgs } from "react-router";
import { ServicesHero, ServicesSection } from "./components";
import { hooddb } from "~/constants.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request),
    { lang } = params as { lang: Locale },
    [servicesCollection, servicesError] = await hooddb.getServices(lang);

  return data({
    services: servicesCollection,
    servicesError,
    metaTags: {
      title: t("title", { title: t("link.services") }),
      description: t("services.description"),
    },
  });
};

// @ts-expect-error TypeScript Analyzer is wrong
export function meta({ data }: typeof loader) {
  if (!data) return [{ title: "Law Firm" }];

  const { title, description } = data.metaTags;

  return [{ title }, { name: "description", content: description }];
}

export default function Services() {
  return (
    <>
      <ServicesHero />
      <ServicesSection />
    </>
  );
}
