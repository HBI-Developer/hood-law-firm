import { Icon } from "@iconify/react";

export default function ErrorView({
  onRetry,
  t,
}: {
  onRetry: () => void;
  t: any;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        <div className="bg-side-2/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-side-2/20">
          <Icon
            icon="mdi:alert-circle-outline"
            className="w-12 h-12 text-side-2"
          />
        </div>
        <h2 className="text-3xl font-bold font-primary text-secondary mb-4">
          {t("errors.error_fetching_data")}
        </h2>
        <p className="text-stone-500 font-secondary text-lg mb-10 leading-relaxed">
          {t("errors.error_general.describe")}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-sm hover:bg-side-1 transition-all duration-300 font-bold group"
        >
          <Icon
            icon="mdi:refresh"
            className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
          />
          {t("errors.retry_fetch")}
        </button>
      </div>
    </div>
  );
}
