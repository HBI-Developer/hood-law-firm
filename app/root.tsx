import {
  data,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LoaderFunctionArgs,
} from "react-router";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Button } from "react-aria-components";
import parser from "accept-language-parser";
import { Provider as ReduxProvider } from "react-redux";
import type { Route } from "./+types/root";
import "./app.css";
import "./i18n";
import { store } from "./store";
import { LanguageManager } from "./components";
import { createCookie } from "react-router";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./constants";
import NotFound from "./routes/not-found";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const localeCookie = createCookie("language", {
  path: "/",
  sameSite: "lax",
  httpOnly: false,
  maxAge: 31536000,
});

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie"),
    url = new URL(request.url),
    supportedLanguages = Object.keys(SUPPORTED_LANGUAGES);

  let locale = params.lang || url.searchParams.get("lng");

  if (!locale) {
    locale = await localeCookie.parse(cookieHeader);
  }

  if (!locale) {
    const acceptLanguage = request.headers.get("Accept-Language");
    if (acceptLanguage) {
      locale = parser.pick(supportedLanguages, acceptLanguage);
    }
  }

  if (!locale || !supportedLanguages.includes(locale as Locale)) {
    locale = DEFAULT_LANGUAGE;
  }

  const currentCookieValue = await localeCookie.parse(cookieHeader);

  if (currentCookieValue !== locale) {
    return data(
      { locale },
      {
        headers: {
          "Set-Cookie": await localeCookie.serialize(locale),
        },
      },
    );
  }

  return data({ locale });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <LanguageManager>
        <html lang="en" style={{ overflowY: "hidden" }}>
          <head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/icon.svg" type="image/svg+xml"></link>
            <Meta />
            <Links />
          </head>
          <body>
            {children}

            <ScrollRestoration />
            <Scripts />
          </body>
        </html>
      </LanguageManager>
    </ReduxProvider>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t, i18n } = useTranslation();
  let statusCode = 500,
    details = "An unexpected error occurred.",
    stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (statusCode === 404) {
      return <NotFound />;
    }
    details = error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="h-screen flex flex-col bg-primary items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <Icon
          icon="solar:danger-triangle-bold-duotone"
          width="120"
          className="text-red-500/10 absolute -top-10 -left-10 rotate-12"
        />
        <h1 className="text-6xl font-primary font-bold text-secondary tracking-tighter relative z-10">
          {statusCode}
        </h1>
      </div>

      <h2 className="text-3xl font-secondary font-bold text-side-1 mb-4">
        {t("errors.error_general.heading")}
      </h2>

      <p className="max-w-md text-secondary/70 font-secondary text-lg mb-4">
        {t("errors.error_general.describe")}
      </p>

      <p className="max-w-md text-red-500/80 font-secondary text-sm mb-10 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
        {details}
      </p>

      <Link to="/" className="outline-none">
        <Button className="flex items-center gap-2 bg-side-1 text-primary px-8 py-3 rounded-md font-secondary text-lg hover:bg-side-3 transition-colors shadow-lg group outline-none focus:ring-2 focus:ring-side-2">
          <Icon
            icon={
              i18n.language === "ar"
                ? "lucide:arrow-right"
                : "lucide:arrow-left"
            }
            className="group-hover:-translate-x-1 transition-transform rtl:rotate-0 ltr:rotate-180"
          />
          {t("404.back_home")}
        </Button>
      </Link>

      {stack && import.meta.env.DEV && (
        <pre className="mt-8 max-w-4xl p-6 bg-stone-900 text-stone-300 rounded-2xl overflow-auto text-left text-xs font-mono shadow-2xl border border-stone-800">
          <code className="block">{stack}</code>
        </pre>
      )}
    </div>
  );
}
