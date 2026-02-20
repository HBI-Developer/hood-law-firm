import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react-aria-components";
import { Icon as Iconify } from "@iconify/react";
import { VideoPlayer } from "..";
import { useNavigate, useParams } from "react-router";

export default function HeroSection() {
  const { t, i18n } = useTranslation(),
    [isVideoMode, setIsVideoMode] = useState(false),
    navigate = useNavigate(),
    { lang } = useParams();

  return (
    <section
      id="hero"
      className="relative h-[90vh] w-full overflow-hidden bg-secondary flex items-center justify-center"
    >
      <div
        className={`absolute inset-0 transition-transform duration-1000 ${isVideoMode ? "scale-110 blur-sm" : "scale-100"}`}
      >
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
          alt="Hood bin Adel Law Firm"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-b from-secondary/80 via-secondary/40 to-secondary" />
      </div>

      {isVideoMode && (
        <VideoPlayer
          src="https://ftp.osuosl.org/pub/xiph/video/Digital_Show_and_Tell-480p.webm"
          onClose={() => setIsVideoMode(false)}
        />
      )}

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1
            className={`
              leading-tight transition-all duration-700 ease-in-out text-primary
              ${
                isVideoMode
                  ? "text-xl md:text-2xl opacity-80 -translate-y-32 mb-4"
                  : "text-5xl md:text-8xl mb-6 font-bold"
              }
              ${i18n.language === "ar" ? "font-secondary" : "font-primary italic"}
            `}
          >
            {t("hero.name")}
          </h1>

          <div
            className={`transition-all duration-500 ${isVideoMode ? "opacity-0 invisible scale-95" : "opacity-100 visible scale-100"}`}
          >
            <h2 className="text-side-2 text-xl md:text-2xl font-secondary mb-6 tracking-widest uppercase">
              {t("hero.lawfirm")}
            </h2>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary/80 font-secondary mb-10 leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onPress={() => setIsVideoMode(true)}
                className="group flex items-center gap-3 px-8 py-4 bg-side-2 text-secondary font-bold rounded-sm hover:bg-white transition-all cursor-pointer"
              >
                <Iconify
                  icon="heroicons:play-circle-16-solid"
                  fontSize={24}
                  className="group-hover:scale-110 transition-transform"
                />
                {t("hero.watch_video")}
              </Button>

              <Button
                className="px-8 py-4 border border-primary/20 text-primary font-bold rounded-sm hover:bg-primary/10 transition-all cursor-pointer"
                onClick={() => navigate(`/${lang}/contact#contact`)}
              >
                {t("hero.consult")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
