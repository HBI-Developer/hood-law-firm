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
import { awards, stats, testimonials } from "~/databases/schema";
import { db } from "~/databases/config.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request);
  const { lang } = params;

  let statistics: Array<InferSelectModel<typeof stats>> = [];
  let awardsCollection: Array<InferSelectModel<typeof awards>> = [];
  let testmonialsCollection: Array<InferSelectModel<typeof testimonials>> = [];
  let statsError = false;
  let awardsError = false;
  let testimonialsError = false;

  try {
    statistics = await db.query.stats.findMany({
      where: eq(stats.lang, lang || "en"),
    });
  } catch (_) {
    statsError = true;
  }

  try {
    awardsCollection = await db.select().from(awards);
  } catch (_) {
    awardsError = true;
  }

  try {
    testmonialsCollection = await db.query.testimonials.findMany({
      where: eq(testimonials.lang, lang || "en"),
    });
  } catch (_) {
    testimonialsError = true;
  }

  return data({
    stats: statistics,
    statsError,
    awards: awardsCollection,
    awardsError,
    testimonials: testmonialsCollection,
    testimonialsError,
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
