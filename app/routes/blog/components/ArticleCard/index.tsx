import { NavLink } from "~/components";
import getArticleSummary from "../../functions/getArticleSummary";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";

interface Props {
  article: any;
}

export default function ArticleCard({ article }: Props) {
  const summary = getArticleSummary(article.content);
  const { t } = useTranslation();
  const locale = useSelector((state: RootState) => state.language.locale);

  return (
    <NavLink
      to={`/${locale}/article/${article.slug}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-primary text-secondary px-3 py-1 rounded-full text-xs font-bold">
          {t(`blog.category.${article.categoryDetails?.category}`)}
        </div>
      </div>
      <div className="p-6 flex flex-col grow">
        <div className="text-gray-500 text-xs mb-2">
          {new Date(article.createdAt).toLocaleDateString(
            locale === "ar" ? "ar-QA" : "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          )}
        </div>
        <h3 className="text-xl font-bold mb-3 text-secondary group-hover:text-side-1 transition-colors leading-tight grow">
          {article.title}
        </h3>
        <p className="text-gray-600 line-clamp-3 text-sm h-15 leading-5 text-justify">
          {summary}
        </p>
      </div>
    </NavLink>
  );
}
