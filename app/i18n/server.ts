import i18next from "i18next";
import { localeCookie } from "~/root";
import enTranslation from "./en.json";
import arTranslation from "./ar.json";

export async function getLang(request: Request) {
  const url = new URL(request.url);
  const langFromUrl = url.pathname.split("/")[1];

  const cookieHeader = request.headers.get("Cookie");
  const locale =
    langFromUrl || (await localeCookie.parse(cookieHeader)) || "en";

  return locale;
}

export async function getFixedT(request: Request) {
  const locale = await getLang(request);

  const instance = i18next.createInstance();
  await instance.init({
    lng: locale,
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
  });

  return instance.t;
}
