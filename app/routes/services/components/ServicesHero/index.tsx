import { useTranslation } from "react-i18next";

export default function ServicesHero() {
  const { t } = useTranslation();

  return (
    <section className="relative h-[70vh] min-h-150 w-full flex items-center justify-center overflow-hidden bg-secondary bg-[url('https://plus.unsplash.com/premium_photo-1698084059560-9a53de7b816b?q=80&w=811&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-center bg-no-repeat bg-cover">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full animate-slow-zoom opacity-40">
          <img
            src="/images/services-hero-bg.jpg"
            className="w-full h-full object-cover"
            alt="Legal Services Background"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-secondary/90 via-secondary/60 to-secondary" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-side-2 font-primary tracking-[0.3em] text-[10px] md:text-xs font-bold uppercase mb-6 opacity-0 animate-fade-in-up">
            {t("services.hero.tag") || "Expertise & Excellence"}
            <span className="block w-full h-px bg-side-2/30 mt-2" />
          </span>

          <h1
            className="text-4xl md:text-7xl font-primary font-bold text-white mb-8 leading-tight opacity-0 animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            {t("services.hero.title") || "Comprehensive Legal Solutions"}
          </h1>

          <p
            className="text-white/70 text-base text-justify [text-align-last:center] md:text-xl font-secondary max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: "500ms" }}
          >
            {t("services.hero.description") ||
              "Tailored legal strategies designed to protect your interests and navigate complex regulatory environments."}
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="relative w-px h-20 bg-white/10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-side-2 animate-scroll-line" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#FDFDFD] via-[#FDFDFD]/50 to-transparent z-20" />
    </section>
  );
}
