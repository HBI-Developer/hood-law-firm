import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { isRouteErrorResponse, useRevalidator } from "react-router";
import { useRouteError } from "react-router";

export default function ErrorBoundary() {
  const error = useRouteError();
  const { t } = useTranslation();
  const revalidator = useRevalidator();

  let errorMessage = t("errors.error_general.describe");
  let errorTitle = t("errors.error_fetching_data");

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data || error.statusText;
    errorTitle = `${error.status} - ${error.statusText}`;
  } else if (error instanceof Error) {
    if (process.env.NODE_ENV === "development") {
      errorMessage = error.message;
    }
  }

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-secondary/10 max-w-lg w-full">
        <div className="text-secondary mb-6 flex justify-center">
          <Icon
            icon="heroicons:exclamation-triangle"
            className="w-20 h-20 opacity-80"
          />
        </div>
        <h2 className="text-3xl font-bold text-secondary mb-3 font-primary">
          {errorTitle}
        </h2>
        <p className="text-secondary/70 mb-8 font-secondary text-lg leading-relaxed">
          {errorMessage}
        </p>
        <button
          onClick={() => revalidator.revalidate()}
          className="
            flex items-center justify-center gap-2 px-8 py-3 rounded-sm mx-auto
            bg-side-2 text-secondary font-bold text-lg
            shadow-md hover:shadow-lg hover:bg-opacity-90
            transition-all duration-300 transform hover:-translate-y-1
          "
        >
          <Icon icon="heroicons:arrow-path" className="w-6 h-6" />
          <span className="font-secondary tracking-wide">
            {t("errors.retry_fetch") || "Retry"}
          </span>
        </button>
      </div>
    </div>
  );
}