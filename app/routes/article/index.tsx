import { data, useLoaderData, type LoaderFunctionArgs } from "react-router";
import getArticleSummary from "../blog/functions/getArticleSummary";
import { createCookie } from "react-router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { ArticleContent, NavLink } from "~/components";
import { useRef, type RefObject } from "react";
import { Icon } from "@iconify/react";
import calculateReadingTime from "~/utils/calculateReadingTime";
import { ReadingProgressBar } from "./components";
import getReadingTime from "~/utils/getReadingTime";
import getViews from "./functions/getViews";
import { hooddb } from "~/constants.server";

export const viewedArticlesCookie = createCookie("viewed_articles", {
  path: "/",
  sameSite: "lax",
  httpOnly: false,
  maxAge: 60 * 60 * 24,
});

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { lang, slug } = params as { lang: Locale; slug: string };

  if (!lang || !slug) throw data({ message: "Not Found" }, { status: 404 });

  const [article, error] = await hooddb.getArticle(lang, slug);

  if (!article) {
    throw data({ message: "Not Found" }, { status: 404 });
  }

  if (error) {
    throw data({ message: "Internal Error" }, { status: 500 });
  }

  const cookieHeader = request.headers.get("Cookie"),
    viewedArticles = (await viewedArticlesCookie.parse(cookieHeader)) || [];

  let updatedViews = article.views || 0,
    setCookieHeader: string | null = null;

  if (!viewedArticles.includes(article.slug)) {
    updatedViews += 1;

    hooddb.updateArticleViews(article.id, updatedViews);

    viewedArticles.push(article.slug);
    setCookieHeader = await viewedArticlesCookie.serialize(viewedArticles);
  }

  const [prevArticle] = await hooddb.getPrevArticle(lang, article.createdAt),
    [nextArticle] = await hooddb.getNextArticle(lang, article.createdAt),
    readingTime = calculateReadingTime(article.content),
    summary = await getArticleSummary(article.content);

  return data(
    {
      article: {
        ...article,
        views: updatedViews,
        readingTime,
      },
      prevArticle,
      nextArticle,
      metaTags: {
        title: article.title,
        description: `${summary.slice(0, 150)}${summary.length > 150 ? "..." : ""}`,
      },
    },
    {
      headers: setCookieHeader ? { "Set-Cookie": setCookieHeader } : {},
    },
  );
};

// @ts-expect-error TypeScript Analyzer is wrong
export function meta({ data }: typeof loader) {
  if (!data) return [{ title: "Law Firm" }];

  const { title, description } = data.metaTags;

  return [{ title }, { name: "description", content: description }];
}

export default function Article() {
  const { article, prevArticle, nextArticle } = useLoaderData<typeof loader>(),
    { t } = useTranslation(),
    locale = useSelector((state: RootState) => state.language.locale),
    isAr = locale === "ar",
    articleContentRef = useRef<HTMLElement>(null),
    formatDate = (timestamp: number) => {
      return new Date(timestamp).toLocaleDateString(isAr ? "ar-QA" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ReadingProgressBar
        articleRef={articleContentRef as RefObject<HTMLElement>}
      />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="inline-block bg-secondary/10 text-secondary px-4 py-1.5 rounded text-sm font-semibold mb-6">
            {t(`blog.category.${article.categoryDetails?.category}`)}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-600 text-sm border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:calendar" className="w-4 h-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:clock" className="w-4 h-4" />
              <span>{getReadingTime(article.readingTime, locale)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:eye" className="w-4 h-4" />
              <span>{getViews(article.views, locale)}</span>
            </div>
          </div>
        </div>
      </div>

      {article.image && (
        <div className="max-w-4xl mx-auto px-6 mt-8">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12">
        <article
          ref={articleContentRef}
          className="bg-white rounded-lg shadow-sm p-8 md:p-12"
        >
          <ArticleContent contentJson={article.content} />

          <div className="mt-12 pt-6 border-t border-gray-200 text-gray-500 text-sm italic">
            {t("article.last_modified")}: {formatDate(article.modifiedAt)}
          </div>
        </article>

        {(prevArticle || nextArticle) && (
          <div className="mt-12 flex flex-col gap-6">
            {prevArticle ? (
              <NavLink
                to={`/${locale}/article/${prevArticle.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-secondary transition-all duration-300">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    {isAr ? (
                      <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                    ) : (
                      <Icon icon="lucide:chevron-left" className="w-4 h-4" />
                    )}
                    <span className="font-semibold">
                      {t("article.prev_article")}
                    </span>
                  </div>
                  <h3 className="text-secondary font-bold group-hover:text-side-2 transition-colors line-clamp-2">
                    {prevArticle.title}
                  </h3>
                </div>
              </NavLink>
            ) : (
              <div />
            )}

            {nextArticle && (
              <NavLink
                to={`/${locale}/article/${nextArticle.slug}`}
                className="group block"
              >
                <div
                  className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-secondary transition-all duration-300 ${isAr ? "text-left" : "text-right"}`}
                >
                  <div
                    className={`flex items-center gap-2 text-gray-500 text-sm mb-2 ${isAr ? "flex-row-reverse" : "justify-end"}`}
                  >
                    {isAr ? (
                      <Icon icon="lucide:chevron-left" className="w-4 h-4" />
                    ) : (
                      <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                    )}
                    <span className="font-semibold">
                      {t("article.next_article")}
                    </span>
                  </div>
                  <h3 className="text-secondary font-bold group-hover:text-side-2 transition-colors line-clamp-2">
                    {nextArticle.title}
                  </h3>
                </div>
              </NavLink>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
