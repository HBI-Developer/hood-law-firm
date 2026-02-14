import React, { useCallback, useRef } from "react";
import { useKeenSlider, type KeenSliderPlugin } from "keen-slider/react";
import { useTranslation } from "react-i18next";
import { Icon as Iconify } from "@iconify/react";
import "keen-slider/keen-slider.min.css";

const REVIEWS = [
  {
    id: 1,
    name: "أحمد منصور",
    role: "رئيس شركة العقارات",
    text: "لقد كان التعامل مع مكتب هود بن عادل نقطة تحول في قضيتنا التجارية. دقة واحترافية لا توصف.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "CEO, Tech Solutions",
    text: "Exceptional legal advice. They understood our complex requirements and delivered beyond expectations.",
  },
  {
    id: 3,
    name: "محمد الكواري",
    role: "مستثمر",
    text: "أكثر ما يميزهم هو الصدق والشفافية منذ اليوم الأول. أشعر بالأمان بوجودهم كمستشارين قانونيين.",
  },
  {
    id: 4,
    name: "ليلى العامري",
    role: "رائدة أعمال",
    text: "السرعة في الإنجاز والاهتمام بأدق التفاصيل هو ما يجعل هذا المكتب الأفضل في المنطقة.",
  },
];

// --- Plugins المخصصة بناءً على مرجع المكتبة الأحدث ---

// 1. التحكم بعجلة الماوس (Wheel Controls)
const WheelControls: KeenSliderPlugin = (slider) => {
  let touchTimeout: ReturnType<typeof setTimeout>;
  let wheelTimeout: ReturnType<typeof setTimeout>;

  function dispatch(e: WheelEvent) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      slider.container.dispatchEvent(
        new CustomEvent("wheel-scroll", { detail: e }),
      );
    }
  }

  slider.on("created", () => {
    slider.container.addEventListener("wheel", dispatch, { passive: false });
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
};

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  // مضاعفة المصفوفة لضمان عمل Loop بسلاسة عند استخدام Centered Slides
  const DOUBLED_REVIEWS =
    REVIEWS.length < 10 ? [...REVIEWS, ...REVIEWS] : REVIEWS;

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      rtl: isRtl,
      mode: "free-snap", // الانتقال الحر مع القفز لأقرب بطاقة

      slides: {
        perView: 1.2, // يظهر أجزاء من الجوانب في الجوال
        spacing: 20,
        origin: "center",
      },
      breakpoints: {
        "(min-width: 768px)": {
          loop: true,
          rtl: isRtl,
          slides: { perView: 2, spacing: 30, origin: "center" },
        },
        "(min-width: 1200px)": {
          loop: true,
          rtl: isRtl,
          slides: { perView: 3, spacing: 40, origin: "center" },
        },
      },
      // Range: لتحديد مدى الحركة (داخلياً يتم عبر السلايدر في وضع Loop)
    },
    [WheelControls, Autoplay], // إضافة الـ Plugins هنا
  );

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

        <div className="relative">
          <div
            ref={sliderRef}
            className="keen-slider overflow-visible! cursor-grab active:cursor-grabbing"
          >
            {DOUBLED_REVIEWS.map((review, idx) => (
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
                    {review.text}
                  </p>

                  <div className="flex items-center gap-5 border-t border-white/10 pt-8 mt-auto">
                    <div className="w-14 h-14 bg-linear-to-br from-side-2 to-side-2/60 rounded-2xl flex items-center justify-center font-bold text-secondary text-xl shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="text-primary font-bold font-primary text-lg">
                        {review.name}
                      </h4>
                      <p className="text-side-2/80 text-xs font-secondary uppercase tracking-[0.2em] mt-1">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
