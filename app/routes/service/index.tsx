import { getFixedT } from "~/i18n/server";
import { data, type LoaderFunctionArgs } from "react-router";
import { and, eq, type InferSelectModel } from "drizzle-orm";
import { services, team } from "~/databases/schema";
import { db } from "~/databases/config.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request);
  const { lang, slug } = params;

  let service: InferSelectModel<typeof services> | undefined;
  let serviceError = false;

  try {
    service = await db.query.services.findFirst({
      where: and(
        eq(services.slug, slug || ""),
        eq(services.lang, lang || "en"),
      ),
    });
  } catch (_) {
    serviceError = true;
  }

  return data({
    service,
    serviceError,
    metaTags: {
      title: t("title", { title: service?.label || "service" }),
      description: t("about.description"),
    },
  });
};

// @ts-expect-error TypeScript Analyzer is wrong
export function meta({ data }: typeof loader) {
  if (!data) return [{ title: "Law Firm" }];

  const { title, description } = data.metaTags;

  return [{ title }, { name: "description", content: description }];
}

export default function Service() {
  return <div>Service</div>;
}
