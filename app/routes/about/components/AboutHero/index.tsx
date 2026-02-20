import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

export default function AboutHero() {
  const { t, i18n } = useTranslation(),
    isRtl = i18n.language === "ar",
    containerRef = useRef<HTMLDivElement>(null),
    bgRef = useRef<HTMLDivElement>(null),
    borderRef = useRef<HTMLDivElement>(null),
    textRef = useRef<HTMLDivElement>(null),
    mouse = useRef({ x: 0, y: 0 }),
    lerpMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };

    let animationFrameId: number;

    const animate = () => {
      lerpMouse.current.x += (mouse.current.x - lerpMouse.current.x) * 0.1;
      lerpMouse.current.y += (mouse.current.y - lerpMouse.current.y) * 0.1;

      const { x, y } = lerpMouse.current;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
      }

      if (borderRef.current) {
        borderRef.current.style.transform = `translate(${-x * 50}px, ${-y * 50}px)`;
      }

      if (textRef.current) {
        textRef.current.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center bg-secondary pt-20 pb-12 overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none opacity-30 will-change-transform"
      >
        <div className="absolute top-[10%] left-[10%] w-100 h-100 bg-side-2/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-75 h-75 bg-side-1/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <div
            ref={textRef}
            className={`w-full lg:w-3/5 space-y-6 will-change-transform ${
              isRtl ? "text-right" : "text-left"
            }`}
          >
            <div className="inline-block px-4 py-1 border border-side-2/30 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-1000 max-md:mx-auto max-md:block max-md:w-min">
              <span className="text-side-2 font-primary select-none text-sm uppercase tracking-[0.3em]">
                {t("about.hero.founder") || "The Founder"}
              </span>
            </div>

            <h1 className="text-4xl max-md:text-center md:text-6xl lg:text-7xl font-primary font-bold text-primary leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
              {t("about.hero.founderName") || "Mr. Hood bin Adel Al-Qadi"}
            </h1>

            <div className="max-md:mx-auto max-md:w-40 w-20 h-1.5 bg-side-2 rounded-full mb-8 animate-in zoom-in duration-1000 delay-300" />

            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <p className="text-primary/80 text-lg text-justify md:text-xl font-secondary leading-relaxed ltr:first-letter:text-3xl">
                {t("about.hero.founderBio")}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-2/5 flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000 delay-200">
            <div className="relative w-full max-w-112.5 aspect-4/5 group">
              <div
                ref={borderRef}
                className="absolute -inset-4 border border-side-2/20 rounded-2xl -z-10 transition-colors duration-500 group-hover:border-side-2/50 will-change-transform"
              />

              <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-secondary-light shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <img
                  src={
                    "https://images.unsplash.com/photo-1580643375398-5174902ebcec?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt="Founder"
                  className="w-full h-full object-cover object-top md:grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-secondary via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
