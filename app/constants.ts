import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";
import arLogo from "~/assets/logo-ar.svg";
import enLogo from "~/assets/logo-en.svg";

export const NAV_LINKS = [
  { name: "link.home", path: "/" },
  { name: "link.about", path: "/about" },
  { name: "link.services", path: "/services" },
  { name: "link.contact", path: "/contact" },
  { name: "link.careers", path: "/careers" },
  { name: "link.blog", path: "/blog" },
];

export const LEGAL_LINKS = [
  { name: "footer.terms_and_conditions", path: "/legal/terms-and-conditions" },
  { name: "footer.privacy_policy", path: "/legal/privacy-policy" },
  { name: "footer.cookies_policy", path: "/legal/cookies-policy" },
];

export const PHONE_NUMBER = "249 11 013 0094";

export const ANIMATION_DURATION = () => {
  return parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue("--animate-duration")
      .trim(),
  );
};

export const DEFAULT_LANGUAGE = "en";

export const SUPPORTED_LANGUAGES = {
  ar: { name: "العربية", direction: "rtl" },
  en: { name: "English", direction: "ltr" },
} as const;

export type Locale = keyof typeof SUPPORTED_LANGUAGES;

export const LOGO_BY_LANGUAGE = {
  ar: arLogo,
  en: enLogo,
};

export const MAP_LINK = "https://maps.app.goo.gl/TEkAMmnjWA9uwiwS8";

export const EMBED_MAP_LINK =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d64722591.56959051!2d-149.23960340000002!3d-8.065379849999985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x76ed042c30f318eb%3A0x8eff14a070876cbc!2z2KfZhNmF2K3Ziti3INin2YTZh9in2K_Zig!5e0!3m2!1sar!2sru!4v1771087928240!5m2!1sar!2sru";

export const CHECK_CONTACT_FIELDS_SCHEMA = z.object({
  firstName: z
    .string()
    .min(1, { message: "field_required" })
    .min(2, { message: "too_short_name" })
    .max(256, { message: "too_long_name" }),
  lastName: z
    .string()
    .min(1, { message: "field_required" })
    .min(2, { message: "too_short_name" })
    .max(256, { message: "too_long_name" }),
  email: z
    .string()
    .min(1, { message: "field_required" })
    .and(z.email({ message: "invalid_email" })),
  phone: z.preprocess(
    (val) => (val === undefined ? "" : val),
    z
      .string()
      .min(1, { message: "field_required" })
      .refine((val) => val && isValidPhoneNumber(val), {
        message: "invalid_phone",
      }),
  ),
  subject: z.string().min(1, { message: "field_required" }),
  message: z
    .string()
    .min(1, { message: "field_required" })
    .min(10, { message: "message_too_short" }),
});

export const CHECK_JOB_APPLICATION_SCHEMA = z.object({
  firstName: z
    .string()
    .min(1, { message: "field_required" })
    .min(2, { message: "too_short_name" })
    .max(256, { message: "too_long_name" }),
  lastName: z
    .string()
    .min(1, { message: "field_required" })
    .min(2, { message: "too_short_name" })
    .max(256, { message: "too_long_name" }),
  email: z
    .string()
    .min(1, { message: "field_required" })
    .and(z.email({ message: "invalid_email" })),
  phone: z.preprocess(
    (val) => (val === undefined ? "" : val),
    z
      .string()
      .min(1, { message: "field_required" })
      .refine((val) => val && isValidPhoneNumber(val), {
        message: "invalid_phone",
      }),
  ),
  resume: z
    .custom<File | null | undefined>()
    .refine(
      (file) =>
        !file ||
        (file instanceof File &&
          file.size <= MAXIMUM_PDF_RESUME_SIZE * 1024 * 1024),
      {
        message: "file_too_large",
      },
    )
    .refine(
      (file) =>
        !file || (file instanceof File && file.type === "application/pdf"),
      {
        message: "invalid_file_type",
      },
    )
    .optional(),
  coverLetter: z.string().optional(),
});

export const MAXIMUM_PDF_RESUME_SIZE = 5; // in megabytes

export const ARTICLES_IN_PAGE = 6;

export const CAREERS_IN_PAGE = 10;

export const DEFAULT_BLOG_CATEGORY = "3";
