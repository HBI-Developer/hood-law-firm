import type { Route } from "../home/+types/index";
import {
  AwardsSection,
  HeroSection,
  MapSection,
  StatsSection,
  TestimonialsSection,
} from "./components";
import { data, type LoaderFunctionArgs } from "react-router";
import { getFixedT } from "~/i18n/server";
import { eq, type InferSelectModel } from "drizzle-orm";
import { stats } from "~/databases/schema";
import { db } from "~/databases/config.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request);
  const { lang } = params;

  let statistics: Array<InferSelectModel<typeof stats>> = [];
  let statsError = false;

  try {
    statistics = await db.query.stats.findMany({
      where: eq(stats.lang, lang || "en"),
    });
  } catch (_) {
    statsError = true;
  }

  return data({
    stats: statistics,
    statsError,
    metaTags: {
      title: t("home"),
      description: t("description"),
    },
  });
};

// @ts-expect-error TypeScript Analyzer is wrong
export function meta({ data }: typeof loader) {
  if (!data) return [{ title: "Law Firm" }];

  const { title, description } = data.metaTags;

  return [{ title }, { name: "description", content: description }];
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AwardsSection />
      <TestimonialsSection />
      <MapSection />
    </>
  );
}
