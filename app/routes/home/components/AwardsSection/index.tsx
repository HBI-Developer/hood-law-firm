import type { InferSelectModel } from "drizzle-orm";
import { useKeenSlider, type KeenSliderOptions } from "keen-slider/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData } from "react-router";
import type { awards } from "~/databases/schema";
import useImagesTracker from "~/hooks/useImagesTracker";
import { DataEmptyState, DataErrorState } from "~/components";

export default function AwardsSection() {
  const { t, i18n } = useTranslation(),
    { tracker, isLoaded } = useImagesTracker(),
    animationConfig = { duration: 30000, easing: (t: number) => t },
    loaderData = useLoaderData(),
    fetcher = useFetcher(),
    AWARDS = fetcher.data?.awards ?? loaderData.awards,
    awardsError = fetcher.data?.awardsError ?? loaderData.awardsError,
    isLoading = fetcher.state !== "idle",
    handleRetry = () => {
      fetcher.load(window.location.pathname);
    },
    options: KeenSliderOptions = {
      loop: true,
      renderMode: "performance",
      drag: false,
      rtl: i18n.language === "ar",
      slides: {
        perView: "auto",
        spacing: 40,
      },
    };

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(options);

  useEffect(() => {
    if (isLoaded && instanceRef.current) {
      const slider = instanceRef.current;

      setTimeout(() => {
        slider.update({
          ...options,
          rtl: i18n.language === "ar",
        });
        slider.moveToIdx(slider.track.details.abs - 5, true, animationConfig);
      }, 50);

      const restartAnimation = () => {
        slider.moveToIdx(slider.track.details.abs - 5, true, animationConfig);
      };

      slider.on("animationEnded", restartAnimation);
      slider.on("updated", restartAnimation);

      return () => {
        slider.on("animationEnded", () => {});
        slider.on("updated", () => {});
      };
    }
  }, [isLoaded, i18n.language]);

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden select-none">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="text-2xl md:text-3xl font-primary font-bold text-secondary/80 uppercase tracking-[0.2em]">
          {t("awards.title")}
        </h2>
        <div className="w-16 md:w-24 h-1 bg-side-2 mx-auto mt-4" />
      </div>

      <div className="container">
        {awardsError ? (
          <DataErrorState
            onRetry={handleRetry}
            className="bg-stone-50"
            loading={isLoading}
          />
        ) : AWARDS.length === 0 ? (
          <DataEmptyState
            message={t("errors.no_data_awards")}
            className="bg-stone-50/50"
          />
        ) : (
          <div className="relative group" ref={tracker}>
            <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

            <div
              ref={sliderRef}
              className="keen-slider flex items-center overflow-visible!"
            >
              {AWARDS.map((award: InferSelectModel<typeof awards>) => (
                <div
                  key={award.id}
                  className="keen-slider__slide flex! h-28! md:h-24! w-auto! min-w-max! relative! overflow-visible!"
                  style={{ flex: "none" }}
                  title={award.name}
                >
                  <div className="h-full px-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 transform hover:scale-110">
                    <img
                      src={award.image}
                      alt={award.name}
                      className="h-full w-auto object-contain pointer-events-none"
                      style={{ display: "block" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
