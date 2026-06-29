import type { InferSelectModel } from "drizzle-orm";
import { useKeenSlider, type KeenSliderOptions } from "keen-slider/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useLoaderData } from "react-router";
import type { awards } from "~/databases/schema";
import { DataEmptyState, DataErrorState } from "~/components";

const SLIDE_HEIGHT = 108;
const SLIDE_PADDING = 32;
const FALLBACK_WIDTH = 200;

type SlideWidthMap = Record<number, number>;

function preloadDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: FALLBACK_WIDTH - SLIDE_PADDING, height: SLIDE_HEIGHT });
    img.src = src;
  });
}

export default function AwardsSection() {
  const { t, i18n } = useTranslation(),
    animationConfig = { duration: 30000, easing: (t: number) => t },
    loaderData = useLoaderData(),
    fetcher = useFetcher(),
    AWARDS = fetcher.data?.awards ?? loaderData.awards,
    awardsError = fetcher.data?.awardsError ?? loaderData.awardsError,
    isLoading = fetcher.state !== "idle",
    [slideWidths, setSlideWidths] = useState<SlideWidthMap | null>(null),
    [isAnimationPaused, setIsAnimationPaused] = useState(false),
    animationTimeoutRef = useRef<NodeJS.Timeout | null>(null),
    handleRetry = () => {
      fetcher.load(window.location.pathname);
    };

  useEffect(() => {
    if (!AWARDS || AWARDS.length === 0) return;

    let cancelled = false;

    (async () => {
      const entries = await Promise.all(
        AWARDS.map(async (award: InferSelectModel<typeof awards>) => {
          try {
            const { width, height } = await preloadDimensions(award.image);
            const slideWidth = Math.round((width / height) * SLIDE_HEIGHT) + SLIDE_PADDING;
            return [award.id, slideWidth] as const;
          } catch {
            return [award.id, FALLBACK_WIDTH] as const;
          }
        }),
      );

      if (!cancelled) {
        setSlideWidths(Object.fromEntries(entries));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [AWARDS]);

  const sliderOptions = useMemo<KeenSliderOptions>(
    () => ({
      loop: true,
      renderMode: "performance",
      drag: false,
      rtl: i18n.language === "ar",
      slides: {
        perView: "auto",
        spacing: 40,
      },
    }) as const,
    [i18n.language],
  );

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(sliderOptions);

  const pauseAnimation = () => {
    if (instanceRef.current?.animator) {
      instanceRef.current.animator.stop();
      setIsAnimationPaused(true);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    }
  };

  const resumeAnimation = () => {
    if (instanceRef.current && !isAnimationPaused) return;

    setIsAnimationPaused(false);
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

    animationTimeoutRef.current = setTimeout(() => {
      if (instanceRef.current) {
        const slider = instanceRef.current;
        slider.moveToIdx(slider.track.details.abs - 5, true, animationConfig);
      }
    }, 500);
  };

  useEffect(() => {
    if (slideWidths && instanceRef.current) {
      const slider = instanceRef.current;

      slider.slides.forEach(slide => {
        slide.style.minWidth = "";
        slide.style.maxWidth = "";
      });

      slider.update();

      setTimeout(() => {
        slider.moveToIdx(slider.track.details.abs - 5, true, animationConfig);
      }, 100);

      const restartAnimation = () => {
        if (!isAnimationPaused) {
          slider.moveToIdx(slider.track.details.abs - 5, true, animationConfig);
        }
      };

      slider.on("animationEnded", restartAnimation);
      slider.on("updated", restartAnimation);

      return () => {
        slider.on("animationEnded", () => {});
        slider.on("updated", () => {});
      };
    }
  }, [slideWidths]);

  useEffect(() => {
    if (slideWidths && instanceRef.current) {
      instanceRef.current.update(sliderOptions);
    }
  }, [i18n.language]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden select-none awards-section">
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
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

            <div ref={sliderRef} className="keen-slider">
              {AWARDS.map((award: InferSelectModel<typeof awards>) => (
                <div
                  key={award.id}
                  className="keen-slider__slide flex-none h-28 md:h-24 relative"
                  style={
                    {
                      flex: "none",
                      "--slide-width": slideWidths ? `${slideWidths[award.id]}px` : undefined,
                    } as React.CSSProperties
                  }
                  title={award.name}
                  onMouseEnter={pauseAnimation}
                  onMouseLeave={resumeAnimation}
                >
                  <div className="h-full px-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 transform hover:scale-110 origin-center">
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
