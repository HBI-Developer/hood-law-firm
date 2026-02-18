import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData, useParams } from "react-router";
import { DataEmptyState, DataErrorState, NavLink } from "~/components";

export default function ServicesSection() {
  const { t } = useTranslation();
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const { lang } = useParams();

  const servicesList = fetcher.data?.services ?? loaderData.services;
  const hasError = fetcher.data?.servicesError ?? loaderData.servicesError;
  const isLoading = fetcher.state !== "idle";

  const handleRetry = () => {
    fetcher.load(window.location.pathname);
  };

  return (
    <section className="py-20 px-2 md:px-6 bg-stone-100">
      <div className="max-w-7xl mx-auto">
        {hasError ? (
          <DataErrorState
            onRetry={handleRetry}
            className="bg-stone-50"
            loading={isLoading}
          />
        ) : servicesList.length === 0 ? (
          <DataEmptyState
            message={t("errors.no_data_services")}
            className="bg-stone-50 border-stone-200"
          />
        ) : (
          <div className="flex flex-wrap justify-center gap-12 lg:gap-8">
            {servicesList.map((service: any) => (
              <div
                key={service.id}
                className="group min-w-[80%] max-w-[80%] md:min-w-[40%] md:max-w-[40%] lg:min-w-[30%] lg:max-w-[30%] relative bg-white rounded-4xl shadow-xl shadow-stone-200/50 overflow-visible transition-transform duration-500 hover:-translate-y-2 border border-stone-100 flex flex-col"
              >
                {/* الحاوية العلوية للصورة */}
                <div className="relative h-64 w-full overflow-hidden rounded-t-4xl">
                  <img
                    src={service.image}
                    alt={t(`services.items.${service.id}.title`)}
                    className="w-full h-full object-cover transition-scale duration-700 group-hover:scale-110"
                  />
                  {/* Overlay خفيف لتحسين تباين الصورة */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>

                {/* الأيقونة العائمة (The Floating Icon) */}
                <div className="absolute top-57.5 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-white p-4 rounded-full shadow-lg border border-stone-50 flex items-center justify-center text-secondary duration-500 transition-colors group-hover:bg-secondary group-hover:text-white">
                    <Icon icon={service.icon} className="w-10 h-10" />
                  </div>
                </div>

                {/* المحتوى السفلي */}
                <div className="pt-16 pb-10 px-8 text-center flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold font-primary text-stone-900 mb-4">
                    {service.label}
                  </h3>
                  <p className="text-stone-500 font-secondary leading-relaxed mb-8 line-clamp-3">
                    {service.overview}
                  </p>

                  <NavLink
                    to={`/${lang}/service/${service.slug}`}
                    className="inline-flex items-center text-blue-700 font-bold hover:text-secondary transition-colors gap-2 group/btn mt-auto mx-auto"
                  >
                    {t("learn_more")}
                    <Icon
                      icon="solar:arrow-left-linear"
                      className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1 rtl:rotate-0 ltr:rotate-180"
                    />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
