import { getFixedT } from "~/i18n/server";
import { data, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { useRef, type RefObject } from "react";
import { Icon } from "@iconify/react";
import calculateReadingTime from "~/utils/calculateReadingTime";
import { ReadingProgressBar } from "../article/components";
import getReadingTime from "~/utils/getReadingTime";
import { ArticleContent } from "~/components";
import { hooddb } from "~/constants.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request),
    { lang, slug } = params as { lang: Locale; slug: string },
    [article, error] = await hooddb.getLegal(lang, slug);

  return data({
    article: article && !error ? article : null,
    metaTags: {
      title: t("title", { title: " | " + t("footer.terms") }),
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

export default function TermsAndConditions() {
  const { article } = useLoaderData<typeof loader>(),
    { t } = useTranslation(),
    locale = useSelector((state: RootState) => state.language.locale),
    articleContentRef = useRef<HTMLElement>(null);

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        {t("blog.noArticle")}
      </div>
    );
  }

  const readingTime = calculateReadingTime(article.content);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ReadingProgressBar
        articleRef={articleContentRef as RefObject<HTMLElement>}
      />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-600 text-sm border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:clock" className="w-4 h-4" />
              <span>{getReadingTime(readingTime, locale)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <article
          ref={articleContentRef}
          className="bg-white rounded-lg shadow-sm p-8 md:p-12"
        >
          <ArticleContent contentJson={article.content} />
        </article>
      </div>
    </div>
  );
}
