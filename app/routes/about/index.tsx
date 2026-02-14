import { AboutHero, IdentitySection, TeamSection } from "./components";
import { getFixedT } from "~/i18n/server";
import { data, type LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const t = await getFixedT(request);

  return data({
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
