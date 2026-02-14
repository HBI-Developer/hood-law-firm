import { getFixedT } from "~/i18n/server";
import { data, type LoaderFunctionArgs } from "react-router";
import { ServicesHero, ServicesSection } from "./components";
import { services } from "~/databases/schema";
import { db } from "~/databases/config.server";
import { eq, type InferSelectModel } from "drizzle-orm";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request);
  const { lang } = params;

  let servicesCollection: Array<InferSelectModel<typeof services>> = [];
  let servicesError = false;

  try {
    servicesCollection = await db.query.services.findMany({
      where: eq(services.lang, lang || "en"),
    });
  } catch (_) {
    servicesError = true;
  }

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
