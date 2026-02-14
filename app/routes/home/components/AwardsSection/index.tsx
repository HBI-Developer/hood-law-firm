import { useKeenSlider, type KeenSliderOptions } from "keen-slider/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useImagesTracker from "~/hooks/useImagesTracker";

const AWARDS = [
  {
    id: 1,
    name: "Chambers and Partners",
    src: "https://www.alrowaad.ae/ar/wp-content/uploads/2022/01/corporateintl-2022-award.jpg",
  },
  {
    id: 2,
    name: "The Legal 100 2019",
    src: "https://www.alrowaad.ae/ar/wp-content/uploads/2017/11/legal100asia-2019-award-300x181.jpg",
  },
  {
    id: 3,
    name: "The Legal 100 2020",
    src: "https://www.alrowaad.ae/ar/wp-content/uploads/2017/11/legal100asia-2020-award.jpg",
  },
  {
    id: 4,
    name: "Global 100 2018",
    src: "https://www.alrowaad.ae/ar/wp-content/uploads/2017/11/global100-2018award-300x181.jpg",
  },
  {
    id: 5,
    name: "Le Fonti Awards 2017",
    src: "https://www.alrowaad.ae/ar/wp-content/uploads/2017/11/lefonti-awards-300x161.png",
  },
  {
    id: 6,
    name: "MEA Markets",
    src: "https://www.alrowaad.ae/ar/wp-content/uploads/2017/11/awards-mea-300x108.png",
  },
  {
    id: 7,
    name: "Global Law Experts 2017",
    src: "https://www.alrowaad.ae/ar/wp-content/uploads/2017/11/awards-globallawexperts-300x181.png",
  },
  {
    id: 8,
    name: "Global Law Experts 2014",
    src: "https://www.alrowaad.ae/ar/wp-content/uploads/2017/11/awards-globallawexperts2014-300x181.png",
  },
  {
    id: 9,
    name: "Corporate America Today Annual 2020",
    src: "https://www.alrowaad.ae/ar/wp-content/uploads/2022/04/corporateamericatoday-2020-has-300x181.png",
  },
  {
    id: 10,
    name: "Thought Leader Lexology",
    src: "https://www.alrowaad.ae/ar/wp-content/uploads/2017/11/thoughtleader-300x181.png",
  },
];

export default function AwardsSection() {
  const { t, i18n } = useTranslation();
  const { tracker, isLoaded } = useImagesTracker();

  const animationConfig = { duration: 30000, easing: (t: number) => t };

  const options: KeenSliderOptions = {
    loop: true,
    renderMode: "performance",
    drag: false,
    rtl: i18n.language === "ar", // دعم اتجاه اللغة برمجياً
    slides: {
      perView: "auto",
      spacing: 40, // مسافة أقل قليلاً للجوال لتناسب الحجم الأكبر
    },
  };

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(options);

  // إعادة تشغيل السلايدر عند اكتمال الصور أو تغير اللغة
  useEffect(() => {
    if (isLoaded && instanceRef.current) {
      const slider = instanceRef.current;

      // إجبار السلايدر على إعادة الحساب بالخيارات الجديدة (بما فيها الـ RTL)
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
  }, [isLoaded, i18n.language]); // مصفوفة التبعيات تضمن التحديث عند تغير اللغة

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden select-none">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="text-2xl md:text-3xl font-primary font-bold text-secondary/80 uppercase tracking-[0.2em]">
          {t("awards.title")}
        </h2>
        <div className="w-16 md:w-24 h-1 bg-side-2 mx-auto mt-4" />
      </div>

      <div className="relative group" ref={tracker}>
        {/* Gradients */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          ref={sliderRef}
          className="keen-slider flex items-center overflow-visible!"
        >
          {AWARDS.map((award) => (
            <div
              key={award.id}
              className="keen-slider__slide flex! h-28! md:h-24! w-auto! min-w-max! relative! overflow-visible!"
              style={{ flex: "none" }} // هذا يمنع السلايدر من تغيير حجم الشريحة
            >
              <div className="h-full px-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 transform hover:scale-110">
                <img
                  src={award.src}
                  alt={award.name}
                  className="h-full w-auto object-contain pointer-events-none"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
