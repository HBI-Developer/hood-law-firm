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
import { hooddb } from "~/constants.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request),
    { lang } = params as { lang: Locale },
    [stats, statsError] = await hooddb.getStats(lang),
    [awards, awardsError] = await hooddb.getAwards(),
    [testimonials, testimonialsError] = await hooddb.getTestimonials(lang);

  return data({
    stats,
    statsError,
    awards,
    awardsError,
    testimonials,
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
