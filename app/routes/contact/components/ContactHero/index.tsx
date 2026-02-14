import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { EMBED_MAP_LINK } from "~/constants";

export default function ContactHero() {
  const { t } = useTranslation();
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <section className="relative h-[65vh] min-h-125 w-full bg-secondary overflow-hidden flex items-center justify-center">
      {/* 1. طبقة الخريطة (Iframe) */}
      <div
        className={`absolute inset-0 z-0 transition-all duration-1000 ${
          isUnlocked
            ? "grayscale-0 opacity-100 scale-100"
            : "grayscale contrast-125 brightness-40 opacity-40 scale-105"
        }`}
      >
        <iframe
          title="Office Location"
          src={EMBED_MAP_LINK}
          className={`w-full h-full border-0 ${isUnlocked ? "pointer-events-auto" : "pointer-events-none"}`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* 2. الطبقة التفاعلية (تختفي تماماً عند النقر) */}
      {!isUnlocked && (
        <div
          onClick={() => setIsUnlocked(true)}
          className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center bg-secondary/20 hover:bg-transparent transition-colors duration-500"
        >
          {/* كرت التنبيه الزجاجي */}
          <div className="relative z-30 flex flex-col items-center gap-6 p-10 rounded-[2.5rem] border border-white/10 bg-secondary/60 backdrop-blur-xl shadow-2xl animate-fade-in-up">
            <div className="relative">
              <div className="absolute inset-0 bg-side-2/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 bg-side-2 rounded-2xl flex items-center justify-center text-secondary shadow-lg">
                {/* أيقونات Iconify الذكية */}
                <Icon
                  icon="solar:map-point-wave-bold-duotone"
                  className="hidden md:block w-10 h-10 animate-bounce"
                />
                <Icon
                  icon="fluent-mdl2:touch"
                  className="md:hidden w-10 h-10 animate-pulse"
                />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-white font-primary font-bold text-2xl md:text-3xl mb-2">
                {t("contact.map.our_location") || "Find Our Office"}
              </h2>
              <p className="text-side-2 text-xs tracking-[0.3em] uppercase font-bold opacity-80">
                <span className="hidden md:inline">
                  {t("contact.map.click_to_activate")}
                </span>
                <span className="md:hidden">
                  {t("contact.map.tap_to_activate")}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. تدرج سفلي سينمائي يختفي عند التفعيل لربط الأقسام */}
      <div
        className={`absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-[#FDFDFD] via-[#FDFDFD]/40 to-transparent z-10 pointer-events-none transition-opacity duration-1000 ${isUnlocked ? "opacity-0" : "opacity-100"}`}
      />
    </section>
  );
}
