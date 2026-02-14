import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

interface DataErrorStateProps {
  message?: string;
  onRetry: () => void;
  className?: string;
  loading?: boolean;
}

export default function DataErrorState({
  message,
  onRetry,
  className = "",
  loading = false,
}: DataErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 ${className}`}
    >
      <div className="bg-red-500/10 p-4 rounded-full mb-4">
        <Icon
          icon={
            loading ? "solar:refresh-linear" : "solar:danger-triangle-bold-duotone"
          }
          className={`w-12 h-12 text-red-500 ${loading ? "animate-spin" : ""}`}
        />
      </div>
      <p className="text-lg font-secondary text-secondary mb-6 max-w-md">
        {loading ? t("blog.loading") : message || t("errors.error_fetching_data")}
      </p>
      <button
        onClick={onRetry}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-bold transition-all hover:bg-secondary/90 hover:scale-105 active:scale-95 shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:scale-100"
      >
        <Icon
          icon={loading ? "solar:refresh-linear" : "solar:restart-bold"}
          className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
        />
        {loading ? t("blog.loading") : t("errors.retry_fetch")}
      </button>
    </div>
  );
}
