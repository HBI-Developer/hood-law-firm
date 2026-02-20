import i18next from "i18next";
import { localeCookie } from "~/root";
import enTranslation from "./en.json";
import arTranslation from "./ar.json";

export async function getLang(request: Request) {
  const url = new URL(request.url),
    langFromUrl = url.pathname.split("/")[1],
    cookieHeader = request.headers.get("Cookie"),
    locale = langFromUrl || (await localeCookie.parse(cookieHeader)) || "en";

  return locale;
}

export async function getFixedT(request: Request) {
  const locale = await getLang(request),
    instance = i18next.createInstance();
  await instance.init({
    lng: locale,
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
  });

  return instance.t;
}
