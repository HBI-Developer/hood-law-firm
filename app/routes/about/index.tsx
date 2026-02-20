import { AboutHero, IdentitySection, TeamSection } from "./components";
import { getFixedT } from "~/i18n/server";
import { data, type LoaderFunctionArgs } from "react-router";
import { hooddb } from "~/constants.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request),
    { lang } = params,
    [teamCollection, teamError] = await hooddb.getTeams(
      (lang as Locale) || "en",
    );

  return data({
    team: teamCollection,
    teamError,
    metaTags: {
      title: t("title", { title: t("link.about") }),
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

export default function About() {
  return (
    <>
      <AboutHero />
      <TeamSection />
      <IdentitySection />
    </>
  );
}
