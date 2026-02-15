import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const blogCategories = sqliteTable("blog_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  category: text("category").notNull(),
});

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  image: text("image").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull(),
  lang: text("lang").notNull().default("en"),
  createdAt: integer("created_at").notNull(),
  modifiedAt: integer("modified_at").notNull(),
  category: integer("category").references(() => blogCategories.id),
  views: integer("views").default(0),
});

export const awards = sqliteTable("awards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  image: text("image").notNull(),
});

export const legal = sqliteTable("legal", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull(),
  lang: text("lang").notNull().default("en"),
});

export const careers = sqliteTable("careers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lang: text("lang").notNull().default("en"),
  title: text("title").notNull(),
  overview: text("overview").notNull(),
  opportunities: integer("opportunities").notNull(),
  type: integer("type").notNull(),
  deadline: integer("deadline").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  duties: text("duties").notNull(),
  expectations: text("expectations").notNull(),
  experience: text("experience").notNull(),
  notes: text("notes").notNull(),
});

export const stats = sqliteTable("stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull().unique(),
  icon: text("icon").notNull(),
  stat: integer("stat").notNull(),
  prefix: text("prefix"),
  suffix: text("suffix"),
  lang: text("lang").notNull().default("en"),
});

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  image: text("image").notNull(),
  icon: text("icon").notNull(),
  label: text("label").notNull().unique(),
  overview: text("overview").notNull(),
  slug: text("slug").notNull(),
  lang: text("lang").notNull().default("en"),
});

export const team = sqliteTable("team", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  job: integer("job").notNull(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  bio: text("bio").notNull(),
  lang: text("lang").notNull().default("en"),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  position: text("position").notNull(),
  testimonial: text("testimonial").notNull(),
  lang: text("lang").notNull().default("en"),
});

export const blogCategoriesRelations = relations(
  blogCategories,
  ({ many }) => ({
    articles: many(articles),
  }),
);

export const articlesRelations = relations(articles, ({ one }) => ({
  categoryDetails: one(blogCategories, {
    fields: [articles.category],
    references: [blogCategories.id],
  }),
}));
