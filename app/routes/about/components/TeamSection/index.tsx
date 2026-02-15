import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useKeenSlider, type KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useFetcher, useLoaderData } from "react-router";
import type { InferSelectModel } from "drizzle-orm";
import type { team } from "~/databases/schema";
import { Icon as Iconify } from "@iconify/react";

type Category = 1 | 2; // 1 => "consultants", 2 => "admins"

const getJob = (job: number) => {
  switch (job) {
    case 1:
      return "admin";
    case 2:
      return "consultant";
    default:
      return;
  }
};

const wheelPlugin: KeenSliderPlugin = (slider) => {
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    delta > 0 ? slider.next() : slider.prev();
  };
  slider.on("created", () => {
    slider.container.addEventListener("wheel", handleWheel, { passive: false });
  });
};

const autoplayPlugin: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout>;
  const clear = () => clearTimeout(timeout);
  const next = () => {
    clear();
    timeout = setTimeout(() => slider.next(), 7000);
  };
  slider.on("created", next);
  slider.on("animationEnded", next);
  slider.on("updated", next);
  slider.on("destroyed", clear);
};

export default function TeamSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [activeTab, setActiveTab] = useState<Category>(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const sliderKeyRef = useRef(0);

  const loaderData = useLoaderData();
  const fetcher = useFetcher();

  const TEAM_DATA = fetcher.data?.team ?? loaderData.team ?? [];
  const teamError = fetcher.data?.teamError ?? loaderData.teamError;
  const isLoading = fetcher.state !== "idle";

  const [currentTeam, setCurrentTeam] = useState<typeof TEAM_DATA>(
    TEAM_DATA.filter((member: any) => member.job === activeTab),
  );

  const handleRetry = () => {
    fetcher.load(window.location.pathname);
  };

  useEffect(() => {
    sliderKeyRef.current += 1;
    setCurrentSlide(0);
    setLoaded(false);
  }, [activeTab]);

  const changeTeam = useCallback(() => {
    setCurrentTeam(TEAM_DATA.filter((member: any) => member.job === activeTab));
  }, [TEAM_DATA, activeTab]);

  useEffect(() => {
    changeTeam();
  }, [changeTeam]);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      rtl: isRtl,
      initial: 0,
      drag: true,
      slides: {
        perView: 1,
        spacing: 0,
      },
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },
    [wheelPlugin, autoplayPlugin],
  );

  useEffect(() => {
    if (instanceRef.current && loaded) {
      instanceRef.current.moveToIdx(0);
    }
  }, [currentTeam, loaded, instanceRef]);

  const handleTabChange = (cat: Category) => {
    setActiveTab(cat);
  };

  return (
    <section className="py-16 md:py-24 bg-[#FDFDFD] overflow-hidden">
      <div className="container mx-auto px-6">
        {/* 1. Header & Tabs */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="flex bg-secondary/5 p-1.5 rounded-2xl border border-secondary/10 w-full max-w-4xl shadow-inner">
            {([1, 2] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => handleTabChange(cat)}
                className={`flex-1 px-4 md:px-12 py-3.5 md:py-4 rounded-xl font-primary text-[10px] md:text-base font-bold transition-all duration-500 whitespace-nowrap ${
                  activeTab === cat
                    ? "bg-side-2 text-secondary shadow-lg scale-[1.02]"
                    : "text-secondary/60 hover:text-secondary hover:bg-secondary/5"
                }`}
              >
                {t(`about.team.${getJob(cat)}s`)}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Content Area (Slider or States) */}
        {teamError ? (
          <div className="bg-white p-10 md:p-20 rounded-3xl border border-secondary/5 shadow-sm text-center max-w-4xl mx-auto">
            <div className="bg-red-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
              <Iconify
                icon={
                  isLoading
                    ? "solar:refresh-linear"
                    : "solar:danger-triangle-bold-duotone"
                }
                className={`w-12 h-12 text-red-500 ${isLoading ? "animate-spin" : ""}`}
              />
            </div>
            <h3 className="text-secondary text-2xl md:text-3xl font-primary font-bold mb-4">
              {isLoading ? t("blog.loading") : t("errors.error_fetching_data")}
            </h3>
            <p className="text-secondary/50 font-secondary text-lg mb-10 max-w-md mx-auto">
              {t("toast.error_retry")}
            </p>
            <button
              onClick={handleRetry}
              disabled={isLoading}
              className="inline-flex items-center gap-3 px-10 py-4 bg-secondary text-white rounded-2xl font-bold transition-all hover:bg-secondary/90 hover:scale-105 active:scale-95 shadow-xl shadow-secondary/20 disabled:opacity-50"
            >
              <Iconify
                icon={isLoading ? "solar:refresh-linear" : "solar:restart-bold"}
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? t("blog.loading") : t("errors.retry_fetch")}
            </button>
          </div>
        ) : currentTeam.length === 0 ? (
          <div className="bg-white p-10 md:p-20 rounded-3xl border border-secondary/5 shadow-sm text-center max-w-4xl mx-auto">
            <div className="bg-side-2/5 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
              <Iconify
                icon="solar:users-group-two-rounded-linear"
                className="w-12 h-12 text-side-2"
              />
            </div>
            <h3 className="text-secondary text-2xl md:text-3xl font-primary font-bold mb-4">
              {t(`about.team.${getJob(activeTab)}s`)}
            </h3>
            <p className="text-secondary/50 font-secondary text-lg italic">
              {t("errors.no_data_team")}
            </p>
          </div>
        ) : (
          <>
            <div
              ref={sliderRef}
              key={`slider-${sliderKeyRef.current}`}
              className="keen-slider"
            >
              {currentTeam.map(
                (member: InferSelectModel<typeof team>, idx: number) => (
                  <div
                    key={`${member.id}-${idx}`}
                    className="keen-slider__slide px-2"
                  >
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14 bg-white p-6 md:p-14 rounded-3xl border border-secondary/5 shadow-sm">
                      {/* صورة الشخص */}
                      <div
                        className={`w-full lg:w-1/3 aspect-4/5 rounded-2xl overflow-hidden transition-all duration-1000 ${
                          currentSlide === idx
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95"
                        }`}
                      >
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* المحتوى */}
                      <div
                        className={`w-full lg:w-2/3 space-y-4 md:space-y-6 text-center lg:text-start transition-all duration-1000 ${
                          currentSlide === idx
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 ltr:translate-x-12 rtl:-translate-x-12"
                        }`}
                      >
                        <span className="inline-block text-side-2 font-primary max-md:text-[15px] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase px-3 py-1 border border-side-2/20 rounded-full">
                          {t(`about.team.${getJob(member.job)}`)}
                        </span>
                        <h4 className="text-secondary text-3xl md:text-5xl font-primary font-bold">
                          {member.name}
                        </h4>

                        <div className="w-32 h-1 bg-side-2 rounded-full mx-auto lg:mx-0" />

                        <p className="text-secondary/70 text-base md:text-lg font-secondary leading-relaxed text-justify lg:text-start">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Navigation */}
            {loaded && currentTeam.length > 0 && (
              <div className="mt-8 md:mt-12">
                <div className="flex md:hidden justify-center gap-2">
                  {currentTeam.map((_: never, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => instanceRef.current?.moveToIdx(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentSlide === idx
                          ? "w-8 bg-side-2"
                          : "w-2 bg-secondary/20"
                      }`}
                    />
                  ))}
                </div>

                <div className="hidden md:flex justify-center flex-wrap gap-4">
                  {currentTeam.map(
                    (member: InferSelectModel<typeof team>, idx: number) => (
                      <button
                        key={`thumb-${member.id}-${idx}`}
                        onClick={() => instanceRef.current?.moveToIdx(idx)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-500 ${
                          currentSlide === idx
                            ? "border-side-2 scale-110 shadow-lg ring-4 ring-side-2/10"
                            : "border-transparent opacity-40 grayscale"
                        }`}
                      >
                        <img
                          src={member.image}
                          alt="nav"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
