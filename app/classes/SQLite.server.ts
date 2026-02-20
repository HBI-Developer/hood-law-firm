"use server";

import {
  and,
  count,
  desc,
  eq,
  gt,
  lt,
  type InferSelectModel,
} from "drizzle-orm";
import { db } from "~/databases/config.server";
import {
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
import type { HoodDatabase } from "./type";

export default class SQLite implements HoodDatabase {
  async getStats(lang: Locale) {
    let statistics: Array<InferSelectModel<typeof stats>> = [],
      error = false;

    try {
      statistics = await db.query.stats.findMany({
        where: eq(stats.lang, lang || "en"),
      });
    } catch (_) {
      error = true;
    }

    return [statistics, error] as const;
  }

  async getAwards() {
    let collection: Array<InferSelectModel<typeof awards>> = [],
      error = false;

    try {
      collection = await db.select().from(awards);
    } catch (_) {
      error = true;
    }

    return [collection, error] as const;
  }

  async getTestimonials(lang: Locale) {
    let collection: Array<InferSelectModel<typeof testimonials>> = [],
      error = false;

    try {
      collection = await db.query.testimonials.findMany({
        where: eq(testimonials.lang, lang || "en"),
      });
    } catch (_) {
      error = true;
    }

    return [collection, error] as const;
  }

  async getTeams(lang: Locale) {
    let collection: Array<InferSelectModel<typeof team>> = [],
      error = false;

    try {
      collection = await db.query.team.findMany({
        where: eq(team.lang, lang),
      });
    } catch (_) {
      error = true;
    }

    return [collection, error] as const;
  }

  async getServices(lang: Locale) {
    let collection: Array<InferSelectModel<typeof services>> = [],
      error = false;

    try {
      collection = await db.query.services.findMany({
        where: eq(services.lang, lang || "en"),
      });
    } catch (_) {
      error = true;
    }

    return [collection, error] as const;
  }

  async getService(lang: Locale, slug: string) {
    let service: InferSelectModel<typeof services> | undefined,
      error = false;

    try {
      service = await db.query.services.findFirst({
        where: and(
          eq(services.slug, slug || ""),
          eq(services.lang, lang || "en"),
        ),
      });
    } catch (_) {
      error = true;
    }

    return [service, error] as const;
  }

  async getCareersCount(lang: Locale) {
    const [{ value }] = await db
      .select({ value: count() })
      .from(careers)
      .where(eq(careers.lang, lang));

    return value;
  }

  async getCareers(lang: Locale, limit: number, offset: number) {
    return await db.query.careers.findMany({
      where: eq(careers.lang, lang),
      limit,
      offset,
      orderBy: [desc(careers.id)],
    });
  }

  async getArticleCategories(lang: Locale) {
    return await db.select().from(blogCategories);
  }

  async getArticleCount(lang: Locale, category: number) {
    const [{ value }] = await db
      .select({ value: count() })
      .from(articles)
      .where(and(eq(articles.lang, lang), eq(articles.category, category)));

    return value || 0;
  }

  async getArticles(
    lang: Locale,
    category: number,
    limit: number,
    offset: number,
  ) {
    return await db.query.articles.findMany({
      where: and(eq(articles.lang, lang), eq(articles.category, category)),
      with: {
        categoryDetails: true,
      },
      orderBy: [desc(articles.createdAt)],
      limit,
      offset,
    });
  }

  async getArticle(lang: Locale, slug: string) {
    let article: InferSelectModel<typeof articles> | undefined,
      error = false;

    try {
      article = await db.query.articles.findFirst({
        where: and(
          eq(articles.slug, slug || ""),
          eq(articles.lang, lang || "ar"),
        ),
        with: {
          categoryDetails: true,
        },
      });
    } catch (_) {
      error = true;
    }

    return [article, error] as const;
  }

  async getPrevArticle(lang: Locale, time: number) {
    let article: InferSelectModel<typeof articles> | undefined,
      error = false;

    try {
      article = await db.query.articles.findFirst({
        where: and(
          eq(articles.lang, lang || "ar"),
          lt(articles.createdAt, time),
        ),
        orderBy: [desc(articles.createdAt)],
      });
    } catch (_) {
      error = true;
    }

    return [article, error] as const;
  }

  async getNextArticle(lang: Locale, time: number) {
    let article: InferSelectModel<typeof articles> | undefined,
      error = false;

    try {
      article = await db.query.articles.findFirst({
        where: and(
          eq(articles.lang, lang || "ar"),
          gt(articles.createdAt, time),
        ),
        orderBy: [desc(articles.createdAt)],
      });
    } catch (_) {
      error = true;
    }

    return [article, error] as const;
  }

  async updateArticleViews(id: number, views: number) {
    await db.update(articles).set({ views: views }).where(eq(articles.id, id));
  }

  async getLegal(lang: Locale, slug: string) {
    let article: InferSelectModel<typeof legal> | undefined,
      error = false;

    try {
      article = await db.query.legal.findFirst({
        where: and(eq(legal.lang, lang || "en"), eq(legal.slug, slug || "404")),
      });
    } catch (_) {
      error = true;
    }

    return [article, error] as const;
  }
}
