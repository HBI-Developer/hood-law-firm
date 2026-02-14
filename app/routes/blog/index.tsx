import { data, useParams, type LoaderFunctionArgs } from "react-router";
import { getFixedT, getLang } from "~/i18n/server";
import { db } from "~/databases/config.server";
import { articles, blogCategories } from "~/databases/schema";
import { eq, desc, and, count } from "drizzle-orm";
import { useLoaderData, useNavigation } from "react-router";
import { NavLink } from "~/components";
import { ARTICLES_IN_PAGE, DEFAULT_BLOG_CATEGORY } from "~/constants";
import { ArticleCard, SkeletonCard } from "./components";
import getPaginationRange from "./functions/getPaginationRange";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { Button } from "react-aria-components";
import { useRef } from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const t = await getFixedT(request);
  const locale = (await getLang(request)) || "ar";
  const { category, page } = params;
  const selectedCategoryId = category || DEFAULT_BLOG_CATEGORY;
  const currentPage = Math.max(1, Number(page || "1"));

  try {
    const categories = await db.select().from(blogCategories);

    const whereClause = and(
      eq(articles.lang, locale),
      eq(articles.category, Number(selectedCategoryId)),
    );

    const [{ value: totalCount }] = await db
      .select({ value: count() })
      .from(articles)
      .where(whereClause);

    const totalPages = Math.ceil(totalCount / ARTICLES_IN_PAGE);

    const paginatedArticles = await db.query.articles.findMany({
      where: whereClause,
      with: {
        categoryDetails: true,
      },
      orderBy: [desc(articles.createdAt)],
      limit: ARTICLES_IN_PAGE,
      offset: (currentPage - 1) * ARTICLES_IN_PAGE,
    });

    return data({
      articles: paginatedArticles,
      categories,
      totalPages,
      currentPage,
      selectedCategoryId: Number(selectedCategoryId),
      metaTags: {
        title: t("title", { title: t("link.blog") }),
        description: t("blog.description"),
      },
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return data({
      articles: [],
      categories: [],
      totalPages: 0,
      currentPage: 1,
      selectedCategoryId: null,
      metaTags: {
        title: t("title", { title: t("link.blog") }),
        description: t("blog.description"),
      },
    });
  }
};

// @ts-expect-error TypeScript Analyzer is wrong
export function meta({ data }: typeof loader) {
  if (!data) return [{ title: "Law Firm" }];

  const { title, description } = data.metaTags;

  return [{ title }, { name: "description", content: description }];
}

export default function Blog() {
  const { articles, categories, totalPages, currentPage, selectedCategoryId } =
    useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const locale = useSelector((state: RootState) => state.language.locale);
  const params = useParams();
  const categoryIsAdded = useRef(false);

  return (
    <main className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-6">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t("blog.heading")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t("blog.describe")}
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => {
            if (!params.category && String(cat.id) === DEFAULT_BLOG_CATEGORY) {
              return (
                <Button
                  key={cat.id}
                  onClick={() => {
                    if (categoryIsAdded.current) return;
                    const newUrl = `${window.location.pathname}/${cat.id}`;
                    window.history.replaceState({ path: newUrl }, "", newUrl);
                    categoryIsAdded.current = true;
                  }}
                  className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
                    selectedCategoryId === cat.id
                      ? "bg-secondary text-primary border-secondary shadow-md"
                      : "bg-white text-gray-600 border-gray-100 hover:border-side-2"
                  }`}
                >
                  {t(`blog.category.${cat.category}`)}
                </Button>
              );
            }

            return (
              <NavLink
                key={cat.id}
                to={`/${locale}/blog/${cat.id}`}
                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
                  selectedCategoryId === cat.id
                    ? "bg-secondary text-primary border-secondary shadow-md"
                    : "bg-white text-gray-600 border-gray-100 hover:border-side-2"
                }`}
              >
                {t(`blog.category.${cat.category}`)}
              </NavLink>
            );
          })}
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/40 backdrop-blur-[2px] rounded-2xl transition-opacity duration-300">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-side-2 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-secondary font-bold">
                  {t("blog.loading")}...
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && articles.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : articles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
          </div>

          {!isLoading && articles.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-6">📋</div>
              <h3 className="text-2xl font-bold text-secondary">
                {t("blog.noArticle")}
              </h3>
              <p className="text-gray-500 mt-2">{t("blog.noArticleMessage")}</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            {getPaginationRange(currentPage, totalPages).map((page, i) => {
              if (page === "...") {
                return (
                  <span
                    key={`dots-${i}`}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 font-bold"
                  >
                    ...
                  </span>
                );
              }

              return (
                <NavLink
                  key={page}
                  to={`/${locale}/blog/${params.category || DEFAULT_BLOG_CATEGORY}/${page}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all duration-300 ${
                    currentPage === page
                      ? "bg-side-2 text-secondary shadow-lg transform scale-110"
                      : "bg-white text-gray-600 border border-gray-100 hover:border-side-2 hover:text-side-2"
                  }`}
                >
                  {page}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
