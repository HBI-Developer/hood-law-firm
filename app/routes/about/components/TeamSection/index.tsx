import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useKeenSlider, type KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import arConsultants from "../../data/ar-consult.json";
import enConsultants from "../../data/en-consult.json";
import arStaff from "../../data/ar-staff.json";
import enStaff from "../../data/en-staff.json";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";

type Category = "consultants" | "admins";
type TeamMember = {
  id: string | number;
  full_name: string;
  role: string;
  bio: string;
  image: string;
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
    timeout = setTimeout(() => slider.next(), 10000);
  };
  slider.on("created", next);
  slider.on("animationEnded", next);
  slider.on("updated", next);
  slider.on("destroyed", clear);
};

export default function TeamSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [activeTab, setActiveTab] = useState<Category>("consultants");
  const [currentTeam, setCurrentTeam] = useState<TeamMember[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const locale = useSelector((state: RootState) => state.language.locale);
  const sliderKeyRef = useRef(0);

  useEffect(() => {
    sliderKeyRef.current += 1;
    setCurrentSlide(0);
    setLoaded(false);
  }, [locale, activeTab]);

  const changeTeam = useCallback(() => {
    let data: any[] = [];
    if (activeTab === "consultants") {
      data = locale === "ar" ? arConsultants : enConsultants;
    } else {
      data = locale === "ar" ? arStaff : enStaff;
    }
    setCurrentTeam(data);
  }, [locale, activeTab]);

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
        {/* 1. Header & Tabs (نظام التوسيط والمتجاوب) */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="flex bg-secondary/5 p-1.5 rounded-2xl border border-secondary/10 w-full max-w-4xl shadow-inner">
            {(["consultants", "admins"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => handleTabChange(cat)}
                // استخدام flex-1 يضمن أن الأزرار تتقاسم العرض بالتساوي
                className={`flex-1 px-4 md:px-12 py-3.5 md:py-4 rounded-xl font-primary text-[10px] md:text-base font-bold transition-all duration-500 whitespace-nowrap ${
                  activeTab === cat
                    ? "bg-side-2 text-secondary shadow-lg scale-[1.02]"
                    : "text-secondary/60 hover:text-secondary hover:bg-secondary/5"
                }`}
              >
                {t(`about.team.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Slider Container */}
        <div
          ref={sliderRef}
          key={`slider-${sliderKeyRef.current}`}
          className="keen-slider"
        >
          {currentTeam.map((member, idx) => (
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
                    alt={member.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* المحتوى (التوسيط للهاتف) */}
                <div
                  className={`w-full lg:w-2/3 space-y-4 md:space-y-6 text-center lg:text-start transition-all duration-1000 ${
                    currentSlide === idx
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 ltr:translate-x-12 rtl:-translate-x-12"
                  }`}
                >
                  <span className="inline-block text-side-2 font-primary max-md:text-[15px] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase px-3 py-1 border border-side-2/20 rounded-full">
                    {member.role}
                  </span>
                  <h4 className="text-secondary text-3xl md:text-5xl font-primary font-bold">
                    {member.full_name}
                  </h4>

                  {/* الفاصل: أصبح أعرض (w-32) ومتوسط في الهاتف */}
                  <div className="w-32 h-1 bg-side-2 rounded-full mx-auto lg:mx-0" />

                  <p className="text-secondary/70 text-base md:text-lg font-secondary leading-relaxed text-justify lg:text-start">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Navigation: Dots (Mobile) vs Thumbnails (Desktop) */}
        {loaded && currentTeam.length > 0 && (
          <div className="mt-8 md:mt-12">
            {/* Dots (تظهر فقط تحت الشاشات المتوسطة md) */}
            <div className="flex md:hidden justify-center gap-2">
              {currentTeam.map((_, idx) => (
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

            {/* Thumbnails (تظهر فقط من الشاشات المتوسطة md فأعلى) */}
            <div className="hidden md:flex justify-center flex-wrap gap-4">
              {currentTeam.map((member, idx) => (
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
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
