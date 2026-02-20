import type { InferSelectModel } from "drizzle-orm";
import type {
  articles,
  awards,
  blogCategories,
  careers,
  legal,
  services,
  stats,
  team,
  testimonials,
} from "~/databases/schema";

export interface HoodDatabase {
  getStats(
    lang: Locale,
  ): Promise<readonly [Array<InferSelectModel<typeof stats>>, boolean]>;

  getAwards(): Promise<
    readonly [Array<InferSelectModel<typeof awards>>, boolean]
  >;

  getTestimonials(
    lang: Locale,
  ): Promise<readonly [Array<InferSelectModel<typeof testimonials>>, boolean]>;

  getTeams(
    lang: Locale,
  ): Promise<readonly [Array<InferSelectModel<typeof team>>, boolean]>;

  getServices(
    lang: Locale,
  ): Promise<readonly [Array<InferSelectModel<typeof services>>, boolean]>;

  getService(
    lang: Locale,
    slug: string,
  ): Promise<readonly [InferSelectModel<typeof services> | undefined, boolean]>;

  getCareersCount(lang: Locale): Promise<number>;

  getCareers(
    lang: Locale,
    limit: number,
    offset: number,
  ): Promise<Array<InferSelectModel<typeof careers>>>;

  getArticleCategories(
    lang: Locale,
  ): Promise<Array<InferSelectModel<typeof blogCategories>>>;

  getArticleCount(lang: Locale, category: number): Promise<number>;

  getArticles(
    lang: Locale,
    category: number,
    limit: number,
    offset: number,
  ): Promise<Array<InferSelectModel<typeof articles>>>;

  getArticle(
    lang: Locale,
    slug: string,
  ): Promise<readonly [InferSelectModel<typeof articles> | undefined, boolean]>;

  getPrevArticle(
    lang: Locale,
    time: number,
  ): Promise<readonly [InferSelectModel<typeof articles> | undefined, boolean]>;

  getNextArticle(
    lang: Locale,
    time: number,
  ): Promise<readonly [InferSelectModel<typeof articles> | undefined, boolean]>;

  updateArticleViews(id: number, views: number): Promise<void>;

  getLegal(
    lang: Locale,
    slug: string,
  ): Promise<readonly [InferSelectModel<typeof legal> | undefined, boolean]>;
}
