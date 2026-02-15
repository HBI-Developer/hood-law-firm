import { useKeenSlider, type KeenSliderPlugin } from "keen-slider/react";
import { useTranslation } from "react-i18next";
import { Icon as Iconify } from "@iconify/react";
import "keen-slider/keen-slider.min.css";
import { useFetcher, useLoaderData } from "react-router";
import type { InferSelectModel } from "drizzle-orm";
import type { testimonials } from "~/databases/schema";
import { useEffect } from "react";

// --- Plugins المخصصة بناءً على مرجع المكتبة الأحدث ---

// 1. التحكم بعجلة الماوس (Wheel Controls)
const WheelControls: KeenSliderPlugin = (slider) => {
  const handleWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      e.deltaX > 0 ? slider.next() : slider.prev();
    }
  };
  slider.on("created", () => {
    slider.container.addEventListener("wheel", handleWheel, { passive: false });
  });
};

// 2. التبديل التلقائي (Autoplay) مع مراعاة التفاعل
const Autoplay: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;

  function clear() {
    clearTimeout(timeout);
  }

  function next() {
    clear();
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 4000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clear();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      next();
    });
    next();
  });
  slider.on("animationEnded", next);
  slider.on("updated", next);
  slider.on("destroyed", clear);
};

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const loaderData = useLoaderData();
  const fetcher = useFetcher();

  const REVIEWS = fetcher.data?.testimonials ?? loaderData.testimonials ?? [];
  const testimonialsError =
    fetcher.data?.testimonialsError ?? loaderData.testimonialsError;
  const isLoading = fetcher.state !== "idle";

  const handleRetry = () => {
    fetcher.load(window.location.pathname);
  };

  // مضاعفة المصفوفة لضمان عمل Loop بسلاسة عند استخدام Centered Slides
  const DOUBLED_REVIEWS =
    REVIEWS.length > 0 && REVIEWS.length < 10
      ? [...REVIEWS, ...REVIEWS]
      : REVIEWS;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: REVIEWS.length > 1,
      rtl: isRtl,
      mode: "free-snap", // الانتقال الحر مع القفز لأقرب بطاقة

      slides: {
        perView: 1.2, // يظهر أجزاء من الجوانب في الجوال
        spacing: 20,
        origin: "center",
      },
      breakpoints: {
        "(min-width: 768px)": {
          slides: { perView: 2, spacing: 30, origin: "center" },
        },
        "(min-width: 1200px)": {
          slides: { perView: 3, spacing: 40, origin: "center" },
        },
      },
    },
    [WheelControls, Autoplay], // إضافة الـ Plugins هنا
  );

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update({
        loop: REVIEWS.length > 1,
        rtl: isRtl,
      });
    }
  }, [REVIEWS.length, isRtl, instanceRef]);

  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      {/* الخلفية الزخرفية */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-side-2/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-primary font-bold text-primary mb-4 tracking-tight">
            {t("testimonials.title")}
          </h2>
          <div className="w-20 h-1.5 bg-side-2 mx-auto rounded-full" />
        </div>

        {testimonialsError ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/3 backdrop-blur-xl border border-white/10 p-10 md:p-12 rounded-3xl flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500/20 to-transparent" />
              <div className="bg-red-500/10 p-6 rounded-2xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                <Iconify
                  icon={
                    isLoading
                      ? "solar:refresh-linear"
                      : "solar:danger-triangle-bold-duotone"
                  }
                  className={`w-16 h-16 text-red-500/80 ${isLoading ? "animate-spin" : ""}`}
                />
              </div>
              <h3 className="text-primary text-2xl font-primary font-bold mb-4">
                {isLoading
                  ? t("blog.loading")
                  : t("errors.error_fetching_data")}
              </h3>
              <p className="text-primary/60 font-secondary mb-8 max-w-sm">
                {t("toast.error_retry")}
              </p>
              <button
                onClick={handleRetry}
                disabled={isLoading}
                className="group/btn flex items-center gap-3 px-8 py-4 bg-side-2 text-secondary rounded-2xl font-bold transition-all hover:bg-side-2/90 hover:scale-105 active:scale-95 shadow-xl shadow-side-2/20 disabled:opacity-50 disabled:scale-100"
              >
                <Iconify
                  icon={
                    isLoading ? "solar:refresh-linear" : "solar:restart-bold"
                  }
                  className={`w-6 h-6 ${isLoading ? "animate-spin" : "group-hover/btn:rotate-180 transition-transform duration-500"}`}
                />
                {isLoading ? t("blog.loading") : t("errors.retry_fetch")}
              </button>
            </div>
          </div>
        ) : REVIEWS.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/3 backdrop-blur-xl border border-white/10 p-10 md:p-12 rounded-3xl flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-side-2/20 to-transparent" />
              <div className="bg-side-2/10 p-6 rounded-2xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                <Iconify
                  icon="solar:box-minimalistic-linear"
                  className="w-16 h-16 text-side-2/80"
                />
              </div>
              <h3 className="text-primary text-2xl font-primary font-bold mb-4">
                {t("testimonials.title")}
              </h3>
              <p className="text-primary/60 font-secondary max-w-sm italic">
                {t("errors.no_data_testimonials")}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={sliderRef}
              className="keen-slider overflow-visible! cursor-grab active:cursor-grabbing"
            >
              {DOUBLED_REVIEWS.map(
                (
                  review: InferSelectModel<typeof testimonials>,
                  idx: number,
                ) => (
                  <div
                    key={`${review.id}-${idx}`}
                    className="keen-slider__slide py-8"
                  >
                    {/* بطاقة Glassmorphism مطورة */}
                    <div className="h-full bg-white/3 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl flex flex-col justify-between hover:bg-white/6 hover:border-side-2/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
                      {/* انعكاس ضوئي علوي للبطاقة */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <Iconify
                        icon="ri:double-quotes-l"
                        className={`absolute top-8 ${isRtl ? "left-8" : "right-8"} text-side-2/10`}
                        fontSize={60}
                      />

                      <p className="text-primary/90 text-lg font-secondary leading-relaxed mb-12 relative z-10">
                        {review.testimonial}
                      </p>

                      <div className="flex items-center gap-5 border-t border-white/10 pt-8 mt-auto">
                        <div className="w-14 h-14 bg-linear-to-br aspect-square from-side-2 to-side-2/60 rounded-2xl flex items-center justify-center font-bold text-secondary text-xl shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                          {review.name[0]}
                        </div>
                        <div>
                          <h4 className="text-primary font-bold font-primary text-lg">
                            {review.name}
                          </h4>
                          <p className="text-side-2/80 text-xs font-secondary uppercase tracking-[0.2em] mt-1">
                            {review.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
