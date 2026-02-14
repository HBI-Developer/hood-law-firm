import { useFetcher, useLoaderData } from "react-router";
import { DataEmptyState, DataErrorState } from "~/components";
import { useTranslation } from "react-i18next";
import StatCard from "../StatCard";
import type { InferSelectModel } from "drizzle-orm";
import type { stats } from "~/databases/schema";

export default function StatsSection() {
  const { t } = useTranslation();
  const loaderData = useLoaderData();
  const fetcher = useFetcher();

  const statsList = fetcher.data?.stats ?? loaderData.stats;
  const hasError = fetcher.data?.statsError ?? loaderData.statsError;
  const isLoading = fetcher.state !== "idle";

  const handleRetry = () => {
    fetcher.load(window.location.pathname);
  };

  return (
    <section className="py-24 bg-primary">
      <div className="container mx-auto px-6">
        {hasError ? (
          <DataErrorState
            onRetry={handleRetry}
            className="bg-white/10"
            loading={isLoading}
          />
        ) : statsList.length === 0 ? (
          <DataEmptyState
            message={t("errors.no_data_stats")}
            className="bg-white/5"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsList.map((stat: InferSelectModel<typeof stats>) => (
              <StatCard
                key={stat.id}
                icon={stat.icon}
                stat={stat.stat}
                label={stat.label}
                prefix={stat.prefix || ""}
                suffix={stat.suffix || ""}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
