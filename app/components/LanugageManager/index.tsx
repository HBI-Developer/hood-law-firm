import { useEffect } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import i18n from "i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "~/store";
import { setLanguage } from "~/store/slices/language";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type Locale,
} from "~/constants";

export default function LanguageManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { locale: reduxLocale } = useSelector(
    (state: RootState) => state.language,
  );

  const rootData = useRouteLoaderData("root") as { locale: Locale } | undefined;

  useEffect(() => {
    const serverLocale = rootData?.locale;

    let targetLang: Locale = (serverLocale as Locale) || DEFAULT_LANGUAGE;

    if (targetLang !== reduxLocale || targetLang !== lang) {
      dispatch(setLanguage(targetLang));
      i18n.changeLanguage(targetLang);
      localStorage.setItem("i18nextLng", targetLang);

      if (!lang && location.pathname === "/") {
        navigate(`/${targetLang}`, { replace: true });
      }
    }

    document.documentElement.dir = SUPPORTED_LANGUAGES[targetLang].direction;
    document.documentElement.lang = targetLang;
  }, [rootData, lang, dispatch, reduxLocale, navigate, location.pathname]);

  return <>{children}</>;
}
